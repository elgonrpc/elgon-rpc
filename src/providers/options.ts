import type { Quote, OptionsChain, OptionContract } from "../types";

function generateExpDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 1; i <= 6; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i * 7);
    const fri = new Date(d);
    fri.setDate(fri.getDate() + (5 - fri.getDay()));
    dates.push(fri.toISOString().slice(0, 10));
  }
  return dates;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function generateContracts(
  underlying: Quote,
  exp: string,
  type: "call" | "put",
): OptionContract[] {
  const price = underlying.price;
  const contracts: OptionContract[] = [];
  const strikes = [];

  const step = price > 100 ? 5 : price > 20 ? 2.5 : 1;
  const base = Math.round(price / step) * step;

  for (let i = -5; i <= 5; i++) {
    strikes.push(round2(base + i * step));
  }

  for (const strike of strikes) {
    const moneyness = type === "call"
      ? (price - strike) / price
      : (strike - price) / price;

    const iv = 0.25 + Math.random() * 0.3 + Math.max(0, -moneyness) * 0.5;
    const mid = Math.max(0.01, price * iv * 0.05 + Math.max(0, moneyness * price));

    contracts.push({
      contractSymbol: `${underlying.symbol}${exp.replace(/-/g, "")}${type[0].toUpperCase()}${strike}`,
      strike,
      expiration: exp,
      type,
      lastPrice: round2(mid),
      bid: round2(mid * 0.95),
      ask: round2(mid * 1.05),
      volume: Math.floor(Math.random() * 2000),
      openInterest: Math.floor(Math.random() * 5000),
      impliedVolatility: round2(iv),
    });
  }

  return contracts;
}

export function generateOptionsChain(underlying: Quote): OptionsChain {
  const expirations = generateExpDates();
  const exp = expirations[0];

  return {
    underlying,
    expirations,
    calls: generateContracts(underlying, exp, "call"),
    puts: generateContracts(underlying, exp, "put"),
  };
}

// add rate limiting tests
