// src/components/Hero.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // matches your FeaturedProperties usage
import useDebounced from "../hooks/useDebounced"; // optional — see note if you don't want a new file
// import PropertyListPreview from "./PropertyListPreview"; // small preview renderer (optional - fallback included)

const API_BASE = import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

/**
 * If you don't want an extra hook file, you can inline the debounce logic directly in this file.
 * I recommend creating src/hooks/useDebounced.js with the typical implementation:
 *
 * export default function useDebounced(value, delay = 300) {
 *   const [debounced, setDebounced] = useState(value);
 *   useEffect(() => {
 *     const t = setTimeout(() => setDebounced(value), delay);
 *     return () => clearTimeout(t);
 *   }, [value, delay]);
 *   return debounced;
 * }
 *
 * But if you really want no extra files, remove the import and use the inlineDebounce function below.
 */

export default function Hero({ initialLocation = "" }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Rent");
  const [query, setQuery] = useState(initialLocation || "");
  const debouncedQuery = useDebounced(query, 350); // debounce hook (recommended)

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState(null);

  const suggestionRef = useRef(null);

  // Helper: build properties API URL (adjust query param names if your backend differs)
 const buildPropertiesUrl = ({ query, type, page = 0, size = 8 }) => {
  const params = new URLSearchParams();

  if (query && query.trim()) {
    params.set("q", query.trim()); // ✅ matches backend @RequestParam String q
  }

  if (type && type.trim()) {
    params.set("type", type.trim());
  }

  params.set("page", page);
  params.set("size", size);

  return `${API_BASE}/api/properties?${params.toString()}`;
};

  // Click-outside closes the suggestions
  useEffect(() => {
    const onDocClick = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Optional: fetch place suggestions from backend proxy /api/places?input=
  useEffect(() => {
  if (!debouncedQuery) {
    setSuggestions([]);
    setLoadingSuggestions(false);
    return;
  }

  setLoadingSuggestions(true);

  const url = `${API_BASE}/api/places?input=${encodeURIComponent(debouncedQuery)}`;
  console.log("🔎 places url:", url);

  fetch(url)
    .then(async (res) => {
      const text = await res.text();
      console.log("✅ places status:", res.status, "body:", text);

      if (!res.ok) throw new Error(`places ${res.status}: ${text}`);

      return JSON.parse(text);
    })
    .then((data) => {
      console.log("✅ places parsed:", data);
      setSuggestions(data.predictions || []);
    })
    .catch((err) => {
      console.error("❌ places error:", err);
      setSuggestions([]);
    })
    .finally(() => setLoadingSuggestions(false));
}, [debouncedQuery]);


  // Fetch preview results whenever user pauses typing or when activeTab changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setError(null);
      return;
    }

    setLoadingResults(true);
    setError(null);

    const url = buildPropertiesUrl({ location: debouncedQuery, type: activeTab, page: 0, size: 6 });

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => null);
          throw new Error(text || "Failed to fetch properties");
        }
        return res.json();
      })
      .then((data) => {
        /**
         * Depending on your Spring backend, you may return:
         * - A Page<PropertyCardDto> (with fields like content, totalElements, number, size)
         * - Or { properties: [...], total, page, limit }
         *
         * Handle both possibilities:
         */
        if (Array.isArray(data)) {
          // if backend returns raw array
          setResults(data);
        } else if (data.content) {
          // Spring Page object
          setResults(data.content || []);
        } else if (data.properties) {
          setResults(data.properties || []);
        } else {
          // try to be forgiving: if object has numeric keys or nested props
          setResults(data || []);
        }
      })
      .catch((err) => {
        console.error("Property search error:", err);
        setError(err.message || "Failed to fetch properties");
        setResults([]);
      })
      .finally(() => setLoadingResults(false));
  }, [debouncedQuery, activeTab]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    setShowSuggestions(false);

    const location = (query || "").trim();
    if (!location) return;

    // For SPA navigation: go to a dedicated search page (bookmarkable)
    // If you have client route /search that reads query params, use:
    try {
      navigate(`/search?location=${encodeURIComponent(location)}&type=${encodeURIComponent(activeTab)}`);
    } catch {
      // Fallback: if router isn't available, keep inline preview results (already loaded)
    }
  };

  const handleSuggestionClick = (desc) => {
    setQuery(desc);
    setShowSuggestions(false);
    // optionally trigger immediate fetch (debounce will trigger soon)
  };

  return (
    <section className="relative w-full h-[90vh]">
      {/* Background image (same as your current file) */}
      <img src="/christian-vasile-E_EDcwg8das-unsplash.jpg" alt="Property" className="w-full h-full object-cover" />

      {/* Overlay Card */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-3xl">
        <p className="text-sm text-gray-500 mb-2">
          From as low as $10 per day with limited time offer discounts.
        </p>

        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
          Your Property, Our Priority.
        </h2>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-300 mb-4 font-serif">
          {["Rent", "Buy", "Sell"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-2 text-gray-800 font-medium hover:text-black transition cursor-pointer ${activeTab === tab ? "text-black" : ""}`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F3B03E] rounded-full transition-all duration-300" />
              )}
            </button>
          ))}
        </div>

        {/* Search input + button */}
        <form onSubmit={handleSubmit} ref={suggestionRef} className="relative">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="w-full sm:w-2/3">
              <label htmlFor="location" className="text-xs text-gray-500">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search city, neighbourhood or postcode (e.g. Manchester)"
                className="mt-1 w-full bg-white border border-transparent focus:border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
                aria-autocomplete="list"
                aria-controls="suggestion-list"
                aria-expanded={showSuggestions}
              />

              {/* Suggestions dropdown (optional) */}
              {showSuggestions && (
                <div className="mt-2 relative z-50">
                  <ul id="suggestion-list" className="bg-white border border-gray-200 rounded-md shadow-sm max-h-48 overflow-auto">
                    {loadingSuggestions ? (
                      <li className="p-2 text-sm text-gray-500">Loading suggestions…</li>
                    ) : suggestions.length ? (
                      suggestions.map((s) => (
                        <li
                          key={s.id || s.description || s}
                          className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                          onClick={() => handleSuggestionClick(s.description || s)}
                        >
                          {s.description || s}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-sm text-gray-500">No suggestions</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-3 sm:mt-0">
              <button
                type="submit"
                className="bg-[#F3B03E] hover:bg-[#F3B03E] text-black px-5 py-2 rounded-md transition font-medium cursor-pointer"
              >
                Browse Properties
              </button>
            </div>
          </div>
        </form>

        {/* Results preview */}
        <div className="mt-4">
          {loadingResults ? (
            <p className="text-sm text-gray-500">Searching properties…</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : results.length ? (
            <>
              <p className="text-sm text-gray-600 mb-2">
                Showing {results.length} preview result{results.length > 1 ? "s" : ""} for{" "}
                <strong>{debouncedQuery}</strong>
              </p>

              {/* If you have a PropertyListPreview component, use it; otherwise inline map */}
              {typeof PropertyListPreview !== "undefined" ? (
                <PropertyListPreview properties={results} />
              ) : (
                <ul className="space-y-3 max-h-48 overflow-auto">
                  {results.map((p) => (
                    <li key={p.id} className="p-3 border border-gray-100 rounded-lg bg-white shadow-sm flex items-center">
                      <img
                        src={p.coverImageUrl || p.image || "/placeholder.jpg"}
                        alt={p.title || p.name || "Property"}
                        className="w-16 h-12 object-cover rounded-md mr-3"
                      />
                      <div>
                        <div className="font-semibold">{p.title || p.name}</div>
                        <div className="text-sm text-gray-500">
                          {(p.city || p.state) ? `${p.city || ""}${p.state ? ` • ${p.state}` : ""}` : ""}
                          {" "}
                          {p.price ? `• ${p.currency || "£"}${p.price}` : ""}
                        </div>
                        <div className="mt-2">
                          <button
                            className="text-sm text-yellow-600 underline"
                            onClick={() => navigate(`/properties/${p.id}`)}
                          >
                            View details
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            debouncedQuery && <p className="text-sm text-gray-500">No properties found for “{debouncedQuery}”.</p>
          )}
        </div>
      </div>
    </section>
  );
}
