export interface Quote {
  symbol: string;
  price: number;
  changePct: number;
  volume: number;
  timestamp: string;
}

export interface Candle {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Abstraction over any market-data source. Swap MockProvider for a
 * RealProvider (e.g. an EGX/Refinitiv/IEX feed) by changing getMarketDataProvider()
 * below — no other code in the app needs to change.
 */
export interface MarketDataProvider {
  getQuote(symbol: string): Promise<Quote | null>;
  getQuotes(symbols: string[]): Promise<Quote[]>;
  getHistory(symbol: string, days?: number): Promise<Candle[]>;
}
