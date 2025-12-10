// src/components/UploadSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const formatMoney = (n) =>
    typeof n === "number" && !Number.isNaN(n)
        ? `£${n.toLocaleString("en-GB")}`
        : "Price on request";

const UploadSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // We expect UploadProperty to send something like: { state: { property: preview } }
    const property = location.state?.property || null;

    const handleGoToListings = () => {
        navigate("/account/listings");
    };

    const handleViewProperty = () => {
        if (property?.id) {
            navigate(`/buy/properties/${property.id}`);
        } else {
            navigate("/buy");
        }
    };

    return (
        <section className="min-h-screen bg-[#f7f6f3] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 md:p-8 border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 font-semibold mb-1">
                            Submission received
                        </p>
                        <h1 className="text-2xl md:text-3xl font-serif font-semibold">
                            Your property is now pending review
                        </h1>
                        <p className="text-sm text-gray-600 mt-2 max-w-xl">
                            Our team will review your listing shortly. Once approved, it will
                            appear in public search results just like the preview below.
                        </p>
                    </div>
                </div>

                {/* If we have property preview data, show card-style preview */}
                {property ? (
                    <div className="mt-5">
                        <h2 className="text-sm font-medium text-gray-700 mb-2">
                            Public listing preview
                        </h2>
                        <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
                            <div className="p-3">
                                <div className="rounded-xl overflow-hidden">
                                    <img
                                        src={property.coverImageUrl || "/placeholder.jpg"}
                                        alt={property.title || "Listing preview"}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                            </div>
                            <div className="px-3 pb-3">
                                <h3 className="text-lg font-semibold">
                                    {property.title || "Untitled property"}
                                </h3>

                                <p className="text-xs text-gray-500 mt-0.5">
                                    {[property.city, property.state].filter(Boolean).join(", ") ||
                                        "Location not specified"}
                                </p>

                                {property.description && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        {property.description.length > 120
                                            ? `${property.description.slice(0, 120)}…`
                                            : property.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-lg font-bold">
                                        {formatMoney(property.price)}
                                    </p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-yellow-100 text-yellow-800">
                                        Status: PENDING REVIEW
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Fallback if user lands here without state
                    <div className="mt-5 text-sm text-gray-600">
                        Your listing was submitted successfully. Once it’s approved, it will
                        appear in search results. You can view all your listings from{" "}
                        <button
                            onClick={handleGoToListings}
                            className="underline text-gray-800"
                        >
                            My Listings
                        </button>
                        .
                    </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
                    <button
                        onClick={handleGoToListings}
                        className="w-full sm:w-auto px-4 py-2 rounded-full text-sm font-medium bg-black text-white hover:bg-black/90"
                    >
                        Go to My Listings
                    </button>
                    <button
                        onClick={handleViewProperty}
                        className="w-full sm:w-auto px-4 py-2 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-50"
                    >
                        View property page
                    </button>
                </div>

                <p className="mt-3 text-[11px] text-gray-500">
                    You can return to this page from your{" "}
                    <button
                        onClick={handleGoToListings}
                        className="underline text-gray-700"
                    >
                        My Listings
                    </button>{" "}
                    area once the property is approved and live.
                </p>
            </div>
        </section>
    );
};

export default UploadSuccess;
