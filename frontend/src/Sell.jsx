// src/Sell.jsx
import React, { useState, useEffect } from "react";
import UploadProperty from "./components/UploadProperty";
import {
    isLoggedIn,
    setAccessToken,
    clearAccessToken,
    getAccessToken,
} from "./auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Sell = () => {
    const [authed, setAuthed] = useState(isLoggedIn());
    const [mode, setMode] = useState("login"); // "login" | "register"

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // for register
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [info, setInfo] = useState(""); // success / info messages

    useEffect(() => {
        // if token somehow removed elsewhere, keep UI in sync
        if (!getAccessToken()) setAuthed(false);
    }, []);

    const handleLogout = () => {
        clearAccessToken();
        setAuthed(false);
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
                    : { email, password, name };

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(
                    `Failed to ${mode === "login" ? "login" : "register"
                    } (${res.status}): ${txt}`
                );
            }

            let data = {};
            try {
                data = await res.json();
            } catch {
                data = {};
            }

            if (mode === "login") {
                // ✅ LOGIN FLOW
                const token = data.accessToken || data.token || data.jwt || null;
                if (token) {
                    setAccessToken(token);
                }
                setAuthed(true);
            } else {
                // ✅ REGISTER FLOW – don't auto-login, ask user to log in
                setMode("login");
                setPassword("");
                setName("");
                setInfo(
                    "Your account has been created. Please log in to start listing your property."
                );
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Logged in → show upload flow + slim context bar
    if (authed) {
        return (
            <div className="min-h-screen bg-[#f7f6f3]">
                <div className="bg-[#f7f6f3] backdrop-blur-md">
                    <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h1 className="text-xl md:text-2xl font-serif font-semibold">
                                List a Property on Golden Nest
                            </h1>
                            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                                You’re signed in. Complete the form below to submit your property
                                for review. Once approved, it will appear in the marketplace.
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="self-start md:self-auto inline-flex items-center gap-2 text-xs md:text-sm px-3 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition"
                        >
                            <span className="h-6 w-6 rounded-full bg-[#F3B03E] text-white flex items-center justify-center text-[11px]">
                                ✕
                            </span>
                            <span>Log out</span>
                        </button>
                    </div>
                </div>

                <UploadProperty />
            </div>
        );
    }

    // ❌ Not logged in → show login / register card
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f7f6f3] to-[#e9e4d9] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1.1fr,1fr] gap-8 items-stretch">
                {/* Left pane: marketing / explanation */}
                <div className="hidden md:flex flex-col justify-center bg-white/70 rounded-3xl border border-gray-200 shadow-sm px-8 py-8">
                    <div className="inline-flex items-center gap-2 text-xs font-medium bg-black text-white px-3 py-1 rounded-full mb-4 w-fit">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        List in just a few minutes
                    </div>
                    <h1 className="text-3xl font-serif font-semibold text-gray-900 mb-3">
                        Start listing properties with Golden Nest
                    </h1>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        Create a free account to manage your properties, track review status,
                        and keep everything in one place. Once your listing is approved, it
                        will be visible to buyers browsing the marketplace.
                    </p>
                    <ul className="text-sm text-gray-700 space-y-2 mt-2">
                        <li>• Save and manage all your listings under one account</li>
                        <li>• Track approval status (pending, approved, rejected)</li>
                        <li>• Add rich details, photos, and location to each property</li>
                    </ul>
                </div>

                {/* Right pane: auth card */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8">
                    <div className="mb-6">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                            {mode === "login"
                                ? "Welcome back to Golden Nest"
                                : "Create your Golden Nest account"}
                        </h2>
                        <p className="text-xs md:text-sm text-gray-600 mt-1">
                            {mode === "login"
                                ? "Log in to continue listing and managing your properties."
                                : "A quick sign-up so you can securely list and manage properties."}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center bg-gray-100 rounded-full p-1 mb-6">
                        <button
                            className={
                                "flex-1 text-xs md:text-sm font-medium px-3 py-1.5 rounded-full transition " +
                                (mode === "login"
                                    ? "bg-[#F3B03E] shadow text-gray-900"
                                    : "text-gray-500")
                            }
                            onClick={() => {
                                setMode("login");
                                setError("");
                                setInfo("");
                            }}
                        >
                            Log in
                        </button>
                        <button
                            className={
                                "flex-1 text-xs md:text-sm font-medium px-3 py-1.5 rounded-full transition " +
                                (mode === "register"
                                    ? "bg-[#F3B03E] shadow text-gray-900"
                                    : "text-gray-500")
                            }
                            onClick={() => {
                                setMode("register");
                                setError("");
                                setInfo("");
                            }}
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
                            <div>
                                <label className="block text-xs md:text-sm font-medium mb-1">
                                    Full name
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs md:text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <p className="text-[11px] text-gray-500 mt-1">
                                Use at least 8 characters — a mix of letters and numbers works
                                best.
                            </p>
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
                                ? mode === "login"
                                    ? "Logging in…"
                                    : "Creating account…"
                                : mode === "login"
                                    ? "Log in"
                                    : "Create account"}
                        </button>

                        <p className="text-[11px] md:text-xs text-gray-500 mt-3">
                            By continuing, you agree that all listings may be reviewed by our
                            team before going live in the marketplace.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Sell;
