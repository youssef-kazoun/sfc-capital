import { db, schema } from "@/db";
import { desc, eq, and } from "drizzle-orm";

export async function getTrendingStocks(limit = 6) {
  return db.select().from(schema.stocks).orderBy(desc(schema.stocks.changePct)).limit(limit);
}

export async function getAllStocks() {
  return db.select().from(schema.stocks).orderBy(schema.stocks.symbol);
}

export async function getStockBySymbol(symbol: string) {
  const rows = await db.select().from(schema.stocks).where(eq(schema.stocks.symbol, symbol));
  return rows[0] ?? null;
}

export async function getLatestNews(limit = 3) {
  return db
    .select()
    .from(schema.newsArticles)
    .where(eq(schema.newsArticles.published, true))
    .orderBy(desc(schema.newsArticles.publishedAt))
    .limit(limit);
}

export async function getAllNews(market?: "SAUDI" | "US", category?: string) {
  const conditions = [eq(schema.newsArticles.published, true)];
  if (market) conditions.push(eq(schema.newsArticles.market, market));
  if (category) conditions.push(eq(schema.newsArticles.category, category));
  return db
    .select()
    .from(schema.newsArticles)
    .where(and(...conditions))
    .orderBy(desc(schema.newsArticles.publishedAt));
}

export async function getNewsBySlug(slug: string) {
  const rows = await db.select().from(schema.newsArticles).where(eq(schema.newsArticles.slug, slug));
  return rows[0] ?? null;
}

export async function getRelatedArticles(articleId: string, category: string, limit = 3) {
  const rows = await db
    .select()
    .from(schema.newsArticles)
    .where(and(eq(schema.newsArticles.published, true), eq(schema.newsArticles.category, category)))
    .orderBy(desc(schema.newsArticles.publishedAt))
    .limit(limit + 1);
  return rows.filter((r) => r.id !== articleId).slice(0, limit);
}

export async function getUserById(id: string) {
  const rows = await db.select().from(schema.users).where(eq(schema.users.id, id));
  return rows[0] ?? null;
}

export async function getNewsCategories() {
  const rows = await db
    .select({ category: schema.newsArticles.category })
    .from(schema.newsArticles)
    .where(eq(schema.newsArticles.published, true));
  return Array.from(new Set(rows.map((r) => r.category)));
}

export async function getLatestRecommendations(limit = 3) {
  const rows = await db
    .select({
      id: schema.recommendations.id,
      action: schema.recommendations.action,
      entryPrice: schema.recommendations.entryPrice,
      targetPrice: schema.recommendations.targetPrice,
      stopLoss: schema.recommendations.stopLoss,
      status: schema.recommendations.status,
      riskLevel: schema.recommendations.riskLevel,
      stockSymbol: schema.stocks.symbol,
      stockName: schema.stocks.name,
    })
    .from(schema.recommendations)
    .leftJoin(schema.stocks, eq(schema.recommendations.stockId, schema.stocks.id))
    .orderBy(desc(schema.recommendations.createdAt))
    .limit(limit);
  return rows as any[];
}

export async function getAllRecommendations(market?: "SAUDI" | "US") {
  const rows = await db
    .select({
      id: schema.recommendations.id,
      action: schema.recommendations.action,
      entryPrice: schema.recommendations.entryPrice,
      targetPrice: schema.recommendations.targetPrice,
      stopLoss: schema.recommendations.stopLoss,
      status: schema.recommendations.status,
      riskLevel: schema.recommendations.riskLevel,
      createdAt: schema.recommendations.createdAt,
      stockSymbol: schema.stocks.symbol,
      stockName: schema.stocks.name,
      exchange: schema.stocks.exchange,
    })
    .from(schema.recommendations)
    .leftJoin(schema.stocks, eq(schema.recommendations.stockId, schema.stocks.id))
    .orderBy(desc(schema.recommendations.createdAt));

  const filtered = market
    ? rows.filter((r) => (market === "SAUDI" ? r.exchange === "TADAWUL" : r.exchange !== "TADAWUL"))
    : rows;
  return filtered as any[];
}

export async function getRecommendationById(id: string) {
  const recRows = await db.select().from(schema.recommendations).where(eq(schema.recommendations.id, id));
  const rec = recRows[0];
  if (!rec) return null;

  const [stock, updates, authorRows] = await Promise.all([
    db.select().from(schema.stocks).where(eq(schema.stocks.id, rec.stockId)).then((r) => r[0] ?? null),
    db
      .select()
      .from(schema.recommendationUpdates)
      .where(eq(schema.recommendationUpdates.recommendationId, id))
      .orderBy(desc(schema.recommendationUpdates.createdAt)),
    db.select().from(schema.users).where(eq(schema.users.id, rec.authorId)),
  ]);
  const author = authorRows[0] ?? null;

  return { rec, stock, updates, author };
}

export async function getAllAnalyses() {
  return db
    .select()
    .from(schema.analyses)
    .where(eq(schema.analyses.published, true))
    .orderBy(desc(schema.analyses.createdAt));
}

export async function getAnalysisBySlug(slug: string) {
  const rows = await db.select().from(schema.analyses).where(eq(schema.analyses.slug, slug));
  return rows[0] ?? null;
}

export async function getActivePackages() {
  return db.select().from(schema.packages).where(eq(schema.packages.isActive, true));
}

export async function getMarketOverview() {
  const allStocks = await db.select().from(schema.stocks);

  const saudi = allStocks.filter((s) => s.exchange === "TADAWUL");
  const us = allStocks.filter((s) => s.exchange !== "TADAWUL");

  const topGainers = [...allStocks].sort((a, b) => b.changePct - a.changePct).slice(0, 5);
  const topLosers = [...allStocks].sort((a, b) => a.changePct - b.changePct).slice(0, 5);
  const mostActive = [...allStocks].sort((a, b) => b.volume - a.volume).slice(0, 5);

  const sectorMap = new Map<string, { count: number; avgChange: number }>();
  for (const s of allStocks) {
    const sector = s.sector || "أخرى";
    const existing = sectorMap.get(sector) || { count: 0, avgChange: 0 };
    existing.avgChange = (existing.avgChange * existing.count + s.changePct) / (existing.count + 1);
    existing.count += 1;
    sectorMap.set(sector, existing);
  }
  const sectors = Array.from(sectorMap.entries()).map(([sector, data]) => ({ sector, ...data }));

  const saudiAvg = saudi.length ? saudi.reduce((sum, s) => sum + s.changePct, 0) / saudi.length : 0;
  const usAvg = us.length ? us.reduce((sum, s) => sum + s.changePct, 0) / us.length : 0;

  return { topGainers, topLosers, mostActive, sectors, saudiAvg, usAvg, saudiCount: saudi.length, usCount: us.length };
}
