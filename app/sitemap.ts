import type { MetadataRoute } from "next";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const staticPages = [
    "",
    "/services",
    "/markets",
    "/market-overview",
    "/news",
    "/recommendations",
    "/analysis",
    "/calculators",
    "/shariah-checker",
    "/packages",
    "/offers",
    "/trial",
    "/academy",
    "/faq",
    "/about",
    "/contact",
    "/terms",
    "/policy",
    "/refund-policy",
    "/disclaimer",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const [stocks, news] = await Promise.all([
    db.select({ symbol: schema.stocks.symbol }).from(schema.stocks),
    db
      .select({ slug: schema.newsArticles.slug, updatedAt: schema.newsArticles.updatedAt })
      .from(schema.newsArticles)
      .where(eq(schema.newsArticles.published, true)),
  ]);

  const stockPages = stocks.map((s) => ({
    url: `${siteUrl}/stocks/${s.symbol}`,
    lastModified: new Date(),
  }));

  const newsPages = news.map((n) => ({
    url: `${siteUrl}/news/${n.slug}`,
    lastModified: new Date(n.updatedAt),
  }));

  return [...staticPages, ...stockPages, ...newsPages];
}
