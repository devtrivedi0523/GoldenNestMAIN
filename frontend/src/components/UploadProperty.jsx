// src/components/UploadProperty.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../auth";
import AdvancedProperty from "./AdvancedProperty";

const API_BASE = import.meta.env.VITE_API_URL || "https://goldennestmain-production.up.railway.app";

const UploadProperty = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    address1: "",
    city: "",
    state: "",
    zip: "",
    areaSqft: "",
    lat: "",
    lng: "",
    imagesInput: "",
    locationTag: "",
    propertyType: "",
    yearBuilt: "",

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
      // Build images array from comma-separated input
      const images = form.imagesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const floorPlans = (form.floorPlansInput || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const virtualTours = (form.virtualToursInput || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const documents = (form.documentsInput || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        address1: form.address1,
        city: form.city,
        state: form.state,
        zip: form.zip,
        areaSqft: form.areaSqft ? Number(form.areaSqft) : null,
        lat: form.lat ? Number(form.lat) : null,
        lng: form.lng ? Number(form.lng) : null,
        locationTag: form.locationTag || "",
        propertyType: form.propertyType || "",
        yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : null,
        type: form.propertyType || "",
        images,

        tenure: form.tenure || null,
        leaseStartDate: form.leaseStartDate || null,
        leaseTermYears: form.leaseTermYears
          ? Number(form.leaseTermYears)
          : null,
        leaseExpiryDate: form.leaseExpiryDate || null,
        floorPlans,
        virtualTours,
        documents,
      };

      const token = getAccessToken();
      if (!token) {
        setError("You must be logged in to upload a property.");
        setSubmitting(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await fetch(`${API_BASE}/api/properties`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Upload failed (${res.status}): ${txt}`);
      }

      const data = await res.json(); // { id, status }

      // Build a preview object to show on the success page
      const firstImage = images[0] || null;
      const preview = {
        id: data.id,
        title: form.title,
        city: form.city,
        state: form.state,
        price: form.price ? Number(form.price) : null,
        description: form.description,
        coverImageUrl: firstImage,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        status: "PENDING",
      };

      // Navigate to a separate success page with preview
      navigate(`/sell/upload/${data.id}/advanced`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to upload property");
    } finally {
      setSubmitting(false);
    }
  };

  // Small derived helper: preview image URLs
  const imageUrls = useMemo(
    () =>
      form.imagesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [form.imagesInput]
  );

  return (
    <section className="py-10 px-6 md:px-20 bg-[#f7f6f3]">
      <div className="max-w-5xl mx-auto">
        {/* <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-semibold">
              List a New Property
            </h1>
            <p className="text-gray-600 mt-2 max-w-xl text-sm md:text-base">
              Share key details, location, and photos so buyers can get a clear
              first impression of your property.
            </p>
          </div>
        </div> */}

        <form
          onSubmit={onSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
        >
          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* BASIC DETAILS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Basic details</h2>
              <span className="text-xs text-gray-500">
                Fields marked <span className="text-red-500">*</span> are
                required
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                  placeholder="e.g. Bright 2BHK apartment near city center"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                  placeholder="Describe the property, layout, surroundings, and any special features."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Mention light, storage, nearby transport, schools, or
                  amenities to make the listing more attractive.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      £
                    </span>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={onChange}
                      className="w-full border rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                      placeholder="e.g. 350000"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the full sale price (numbers only).
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bedrooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="bedrooms"
                    type="number"
                    min="0"
                    value={form.bedrooms}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                    placeholder="e.g. 3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bathrooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="bathrooms"
                    type="number"
                    min="0"
                    value={form.bathrooms}
                    onChange={onChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                    placeholder="e.g. 2"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-3">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Street address <span className="text-red-500">*</span>
                </label>
                <input
                  name="address1"
                  value={form.address1}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                  placeholder="e.g. 21 Baker Street"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                  placeholder="e.g. London"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                  placeholder="State / Region"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  ZIP / Pincode
                </label>
                <input
                  name="zip"
                  value={form.zip}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                  placeholder="Postal code"
                />
              </div>
            </div>
          </div>

          {/* PROPERTY DETAILS */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-3">Property details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Area (sq ft)
                </label>
                <input
                  name="areaSqft"
                  type="number"
                  value={form.areaSqft}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                  placeholder="e.g. 1200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Latitude
                </label>
                <input
                  name="lat"
                  type="number"
                  value={form.lat}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Longitude
                </label>
                <input
                  name="lng"
                  type="number"
                  value={form.lng}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location tag
                </label>
                <select
                  name="locationTag"
                  value={form.locationTag}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                >
                  <option value="">Select location</option>
                  <option value="Downtown">Downtown</option>
                  <option value="Suburbs">Suburbs</option>
                  <option value="Beachfront">Beachfront</option>
                  <option value="Hillside">Hillside</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Property type
                </label>
                <select
                  name="propertyType"
                  value={form.propertyType}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                >
                  <option value="">Select type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Year built
                </label>
                <select
                  name="yearBuilt"
                  value={form.yearBuilt}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                >
                  <option value="">Select year</option>
                  {Array.from({ length: 60 }).map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={String(year)}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* PHOTOS */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-3">Photos</h2>
            <div>
              <label className="block text-sm font-medium mb-1">
                Image URLs (comma separated)
              </label>
              <input
                name="imagesInput"
                value={form.imagesInput}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                placeholder="https://image1.jpg, https://image2.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste one or more image URLs separated by commas. The first one
                will be used as the main cover image.
              </p>

              {imageUrls.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Preview
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {imageUrls.map((url, i) => (
                      <div
                        key={url + i}
                        className="w-24 h-20 rounded-lg overflow-hidden border bg-gray-100"
                      >
                        <img
                          src={url}
                          alt={`preview-${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.opacity = "0.4";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* <AdvancedProperty form={form} onChange={onChange} /> */}
          {/* SUBMIT */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-[#F3B03E] text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-black/90 transition"
            >
              {submitting && (
                <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {submitting ? "Uploading…" : "Publish listing"}
            </button>
          </div>
        </form>

      </div>
    </section>
  );
};

export default UploadProperty;
