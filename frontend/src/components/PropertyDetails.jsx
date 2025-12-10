// src/components/PropertyDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaBed,
    FaBath,
    FaHome,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY; // Google Maps key

// Helper to format price with commas
const formatPrice = (value, currency = "£") => {
    if (value == null) return null;
    const num = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(num)) return null;
    return `${currency}${num.toLocaleString()}`;
};

export default function PropertyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // carousel state
    const [activeImage, setActiveImage] = useState(0);

    // tabs state
    const [activeTab, setActiveTab] = useState("details"); // "details" | "floor" | "virtual" | "docs" | "map"

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const res = await fetch(`${API_BASE}/api/properties/${id}`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error("Property not found");
                    throw new Error(`Failed to load property (${res.status})`);
                }
                const data = await res.json();
                setProperty(data);
                setActiveImage(0);
            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to load property");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
                Loading property…
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-semibold">
                    {error || "Property not found"}
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className="underline text-gray-700"
                >
                    Back to listings
                </button>
            </div>
        );
    }

    const images =
        Array.isArray(property.images) && property.images.length > 0
            ? property.images
            : ["/placeholder.jpg"];

    const formattedPrice = formatPrice(property.price);
    const locationLine =
        [property.city, property.state].filter(Boolean).join(", ") || null;

    const handlePrev = () => {
        setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setActiveImage((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    // Build some “key features” bullets from the data we actually have
    const keyFeatures = [
        property.bedrooms != null && property.bathrooms != null
            ? `${property.bedrooms} bedroom, ${property.bathrooms} bathroom ${property.type ? property.type.toLowerCase() : "property"
            }`
            : null,
        property.areaSqft != null
            ? `Approx. ${property.areaSqft.toLocaleString()} sq ft of living space`
            : null,
        locationLine ? `Located in ${locationLine}` : null,
        formattedPrice ? `Guide price of ${formattedPrice}` : null,
    ].filter(Boolean);

    // ⭐ Advanced arrays (from backend; default to empty)
    const floorPlans = Array.isArray(property.floorPlans)
        ? property.floorPlans
        : [];
    const virtualTours = Array.isArray(property.virtualTours)
        ? property.virtualTours
        : [];
    const documents = Array.isArray(property.documents)
        ? property.documents
        : [];

    const floorCount = floorPlans.length;
    const virtualCount = virtualTours.length;
    const docsCount = documents.length;

    // Build full address for Google Maps (falls back to city/state)
    const addressParts = [
        property.address1,
        property.city,
        property.state,
        property.zip,
    ].filter(Boolean);
    const fullAddress =
        addressParts.join(", ") || locationLine || property.title || "";
    const mapsQuery = encodeURIComponent(fullAddress);

    // Coords (if we have them from backend)
    const hasCoords =
        property.lat != null &&
        property.lng != null &&
        !Number.isNaN(Number(property.lat)) &&
        !Number.isNaN(Number(property.lng));

    // Map + street view URLs
    const mapSrc = hasCoords
        ? `https://www.google.com/maps/embed/v1/view?key=${MAPS_KEY}&center=${property.lat},${property.lng}&zoom=16&maptype=roadmap`
        : `https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${mapsQuery}`;

    const streetViewSrc = hasCoords
        ? `https://www.google.com/maps/embed/v1/streetview?key=${MAPS_KEY}&location=${property.lat},${property.lng}&heading=210&pitch=10&fov=80`
        : null;

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="px-6 md:px-10 lg:px-20 pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-semibold text-[#F3B03E]">
                            {property.title}
                        </h1>
                        {locationLine && (
                            <p className="text-gray-700 mt-1 font-medium">
                                {formattedPrice && (
                                    <>
                                        {formattedPrice}
                                        <span className="font-normal text-gray-600">
                                            {" "}
                                            Offers in the Region of
                                        </span>
                                        <br />
                                    </>
                                )}
                                {property.bedrooms != null && (
                                    <>
                                        {property.bedrooms} bedroom{" "}
                                        {property.type
                                            ? property.type.toLowerCase()
                                            : "property"}{" "}
                                        <span className="font-semibold">for sale</span>
                                    </>
                                )}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Image carousel */}
            <div className="px-6 md:px-10 lg:px-20 mt-4">
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img
                        src={images[activeImage]}
                        alt={`photo-${activeImage + 1}`}
                        className="w-full max-h-[520px] object-cover"
                    />

                    {/* Arrows only if there is more than one image */}
                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
                            >
                                <FaChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80"
                            >
                                <FaChevronRight className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs + content */}
            <div className="px-6 md:px-10 lg:px-20 mt-6 mb-16">
                <div className="border border-gray-200 rounded-lg bg-white">
                    {/* Tabs row */}
                    <div className="border-b border-gray-200 flex flex-wrap">
                        {[
                            { id: "details", label: "Details" },
                            { id: "floor", label: `Floor Plans (${floorCount})` },
                            { id: "virtual", label: `Virtual Tours (${virtualCount})` },
                            { id: "docs", label: `Documents (${docsCount})` },
                            { id: "map", label: "Map & Street View" },
                        ].map((tab) => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={
                                        "px-4 py-2 text-sm font-medium border-r last:border-r-0 " +
                                        (active
                                            ? "bg-white text-[#F3B03E] border-b-2 border-b-[#F3B03E]"
                                            : "bg-gray-50 text-gray-600 hover:bg-white")
                                    }
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab content */}
                    <div className="p-5 md:p-6 text-sm text-gray-800">
                        {activeTab === "details" && (
                            <>
                                {/* Key Features */}
                                <h2 className="text-lg font-semibold mb-2">Key Features</h2>
                                <hr className="border-gray-200 mb-3" />
                                {keyFeatures.length > 0 ? (
                                    <ul className="list-disc pl-5 space-y-1 mb-6">
                                        {keyFeatures.map((f, idx) => (
                                            <li key={idx}>{f}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mb-6 text-sm text-gray-600">
                                        Key features will appear here when added for this property.
                                    </p>
                                )}

                                {/* Description */}
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <hr className="border-gray-200 mb-3" />
                                <p className="leading-relaxed whitespace-pre-line mb-8">
                                    {property.description ||
                                        "No detailed description has been provided for this property yet."}
                                </p>

                                {/* Further Details */}
                                <h3 className="text-lg font-semibold mb-2">Further Details</h3>
                                <hr className="border-gray-200 mb-3" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-12 mb-8 text-sm">
                                    <div className="flex">
                                        <span className="font-semibold w-36">Property Type:</span>
                                        <span>
                                            {property.type
                                                ? `${property.type}${property.bedrooms != null &&
                                                    property.bathrooms != null
                                                    ? ` (${property.bedrooms} bedroom, ${property.bathrooms} bathroom)`
                                                    : ""
                                                }`
                                                : "Not specified"}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-semibold w-36">Tenure:</span>
                                        <span>{property.tenure || "Not specified"}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-semibold w-36">Floor Space:</span>
                                        <span>
                                            {property.areaSqft != null
                                                ? `${property.areaSqft.toLocaleString()} square feet`
                                                : "Not specified"}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-semibold w-36">Location:</span>
                                        <span>{locationLine || "Not specified"}</span>
                                    </div>
                                </div>

                                {/* Leasehold Information */}
                                <h3 className="text-lg font-semibold mb-2">
                                    Leasehold Information
                                </h3>
                                <hr className="border-gray-200 mb-3" />
                                <div className="space-y-1 mb-8 text-sm">
                                    <p>
                                        <span className="font-semibold">Tenure:</span>{" "}
                                        {property.tenure || "Not specified"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Lease Start Date:</span>{" "}
                                        {property.leaseStartDate || "Not specified"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Original Lease Term:</span>{" "}
                                        {property.leaseTermYears != null
                                            ? `${property.leaseTermYears} years`
                                            : "Not specified"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Lease Expiry Date:</span>{" "}
                                        {property.leaseExpiryDate || "Not specified"}
                                    </p>
                                </div>

                                {/* Disclaimer */}
                                <h3 className="text-lg font-semibold mb-2">Disclaimer</h3>
                                <hr className="border-gray-200 mb-3" />
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    These particulars are intended to give a fair and
                                    substantially correct overall description for the guidance of
                                    intending purchasers and do not constitute an offer or part of
                                    a contract. Any services, heating systems or appliances have
                                    not been tested and no warranty can be given or implied as to
                                    their working order. Prospective purchasers should rely on
                                    their own inspections and seek appropriate professional
                                    advice.
                                </p>
                            </>
                        )}

                        {activeTab === "floor" && (
                            <div className="text-sm text-gray-600">
                                <p className="font-medium mb-2">Floor Plans</p>
                                {floorPlans.length === 0 ? (
                                    <p>No floor plans have been uploaded for this property yet.</p>
                                ) : (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {floorPlans.map((url, i) => (
                                            <li key={url + i}>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 hover:underline break-all"
                                                >
                                                    Floor plan {i + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {activeTab === "virtual" && (
                            <div className="text-sm text-gray-600">
                                <p className="font-medium mb-2">Virtual Tours</p>
                                {virtualTours.length === 0 ? (
                                    <p>
                                        No video or virtual tours are currently available for this
                                        property.
                                    </p>
                                ) : (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {virtualTours.map((url, i) => (
                                            <li key={url + i}>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 hover:underline break-all"
                                                >
                                                    Virtual tour {i + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {activeTab === "docs" && (
                            <div className="text-sm text-gray-600">
                                <p className="font-medium mb-2">Documents</p>
                                {documents.length === 0 ? (
                                    <p>
                                        Supporting documents (brochures, PDFs, etc.) will appear
                                        here once they are added.
                                    </p>
                                ) : (
                                    <ul className="list-disc pl-5 space-y-1">
                                        {documents.map((url, i) => (
                                            <li key={url + i}>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 hover:underline break-all"
                                                >
                                                    Document {i + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {activeTab === "map" && (
                            <div className="text-sm text-gray-600 space-y-4">
                                <p className="font-medium">Map & Street View</p>

                                {!MAPS_KEY ? (
                                    <p className="text-red-600">
                                        Google Maps key is not configured. Add{" "}
                                        <code>VITE_GOOGLE_MAPS_KEY</code> to your environment.
                                    </p>
                                ) : (
                                    <>
                                        {/* Map */}
                                        <div className="w-full h-[320px] md:h-[420px] border rounded-xl overflow-hidden shadow-sm">
                                            <iframe
                                                title="Property location map"
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                loading="lazy"
                                                allowFullScreen
                                                referrerPolicy="no-referrer-when-downgrade"
                                                src={mapSrc}
                                            />
                                        </div>

                                        {/* Street View (only when we have coords) */}
                                        {streetViewSrc && (
                                            <>
                                                <p className="font-medium mt-4">Street View</p>
                                                <div className="w-full h-[260px] border rounded-xl overflow-hidden shadow-sm">
                                                    <iframe
                                                        title="Property street view"
                                                        width="100%"
                                                        height="100%"
                                                        style={{ border: 0 }}
                                                        loading="lazy"
                                                        allowFullScreen
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        src={streetViewSrc}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <p className="text-xs text-gray-600">
                                            {hasCoords
                                                ? "Location is shown based on latitude/longitude stored for this property."
                                                : "Exact coordinates are not stored for this property yet, so the map shows an approximate location based on the address."}
                                        </p>

                                        {fullAddress && (
                                            <p className="text-xs text-gray-600">
                                                Address used:{" "}
                                                <span className="font-medium">{fullAddress}</span>
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom back link */}
                <div className="mt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="underline text-gray-700 text-sm"
                    >
                        Back to property listings
                    </button>
                </div>
            </div>
        </div>
    );
}
