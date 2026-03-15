// src/MyListings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken, clearAccessToken } from "./auth";
import { FaBed, FaBath, FaHome, FaChevronDown, FaChevronRight, FaSearch } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

const statusColor = (s) => {
  switch (s) {
    case "APPROVED": return "bg-green-100 text-green-700";
    case "REJECTED": return "bg-red-100 text-red-700";
    case "PENDING":
    default: return "bg-yellow-100 text-yellow-700";
  }
};

const formatPrice = (value) => {
  if (value == null) return "Price on request";
  const n = Number(value);
  if (isNaN(n)) return "Price on request";
  return `£${n.toLocaleString()}`;
};

const tagsFromCard = (p) => {
  const out = [];
  if (p.bedrooms != null) out.push({ label: `${p.bedrooms}-Bedroom`, icon: FaBed });
  if (p.bathrooms != null) out.push({ label: `${p.bathrooms}-Bathroom`, icon: FaBath });
  if (p.type) out.push({ label: p.type, icon: FaHome });
  return out;
};

/* ---------- Sidebar ---------- */
const Sidebar = ({ onNavigate }) => {
  const [openProp, setOpenProp] = useState(true);

  return (
    <aside className="hidden lg:flex flex-col w-[220px] bg-white border rounded-2xl m-3 p-3 shrink-0">
      <div className="flex items-center gap-2 px-2 py-3">
        <img src="/1-2 1.png" alt="Golden Nest" className="h-10" />
      </div>

      <div className="mt-2">
        <div
          className="rounded-md bg-[#F3B03E]/30 text-black px-3 py-2 font-medium cursor-pointer"
          onClick={() => onNavigate && onNavigate("dashboard")}
        >
          Dashboard
        </div>
      </div>

      <div className="mt-4">
        <button
          className="w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium"
          onClick={() => setOpenProp((v) => !v)}
        >
          <span>Property Management</span>
          {openProp ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openProp && (
          <ul className="pl-3 text-sm text-gray-700 space-y-2 mt-1">
            <li className="px-2 py-1 rounded hover:bg-gray-100 cursor-pointer font-medium text-[#F3B03E]">
              Active Listings
            </li>
            <li className="px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
              Total Listings
            </li>
          </ul>
        )}
      </div>
    </aside>
  );
};

/* ---------- Property Card ---------- */
const PropertyCard = ({ p, onView }) => {
  const img = p.coverImageUrl || "/placeholder.jpg";
  const tags = tagsFromCard(p);

  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={img} alt={p.title} className="w-full h-48 object-cover" />
        <span
          className={
            "absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold " +
            statusColor(p.status)
          }
        >
          {p.status || "PENDING"}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{p.title}</h3>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map(({ label, icon: Icon }, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs bg-black text-white px-3 py-1 rounded-full"
              >
                <Icon className="text-white text-[10px]" />
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Decline reason — only shown for rejected listings */}
        {p.status === "REJECTED" && p.declineReason && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
            <p className="text-xs font-semibold text-red-600 mb-1">Declined reason</p>
            <p className="text-xs text-red-700">{p.declineReason}</p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">{formatPrice(p.price)}</span>
          <button
            onClick={onView}
            className="text-xs text-gray-500 underline underline-offset-2 hover:text-black transition"
          >
            View page
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Main ---------- */
const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const filterOptions = ["All", "For Sale", "For Rent"];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const token = getAccessToken();
        if (!token) { setError("You must be logged in to view your listings."); return; }

        const res = await fetch(`${API_BASE}/api/properties/mine`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (res.status === 401 || res.status === 403) {
          setError("You are not authorised. Please log in again.");
          return;
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load your properties");
        }

        const data = await res.json();
        setListings(Array.isArray(data.content) ? data.content : []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load your properties");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    clearAccessToken();
    navigate("/login", { replace: true });
  };

  const filtered = listings.filter((p) => {
    if (filter === "All") return true;
    if (filter === "For Sale") return String(p.listingType || p.type || "").toUpperCase().includes("SALE");
    if (filter === "For Rent") return String(p.listingType || p.type || "").toUpperCase().includes("RENT");
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 md:px-10 py-4">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                className="w-full rounded-full border px-10 py-2 bg-white text-sm focus:outline-none"
                placeholder="Search listings…"
                disabled
              />
            </div>
          </div>

          {/* Avatar / logout */}
          <button
            onClick={handleLogout}
            title="Log out"
            className="ml-4 h-10 w-10 rounded-full bg-[#F3B03E] text-white flex items-center justify-center text-lg hover:bg-[#e3a12f] transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 md:px-10 pb-16">
          {/* Header row */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Hello, User</h1>
              <p className="text-gray-600 mt-1">
                You can now review and edit all your property listings.
              </p>
            </div>

            {/* Filter dropdown */}
            <div className="relative mt-1">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white border rounded-xl px-4 py-2 pr-8 text-sm font-medium focus:outline-none cursor-pointer shadow-sm"
              >
                {filterOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
          </div>

          {/* States */}
          {loading && (
            <div className="py-20 text-center text-gray-500">Loading your listings…</div>
          )}

          {error && !loading && (
            <div className="py-10 text-center text-red-600">{error}</div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              No listings found.{" "}
              <button
                onClick={() => navigate("/sell")}
                className="underline text-black"
              >
                List a property →
              </button>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PropertyCard
                  key={p.id}
                  p={p}
                  onView={() => navigate(`/buy/properties/${p.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyListings;