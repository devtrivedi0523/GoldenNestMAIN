// src/components/Hero.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounced from "../hooks/useDebounced";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

export default function Hero({ initialLocation = "" }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Rent");
  const [query, setQuery] = useState(initialLocation || "");
  const debouncedQuery = useDebounced(query, 350);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState(null);

  const suggestionRef = useRef(null);

  // Build properties URL (uses "q" param expected by the backend)
  const buildPropertiesUrl = ({ query, page = 0, size = 8 }) => {
    const params = new URLSearchParams();
    if (query && query.trim()) params.set("q", query.trim());
    params.set("page", page);
    params.set("size", size);
    return `${API_BASE}/api/properties?${params.toString()}`;
  };

  // Close suggestions when clicking outside the suggestionRef wrapper
  useEffect(() => {
    const onDocClick = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Fetch place suggestions
  useEffect(() => {
    if (!debouncedQuery) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);

    const url = `${API_BASE}/api/places?input=${encodeURIComponent(debouncedQuery)}`;

    fetch(url)
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error(`places ${res.status}: ${text}`);
        // backend returns { predictions: [...] }
        try {
          return JSON.parse(text);
        } catch {
          return { predictions: [] };
        }
      })
      .then((data) => {
        setSuggestions(Array.isArray(data.predictions) ? data.predictions : []);
      })
      .catch((err) => {
        console.error("places fetch error:", err);
        setSuggestions([]);
      })
      .finally(() => setLoadingSuggestions(false));
  }, [debouncedQuery]);

  // Fetch property preview results (uses query param "q")
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setError(null);
      return;
    }

    setLoadingResults(true);
    setError(null);

    // Pass query (not "location" or other name)
    const url = buildPropertiesUrl({ query: debouncedQuery, page: 0, size: 6 });

    fetch(url)
      .then(async (res) => {
        const text = await res.text().catch(() => null);
        if (!res.ok) {
          throw new Error(text || `HTTP ${res.status}`);
        }
        try {
          return JSON.parse(text);
        } catch {
          return res.json();
        }
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setResults(data);
        } else if (data && data.content) {
          setResults(data.content || []);
        } else if (data && data.properties) {
          setResults(data.properties || []);
        } else {
          // fallback: attempt to use data directly if it's an array-like
          setResults(Array.isArray(data) ? data : data || []);
        }
      })
      .catch((err) => {
        console.error("Property search error:", err);
        setError(err.message || "Failed to fetch properties");
        setResults([]);
      })
      .finally(() => setLoadingResults(false));
  }, [debouncedQuery]); // intentionally not including activeTab so tab-filtering won't hide results unexpectedly

  const handleSubmit = (e) => {
    e?.preventDefault();
    setShowSuggestions(false);

    const location = (query || "").trim();
    if (!location) return;

    // Map tab to route base (you can change 'buy'/'rent' names if your app uses different routes)
    const routeBase = activeTab.toLowerCase(); // "rent" | "buy" | "sell"

    // Use 'q' param because backend expects q for free-text search
    navigate(`/${routeBase}?q=${encodeURIComponent(location)}`);
  };


  const handleSuggestionClick = (desc) => {
    // desc might be object or string depending on API; we expect a description string
    const value = typeof desc === "string" ? desc : desc?.description || "";
    setQuery(value);
    setShowSuggestions(false);
    // debouncedQuery will update soon and trigger property fetch
  };

  return (
    <section className="relative w-full h-[90vh]">
      <img src="/christian-vasile-E_EDcwg8das-unsplash.jpg" alt="Property" className="w-full h-full object-cover" />

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-3xl">
        <p className="text-sm text-gray-500 mb-2">
          From as low as $10 per day with limited time offer discounts.
        </p>

        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">Your Property, Our Priority.</h2>

        <div className="flex space-x-6 border-b border-gray-300 mb-4 font-serif">
          {["Rent", "Buy", "Sell"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-2 text-gray-800 font-medium hover:text-black transition cursor-pointer ${activeTab === tab ? "text-black" : ""
                }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F3B03E] rounded-full transition-all duration-300" />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} ref={suggestionRef} className="relative">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="w-full sm:w-2/3">
              <label htmlFor="location" className="text-xs text-gray-500">
                Location
              </label>

              {/* wrapper relative ensures absolute dropdown positions against it */}
              <div className="relative mt-1" ref={suggestionRef}>
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
                  className="w-full bg-white border border-transparent focus:border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
                  aria-autocomplete="list"
                  aria-controls="suggestion-list"
                  aria-expanded={showSuggestions}
                />

                {/* Suggestions dropdown (absolute, z-index high) */}
                {showSuggestions && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] max-h-56 overflow-auto">
                    {loadingSuggestions ? (
                      <div className="p-2 text-sm text-gray-500">Loading suggestions…</div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((s) => {
                        const desc = typeof s === "string" ? s : s.description || s.id || s;
                        return (
                          <div
                            key={s.id || desc}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                            onMouseDown={() => handleSuggestionClick(s)}
                          >
                            {desc}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-2 text-sm text-gray-500">No suggestions</div>
                    )}
                  </div>
                )}
              </div>
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
                        {(p.city || p.state) ? `${p.city || ""}${p.state ? ` • ${p.state}` : ""}` : ""}{" "}
                        {p.price ? `• ${p.currency || "£"}${p.price}` : ""}
                      </div>
                      <div className="mt-2">
                        <button
                          className="text-sm text-yellow-600 underline"
                          onClick={() => {
                            // Prefer tab-scoped detail route if you use /buy/properties/:id, otherwise fallback to /properties/:id
                            const routeBase = activeTab.toLowerCase(); // rent | buy | sell
                            // If your app uses /buy/properties/:id, use that; otherwise change to the route you use.
                            navigate(`/${routeBase}/properties/${p.id}`);
                          }}
                        >
                          View details
                        </button>

                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            debouncedQuery && <p className="text-sm text-gray-500">No properties found for “{debouncedQuery}”.</p>
          )}
        </div>
      </div>
    </section>
  );
}
