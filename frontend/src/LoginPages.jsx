import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("ADMIN"); // ADMIN | AGENT
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim() && password.trim() && !loading;
  }, [email, password, loading]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1) Login -> token
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!res.ok) {
        throw new Error(
          (data && data.message) ||
            (typeof data === "string" && data) ||
            `Login failed (${res.status})`
        );
      }

      // IMPORTANT: adjust token key if your backend returns different name
      const token =
        data?.token || data?.accessToken || data?.jwt || data?.data?.token;

      if (!token) {
        throw new Error("Login succeeded but token was not found in response.");
      }

      setAccessToken(token);

      // 2) Fetch /me -> role
      const meRes = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      const meText = await meRes.text();
      let me = null;
      try {
        me = meText ? JSON.parse(meText) : null;
      } catch {
        me = meText;
      }

      if (!meRes.ok) {
        throw new Error(
          (me && me.message) ||
            (typeof me === "string" && me) ||
            `Failed to fetch profile (${meRes.status})`
        );
      }

      const role = String(me?.role || "").toUpperCase();

      // 3) Enforce selected login type
      if (mode === "ADMIN" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
        throw new Error(`This account is ${role || "UNKNOWN"} — not an ADMIN.`);
      }
      if (mode === "AGENT" && role !== "AGENT") {
        throw new Error(`This account is ${role || "UNKNOWN"} — not an AGENT.`);
      }

      // 4) Redirect
      navigate(mode === "ADMIN" ? "/admin" : "/agent");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] px-6 md:px-10 lg:px-16 py-10">
      <div className="max-w-xl mx-auto bg-white border rounded-2xl shadow-sm p-6 md:p-8">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-2 text-gray-600">
          Choose a portal, then sign in.
        </p>

        {/* Mode selector */}
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("ADMIN")}
            className={
              "px-4 py-2 rounded-full text-sm font-medium border " +
              (mode === "ADMIN"
                ? "bg-[#F3B03E] border-[#F3B03E] text-black"
                : "bg-white hover:bg-black/5")
            }
          >
            Admin Portal
          </button>
          <button
            type="button"
            onClick={() => setMode("AGENT")}
            className={
              "px-4 py-2 rounded-full text-sm font-medium border " +
              (mode === "AGENT"
                ? "bg-[#F3B03E] border-[#F3B03E] text-black"
                : "bg-white hover:bg-black/5")
            }
          >
            Agent Portal
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-full px-5 py-2 font-medium bg-black text-white hover:bg-black/90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : `Sign in to ${mode === "ADMIN" ? "Admin" : "Agent"} Portal`}
          </button>
        </form>
      </div>
    </div>
  );
}
