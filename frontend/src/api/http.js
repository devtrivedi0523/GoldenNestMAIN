// src/api/http.js
import { getAccessToken } from "../auth";

export const API_BASE =
  import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

export function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
    ...authHeaders(),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // matches your auth.ts usage
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
