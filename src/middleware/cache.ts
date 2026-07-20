interface Entry { value: unknown; expiresAt: number; }

const TTL_MS = 15_000;
const store = new Map<string, Entry>();

export function get<T>(key: string): T | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    store.delete(key);
    return null;
  }
  return hit.value as T;
}

export function set(key: string, value: unknown, ttl = TTL_MS): void {
  store.set(key, { value, expiresAt: Date.now() + ttl });
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store) if (now > v.expiresAt) store.delete(k);
}, 60_000).unref();
