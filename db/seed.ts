import "dotenv/config";
import { db, schema } from "../db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding SFC Capital - Saudi + US markets...");

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // =========================
  // USERS
  // =========================
  const [admin, analyst, customer] = await db
    .insert(schema.users)
    .values([
      {
        email: "admin@sfccapital.com",
        name: "SFC Capital Admin",
        role: "ADMIN",
        passwordHash,
      },
      {
        email: "analyst@sfccapital.com",
        name: "SFC Market Analyst",
        role: "ANALYST",
        passwordHash,
      },
      {
        email: "customer@sfccapital.com",
        name: "SFC Customer",
        role: "CUSTOMER",
        passwordHash,
      },
    ])
    .returning();

  // =========================
  // STOCKS
  // Demo/sample prices only.
  // =========================
  const stocks = await db
    .insert(schema.stocks)
    .values([
      {
        symbol: "2222",
        name: "Saudi Aramco",
        exchange: "TADAWUL",
        sector: "Energy",
        currency: "SAR",
        lastPrice: 27.8,
        changePct: 1.25,
        volume: 18500000,
        marketCap: 6850000000000,
      },
      {
        symbol: "1120",
        name: "Al Rajhi Bank",
        exchange: "TADAWUL",
        sector: "Banking",
        currency: "SAR",
        lastPrice: 95.5,
        changePct: 0.82,
        volume: 6200000,
        marketCap: 382000000000,
      },
      {
        symbol: "2010",
        name: "SABIC",
        exchange: "TADAWUL",
        sector: "Materials",
        currency: "SAR",
        lastPrice: 62.0,
        changePct: -0.35,
        volume: 4100000,
        marketCap: 186000000000,
      },
      {
        symbol: "7010",
        name: "stc",
        exchange: "TADAWUL",
        sector: "Telecommunications",
        currency: "SAR",
        lastPrice: 42.5,
        changePct: 0.48,
        volume: 2800000,
        marketCap: 213000000000,
      },
      {
        symbol: "1150",
        name: "Alinma Bank",
        exchange: "TADAWUL",
        sector: "Banking",
        currency: "SAR",
        lastPrice: 31.2,
        changePct: 1.05,
        volume: 5300000,
        marketCap: 62200000000,
      },
      {
        symbol: "1180",
        name: "Saudi National Bank",
        exchange: "TADAWUL",
        sector: "Banking",
        currency: "SAR",
        lastPrice: 35.8,
        changePct: -0.22,
        volume: 3600000,
        marketCap: 214000000000,
      },
      {
        symbol: "AAPL",
        name: "Apple",
        exchange: "NASDAQ",
        sector: "Technology",
        currency: "USD",
        lastPrice: 230,
        changePct: 0.76,
        volume: 42000000,
        marketCap: 3500000000000,
      },
      {
        symbol: "MSFT",
        name: "Microsoft",
        exchange: "NASDAQ",
        sector: "Technology",
        currency: "USD",
        lastPrice: 500,
        changePct: 0.42,
        volume: 21000000,
        marketCap: 3700000000000,
      },
      {
        symbol: "NVDA",
        name: "NVIDIA",
        exchange: "NASDAQ",
        sector: "Semiconductors",
        currency: "USD",
        lastPrice: 180,
        changePct: 1.84,
        volume: 51000000,
        marketCap: 4400000000000,
      },
      {
        symbol: "AMZN",
        name: "Amazon",
        exchange: "NASDAQ",
        sector: "Consumer & Technology",
        currency: "USD",
        lastPrice: 230,
        changePct: 0.91,
        volume: 26000000,
        marketCap: 2450000000000,
      },
      {
        symbol: "GOOGL",
        name: "Alphabet",
        exchange: "NASDAQ",
        sector: "Technology",
        currency: "USD",
        lastPrice: 250,
        changePct: 0.58,
        volume: 19000000,
        marketCap: 3050000000000,
      },
      {
        symbol: "TSLA",
        name: "Tesla",
        exchange: "NASDAQ",
        sector: "Automotive & Technology",
        currency: "USD",
        lastPrice: 350,
        changePct: -0.64,
        volume: 39000000,
        marketCap: 1120000000000,
      },
    ])
    .returning();

  // =========================
  // PRICE HISTORY
  // Synthetic demo history.
  // =========================
  const history = [];

  for (const stock of stocks) {
    let price = Number(stock.lastPrice);

    for (let i = 90; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const change = (Math.random() - 0.5) * 0.035;
      price = Math.max(price * (1 + change), 0.01);

      history.push({
        stockId: stock.id,
        date: date.toISOString().slice(0, 10),
        open: Number((price * (1 - Math.random() * 0.01)).toFixed(2)),
        high: Number((price * (1 + Math.random() * 0.015)).toFixed(2)),
        low: Number((price * (1 - Math.random() * 0.015)).toFixed(2)),
        close: Number(price.toFixed(2)),
        volume: Math.floor(Number(stock.volume) * (0.6 + Math.random() * 0.8)),
      });
    }
  }

  await db.insert(schema.priceHistory).values(history);

  // =========================
  // NEWS
  // =========================
  const news = await db
    .insert(schema.newsArticles)
    .values([
      {
        slug: "saudi-market-outlook",
        title: "Saudi Market Outlook: Key Trends to Watch",
        excerpt:
          "An overview of major trends across the Saudi market and key sectors.",
        content:
          "Saudi equities continue to attract attention as investors monitor energy, banking, telecommunications and broader economic developments.",
        category: "MARKETS",
        published: true,
        publishedAt: new Date().toISOString(),
        authorId: analyst.id,
      },
      {
        slug: "aramco-energy-market-update",
        title: "Saudi Energy Market Update",
        excerpt:
          "Key developments affecting the Saudi energy sector and major energy companies.",
        content:
          "Investors are closely watching energy demand, production expectations and global commodity-market developments.",
        category: "ENERGY",
        published: true,
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        authorId: analyst.id,
      },
      {
        slug: "us-tech-sector-outlook",
        title: "US Technology Sector Outlook",
        excerpt:
          "Technology remains one of the most closely watched areas of the US equity market.",
        content:
          "Investors continue to focus on cloud computing, artificial intelligence, software growth and technology-sector earnings.",
        category: "TECHNOLOGY",
        published: true,
        publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        authorId: analyst.id,
      },
      {
        slug: "ai-semiconductor-market-trends",
        title: "AI and Semiconductor Market Trends",
        excerpt:
          "Artificial intelligence infrastructure continues to drive semiconductor demand.",
        content:
          "AI infrastructure, accelerated computing and data-center investment remain major themes for semiconductor investors.",
        category: "AI",
        published: true,
        publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        authorId: analyst.id,
      },
    ])
    .returning();

  const stockBySymbol = Object.fromEntries(
    stocks.map((stock) => [stock.symbol, stock])
  );

  await db.insert(schema.newsArticleStocks).values([
    {
      newsId: news[0].id,
      stockId: stockBySymbol["2222"].id,
    },
    {
      newsId: news[0].id,
      stockId: stockBySymbol["1120"].id,
    },
    {
      newsId: news[1].id,
      stockId: stockBySymbol["2222"].id,
    },
    {
      newsId: news[2].id,
      stockId: stockBySymbol["AAPL"].id,
    },
    {
      newsId: news[2].id,
      stockId: stockBySymbol["MSFT"].id,
    },
    {
      newsId: news[2].id,
      stockId: stockBySymbol["GOOGL"].id,
    },
    {
      newsId: news[3].id,
      stockId: stockBySymbol["NVDA"].id,
    },
  ]);

  // =========================
  // RECOMMENDATIONS
  // =========================
  await db.insert(schema.recommendations).values([
    {
      stockId: stockBySymbol["2222"].id,
      action: "BUY",
      targetPrice: 31.0,
      entryPrice: 27.8,
      stopLoss: 25.5,
      rationale:
        "Long-term energy demand and the company's strategic position support a positive outlook.",
      riskLevel: "MEDIUM",
      timeHorizon: "6-12 months",
      authorId: analyst.id,
    },
    {
      stockId: stockBySymbol["1120"].id,
      action: "ACCUMULATE",
      targetPrice: 108.0,
      entryPrice: 95.5,
      stopLoss: 88,
      rationale:
        "Strong banking fundamentals and growth opportunities support gradual accumulation.",
      riskLevel: "MEDIUM",
      timeHorizon: "6-12 months",
      authorId: analyst.id,
    },
    {
      stockId: stockBySymbol["NVDA"].id,
      action: "BUY",
      targetPrice: 215.0,
      entryPrice: 180,
      stopLoss: 160,
      rationale:
        "AI infrastructure demand remains a major growth driver for accelerated computing.",
      riskLevel: "HIGH",
      timeHorizon: "6-12 months",
      authorId: analyst.id,
    },
    {
      stockId: stockBySymbol["AAPL"].id,
      action: "HOLD",
      targetPrice: 245.0,
      entryPrice: 230,
      stopLoss: 210,
      rationale:
        "Strong ecosystem and cash generation are balanced by valuation considerations.",
      riskLevel: "MEDIUM",
      timeHorizon: "6-12 months",
      authorId: analyst.id,
    },
    {
      stockId: stockBySymbol["AMZN"].id,
      action: "ACCUMULATE",
      targetPrice: 265.0,
      entryPrice: 230,
      stopLoss: 210,
      rationale:
        "Cloud computing and e-commerce growth provide multiple long-term growth drivers.",
      riskLevel: "MEDIUM",
      timeHorizon: "6-12 months",
      authorId: analyst.id,
    },
  ]);

  // =========================
  // ANALYSES
  // =========================
  await db.insert(schema.analyses).values([
    {
      slug: "tadawul-market-outlook",
      title: "Tadawul Market Outlook",
      summary:
        "A broad review of Saudi market sectors, opportunities and key risks.",
      content:
        "The Saudi market presents opportunities across energy, banking, telecommunications and industrial sectors. Investors should monitor macroeconomic conditions, earnings and global market sentiment.",
      stockId: stockBySymbol["2222"].id,
      authorId: analyst.id,
    },
    {
      slug: "us-tech-sector-review",
      title: "US Technology Sector Review",
      summary:
        "A review of major trends across leading US technology companies.",
      content:
        "US technology companies continue to benefit from cloud adoption, artificial intelligence and digital transformation. Valuation and macroeconomic risks remain important considerations.",
      stockId: stockBySymbol["MSFT"].id,
      authorId: analyst.id,
    },
    {
      slug: "ai-semiconductor-analysis",
      title: "AI Semiconductor Analysis",
      summary:
        "An overview of artificial intelligence and semiconductor investment themes.",
      content:
        "AI infrastructure investment continues to support demand for advanced computing hardware. Semiconductor companies remain sensitive to valuation, supply-chain conditions and technology cycles.",
      stockId: stockBySymbol["NVDA"].id,
      authorId: analyst.id,
    },
  ]);

  // =========================
  // PACKAGES
  // =========================
  await db.insert(schema.packages).values([
    {
      name: "Starter",
      slug: "starter",
      description: "Essential market access for individual investors.",
      priceMonthly: 0,
      priceYearly: 0,
      features: JSON.stringify([
        "Market overview",
        "Saudi market access",
        "US market access",
        "Basic watchlist",
      ]),
    },
    {
      name: "Pro",
      slug: "pro",
      description: "Advanced tools and research for active investors.",
      priceMonthly: 299,
      priceYearly: 2990,
      features: JSON.stringify([
        "Everything in Starter",
        "Advanced recommendations",
        "Market analysis",
        "Price history",
        "Advanced watchlist",
      ]),
    },
    {
      name: "Elite",
      slug: "elite",
      description: "Premium research and advanced investment insights.",
      priceMonthly: 799,
      priceYearly: 7990,
      features: JSON.stringify([
        "Everything in Pro",
        "Premium research",
        "Advanced market insights",
        "Priority support",
        "Premium reports",
      ]),
    },
  ]);

  console.log("");
  console.log("SFC Capital seed completed successfully.");
  console.log("");
  console.log("Markets:");
  console.log("- Saudi Arabia / Tadawul");
  console.log("- United States / NASDAQ");
  console.log("");
  console.log("Demo logins:");
  console.log("admin@sfccapital.com");
  console.log("analyst@sfccapital.com");
  console.log("customer@sfccapital.com");
  console.log("Password: Password123!");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));






