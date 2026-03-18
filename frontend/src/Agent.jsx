// src/Agent.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api/http";
import {
  FaChevronDown,
  FaChevronRight,
  FaSearch,
  FaHome,
} from "react-icons/fa";
import { clearAccessToken } from "./auth";

/* ---------- tiny UI helpers (same style as Admin) ---------- */

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-1 text-xs bg-black text-white px-3 py-1 rounded-full">
    {children}
  </span>
);

const formatPrice = (value) => {
  if (value == null) return "Price on request";
  const n = Number(value);
  if (isNaN(n)) return "Price on request";
  return `£${n.toLocaleString()}`;
};

const Sidebar = ({ activeTab, onTabChange }) => {
  const [openProp, setOpenProp] = useState(true);
  const [openTxn, setOpenTxn] = useState(false);

  const propLinks = [
    { label: "Pending Review", tab: "pending" },
    { label: "Active Listings", tab: "approved" },
    { label: "Rejected Listings", tab: "rejected" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[220px] bg-white border rounded-2xl m-3 p-3">
      <div className="flex items-center gap-2 px-2 py-3">
        <img src="/1-2 1.png" alt="Golden Nest" />
      </div>
      <div className="mt-2">
        <div className="rounded-md bg-[#F3B03E]/30 text-black px-3 py-2 font-medium">
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
          <ul className="pl-3 text-sm text-gray-700 space-y-1">
            {propLinks.map(({ label, tab }) => (
              <li key={tab}>
                <button
                  onClick={() => onTabChange(tab)}
                  className={
                    "w-full text-left px-2 py-1.5 rounded-md transition " +
                    (activeTab === tab
                      ? "bg-[#F3B03E]/40 font-semibold text-black"
                      : "hover:bg-gray-100 text-gray-700")
                  }
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        <button
          className="w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium"
          onClick={() => setOpenTxn((v) => !v)}
        >
          <span>Transactions</span>
          {openTxn ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openTxn && (
          <ul className="pl-3 text-sm text-gray-700 space-y-2">
            <li className="px-2 text-gray-400">Earnings & Commission (future)</li>
            <li className="px-2 text-gray-400">Pending payouts (future)</li>
          </ul>
        )}
      </div>
    </aside>
  );
};

const ListingCard = ({ p, onView }) => {
  const img = p.coverImageUrl || "/placeholder.jpg";
  const location = [p.city, p.state].filter(Boolean).join(", ");

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <img src={img} alt={p.title} className="w-full h-52 object-cover" />
      <div className="p-4">
        <div className="font-semibold">{p.title}</div>
        {location && <p className="text-xs text-gray-600 mt-1">{location}</p>}

        <div className="mt-3 flex flex-wrap gap-2">
          {location && (
            <Pill>
              <FaHome />
              {location}
            </Pill>
          )}
        </div>

        <div className="mt-4">
          <div className="text-xs text-gray-500">Price</div>
          <div className="flex items-center gap-2">
            <div className="font-semibold">{formatPrice(p.price)}</div>
            <button
              className="ml-auto bg-[#F3B03E] hover:bg-[#e3a12f] text-black text-xs font-medium px-4 py-2 rounded-md"
              onClick={onView}
            >
              View Property Details
            </button>
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          Status: <span className="font-semibold">{p.status}</span>
        </div>
      </div>
    </div>
  );
};

const Tabs = ({ active, counts, onChange }) => {
  const btn = (key, label) => {
    const is = active === key;
    return (
      <button
        onClick={() => onChange(key)}
        className={
          "relative px-4 py-2 rounded-full text-sm font-medium transition " +
          (is
            ? "bg-[#F3B03E] text-black"
            : "bg-white border hover:bg-black/5 text-black")
        }
      >
        {label}
        <span
          className={
            "ml-2 inline-flex items-center justify-center text-xs rounded-full px-2 py-0.5 " +
            (is ? "bg-white/20" : "bg-black/10")
          }
        >
          {counts[key] ?? 0}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {btn("pending", "Pending")}
      {btn("approved", "Approved")}
      {btn("rejected", "Rejected")}
    </div>
  );
};

function statusKeyToEnum(key) {
  if (key === "approved") return "APPROVED";
  if (key === "rejected") return "REJECTED";
  return "PENDING";
}

export default function AgentDashboard() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("pending");
  const [lists, setLists] = useState({ pending: [], approved: [], rejected: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const counts = {
    pending: lists.pending.length,
    approved: lists.approved.length,
    rejected: lists.rejected.length,
  };

  async function loadList(statusKey) {
    setLoading(true);
    setError("");

    try {
      const status = statusKeyToEnum(statusKey);
      const data = await apiFetch(`/api/properties/dashboard?status=${status}&page=0&size=50`);

      const content = data?.content || [];

      const filtered = content.filter(
        (p) => String(p.status || "").toUpperCase() === status
      );

      setLists((prev) => ({ ...prev, [statusKey]: filtered }));
    } catch (e) {
      setError(e.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    clearAccessToken();
    navigate("/login", { replace: true });
  };

  // Single handler used by both Sidebar and Tabs
  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  useEffect(() => {
    loadList("pending");
    loadList("approved");
    loadList("rejected");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const activeItems = useMemo(() => lists[tab] || [], [lists, tab]);

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex">
      <Sidebar activeTab={tab} onTabChange={handleTabChange} />

      <div className="flex-1">
        <div className="flex items-center justify-between px-6 md:px-10 lg:px-16 py-4">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full rounded-full border px-10 py-2 bg-white"
                placeholder="Search (future)"
                disabled
              />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="ml-4 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition"
          >
            <span className="h-6 w-6 rounded-full bg-[#F3B03E] text-white flex items-center justify-center text-[11px]">✕</span>
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>

        <div className="px-6 md:px-10 lg:px-16">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Hello, Agent</h1>
              <p className="mt-2 text-gray-700">
                Your assigned-area properties appear here.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold">Manage Listings</h2>
              <Tabs active={tab} counts={counts} onChange={handleTabChange} />
            </div>

            <div className="mt-6">
              {loading && <div className="py-10 text-center text-gray-500">Loading…</div>}
              {error && !loading && (
                <div className="py-4 text-center text-red-600">{error}</div>
              )}

              {!loading && !error && (
                activeItems.length === 0 ? (
                  <div className="text-gray-600">No listings here.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeItems.map((p) => (
                      <ListingCard
                        key={p.id}
                        p={p}
                        onView={() => navigate(`/buy/properties/${p.id}`)}
                      />
                    ))}
                  </div>
                )
              )}
            </div>

            <div className="h-20" />
          </div>
        </div>
      </div>
    </div>
  );
}