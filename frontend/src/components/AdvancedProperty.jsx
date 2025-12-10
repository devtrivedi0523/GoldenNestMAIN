// src/components/AdvancedProperty.jsx
import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAccessToken } from "../auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function AdvancedProperty() {
    const { id } = useParams();                    // <-- /sell/upload/:id/advanced
    const navigate = useNavigate();
    const location = useLocation();
    const basicProperty = location.state?.property; // optional preview from step 1

    const [form, setForm] = useState({
        tenure: "",
        leaseStartDate: "",
        leaseTermYears: "",
        leaseExpiryDate: "",
        floorPlansInput: "",
        virtualToursInput: "",
        documentsInput: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const token = getAccessToken();
            if (!token) {
                setError("You must be logged in to update advanced details.");
                setSubmitting(false);
                return;
            }

            const payload = {
                tenure: form.tenure || null,
                leaseStartDate: form.leaseStartDate || null, // "YYYY-MM-DD"
                leaseTermYears: form.leaseTermYears
                    ? Number(form.leaseTermYears)
                    : null,
                leaseExpiryDate: form.leaseExpiryDate || null,
                floorPlans: form.floorPlansInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                virtualTours: form.virtualToursInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                documents: form.documentsInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
            };

            const res = await fetch(`${API_BASE}/api/properties/${id}/advanced`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Update failed (${res.status}): ${txt}`);
            }

            // after advanced step, you can either:
            // 1) go to success page
            navigate("/sell/success", {
                state: { property: basicProperty ?? { id: Number(id) } },
            });
            // or 2) go straight to details page:
            // navigate(`/buy/properties/${id}`);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to update advanced details");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="py-10 px-6 md:px-20 bg-[#f7f6f3]">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                <h1 className="text-xl md:text-2xl font-semibold mb-4">
                    Advanced property details
                </h1>
                {basicProperty && (
                    <p className="text-sm text-gray-600 mb-4">
                        Finishing details for:{" "}
                        <span className="font-medium">{basicProperty.title}</span>
                    </p>
                )}

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* LEASE / TENURE */}
                    <div>
                        <h2 className="text-sm font-semibold mb-3">Lease & tenure</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium mb-1">
                                    Tenure
                                </label>
                                <select
                                    name="tenure"
                                    value={form.tenure}
                                    onChange={onChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                                >
                                    <option value="">Not specified</option>
                                    <option value="Freehold">Freehold</option>
                                    <option value="Leasehold">Leasehold</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1">
                                    Lease term (years)
                                </label>
                                <input
                                    name="leaseTermYears"
                                    type="number"
                                    min="0"
                                    value={form.leaseTermYears}
                                    onChange={onChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                                    placeholder="e.g. 99"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1">
                                    Lease start date
                                </label>
                                <input
                                    name="leaseStartDate"
                                    type="date"
                                    value={form.leaseStartDate}
                                    onChange={onChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1">
                                    Lease expiry date
                                </label>
                                <input
                                    name="leaseExpiryDate"
                                    type="date"
                                    value={form.leaseExpiryDate}
                                    onChange={onChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                                />
                            </div>
                        </div>
                    </div>

                    {/* MEDIA FIELDS */}
                    <div className="border-t border-gray-200 pt-4">
                        <h2 className="text-sm font-semibold mb-3">
                            Additional media (optional)
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium mb-1">
                                    Floor plan image URLs (comma separated)
                                </label>
                                <input
                                    name="floorPlansInput"
                                    value={form.floorPlansInput}
                                    onChange={onChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                                    placeholder="https://example.com/floor1.jpg, https://example.com/floor2.jpg"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1">
                                    Virtual tour links (comma separated)
                                </label>
                                <input
                                    name="virtualToursInput"
                                    value={form.virtualToursInput}
                                    onChange={onChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                                    placeholder="https://youtube.com/..., https://matterport.com/..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-1">
                                    Document URLs (comma separated)
                                </label>
                                <input
                                    name="documentsInput"
                                    value={form.documentsInput}
                                    onChange={onChange}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                                    placeholder="Brochures, PDFs, etc."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="text-sm text-gray-600 underline"
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 bg-[#F3B03E] text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-black/90 transition"
                        >
                            {submitting && (
                                <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            )}
                            {submitting ? "Saving…" : "Save & continue"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
