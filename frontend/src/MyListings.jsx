// src/MyListings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "./auth";
import { FaBed, FaBath, FaHome } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

// Status label colors
const statusColor = (s) => {
    switch (s) {
        case "APPROVED":
            return "bg-green-100 text-green-700";
        case "REJECTED":
            return "bg-red-100 text-red-700";
        case "PENDING":
        default:
            return "bg-yellow-100 text-yellow-700";
    }
};

// Price formatting (£1,200,000)
const formatPrice = (value) => {
    if (value == null) return "Price on request";
    const n = Number(value);
    if (isNaN(n)) return "Price on request";
    return `£${n.toLocaleString()}`;
};

// Tags (same as Buy / Rent)
const tagsFromCard = (p) => {
    const out = [];
    if (p.bedrooms != null) out.push(`${p.bedrooms}-Bedroom`);
    if (p.bathrooms != null) out.push(`${p.bathrooms}-Bathroom`);
    if (p.type) out.push(p.type);
    return out;
};

const tagIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes("bed")) return FaBed;
    if (l.includes("bath")) return FaBath;
    return FaHome;
};

const MyListings = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const token = getAccessToken();
                if (!token) {
                    setError("You must be logged in to view your listings.");
                    return;
                }

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

                // /mine returns a Page object → real data in content
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

    if (loading) {
        return (
            <section className="min-h-[60vh] px-6 md:px-20 py-12 bg-gray-50">
                <p className="text-gray-600">Loading your listings…</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-[60vh] px-6 md:px-20 py-12 bg-gray-50">
                <p className="text-red-600">{error}</p>
            </section>
        );
    }

    return (
        <section className="min-h-[60vh] px-6 md:px-20 py-12 bg-gray-50">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-semibold">
                        My Listings
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Here are all the properties you’ve submitted, with their current review status.
                    </p>
                </div>
            </div>

            {listings.length === 0 ? (
                <div className="mt-6 text-gray-600">
                    You haven’t listed any properties yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {listings.map((p) => {
                        const location = [p.city, p.state].filter(Boolean).join(", ");
                        const tags = tagsFromCard(p);

                        return (
                            <div
                                key={p.id}
                                className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                            >
                                <div className="p-3">

                                    {/* HEADER: title + status */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold">{p.title}</h2>
                                            {location && (
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {location}
                                                </p>
                                            )}
                                        </div>

                                        <span
                                            className={
                                                "px-2 py-1 rounded-full text-xs font-medium " +
                                                statusColor(p.status)
                                            }
                                        >
                                            {p.status || "PENDING"}
                                        </span>
                                    </div>

                                    {/* SHORT DESCRIPTION */}
                                    {p.description && (
                                        <p className="text-sm text-gray-600 mt-3">
                                            {p.description.length > 120
                                                ? `${p.description.slice(0, 120)}…`
                                                : p.description}
                                        </p>
                                    )}

                                    {/* TAGS (Bed, Bath, Type) */}
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {tags.map((t, i) => {
                                                const Icon = tagIcon(t);
                                                return (
                                                    <span
                                                        key={i}
                                                        className="text-xs bg-black text-white px-3 py-1 rounded-full flex items-center gap-2"
                                                    >
                                                        {Icon && <Icon className="text-white" />} {t}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* PRICE + CTA */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-sm font-semibold">
                                            {formatPrice(p.price)}
                                        </div>
                                        <button
                                            className="text-sm underline"
                                            onClick={() => navigate(`/buy/properties/${p.id}`)}
                                        >
                                            View public page
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default MyListings;
