import type { Quote, OptionsChain, OptionContract } from "../types";

/** Next four monthly expiries (third Friday). */
function expiries(): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = 1; i <= 4; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
    const offset = (5 - d.getUTCDay() + 7) % 7;
    d.setUTCDate(1 + offset + 14);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Sandbox chain built around the live underlying price. Strikes and expiries are
 * realistic; premiums are simulated and labelled as such in the response.
 */
export function buildChain(underlying: Quote): OptionsChain {
  const price = underlying.price;
  const step = price > 100 ? 5 : price > 20 ? 2.5 : 1;
  const atm = Math.round(price / step) * step;
  const exps = expiries();
  const chain: OptionContract[] = [];

  for (const expiry of exps) {
    for (let i = -2; i <= 2; i++) {
      const strike = r2(atm + i * step);
      for (const type of ["call", "put"] as const) {
        const intrinsic = type === "call" ? Math.max(0, price - strike) : Math.max(0, strike - price);
        const iv = r2(0.2 + Math.random() * 0.6);
        const mid = Math.max(0.01, intrinsic + price * iv * 0.04);
        chain.push({
          strike,
          type,
          bid: r2(mid * 0.97),
          ask: r2(mid * 1.03),
          iv,
          oi: Math.floor(Math.random() * 20000),
          expiry,
        });
      }
    }
  }

  return { symbol: underlying.symbol, underlying: price, expirations: exps, chain };
}
