// src/components/AdminAreas.jsx
import React, { useEffect, useState } from "react";
import { getAccessToken } from "../auth";
import { apiFetch } from "../api/http";
import {
  listAreas,
  createArea as apiCreateArea,
  assignAgentToArea,
  removeAgentFromArea,
} from "../api/areas";

/**
 * AdminAreas.jsx
 * ✅ Directly pasteable
 * ✅ Uses your existing token storage (gn_access_token) via apiFetch/authHeaders
 * ✅ Works with your backend:
 *    - GET    /api/areas
 *    - POST   /api/areas
 *    - PUT    /api/areas/{areaId}/assign/{userId}
 *    - DELETE /api/areas/{areaId}/remove/{userId}
 *    - GET    /api/admin/users/agents
 */

export default function AdminAreas() {
  const [areas, setAreas] = useState([]);
  const [agents, setAgents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [newAreaName, setNewAreaName] = useState("");
  const [selectedAgent, setSelectedAgent] = useState({}); // { [areaId]: agentId }

  const token = getAccessToken();

  const PageShell = ({ children }) => (
    <div className="min-h-screen bg-[#f7f6f3] px-6 md:px-10 lg:px-16 py-10">
      <div className="max-w-6xl mx-auto">{children}</div>
    </div>
  );

  const Card = ({ children }) => (
    <div className="bg-white border rounded-2xl shadow-sm p-6">{children}</div>
  );

  async function loadAll() {
    setLoading(true);
    setError("");
    try {
      const [areasData, agentsData] = await Promise.all([
        listAreas(),
        apiFetch("/api/admin/users/agents"),
      ]);

      setAreas(Array.isArray(areasData) ? areasData : []);
      setAgents(Array.isArray(agentsData) ? agentsData : []);
    } catch (e) {
      setError(e?.message || "Failed to load areas/agents");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function onCreateArea() {
    const name = newAreaName.trim();
    if (!name) return;

    setSaving(true);
    setError("");
    try {
      await apiCreateArea(name);
      setNewAreaName("");
      await loadAll();
    } catch (e) {
      setError(e?.message || "Failed to create area");
    } finally {
      setSaving(false);
    }
  }

  async function onAssign(areaId) {
    const agentId = selectedAgent[areaId];
    if (!agentId) return;

    setSaving(true);
    setError("");
    try {
      await assignAgentToArea(areaId, agentId);
      await loadAll();
    } catch (e) {
      setError(e?.message || "Failed to assign agent");
    } finally {
      setSaving(false);
    }
  }

  async function onRemove(areaId, userId) {
    setSaving(true);
    setError("");
    try {
      await removeAgentFromArea(areaId, userId);
      await loadAll();
    } catch (e) {
      setError(e?.message || "Failed to remove agent");
    } finally {
      setSaving(false);
    }
  }

  if (!token) {
    return (
      <PageShell>
        <Card>
          <h1 className="text-2xl font-bold">Areas</h1>
          <p className="mt-2 text-gray-700">
            You’re not logged in. Please log in as an <b>ADMIN</b> to manage
            areas.
          </p>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Areas</h1>
          <p className="mt-2 text-gray-700">
            Create areas, assign agents (managers), and view assignments.
          </p>
        </div>

        {/* Create Area */}
        <div className="bg-white border rounded-2xl shadow-sm p-4 flex items-center gap-3">
          <input
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            placeholder="New area name (e.g., London)"
            className="w-[260px] max-w-[60vw] rounded-full border px-4 py-2 bg-white"
            disabled={saving}
          />
          <button
            onClick={onCreateArea}
            disabled={saving || !newAreaName.trim()}
            className="rounded-full px-5 py-2 font-medium bg-[#F3B03E] hover:bg-[#e3a12f] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-10 text-center text-gray-600">Loading…</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6">
          {areas.length === 0 ? (
            <Card>
              <div className="text-gray-700">
                No areas yet. Create one above.
              </div>
            </Card>
          ) : (
            areas.map((area) => {
              const users = Array.isArray(area.users) ? area.users : [];
              const assignedAgents = users.filter(
                (u) => String(u.role || "").toUpperCase() === "AGENT"
              );

              return (
                <Card key={area.id}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="text-xl font-semibold">{area.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Area ID: {area.id}
                      </div>
                    </div>

                    {/* Assign dropdown */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <select
                        value={selectedAgent[area.id] || ""}
                        onChange={(e) =>
                          setSelectedAgent((prev) => ({
                            ...prev,
                            [area.id]: e.target.value,
                          }))
                        }
                        className="rounded-full border px-4 py-2 bg-white"
                        disabled={saving}
                      >
                        <option value="">Select agent to assign…</option>
                        {agents.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name ? `${a.name} (${a.email})` : a.email}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => onAssign(area.id)}
                        disabled={saving || !selectedAgent[area.id]}
                        className="rounded-full px-5 py-2 font-medium bg-black text-white hover:bg-black/90 disabled:opacity-60"
                      >
                        Assign
                      </button>
                    </div>
                  </div>

                  {/* Assigned agents */}
                  <div className="mt-6">
                    <div className="text-sm font-semibold tracking-wider text-gray-700">
                      ASSIGNED AGENTS
                    </div>

                    {assignedAgents.length === 0 ? (
                      <div className="mt-3 text-gray-600">
                        No agents assigned to this area.
                      </div>
                    ) : (
                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-gray-500 border-b">
                              <th className="py-2 pr-3">Name</th>
                              <th className="py-2 pr-3">Email</th>
                              <th className="py-2 pr-3">Role</th>
                              <th className="py-2 pr-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assignedAgents.map((u) => (
                              <tr key={u.id} className="border-b">
                                <td className="py-3 pr-3">
                                  {u.name || (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                                <td className="py-3 pr-3">{u.email}</td>
                                <td className="py-3 pr-3">{u.role}</td>
                                <td className="py-3 pr-3 text-right">
                                  <button
                                    onClick={() => onRemove(area.id, u.id)}
                                    disabled={saving}
                                    className="rounded-full px-4 py-2 border hover:bg-red-50 disabled:opacity-60"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      <div className="h-10" />
    </PageShell>
  );
}
