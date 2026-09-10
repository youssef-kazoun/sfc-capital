import { db, schema } from "@/db";
import { eq, inArray } from "drizzle-orm";
import type { MarketDataProvider, Quote, Candle } from "./types";

// Simple seeded PRNG so repeated calls in the same session look "live"
// but stay stable enough for demo purposes.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class MockMarketDataProvider implements MarketDataProvider {
  async getQuote(symbol: string): Promise<Quote | null> {
    const rows = await db.select().from(schema.stocks).where(eq(schema.stocks.symbol, symbol));
    const stock = rows[0];
    if (!stock) return null;

    const rand = mulberry32(Date.now() ^ symbol.length);
    const drift = (rand() - 0.5) * 0.6; // +/- 0.3%
    const price = Math.max(0.01, stock.lastPrice * (1 + drift / 100));

    return {
      symbol: stock.symbol,
      price: Number(price.toFixed(2)),
      changePct: Number((stock.changePct + drift).toFixed(2)),
      volume: stock.volume,
      timestamp: new Date().toISOString(),
    };
  }

  async getQuotes(symbols: string[]): Promise<Quote[]> {
    if (symbols.length === 0) return [];
    const rows = await db.select().from(schema.stocks).where(inArray(schema.stocks.symbol, symbols));

    return rows.map((stock) => {
      const rand = mulberry32(Date.now() ^ stock.symbol.length);
      const drift = (rand() - 0.5) * 0.6;
      return {
        symbol: stock.symbol,
        price: Number((stock.lastPrice * (1 + drift / 100)).toFixed(2)),
        changePct: Number((stock.changePct + drift).toFixed(2)),
        volume: stock.volume,
        timestamp: new Date().toISOString(),
      };
    });
  }

  async getHistory(symbol: string, days = 90): Promise<Candle[]> {
    const stockRows = await db.select().from(schema.stocks).where(eq(schema.stocks.symbol, symbol));
    const stock = stockRows[0];
    if (!stock) return [];

    const existing = await db
      .select()
      .from(schema.priceHistory)
      .where(eq(schema.priceHistory.stockId, stock.id));

    if (existing.length > 0) {
      return existing
        .slice(-days)
        .map((r) => ({
          date: r.date,
          open: r.open,
          high: r.high,
          low: r.low,
          close: r.close,
          volume: r.volume,
        }));
    }

    // Fallback: synthesize a walk ending at lastPrice
    const rand = mulberry32(symbol.charCodeAt(0) * 7919);
    let price = stock.lastPrice * 0.85;
    const candles: Candle[] = [];
    const today = new Date();
    for (let i = days; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const changePct = (rand() - 0.48) * 3;
      const open = price;
      price = Math.max(0.5, price * (1 + changePct / 100));
      const close = price;
      const high = Math.max(open, close) * (1 + rand() * 0.01);
      const low = Math.min(open, close) * (1 - rand() * 0.01);
      candles.push({
        date: d.toISOString().slice(0, 10),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.floor(50000 + rand() * 500000),
      });
    }
    return candles;
  }
}
