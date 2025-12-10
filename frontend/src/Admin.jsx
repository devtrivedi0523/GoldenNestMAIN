// src/Admin.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaChevronDown,
    FaChevronRight,
    FaSearch,
    FaHome,
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/* ---------- tiny UI helpers ---------- */

const Pill = ({ children }) => (
    <span className="inline-flex items-center gap-1 text-xs bg-black text-white px-3 py-1 rounded-full">
        {children}
    </span>
);

const Donut = ({ value = 42 }) => {
    const R = 56;
    const C = 2 * Math.PI * R;
    const seg = [0.7, 0.2, 0.1]; // just visual
    const gaps = 6;
    const dash = (p) => `${C * p - gaps} ${C}`;
    return (
        <div className="relative w-[150px] h-[150px]">
            <svg viewBox="0 0 150 150" className="rotate-[-90deg]">
                <circle cx="75" cy="75" r={R} fill="none" stroke="#f4f4f4" strokeWidth="16" />
                <circle
                    cx="75"
                    cy="75"
                    r={R}
                    fill="none"
                    stroke="#F3B03E"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={dash(seg[0])}
                />
                <circle
                    cx="75"
                    cy="75"
                    r={R}
                    fill="none"
                    stroke="#2e2e2e"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={dash(seg[1])}
                    transform={`rotate(${seg[0] * 360} 75 75)`}
                />
                <circle
                    cx="75"
                    cy="75"
                    r={R}
                    fill="none"
                    stroke="#f0d7a3"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={dash(seg[2])}
                    transform={`rotate(${(seg[0] + seg[1]) * 360} 75 75)`}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-semibold">{value}</div>
            </div>
        </div>
    );
};

const LeftStat = ({ label, value }) => (
    <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold">{value}</span>
    </div>
);

/* 💷 NEW: shared price formatter (same style as Buy/Rent/MyListings) */
const formatPrice = (value) => {
    if (value == null) return "Price on request";
    const n = Number(value);
    if (isNaN(n)) return "Price on request";
    return `£${n.toLocaleString()}`;
};

/* ---------- sidebar ---------- */

const Sidebar = () => {
    const [openProp, setOpenProp] = useState(true);
    const [openTxn, setOpenTxn] = useState(false);
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
                    <ul className="pl-3 text-sm text-gray-700 space-y-2">
                        <li className="px-2">Pending Review</li>
                        <li className="px-2">Active Listings</li>
                        <li className="px-2">Rejected Listings</li>
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

/* ---------- listing card (backend shape) ---------- */

const ListingCard = ({
    p,
    primaryLabel,
    secondaryLabel,
    onPrimary,
    onSecondary,
    onView,
}) => {
    const img = p.coverImageUrl || "/placeholder.jpg";
    const location = [p.city, p.state].filter(Boolean).join(", ");

    // NEW: derive initials for avatar
    const displayName = p.ownerName || p.ownerEmail || "Unknown seller";
    const initials = displayName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="bg-white border rounded-xl overflow-hidden">
            <img src={img} alt={p.title} className="w-full h-52 object-cover" />
            <div className="p-4">
                <div className="font-semibold">{p.title}</div>
                {location && (
                    <p className="text-xs text-gray-600 mt-1">{location}</p>
                )}

                {/* ⭐ NEW: Listed-by block */}
                {(p.ownerName || p.ownerEmail) && (
                    <div className="mt-3 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Listed by</span>
                            <span className="text-xs font-medium text-gray-900">
                                {p.ownerName || "Unknown seller"}
                            </span>
                            {p.ownerEmail && (
                                <span className="text-[11px] text-gray-500">
                                    {p.ownerEmail}
                                </span>
                            )}
                        </div>
                    </div>
                )}

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

                <div className="mt-3 flex gap-2">
                    {primaryLabel && (
                        <button
                            className="px-3 py-1 rounded-md text-xs border hover:bg-red-200"
                            onClick={onPrimary}
                        >
                            {primaryLabel}
                        </button>
                    )}
                    {secondaryLabel && (
                        <button
                            className="px-3 py-1 rounded-md text-xs border hover:bg-green-200"
                            onClick={onSecondary}
                        >
                            {secondaryLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


/* ---------- confirmation bar ---------- */

const ConfirmBar = ({ actionLabel, onCancel, onConfirm }) => {
    return (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50">
            <div className="bg-amber-400 text-black rounded-xl shadow-lg px-6 py-4 w-[520px] max-w-[92vw]">
                <div className="text-sm">
                    Are you sure you want to {actionLabel}? Once confirmed, the status will be
                    updated.
                </div>
                <div className="mt-3 flex gap-2 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-3 py-2 rounded-md border border-black/20 hover:bg-black/5"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-3 py-2 rounded-md text-white bg-black hover:bg-black/90"
                    >
                        {actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ---------- tabs header ---------- */

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

/* ---------- main dashboard with backend status ---------- */

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [tab, setTab] = useState("pending");
    const [lists, setLists] = useState({
        pending: [],
        approved: [],
        rejected: [],
    });
    const [summary, setSummary] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [confirm, setConfirm] = useState(null); // { id, next }

    const counts = {
        pending: summary.pending,
        approved: summary.approved,
        rejected: summary.rejected,
    };

    const labelFor = (next) =>
        next === "approved"
            ? "Approve this listing"
            : next === "rejected"
                ? "Decline this listing"
                : "move this listing back to pending";

    const loadSummary = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/properties/summary`);
            if (!res.ok) throw new Error(`Summary load failed (${res.status})`);
            const data = await res.json();
            setSummary({
                pending: data.pending ?? 0,
                approved: data.approved ?? 0,
                rejected: data.rejected ?? 0,
                total: data.total ?? 0,
            });
        } catch (err) {
            console.error(err);
            // keep old summary, but show error if needed
        }
    };

    const loadList = async (statusKey) => {
        const statusParam = statusKey.toUpperCase(); // PENDING / APPROVED / REJECTED
        setLoading(true);
        setError("");
        try {
            const res = await fetch(
                `${API_BASE}/api/admin/properties?status=${statusParam}&page=0&size=50`
            );
            if (!res.ok) throw new Error(`Failed to load ${statusKey} (${res.status})`);
            const data = await res.json();
            setLists((prev) => ({
                ...prev,
                [statusKey]: data.content || [],
            }));
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to load listings");
        } finally {
            setLoading(false);
        }
    };

    // load summary + current tab list
    useEffect(() => {
        loadSummary();
        loadList(tab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    const doConfirm = async () => {
        if (!confirm) return;
        const { id, next } = confirm;
        setConfirm(null);

        try {
            await fetch(`${API_BASE}/api/admin/properties/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: next.toUpperCase() }),
            });
            // refresh all tabs & summary for simplicity
            await loadSummary();
            await loadList("pending");
            await loadList("approved");
            await loadList("rejected");
        } catch (err) {
            console.error(err);
            alert("Failed to update status: " + (err.message || ""));
        }
    };

    const activeItems = useMemo(() => lists[tab] || [], [lists, tab]);

    const renderList = (items, mode) => {
        if (items.length === 0) {
            return <div className="text-gray-600">No listings here.</div>;
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((p) => {
                    // all our admin details go to buy/properties/:id for now
                    const onView = () => navigate(`/buy/properties/${p.id}`);

                    if (mode === "pending") {
                        return (
                            <ListingCard
                                key={p.id}
                                p={p}
                                onView={onView}
                                primaryLabel="Approve"
                                secondaryLabel="Decline"
                                onPrimary={() => setConfirm({ id: p.id, next: "approved" })}
                                onSecondary={() => setConfirm({ id: p.id, next: "rejected" })}
                            />
                        );
                    }
                    if (mode === "approved") {
                        return (
                            <ListingCard
                                key={p.id}
                                p={p}
                                onView={onView}
                                primaryLabel="Unpublish (Pending)"
                                secondaryLabel="Decline"
                                onPrimary={() => setConfirm({ id: p.id, next: "pending" })}
                                onSecondary={() => setConfirm({ id: p.id, next: "rejected" })}
                            />
                        );
                    }
                    // rejected
                    return (
                        <ListingCard
                            key={p.id}
                            p={p}
                            onView={onView}
                            primaryLabel="Reconsider (Pending)"
                            secondaryLabel="Approve"
                            onPrimary={() => setConfirm({ id: p.id, next: "pending" })}
                            onSecondary={() => setConfirm({ id: p.id, next: "approved" })}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f7f6f3] flex">
            <Sidebar />

            <div className="flex-1">
                {/* top bar */}
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
                    <div className="ml-6 h-10 w-10 rounded-full bg-[#F3B03E]" />
                </div>

                <div className="px-6 md:px-10 lg:px-16">
                    {/* header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold">
                                Hello, Admin
                            </h1>
                            <p className="mt-2 text-gray-700">
                                Let’s get started – review submissions and manage property listings.
                            </p>
                        </div>
                    </div>

                    {/* stats */}
                    <div className="mt-8">
                        <div className="text-lg font-semibold tracking-wider">
                            PROPERTIES
                        </div>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                            <div className="flex items-center gap-6">
                                <Donut value={summary.total} />
                            </div>
                            <div className="max-w-xs space-y-3">
                                <LeftStat label="Total Listings" value={summary.total} />
                                <LeftStat
                                    label="Pending Property Approvals"
                                    value={summary.pending}
                                />
                                <LeftStat label="Approved Listings" value={summary.approved} />
                                <LeftStat label="Rejected Listings" value={summary.rejected} />
                            </div>
                        </div>
                    </div>

                    {/* tabs + lists */}
                    <div className="mt-10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold">
                                Manage Listings
                            </h2>
                            <Tabs active={tab} counts={counts} onChange={setTab} />
                        </div>

                        <div className="mt-6">
                            {loading && (
                                <div className="py-10 text-center text-gray-500">
                                    Loading listings…
                                </div>
                            )}
                            {error && !loading && (
                                <div className="py-4 text-center text-red-600">{error}</div>
                            )}
                            {!loading && !error && renderList(activeItems, tab)}
                        </div>

                        <div className="h-20" />
                    </div>
                </div>
            </div>

            {/* confirmation bar */}
            {confirm && (
                <ConfirmBar
                    actionLabel={labelFor(confirm.next)}
                    onCancel={() => setConfirm(null)}
                    onConfirm={doConfirm}
                />
            )}
        </div>
    );
}
