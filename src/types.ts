export type AssetClass = "stock" | "etf" | "crypto" | "index";

export interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  bid?: number;
  ask?: number;
  volume: number;
  marketCap?: number | null;
  currency: string;
  assetClass: AssetClass;
  /** ISO timestamp of the upstream print. Quotes are delayed, never real-time. */
  asOf: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  assetClass: AssetClass;
}

export interface OptionContract {
  strike: number;
  type: "call" | "put";
  bid: number;
  ask: number;
  iv: number;
  oi: number;
  expiry: string;
}

export interface OptionsChain {
  symbol: string;
  underlying: number;
  expirations: string[];
  chain: OptionContract[];
}

export interface PredictionMarket {
  id: string;
  question: string;
  category: string;
  yes: number;
  no: number;
}

/** Every response carries a hash of its payload so a client can prove what it was served. */
export interface Receipt {
  alg: "sha256";
  hash: string;
  ts: string;
  endpoint: string;
  verifyUrl: string;
}

export interface ApiResponse<T> {
  data: T;
  source: "live" | "sandbox";
  plan: string;
  receipt: Receipt;
}
