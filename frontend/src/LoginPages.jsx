// src/pages/LoginChoice.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAccessToken, clearAccessToken, fetchCurrentUser } from "../auth";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

function normalizeRole(r) {
  return String(r || "").toUpperCase();
}

export default function LoginChoice() {
  const navigate = useNavigate();

  const [mode, setMode] = useState(null); // "ADMIN" | "AGENT"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function doLogin(e) {
    e.preventDefault();
    if (!mode) {
      setError("Please choose Admin or Agent login first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
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
          `Login failed (${res.status})`;
        throw new Error(msg);
      }

      // Support multiple token field names
      const token =
        data?.accessToken ||
        data?.token ||
        data?.jwt ||
        data?.access_token ||
        data?.accessToken?.token;

      if (!token || typeof token !== "string") {
        throw new Error("Login succeeded but backend did not return a token.");
      }

      setAccessToken(token);

      // Verify role via /me
      const me = await fetchCurrentUser();
      if (!me) {
        clearAccessToken();
        throw new Error("Login succeeded but /api/auth/me failed.");
      }

      const role = normalizeRole(me.role);

      if (mode === "ADMIN") {
        if (!(role === "ADMIN" || role === "SUPER_ADMIN")) {
          clearAccessToken();
          throw new Error(
            `This account is ${role}. Please use Agent login (or change role in DB).`
          );
        }
        navigate("/admin", { replace: true });
        return;
      }

      // mode === "AGENT"
      if (role !== "AGENT") {
        clearAccessToken();
        throw new Error(
          `This account is ${role}. Please use Admin login (or change role in DB).`
        );
      }

      navigate("/agent", { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] px-6 md:px-10 lg:px-16 py-10 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="mt-2 text-sm text-gray-600">
          Choose how you want to log in, then enter your credentials.
        </p>

        {/* Mode buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode("ADMIN")}
            className={
              "rounded-xl px-4 py-3 font-semibold border transition " +
              (mode === "ADMIN"
                ? "bg-[#F3B03E] border-[#F3B03E]"
                : "bg-white hover:bg-black/5")
            }
          >
            Admin Login
          </button>
          <button
            type="button"
            onClick={() => setMode("AGENT")}
            className={
              "rounded-xl px-4 py-3 font-semibold border transition " +
              (mode === "AGENT"
                ? "bg-[#F3B03E] border-[#F3B03E]"
                : "bg-white hover:bg-black/5")
            }
          >
            Agent Login
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={doLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !mode}
            className="w-full rounded-full px-5 py-2 font-medium bg-black text-white hover:bg-black/90 disabled:opacity-60"
          >
            {loading ? "Logging in..." : mode ? `Continue as ${mode}` : "Choose a mode"}
          </button>
        </form>
      </div>
    </div>
  );
}
