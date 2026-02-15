// src/api/areas.js
import { apiFetch } from "./http";

export function listAreas() {
  return apiFetch("/api/areas");
}

export function createArea(name) {
  return apiFetch("/api/areas", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function assignAgentToArea(areaId, userId) {
  return apiFetch(`/api/areas/${areaId}/assign/${userId}`, {
    method: "PUT",
  });
}

export function removeAgentFromArea(areaId, userId) {
  return apiFetch(`/api/areas/${areaId}/remove/${userId}`, {
    method: "DELETE",
  });
}
