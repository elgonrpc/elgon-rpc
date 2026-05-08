export type AssetClass = "stock" | "crypto" | "etf" | "index";

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  marketCap: number | null;
  name: string;
  assetClass: AssetClass;
  timestamp: number;
}

export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  assetClass: AssetClass;
}

export interface OptionsChain {
  underlying: Quote;
  expirations: string[];
  calls: OptionContract[];
  puts: OptionContract[];
}

export interface OptionContract {
  contractSymbol: string;
  strike: number;
  expiration: string;
  type: "call" | "put";
  lastPrice: number;
  bid: number;
  ask: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
}

export interface ApiKey {
  key: string;
  plan: string;
  rateLimit: number;
  userId: string | null;
  createdAt: string;
}

// extract SnapTrade config to env
