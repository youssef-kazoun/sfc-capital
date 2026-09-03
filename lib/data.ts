import { db, schema } from "@/db";
import { desc, eq } from "drizzle-orm";

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

export async function getAllNews() {
  return db
    .select()
    .from(schema.newsArticles)
    .where(eq(schema.newsArticles.published, true))
    .orderBy(desc(schema.newsArticles.publishedAt));
}

export async function getNewsBySlug(slug: string) {
  const rows = await db.select().from(schema.newsArticles).where(eq(schema.newsArticles.slug, slug));
  return rows[0] ?? null;
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

export async function getAllRecommendations() {
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
    })
    .from(schema.recommendations)
    .leftJoin(schema.stocks, eq(schema.recommendations.stockId, schema.stocks.id))
    .orderBy(desc(schema.recommendations.createdAt));
  return rows as any[];
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
