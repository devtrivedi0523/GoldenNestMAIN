// src/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isLoggedIn,
  setAccessToken,
  clearAccessToken,
  getAccessToken,
} from "./auth";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

const SigninPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "register"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (isLoggedIn()) navigate("/", { replace: true });
  }, []);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setInfo("");
    setName("");
    setPhone("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const endpoint =
        mode === "login"
          ? `${API_BASE}/api/auth/login`
          : `${API_BASE}/api/auth/register`;

      const body =
        mode === "login"
          ? { email, password }
          : { email, password, name, phone };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        let msg = txt;
        try { msg = JSON.parse(txt)?.error || JSON.parse(txt)?.message || txt; } catch { }
        throw new Error(msg || `Failed to ${mode === "login" ? "log in" : "register"} (${res.status})`);
      }

      let data = {};
      try { data = await res.json(); } catch { data = {}; }

      if (mode === "login") {
        const token = data.accessToken || data.token || data.jwt || null;
        if (token) setAccessToken(token);
        navigate("/", { replace: true });
      } else {
        switchMode("login");
        setInfo("Account created! Please log in to continue.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f6f3] to-[#e9e4d9] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1.1fr,1fr] gap-8 items-stretch">

        {/* Left pane: marketing */}
        <div className="hidden md:flex flex-col justify-center bg-white/70 rounded-3xl border border-gray-200 shadow-sm px-8 py-8">
          <div className="inline-flex items-center gap-2 text-xs font-medium bg-black text-white px-3 py-1 rounded-full mb-4 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Your Golden Nest account
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            Welcome to Golden Nest
          </h1>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Sign in to manage your property listings, track review status, and
            keep everything in one place. New here? Create a free account in
            seconds.
          </p>
          <ul className="text-sm text-gray-700 space-y-2 mt-2">
            <li>• Browse and save your favourite properties</li>
            <li>• List properties for sale or rent</li>
            <li>• Track approval status across all your listings</li>
          </ul>
        </div>

        {/* Right pane: auth card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              {mode === "login"
                ? "Log in to your Golden Nest account."
                : "A quick sign-up to get started with Golden Nest."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-gray-100 rounded-full p-1 mb-6">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={
                "flex-1 text-xs md:text-sm font-medium px-3 py-1.5 rounded-full transition " +
                (mode === "login" ? "bg-[#F3B03E] shadow text-gray-900" : "text-gray-500 hover:text-gray-700")
              }
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={
                "flex-1 text-xs md:text-sm font-medium px-3 py-1.5 rounded-full transition " +
                (mode === "register" ? "bg-[#F3B03E] shadow text-gray-900" : "text-gray-500 hover:text-gray-700")
              }
            >
              Create account
            </button>
          </div>

          {/* Messages */}
          {info && (
            <div className="mb-4 p-3 rounded-md bg-emerald-50 text-emerald-700 text-xs md:text-sm">
              {info}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-xs md:text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1">Full name</label>
                  <input
                    type="text"
                    className={inputCls}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1">
                    Phone number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className={inputCls}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7700 900000"
                    required
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Used so buyers can contact you directly about your listings.
                  </p>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className={inputCls}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className={inputCls}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              {mode === "register" && (
                <p className="text-[11px] text-gray-500 mt-1">
                  Use at least 8 characters — a mix of letters and numbers works best.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 w-full bg-[#F3B03E] text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-black/90 transition"
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {loading
                ? mode === "login" ? "Logging in…" : "Creating account…"
                : mode === "login" ? "Log in" : "Create account"}
            </button>

            <p className="text-[11px] md:text-xs text-gray-500 mt-3">
              By continuing, you agree to Golden Nest's terms. Listings are
              reviewed by our team before going live.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;