import { NetworkError } from "./errors";

export interface HealthStatus {
  ok: boolean;
  latencyMs: number;
  slot?: number;
  version?: string;
}

export async function checkHealth(endpoint: string): Promise<HealthStatus> {
  const url = endpoint.replace(/\/$/, "") + "/health";
  const start = performance.now();

  try {
    const res = await fetch(url);
    const latencyMs = performance.now() - start;

    if (!res.ok) {
      return { ok: false, latencyMs };
    }

    const data = await res.json();
    return {
      ok: true,
      latencyMs,
      slot: data.slot,
      version: data.version,
    };
  } catch (err: any) {
    return {
      ok: false,
      latencyMs: performance.now() - start,
    };
  }
}
