import { MockMarketDataProvider } from "./mock-provider";
import type { MarketDataProvider } from "./types";

let instance: MarketDataProvider | null = null;

/**
 * Returns the active MarketDataProvider. When MARKET_DATA_API_URL/KEY are
 * set in the environment, this is the place to plug in a RealProvider
 * (e.g. `new RefinitivProvider(...)`) — every caller in the app already
 * depends only on the MarketDataProvider interface, not this factory.
 */
export function getMarketDataProvider(): MarketDataProvider {
  if (instance) return instance;

  if (process.env.MARKET_DATA_API_URL && process.env.MARKET_DATA_API_KEY) {
    // TODO: return new RealMarketDataProvider(...) once a live feed is contracted.
    instance = new MockMarketDataProvider();
  } else {
    instance = new MockMarketDataProvider();
  }
  return instance;
}

export * from "./types";
