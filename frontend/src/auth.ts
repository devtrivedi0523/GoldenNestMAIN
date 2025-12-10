// src/auth.ts

const TOKEN_KEY = "gn_access_token";

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch {}
}

export function clearAccessToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/* ----------------------------------------
   ✔ Strongly typed current user object
----------------------------------------- */
export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  // optional fields you may add later:
  phone?: string;
}

/* ----------------------------------------
   ✔ Fetch the logged-in user's profile
----------------------------------------- */
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) return null;

    return (await res.json()) as CurrentUser;
  } catch {
    return null;
  }
}
