// Minimal client-side store for admin actions.
// Persists to localStorage; seeds from your properties.ts dataset on first run.

export type ListingStatus = "pending" | "approved" | "rejected";

export interface ListingState {
    id: string;
    status: ListingStatus;
}

const KEY = "gn:listings:v1";

const load = (): ListingState[] => {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as ListingState[]) : [];
    } catch {
        return [];
    }
};

const save = (rows: ListingState[]) => {
    try {
        localStorage.setItem(KEY, JSON.stringify(rows));
    } catch { }
};

// Initialize from dataset if missing any entries
export const ensureSeeded = (ids: string[]) => {
    const rows = load();
    const known = new Set(rows.map((r) => r.id));
    let changed = false;
    ids.forEach((id) => {
        if (!known.has(id)) {
            rows.push({ id, status: "pending" }); // default new listings as pending
            changed = true;
        }
    });
    if (changed) save(rows);
    return rows;
};

export const getAll = (): ListingState[] => load();

export const getStatus = (id: string): ListingStatus | undefined =>
    load().find((r) => r.id === id)?.status;

export const setStatus = (id: string, status: ListingStatus) => {
    const rows = load();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx >= 0) rows[idx].status = status;
    else rows.push({ id, status });
    save(rows);
    return rows;
};

export const removeListing = (id: string) => {
    save(load().filter((r) => r.id !== id));
};
