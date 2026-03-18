// src/Company.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api/http";
import { FaChevronDown, FaChevronRight, FaSearch, FaHome, FaTimes, FaPlus, FaUserPlus, FaUsers } from "react-icons/fa";
import { clearAccessToken, getAccessToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

/* ---------- helpers ---------- */
const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-1 text-xs bg-black text-white px-3 py-1 rounded-full">{children}</span>
);

const formatPrice = (value) => {
  if (value == null) return "Price on request";
  const n = Number(value);
  if (isNaN(n)) return "Price on request";
  return `£${n.toLocaleString()}`;
};

/* ---------- Sidebar ---------- */
const Sidebar = ({ activeTab, onTabChange, activeSection, onSectionChange }) => {
  const [openProp, setOpenProp] = useState(true);
  const [openTeam, setOpenTeam] = useState(true);

  const propLinks = [
    { label: "Pending Review", tab: "pending" },
    { label: "Approved Listings", tab: "approved" },
    { label: "Rejected Listings", tab: "rejected" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[240px] shrink-0 bg-white border rounded-2xl m-3 p-3 relative z-10">
      <div className="flex items-center gap-2 px-2 py-3"><img src="/1-2 1.png" alt="Golden Nest" /></div>
      <div className="mt-2"><div className="rounded-md bg-[#F3B03E]/30 text-black px-3 py-2 font-medium">Company Dashboard</div></div>

      {/* Property Management */}
      <div className="mt-4">
        <button
          type="button"
          className="w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium cursor-pointer"
          onClick={() => setOpenProp((v) => !v)}
        >
          <span>Property Management</span>{openProp ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openProp && (
          <ul className="pl-3 text-sm space-y-1">
            {propLinks.map(({ label, tab }) => (
              <li key={tab}>
                <button
                  type="button"
                  onClick={() => { onSectionChange("properties"); onTabChange(tab); }}
                  className={
                    "w-full text-left px-2 py-1.5 rounded-md transition cursor-pointer " +
                    (activeSection === "properties" && activeTab === tab
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

      {/* Company Team */}
      <div className="mt-4">
        <button
          type="button"
          className="w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium cursor-pointer"
          onClick={() => setOpenTeam((v) => !v)}
        >
          <span>Company Team</span>{openTeam ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {openTeam && (
          <ul className="pl-3 text-sm space-y-1">
            <li>
              <button
                type="button"
                onClick={() => onSectionChange("agents")}
                className={
                  "w-full text-left px-2 py-1.5 rounded-md transition cursor-pointer " +
                  (activeSection === "agents"
                    ? "bg-[#F3B03E]/40 font-semibold text-black"
                    : "hover:bg-gray-100 text-gray-700")
                }
              >
                Manage Agents
              </button>
            </li>
            <li className="px-2 py-1 text-gray-400 text-sm">Assign areas (future)</li>
          </ul>
        )}
      </div>
    </aside>
  );
};

/* ---------- Tabs ---------- */
const Tabs = ({ active, counts, onChange }) => {
  const btn = (key, label) => {
    const is = active === key;
    return (
      <button
        type="button"
        onClick={() => onChange(key)}
        className={"relative px-4 py-2 rounded-full text-sm font-medium transition " + (is ? "bg-[#F3B03E] text-black" : "bg-white border hover:bg-black/5 text-black")}
      >
        {label}<span className={"ml-2 inline-flex items-center justify-center text-xs rounded-full px-2 py-0.5 " + (is ? "bg-white/20" : "bg-black/10")}>{counts[key] ?? 0}</span>
      </button>
    );
  };
  return <div className="flex flex-wrap gap-2">{btn("pending", "Pending")}{btn("approved", "Approved")}{btn("rejected", "Rejected")}</div>;
};

function statusKeyToEnum(key) {
  if (key === "approved") return "APPROVED";
  if (key === "rejected") return "REJECTED";
  return "PENDING";
}

/* ---------- Listing Card ---------- */
const ListingCard = ({ p, agents, selectedAgentId, onSelectAgent, onAssignAgent, assigning, onView }) => {
  const img = p.coverImageUrl || "/placeholder.jpg";
  const location = [p.city, p.state].filter(Boolean).join(", ");
  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <img src={img} alt={p.title} className="w-full h-52 object-cover" />
      <div className="p-4">
        <div className="font-semibold">{p.title}</div>
        {location && <p className="text-xs text-gray-600 mt-1">{location}</p>}
        <div className="mt-3 flex flex-wrap gap-2">{location && <Pill><FaHome />{location}</Pill>}</div>
        <div className="mt-4">
          <div className="text-xs text-gray-500">Price</div>
          <div className="flex items-center gap-2">
            <div className="font-semibold">{formatPrice(p.price)}</div>
            <button type="button" className="ml-auto bg-[#F3B03E] hover:bg-[#e3a12f] text-black text-xs font-medium px-4 py-2 rounded-md" onClick={onView}>View Property Details</button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">Status: <span className="font-semibold">{p.status}</span></div>
        {p.status === "REJECTED" && p.declineReason && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
            <p className="text-xs font-semibold text-red-600 mb-1">Declined reason</p>
            <p className="text-xs text-red-700">{p.declineReason}</p>
          </div>
        )}
        <div className="mt-4 border-t pt-4">
          <div className="text-xs text-gray-600 mb-2 font-medium">Assign this property to an Agent</div>
          <div className="flex gap-2">
            <select value={selectedAgentId || ""} onChange={(e) => onSelectAgent(p.id, e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white" disabled={!agents?.length}>
              <option value="">{agents?.length ? "Select an agent" : "No agents found"}</option>
              {agents?.map((a) => <option key={a.id} value={String(a.id)}>{a.name ? `${a.name} (${a.email})` : a.email}</option>)}
            </select>
            <button type="button" onClick={() => onAssignAgent(p.id)} disabled={!selectedAgentId || assigning} className="bg-black text-white text-sm px-4 rounded-lg disabled:opacity-60">
              {assigning ? "Assigning..." : "Assign Agent"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Agent Card ---------- */
const AgentCard = ({ agent, onRemove, removing }) => {
  const initials = (agent.name || agent.email || "?").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
      <div className="h-11 w-11 rounded-full bg-gray-900 text-white text-sm font-semibold flex items-center justify-center shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{agent.name || "—"}</div>
        <div className="text-xs text-gray-500 truncate">{agent.email}</div>
      </div>
      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium shrink-0">Active</span>
    </div>
  );
};

/* ---------- Add Agent Panel (slide-in) ---------- */
const AddAgentPanel = ({ onClose, onAdded }) => {
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(null);
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await apiFetch("/api/company/agents/available");
        setAvailable(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "Failed to load available agents");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = available.filter((a) => {
    const q = search.toLowerCase();
    return (
      (a.name || "").toLowerCase().includes(q) ||
      (a.email || "").toLowerCase().includes(q)
    );
  });

  const handleAdd = async (agentId) => {
    setAdding(agentId);
    setError("");
    try {
      await apiFetch(`/api/company/agents/${agentId}`, { method: "PUT" });
      setSuccessId(agentId);
      setAvailable((prev) => prev.filter((a) => a.id !== agentId));
      onAdded();
    } catch (e) {
      setError(e.message || "Failed to add agent");
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold">Add Agent to Company</h2>
            <p className="text-xs text-gray-500 mt-0.5">Browse unassigned agents and add them to your team.</p>
          </div>
          <button type="button" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full border rounded-full px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/30"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-3">
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

          {loading && (
            <div className="py-10 text-center text-gray-400 text-sm">Loading available agents…</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-10 text-center text-gray-400 text-sm">
              {search ? "No agents match your search." : "No unassigned agents found."}
            </div>
          )}

          {!loading && filtered.map((agent) => {
            const initials = (agent.name || agent.email || "?").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
            const isAdding = adding === agent.id;
            const isDone = successId === agent.id;
            return (
              <div key={agent.id} className="flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3">
                <div className="h-9 w-9 rounded-full bg-gray-800 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{agent.name || "—"}</div>
                  <div className="text-xs text-gray-500 truncate">{agent.email}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdd(agent.id)}
                  disabled={isAdding || isDone}
                  className={
                    "shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition " +
                    (isDone
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-black text-white hover:bg-[#F3B03E] hover:text-black disabled:opacity-50")
                  }
                >
                  {isAdding ? "Adding…" : isDone ? "✓ Added" : "Add"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t">
          <button type="button" onClick={onClose} className="w-full py-2 rounded-full border text-sm hover:bg-gray-50 transition">Done</button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Manage Agents Section ---------- */
const ManageAgentsSection = ({ agents, loadingAgents, onRefresh }) => {
  const [showAddPanel, setShowAddPanel] = useState(false);

  const handleAdded = async () => {
    await onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Company Agents</h2>
          <p className="text-sm text-gray-500 mt-1">{agents.length} agent{agents.length !== 1 ? "s" : ""} in your team</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddPanel(true)}
          className="inline-flex items-center gap-2 bg-[#F3B03E] hover:bg-[#e3a12f] text-black font-medium px-5 py-2 rounded-full transition text-sm"
        >
          <FaUserPlus />
          Add Agent
        </button>
      </div>

      {loadingAgents && <div className="py-10 text-center text-gray-400">Loading agents…</div>}

      {!loadingAgents && agents.length === 0 && (
        <div className="py-16 flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <FaUsers className="text-gray-400 text-2xl" />
          </div>
          <div>
            <p className="font-semibold text-gray-700">No agents yet</p>
            <p className="text-sm text-gray-500 mt-1">Click "Add Agent" to assign agents to your company.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddPanel(true)}
            className="inline-flex items-center gap-2 bg-black text-white font-medium px-5 py-2 rounded-full transition text-sm hover:bg-[#F3B03E] hover:text-black"
          >
            <FaUserPlus />
            Add your first agent
          </button>
        </div>
      )}

      {!loadingAgents && agents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}

      {showAddPanel && (
        <AddAgentPanel
          onClose={() => setShowAddPanel(false)}
          onAdded={handleAdded}
        />
      )}
    </div>
  );
};

/* ---------- Advanced Form ---------- */
const AdvancedForm = ({ propertyId, onClose, onSuccess }) => {
  const token = getAccessToken();
  const [form, setForm] = useState({
    tenure: "", leaseStartDate: "", leaseTermYears: "", leaseExpiryDate: "",
    floorPlansInput: "", virtualToursInput: "", documentsInput: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const cls = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70";

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        tenure: form.tenure || null,
        leaseStartDate: form.leaseStartDate || null,
        leaseTermYears: form.leaseTermYears ? Number(form.leaseTermYears) : null,
        leaseExpiryDate: form.leaseExpiryDate || null,
        floorPlans: (form.floorPlansInput || "").split(",").map((s) => s.trim()).filter(Boolean),
        virtualTours: (form.virtualToursInput || "").split(",").map((s) => s.trim()).filter(Boolean),
        documents: (form.documentsInput || "").split(",").map((s) => s.trim()).filter(Boolean),
      };
      const res = await fetch(`${API_BASE}/api/properties/${propertyId}/advanced`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const txt = await res.text(); throw new Error(`Update failed (${res.status}): ${txt}`); }
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to save advanced details");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h2 className="text-lg font-bold">Advanced Details</h2>
          <p className="text-xs text-gray-500 mt-0.5">Step 2 of 2 — optional lease info & media links.</p>
        </div>
        <button type="button" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
          <FaTimes className="text-gray-500" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="flex-1 px-6 py-6 space-y-6">
        {error && <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">{error}</div>}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Lease & Tenure</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium mb-1">Tenure</label><select name="tenure" value={form.tenure} onChange={onChange} className={cls + " bg-white"}><option value="">Not specified</option><option value="Freehold">Freehold</option><option value="Leasehold">Leasehold</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Lease term (years)</label><input name="leaseTermYears" type="number" min="0" value={form.leaseTermYears} onChange={onChange} className={cls} placeholder="e.g. 99" /></div>
            <div><label className="block text-sm font-medium mb-1">Lease start date</label><input name="leaseStartDate" type="date" value={form.leaseStartDate} onChange={onChange} className={cls} /></div>
            <div><label className="block text-sm font-medium mb-1">Lease expiry date</label><input name="leaseExpiryDate" type="date" value={form.leaseExpiryDate} onChange={onChange} className={cls} /></div>
          </div>
        </div>
        <div className="border-t pt-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Additional Media (optional)</h3>
          <div className="space-y-3">
            <div><label className="block text-sm font-medium mb-1">Floor plan URLs</label><input name="floorPlansInput" value={form.floorPlansInput} onChange={onChange} className={cls} placeholder="https://example.com/floor1.jpg, ..." /></div>
            <div><label className="block text-sm font-medium mb-1">Virtual tour links</label><input name="virtualToursInput" value={form.virtualToursInput} onChange={onChange} className={cls} placeholder="https://youtube.com/..., ..." /></div>
            <div><label className="block text-sm font-medium mb-1">Document URLs</label><input name="documentsInput" value={form.documentsInput} onChange={onChange} className={cls} placeholder="Brochures, PDFs, etc." /></div>
          </div>
        </div>
        <div className="border-t pt-5 flex justify-between">
          <button type="button" onClick={onSuccess} className="text-sm text-gray-500 underline">Skip this step</button>
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 bg-[#F3B03E] text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-60 hover:bg-black/90 transition">
            {submitting && <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {submitting ? "Saving…" : "Save & finish"}
          </button>
        </div>
      </form>
    </>
  );
};

/* ---------- Upload Form ---------- */
const UploadForm = ({ me, onClose, onSuccess }) => {
  const token = getAccessToken();
  const [step, setStep] = useState("basic");
  const [newPropertyId, setNewPropertyId] = useState(null);
  const [form, setForm] = useState({
    title: "", description: "", price: "", bedrooms: "", bathrooms: "",
    address1: "", city: "", state: "", zip: "", areaSqft: "",
    lat: "", lng: "", imagesInput: "", locationTag: "", propertyType: "", yearBuilt: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const canSubmit = !!form.title.trim() && !!form.price.trim() && !!form.bedrooms.trim() && !!form.bathrooms.trim() && !!form.address1.trim();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const images = (form.imagesInput || "").split(",").map((s) => s.trim()).filter(Boolean);
      const payload = {
        title: form.title, description: form.description,
        price: Number(form.price), bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms),
        address1: form.address1, city: form.city, state: form.state, zip: form.zip,
        areaSqft: form.areaSqft ? Number(form.areaSqft) : null,
        lat: form.lat ? Number(form.lat) : null, lng: form.lng ? Number(form.lng) : null,
        locationTag: form.locationTag, propertyType: form.propertyType, type: form.propertyType,
        yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : null,
        images,
      };
      const res = await fetch(`${API_BASE}/api/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const txt = await res.text(); throw new Error(`Upload failed (${res.status}): ${txt}`); }
      const data = await res.json();
      setNewPropertyId(data.id);
      setStep("advanced");
    } catch (err) {
      setError(err.message || "Failed to upload property");
    } finally {
      setSubmitting(false);
    }
  };

  const imageUrls = useMemo(() => (form.imagesInput || "").split(",").map((s) => s.trim()).filter(Boolean), [form.imagesInput]);
  const cls = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white shadow-2xl overflow-y-auto flex flex-col">
        {step === "advanced" ? (
          <AdvancedForm propertyId={newPropertyId} onClose={onClose} onSuccess={onSuccess} />
        ) : (
          <>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold">Create New Listing</h2>
                <p className="text-xs text-gray-500 mt-0.5">Logged in as <b>{me?.email}</b> — listing will go to Pending review.</p>
              </div>
              <button type="button" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
                <FaTimes className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="flex-1 px-6 py-6 space-y-6">
              {error && <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">{error}</div>}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Basic Details</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label><input name="title" value={form.title} onChange={onChange} className={cls} placeholder="e.g. Bright 2BHK near city centre" required /></div>
                  <div><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" value={form.description} onChange={onChange} className={cls + " min-h-[90px]"} placeholder="Describe the property..." /></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className="block text-sm font-medium mb-1">Price <span className="text-red-500">*</span></label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">£</span><input name="price" type="number" value={form.price} onChange={onChange} className={cls + " pl-7"} placeholder="350000" required /></div></div>
                    <div><label className="block text-sm font-medium mb-1">Bedrooms <span className="text-red-500">*</span></label><input name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={onChange} className={cls} placeholder="3" required /></div>
                    <div><label className="block text-sm font-medium mb-1">Bathrooms <span className="text-red-500">*</span></label><input name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={onChange} className={cls} placeholder="2" required /></div>
                  </div>
                </div>
              </div>
              <div className="border-t pt-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Location</h3>
                <div className="space-y-3">
                  <div><label className="block text-sm font-medium mb-1">Street address <span className="text-red-500">*</span></label><input name="address1" value={form.address1} onChange={onChange} className={cls} placeholder="21 Baker Street" required /></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><label className="block text-sm font-medium mb-1">City</label><input name="city" value={form.city} onChange={onChange} className={cls} placeholder="London" /></div>
                    <div><label className="block text-sm font-medium mb-1">State</label><input name="state" value={form.state} onChange={onChange} className={cls} placeholder="Region" /></div>
                    <div><label className="block text-sm font-medium mb-1">ZIP</label><input name="zip" value={form.zip} onChange={onChange} className={cls} placeholder="Postcode" /></div>
                  </div>
                </div>
              </div>
              <div className="border-t pt-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Property Details</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="block text-sm font-medium mb-1">Type</label><select name="propertyType" value={form.propertyType} onChange={onChange} className={cls + " bg-white"}><option value="">Select</option><option value="Apartment">Apartment</option><option value="Villa">Villa</option></select></div>
                  <div><label className="block text-sm font-medium mb-1">Location tag</label><select name="locationTag" value={form.locationTag} onChange={onChange} className={cls + " bg-white"}><option value="">Select</option><option value="Downtown">Downtown</option><option value="Suburbs">Suburbs</option><option value="Beachfront">Beachfront</option><option value="Hillside">Hillside</option></select></div>
                  <div><label className="block text-sm font-medium mb-1">Year built</label><select name="yearBuilt" value={form.yearBuilt} onChange={onChange} className={cls + " bg-white"}><option value="">Select</option>{Array.from({ length: 60 }).map((_, i) => { const y = new Date().getFullYear() - i; return <option key={y} value={String(y)}>{y}</option>; })}</select></div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div><label className="block text-sm font-medium mb-1">Area (sq ft)</label><input name="areaSqft" type="number" value={form.areaSqft} onChange={onChange} className={cls} placeholder="1200" /></div>
                  <div><label className="block text-sm font-medium mb-1">Latitude</label><input name="lat" type="number" value={form.lat} onChange={onChange} className={cls} placeholder="Optional" /></div>
                  <div><label className="block text-sm font-medium mb-1">Longitude</label><input name="lng" type="number" value={form.lng} onChange={onChange} className={cls} placeholder="Optional" /></div>
                </div>
              </div>
              <div className="border-t pt-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Photos</h3>
                <input name="imagesInput" value={form.imagesInput} onChange={onChange} className={cls} placeholder="https://image1.jpg, https://image2.jpg" />
                <p className="text-xs text-gray-500 mt-1">Comma-separated URLs. First image becomes the cover.</p>
                {imageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {imageUrls.map((url, i) => (
                      <div key={i} className="w-20 h-16 rounded-lg overflow-hidden border bg-gray-100">
                        <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.opacity = "0.3"; }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t pt-5 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border text-sm hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={submitting || !canSubmit} className="inline-flex items-center gap-2 bg-[#F3B03E] text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-60 hover:bg-black/90 transition">
                  {submitting && <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  {submitting ? "Uploading…" : "Next: Advanced details →"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

/* ---------- Main Dashboard ---------- */
export default function CompanyDashboard() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [section, setSection] = useState("properties"); // "properties" | "agents"
  const [tab, setTab] = useState("pending");
  const [lists, setLists] = useState({ pending: [], approved: [], rejected: [] });
  const [agents, setAgents] = useState([]);
  const [selectedAgentByProperty, setSelectedAgentByProperty] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingMe, setLoadingMe] = useState(true);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [assigningPropertyId, setAssigningPropertyId] = useState(null);
  const [error, setError] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);

  const counts = { pending: lists.pending.length, approved: lists.approved.length, rejected: lists.rejected.length };

  async function loadMe() {
    setLoadingMe(true);
    try { const d = await apiFetch(`/api/auth/me`); setMe(d); }
    catch (e) { console.error(e); }
    finally { setLoadingMe(false); }
  }

  const handleLogout = () => { clearAccessToken(); navigate("/login", { replace: true }); };

  const handleTabChange = (newTab) => setTab(newTab);
  const handleSectionChange = (newSection) => setSection(newSection);

  async function loadAgents() {
    setLoadingAgents(true);
    try { const d = await apiFetch(`/api/company/agents`); setAgents(Array.isArray(d) ? d : []); }
    catch (e) { console.error(e); setAgents([]); }
    finally { setLoadingAgents(false); }
  }

  async function loadList(statusKey) {
    setLoading(true);
    setError("");
    try {
      const status = statusKeyToEnum(statusKey);
      const data = await apiFetch(`/api/properties/dashboard?status=${status}&page=0&size=50`);
      const content = data?.content || [];
      const filtered = content.filter((p) => String(p.status || "").toUpperCase() === status);
      setLists((prev) => ({ ...prev, [statusKey]: filtered }));
    } catch (e) { setError(e.message || "Failed to load"); }
    finally { setLoading(false); }
  }

  async function assignAgent(propertyId) {
    const agentId = selectedAgentByProperty[propertyId];
    if (!agentId) return;
    setAssigningPropertyId(propertyId);
    setError("");
    try {
      await apiFetch(`/api/properties/${propertyId}/assign-agent/${agentId}`, { method: "PUT" });
      await loadList(tab);
    } catch (e) { setError(e.message || "Failed to assign agent"); }
    finally { setAssigningPropertyId(null); }
  }

  useEffect(() => {
    loadMe();
    loadAgents();
    loadList("pending");
    loadList("approved");
    loadList("rejected");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadList(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const activeItems = useMemo(() => lists[tab] || [], [lists, tab]);
  const role = String(me?.role || "").toUpperCase();
  const companyId = me?.companyId ?? me?.company?.id ?? null;

  const handleUploadSuccess = async () => {
    setShowUploadForm(false);
    await loadList("pending");
    await loadList("approved");
    await loadList("rejected");
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex">
      <Sidebar
        activeTab={tab}
        onTabChange={handleTabChange}
        activeSection={section}
        onSectionChange={handleSectionChange}
      />

      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 md:px-10 lg:px-16 py-4">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="w-full rounded-full border px-10 py-2 bg-white" placeholder="Search (future)" disabled />
            </div>
          </div>
          <button type="button" onClick={handleLogout} className="ml-4 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition">
            <span className="h-6 w-6 rounded-full bg-[#F3B03E] text-white flex items-center justify-center text-[11px]">✕</span>
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>

        <div className="px-6 md:px-10 lg:px-16">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Hello{me?.email ? `, ${me.email}` : ""}{" "}
              <span className="text-gray-500 text-lg font-medium">({role || "COMPANY"})</span>
            </h1>
            <p className="mt-2 text-gray-700">
              {section === "agents" ? "Manage your company's agent team." : "All properties under your company appear here."}
            </p>
            {!loadingMe && <p className="mt-1 text-sm text-gray-600">Company ID: <b>{companyId ?? "Not set"}</b></p>}
          </div>

          {/* ── AGENTS SECTION ── */}
          {section === "agents" && (
            <div className="mt-8">
              <ManageAgentsSection
                agents={agents}
                loadingAgents={loadingAgents}
                onRefresh={loadAgents}
              />
            </div>
          )}

          {/* ── PROPERTIES SECTION ── */}
          {section === "properties" && (
            <>
              <div className="py-6">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(true)}
                  className="inline-flex items-center gap-2 bg-[#F3B03E] hover:bg-[#e3a12f] text-black font-medium px-5 py-2 rounded-full transition"
                >
                  <FaPlus className="text-sm" />
                  Create New Listing
                </button>
              </div>

              <div className="mt-2">
                {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl md:text-3xl font-bold">Manage Listings</h2>
                  <Tabs active={tab} counts={counts} onChange={handleTabChange} />
                </div>
                <div className="mt-6">
                  {loading && <div className="py-10 text-center text-gray-500">Loading…</div>}
                  {!loading && (
                    activeItems.length === 0 ? (
                      <div className="text-gray-600">No listings here.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeItems.map((p) => (
                          <ListingCard
                            key={p.id} p={p} agents={agents}
                            selectedAgentId={selectedAgentByProperty[p.id] || ""}
                            onSelectAgent={(pid, aid) => setSelectedAgentByProperty((prev) => ({ ...prev, [pid]: aid }))}
                            assigning={assigningPropertyId === p.id}
                            onAssignAgent={assignAgent}
                            onView={() => navigate(`/buy/properties/${p.id}`)}
                          />
                        ))}
                      </div>
                    )
                  )}
                </div>
                <div className="h-20" />
              </div>
            </>
          )}
        </div>
      </div>

      {showUploadForm && (
        <UploadForm
          me={me}
          onClose={() => setShowUploadForm(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}