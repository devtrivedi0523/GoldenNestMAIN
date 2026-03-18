// src/components/PropertyEnquiry.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import emailjs from "@emailjs/browser";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const formatPrice = (value, currency = "£") => {
    if (value == null) return null;
    const num = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(num)) return null;
    return `${currency}${num.toLocaleString()}`;
};

export default function PropertyEnquiry() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        telephone: "",
        email: "",
        country: "United Kingdom",
        postcode: "",
        message: "",
        wantsMoreDetails: true,
        wantsToView: false,
        hasPropertyToSell: "",
        hasPropertyToLet: "",
        wantsValuation: false,
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        if (!id) return;
        const load = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/api/properties/${id}`);
                if (!res.ok) throw new Error("Property not found");
                const data = await res.json();
                setProperty(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError("");

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    to_email: property?.agentEmail || "",
                    property_title: property?.title || `Property #${id}`,
                    property_id: id,
                    first_name: form.firstName,
                    last_name: form.lastName,
                    telephone: form.telephone,
                    from_email: form.email,
                    country: form.country,
                    postcode: form.postcode,
                    message: form.message || "No message provided.",
                    wants_details: form.wantsMoreDetails ? "Yes" : "No",
                    wants_viewing: form.wantsToView ? "Yes" : "No",
                    has_to_sell: form.hasPropertyToSell || "Not specified",
                    has_to_let: form.hasPropertyToLet || "Not specified",
                    wants_valuation: form.wantsValuation ? "Yes" : "No",
                },
                EMAILJS_PUBLIC_KEY
            );
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setSubmitError("Failed to send your enquiry. Please try again or call us directly.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
                Loading…
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-xl font-semibold">{error || "Property not found"}</p>
                <button onClick={() => navigate(-1)} className="underline text-gray-600 text-sm">Go back</button>
            </div>
        );
    }

    const formattedPrice = formatPrice(property.price);
    const locationLine = [property.city, property.state].filter(Boolean).join(", ") || null;
    const heroImage = Array.isArray(property.images) && property.images.length > 0
        ? property.images[0]
        : "/placeholder.jpg";

    if (submitted) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Enquiry Sent!</h2>
                <p className="text-gray-500 text-center max-w-sm">
                    Your message about <span className="font-medium text-gray-700">{property.title}</span> has been sent to the agent. They'll be in touch soon.
                </p>
                <button
                    onClick={() => navigate(`/buy/properties/${id}`)}
                    className="mt-2 bg-[#F3B03E] hover:bg-[#e0a030] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
                >
                    Back to Property
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex flex-col md:flex-row">

                        {/* LEFT: Form */}
                        <div className="flex-1 p-6 md:p-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Contact The Golden Nest
                            </h1>
                            <p className="text-sm text-gray-500 mb-5">
                                Email about: <span className="font-medium text-gray-700">{property.title}</span>
                            </p>

                            {/* Checkboxes row */}
                            <div className="flex items-center gap-6 mb-5">
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="wantsMoreDetails"
                                        checked={form.wantsMoreDetails}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-[#F3B03E]"
                                    />
                                    More details
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="wantsToView"
                                        checked={form.wantsToView}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-[#F3B03E]"
                                    />
                                    To view a property
                                </label>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name row */}
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            placeholder="Eg. John"
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3B03E]/40 focus:border-[#F3B03E]"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            placeholder="Eg. Smith"
                                            required
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3B03E]/40 focus:border-[#F3B03E]"
                                        />
                                    </div>
                                </div>

                                {/* Telephone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                                    <input
                                        type="tel"
                                        name="telephone"
                                        value={form.telephone}
                                        onChange={handleChange}
                                        placeholder="Eg. 07700 900 000"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3B03E]/40 focus:border-[#F3B03E]"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Eg. john.smith@email.com"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3B03E]/40 focus:border-[#F3B03E]"
                                    />
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <select
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3B03E]/40 focus:border-[#F3B03E] bg-white"
                                    >
                                        <option>United Kingdom</option>
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>Australia</option>
                                        <option>India</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                {/* Postcode */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                                    <input
                                        type="text"
                                        name="postcode"
                                        value={form.postcode}
                                        onChange={handleChange}
                                        placeholder="Eg. MK6 1AJ"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3B03E]/40 focus:border-[#F3B03E]"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your message <span className="font-normal text-gray-400">(Optional)</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Start typing..."
                                        rows={4}
                                        maxLength={700}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F3B03E]/40 focus:border-[#F3B03E] resize-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{form.message.length}/700 characters</p>
                                </div>


                                {/* Error */}
                                {submitError && (
                                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                        {submitError}
                                    </p>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-[#F3B03E] hover:bg-[#e0a030] disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                                >
                                    {submitting ? "Sending…" : "Send email"}
                                </button>
                            </form>
                        </div>

                        {/* RIGHT: Property summary card */}
                        <div className="md:w-64 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 p-5 flex flex-col gap-4">
                            {/* Property image */}
                            <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video">
                                <img
                                    src={heroImage}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Price */}
                            {formattedPrice && (
                                <p className="text-[#F3B03E] text-xl font-bold">{formattedPrice}</p>
                            )}

                            {/* Type & bedrooms */}
                            <div className="text-sm text-gray-700">
                                {property.bedrooms != null && (
                                    <p className="font-semibold">
                                        {property.bedrooms} bedroom {property.type ? property.type.toLowerCase() : "property"}
                                    </p>
                                )}
                                {locationLine && <p className="text-gray-500 mt-0.5">{locationLine}</p>}
                            </div>

                            {/* Agent branding */}
                            <div className="pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-400 mb-2">Marketed by</p>
                                <img
                                    src="/1-2 1.png"
                                    alt="The Golden Nest"
                                    className="h-10 object-contain mb-2"
                                />
                                <p className="text-sm font-semibold text-gray-800">The Golden Nest</p>
                                {property.agentAddress && (
                                    <p className="text-xs text-gray-500 mt-0.5">{property.agentAddress}</p>
                                )}
                            </div>

                            {/* Back link */}
                            <button
                                onClick={() => navigate(`/buy/properties/${id}`)}
                                className="text-xs text-gray-400 hover:text-gray-600 underline text-left mt-auto"
                            >
                                ← Back to property
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}