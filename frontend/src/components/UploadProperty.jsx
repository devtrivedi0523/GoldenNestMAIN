// src/components/UploadProperty.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../auth";
import ImageUploader from "./ImageUploader";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

const UploadProperty = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    areaId: "", // optional, will be set if user has areas
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
  const [loadingMe, setLoadingMe] = useState(true);
  const [error, setError] = useState("");


  // Remove imagesInput from the form useState object
  // Add this separate state:
  const [imageUrls, setImageUrls] = useState([]);

  // metadata from /api/auth/me
  const [me, setMe] = useState(null);

  const token = getAccessToken();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // load current user (includes areas & companyId)
  useEffect(() => {
    let cancelled = false;
    async function loadMe() {
      setLoadingMe(true);
      setError("");
      if (!token) {
        setMe(null);
        setLoadingMe(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Auth failed (${res.status}): ${txt}`);
        }
        const data = await res.json();
        if (cancelled) return;
        setMe(data || null);

        // If user has exactly 1 area, preselect it
        if (data?.areas?.length === 1) {
          setForm((f) => ({ ...f, areaId: String(data.areas[0].id) }));
        }
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Failed to load profile");
        setMe(null);
      } finally {
        if (!cancelled) setLoadingMe(false);
      }
    }
    loadMe();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const role = String(me?.role || "").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const isAgent = role === "AGENT";
  const isCompany = role === "COMPANY";
  const isUser = role === "USER";

  // availableAreas are the areas returned as part of `me`
  const availableAreas = Array.isArray(me?.areas) ? me.areas : [];

  // If user is agent and has areas, require selection
  const agentHasAreas = isAgent && availableAreas.length > 0;

  const canPublishRole = isAdmin || isAgent || isCompany || isUser;

  const canSubmit =
    !!token &&
    !loadingMe &&
    canPublishRole &&
    !!String(form.title || "").trim() &&
    !!String(form.price || "").trim() &&
    !!String(form.bedrooms || "").trim() &&
    !!String(form.bathrooms || "").trim() &&
    !!String(form.address1 || "").trim() &&
    // if agent has areas, area must be selected
    (!agentHasAreas || (!!String(form.areaId || "").trim()));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (!token) {
        setError("You must be logged in to upload a property.");
        setSubmitting(false);
        return;
      }
      if (!canPublishRole) {
        setError(`Your role (${me?.role}) cannot publish properties.`);
        setSubmitting(false);
        return;
      }
      // agent must select an area if they have assigned areas
      if (agentHasAreas && !String(form.areaId || "").trim()) {
        setError("Please select an area before publishing (assigned to your account).");
        setSubmitting(false);
        return;
      }

      const images = imageUrls;


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
        // send areaId when set, otherwise null
        areaId: form.areaId ? Number(form.areaId) : null,

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
        leaseTermYears: form.leaseTermYears ? Number(form.leaseTermYears) : null,
        leaseExpiryDate: form.leaseExpiryDate || null,
        floorPlans,
        virtualTours,
        documents,
      };

      const res = await fetch(`${API_BASE}/api/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Upload failed (${res.status}): ${txt}`);
      }

      const data = await res.json();
      navigate(`/sell/upload/${data.id}/advanced`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to upload property");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-10 px-6 md:px-20 bg-[#f7f6f3]">
      <div className="max-w-5xl mx-auto">
        <form
          onSubmit={onSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6"
        >
          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Profile + area notice */}
          <div className="p-4 rounded-xl border bg-[#fffaf0]">
            {loadingMe ? (
              <div className="text-sm text-gray-700">Loading your profile…</div>
            ) : !token ? (
              <div className="text-sm text-gray-700">You’re not logged in. Please log in first.</div>
            ) : !canPublishRole ? (
              <div className="text-sm text-gray-700">
                Your role is <b>{me?.role || "UNKNOWN"}</b>. You cannot publish properties.
              </div>
            ) : (
              <div className="text-sm text-gray-700">
                Logged in as <b>{me?.email}</b> ({me?.role}).
                {isAgent && availableAreas.length === 0 && (
                  <div className="block mt-1 text-xs text-gray-600">
                    You have no assigned areas. Ask your admin to assign you to an area.
                  </div>
                )}
                {!isAgent && !isAdmin && (
                  <div className="block mt-1 text-xs text-gray-600">
                    Your listing will be reviewed before going live.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* If agent has areas - show select */}
          {agentHasAreas && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Area <span className="text-red-500">*</span>
              </label>
              <select
                name="areaId"
                value={form.areaId}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                required
              >
                <option value="">Select area…</option>
                {availableAreas.map((a) => (
                  <option key={a.id} value={String(a.id)}>
                    {a.name} (ID: {a.id})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">This listing will be managed under the selected area.</p>
            </div>
          )}

          {/* --- rest of form (same as before) --- */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Basic details</h2>
              <span className="text-xs text-gray-500">
                Fields marked <span className="text-red-500">*</span> are required
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
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                  placeholder="Describe the property, layout, surroundings, and any special features."
                />
                <p className="text-xs text-gray-500 mt-1">Tip: Mention light, storage, nearby transport, schools, or amenities to make the listing more attractive.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">£</span>
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
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bedrooms <span className="text-red-500">*</span></label>
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
                  <label className="block text-sm font-medium mb-1">Bathrooms <span className="text-red-500">*</span></label>
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

          {/* location, property details, photos, etc. (unchanged) */}
          {/* LOCATION */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-3">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Street address <span className="text-red-500">*</span></label>
                <input name="address1" value={form.address1} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70" placeholder="e.g. 21 Baker Street" required />
              </div>
              <div><label className="block text-sm font-medium mb-1">City</label><input name="city" value={form.city} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. London" /></div>
              <div><label className="block text-sm font-medium mb-1">State</label><input name="state" value={form.state} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="State / Region" /></div>
              <div><label className="block text-sm font-medium mb-1">ZIP / Pincode</label><input name="zip" value={form.zip} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Postal code" /></div>
            </div>
          </div>

          {/* PROPERTY DETAILS */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-3">Property details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium mb-1">Area (sq ft)</label><input name="areaSqft" type="number" value={form.areaSqft} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. 1200" /></div>
              <div><label className="block text-sm font-medium mb-1">Latitude</label><input name="lat" type="number" value={form.lat} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Optional" /></div>
              <div><label className="block text-sm font-medium mb-1">Longitude</label><input name="lng" type="number" value={form.lng} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Optional" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location tag</label>
                <select name="locationTag" value={form.locationTag} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="">Select location</option>
                  <option value="Downtown">Downtown</option>
                  <option value="Suburbs">Suburbs</option>
                  <option value="Beachfront">Beachfront</option>
                  <option value="Hillside">Hillside</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Property type</label>
                <select name="propertyType" value={form.propertyType} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="">Select type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Year built</label>
                <select name="yearBuilt" value={form.yearBuilt} onChange={onChange} className="w-full border rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="">Select year</option>
                  {Array.from({ length: 60 }).map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return <option key={year} value={String(year)}>{year}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* PHOTOS */}
          {/* PHOTOS */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-3">Photos</h2>
            <ImageUploader urls={imageUrls} onChange={setImageUrls} />
          </div>

          {/* SUBMIT */}
          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={submitting || !canSubmit} className="inline-flex items-center gap-2 bg-[#F3B03E] text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-black/90 transition" title={!canSubmit ? (!token ? "Login required" : loadingMe ? "Loading profile..." : "Fill required fields") : ""}>
              {submitting && <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {submitting ? "Uploading…" : "Publish listing"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UploadProperty;