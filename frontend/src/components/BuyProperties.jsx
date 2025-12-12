// src/components/BuyProperties.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBed, FaBath, FaHome, FaBuilding, FaTree } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "https://goldennestmain-production.up.railway.app";

// Format sale price with commas, e.g. £1,200,000
const formatPrice = (value, currency = "£") => {
    if (value == null) return "Price on request";
    const num = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(num)) return "Price on request";
    return `${currency}${num.toLocaleString()}`;
};

// Same idea as in RentProperties
const tagIcon = (label) => {
    const l = label.toLowerCase();
    if (l.includes("bed")) return FaBed;
    if (l.includes("bath")) return FaBath;
    if (l.includes("apartment")) return FaBuilding;
    if (l.includes("cottage") || l.includes("villa")) return FaTree;
    return FaHome;
};

const tagsFromCard = (p) => {
    const out = [];
    if (p.bedrooms != null) out.push(`${p.bedrooms}-Bedroom`);
    if (p.bathrooms != null) out.push(`${p.bathrooms}-Bathroom`);
    if (p.type) out.push(p.type);
    return out;
};

const BuyProperties = ({ filters = {} }) => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    // normalise filters
    const city = filters.city || "";
    const minPrice = filters.minPrice || "";
    const maxPrice = filters.maxPrice || "";
    const q = filters.q || "";
    const type = filters.type || "";
    const yearBuilt = filters.yearBuilt || "";
    const minSize = filters.minSize || "";
    const maxSize = filters.maxSize || "";

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                params.set("page", "0");
                params.set("size", "24");

                if (city) params.set("city", city);
                if (minPrice) params.set("minPrice", minPrice);
                if (maxPrice) params.set("maxPrice", maxPrice);
                if (q) params.set("q", q);
                if (type) params.set("type", type);
                if (yearBuilt) params.set("yearBuilt", yearBuilt);
                if (minSize) params.set("minSize", minSize);
                if (maxSize) params.set("maxSize", maxSize);

                const res = await fetch(`${API_BASE}/api/properties?` + params.toString());
                if (!res.ok) throw new Error("Failed to load properties");
                const data = await res.json();
                setProperties(data.content || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [city, minPrice, maxPrice, q, type, yearBuilt, minSize, maxSize]);

    if (loading) {
        return (
            <section className="py-16 bg-white px-6 md:px-20">
                <p className="text-gray-500">Loading properties…</p>
            </section>
        );
    }

    if (properties.length === 0) {
        return (
            <section className="py-16 bg-white px-6 md:px-20">
                <p className="text-gray-500">No properties found for your filters.</p>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white px-6 md:px-20">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif font-semibold">
                        Discover Properties for Sale
                    </h2>
                    <p className="text-gray-600 mt-2 max-w-xl">
                        Browse all approved listings that match your criteria.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.map((p) => {
                    const img = p.coverImageUrl || "/placeholder.jpg";
                    const location = [p.city, p.state].filter(Boolean).join(", ");
                    const priceText = formatPrice(p.price, "£");
                    const blurb = p.description || "";
                    const tags = tagsFromCard(p);

                    return (
                        <div
                            key={p.id}
                            className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                        >
                            {/* Image */}
                            <div className="p-3">
                                <button
                                    onClick={() => navigate(`/buy/properties/${p.id}`)}
                                    className="block w-full rounded-xl overflow-hidden focus:outline-none"
                                >
                                    <img
                                        src={img}
                                        alt={p.title}
                                        className="w-full h-48 object-cover"
                                    />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-3">
                                <h3 className="text-lg font-semibold">{p.title}</h3>
                                {location && (
                                    <p className="text-sm text-gray-600 mt-1">{location}</p>
                                )}

                                {/* optional short description */}
                                {blurb && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        {blurb.length > 110 ? `${blurb.slice(0, 110)}…` : blurb}{" "}
                                        <span className="text-black font-medium cursor-pointer">
                                            Read More
                                        </span>
                                    </p>
                                )}

                                {/* Tags row like in RentProperties */}
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {tags.map((tag, i) => {
                                            const Icon = tagIcon(tag);
                                            return (
                                                <span
                                                    key={i}
                                                    className="text-sm bg-black text-white px-3 py-1 rounded-full flex items-center gap-2"
                                                >
                                                    {Icon && <Icon className="text-white" />} {tag}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Price + CTA */}
                                <div className="flex justify-between items-center mt-6">
                                    <p className="text-lg font-bold">{priceText}</p>
                                    <button
                                        onClick={() => navigate(`/buy/properties/${p.id}`)}
                                        className="bg-[#F3B03E] text-black px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        View Property Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default BuyProperties;
