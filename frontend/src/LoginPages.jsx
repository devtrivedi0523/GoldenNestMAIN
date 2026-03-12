import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAccessToken } from "./auth";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://api.thegoldennest.co.uk";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("ADMIN"); // ADMIN | COMPANY | AGENT
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // for register

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // success messages

  const canSubmit = useMemo(() => {
    return email.trim() && password.trim() && !loading;
  }, [email, password, loading]);

  const switchAuthMode = (newMode) => {
    setAuthMode(newMode);
    setError("");
    setInfo("");
    setName("");
    setPassword("");
  };

  const switchPortalMode = (newMode) => {
    setMode(newMode);
    setError("");
    setInfo("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (authMode === "register") {
        // ── REGISTER ──────────────────────────────────────────────
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password, name }),
        });

        const text = await res.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = text; }

        if (!res.ok) {
          throw new Error(
            (data && data.message) ||
              (typeof data === "string" && data) ||
              `Registration failed (${res.status})`
          );
        }

        // Switch to login and let the user sign in
        setAuthMode("login");
        setPassword("");
        setName("");
        setInfo("Account created! Please log in to continue.");
        return;
      }

      // ── LOGIN ────────────────────────────────────────────────────
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch { data = text; }

      if (!res.ok) {
        throw new Error(
          (data && data.message) ||
            (typeof data === "string" && data) ||
            `Login failed (${res.status})`
        );
      }

      const token =
        data?.token || data?.accessToken || data?.jwt || data?.data?.token;

      if (!token) {
        throw new Error("Login succeeded but token was not found in response.");
      }

      setAccessToken(token);

      // Fetch /me -> role
      const meRes = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      const meText = await meRes.text();
      let me = null;
      try { me = meText ? JSON.parse(meText) : null; } catch { me = meText; }

      if (!meRes.ok) {
        throw new Error(
          (me && me.message) ||
            (typeof me === "string" && me) ||
            `Failed to fetch profile (${meRes.status})`
        );
      }

      const role = String(me?.role || "").toUpperCase();

      // Enforce selected portal type
      if (mode === "ADMIN" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
        throw new Error(`This account is ${role || "UNKNOWN"} — not an ADMIN.`);
      }
      if (mode === "COMPANY" && role !== "COMPANY") {
        throw new Error(
          `This account is ${role || "UNKNOWN"} — not a COMPANY account.`
        );
      }
      if (mode === "AGENT" && role !== "AGENT") {
        throw new Error(`This account is ${role || "UNKNOWN"} — not an AGENT.`);
      }

      if (role === "COMPANY" && !me?.companyId && !me?.company?.id) {
        throw new Error(
          "This COMPANY account has no company assigned (companyId is missing)."
        );
      }

      // Redirect by mode
      if (mode === "ADMIN") navigate("/admin");
      else if (mode === "COMPANY") navigate("/company");
      else navigate("/agent");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  const portalLabel =
    mode === "ADMIN" ? "Admin" : mode === "COMPANY" ? "Company" : "Agent";

  return (
    <div className="min-h-screen bg-[#f7f6f3] px-6 md:px-10 lg:px-16 py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Login</h1>
        <p className="text-gray-600 mb-6">Choose a portal, then sign in.</p>

        {/* Portal selector */}
        <div className="flex gap-2 flex-wrap mb-6">
          {["ADMIN", "COMPANY", "AGENT"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => switchPortalMode(p)}
              className={
                "px-4 py-2 rounded-full text-sm font-medium border transition " +
                (mode === p
                  ? "bg-[#F3B03E] border-[#F3B03E] text-black"
                  : "bg-white hover:bg-black/5")
              }
            >
              {p.charAt(0) + p.slice(1).toLowerCase()} Portal
            </button>
          ))}
        </div>

        {/* Auth card */}
        <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8">
          {/* Login / Create account tabs */}
          <div className="flex items-center bg-gray-100 rounded-full p-1 mb-6">
            <button
              type="button"
              onClick={() => switchAuthMode("login")}
              className={
                "flex-1 text-xs md:text-sm font-medium px-3 py-1.5 rounded-full transition " +
                (authMode === "login"
                  ? "bg-[#F3B03E]  text-gray-900"
                  : "text-gray-500 hover:text-gray-700")
              }
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => switchAuthMode("register")}
              className={
                "flex-1 text-xs md:text-sm font-medium px-3 py-1.5 rounded-full transition " +
                (authMode === "register"
                  ? "bg-[#F3B03E] shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700")
              }
            >
              Create account
            </button>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {authMode === "login"
                ? `Sign in to ${portalLabel} Portal`
                : `Create a ${portalLabel} account`}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {authMode === "login"
                ? "Enter your credentials to continue."
                : "Fill in your details to get started."}
            </p>
          </div>

          {/* Messages */}
          {info && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3 text-sm">
              {info}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "register" && (
              <div>
                <label className="block text-sm font-medium mb-1">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 focus:border-black/70"
                placeholder="you@example.com"
                autoComplete="email"
                required
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
                autoComplete={authMode === "login" ? "current-password" : "new-password"}
                required
              />
              {authMode === "register" && (
                <p className="text-[11px] text-gray-500 mt-1">
                  Use at least 8 characters — a mix of letters and numbers works best.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-full px-5 py-2.5 font-medium bg-[#F3B03E] text-white hover:bg-black/90 transition inline-flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {loading
                ? authMode === "login"
                  ? "Signing in…"
                  : "Creating account…"
                : authMode === "login"
                ? `Sign in to ${portalLabel} Portal`
                : `Create ${portalLabel} account`}
            </button>

            {authMode === "register" && (
              <p className="text-[11px] text-gray-500 mt-2">
                By creating an account, you agree that it may be reviewed by our
                team before access is granted.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}