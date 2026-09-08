import "dotenv/config";
import { db, schema } from "../db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // ---------------- Users ----------------
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const [admin] = await db
    .insert(schema.users)
    .values({
      name: "Admin User",
      email: "admin@sfccapital.com",
      passwordHash,
      role: "ADMIN",
    })
    .returning();

  const [analyst] = await db
    .insert(schema.users)
    .values({
      name: "Nour El-Sayed",
      email: "analyst@sfccapital.com",
      passwordHash,
      role: "ANALYST",
    })
    .returning();

  const [customer] = await db
    .insert(schema.users)
    .values({
      name: "Demo Customer",
      email: "customer@sfccapital.com",
      passwordHash,
      role: "CUSTOMER",
    })
    .returning();

  // ---------------- Stocks (EGX-flavored demo set) ----------------
  const stockSeed = [
    { symbol: "COMI", name: "Commercial International Bank", sector: "Banking", lastPrice: 78.4, changePct: 1.2, volume: 3200000, marketCap: 190000000000 },
    { symbol: "HRHO", name: "EFG Hermes Holding", sector: "Financial Services", lastPrice: 22.1, changePct: -0.8, volume: 1800000, marketCap: 25000000000 },
    { symbol: "TMGH", name: "Talaat Moustafa Group", sector: "Real Estate", lastPrice: 14.6, changePct: 2.4, volume: 5400000, marketCap: 60000000000 },
    { symbol: "SWDY", name: "Elsewedy Electric", sector: "Industrials", lastPrice: 19.9, changePct: 0.5, volume: 2100000, marketCap: 42000000000 },
    { symbol: "EAST", name: "Eastern Company", sector: "Consumer Goods", lastPrice: 24.3, changePct: -1.5, volume: 900000, marketCap: 33000000000 },
    { symbol: "ETEL", name: "Telecom Egypt", sector: "Telecom", lastPrice: 27.8, changePct: 0.9, volume: 2600000, marketCap: 58000000000 },
    { symbol: "ORAS", name: "Orascom Construction", sector: "Construction", lastPrice: 45.2, changePct: 3.1, volume: 700000, marketCap: 22000000000 },
    { symbol: "ABUK", name: "Abu Qir Fertilizers", sector: "Chemicals", lastPrice: 62.5, changePct: -0.3, volume: 500000, marketCap: 37000000000 },
    { symbol: "FWRY", name: "Fawry for Banking Technology", sector: "Fintech", lastPrice: 6.8, changePct: 4.2, volume: 8100000, marketCap: 11000000000 },
    { symbol: "MFPC", name: "Misr Fertilizers Production", sector: "Chemicals", lastPrice: 88.1, changePct: 1.8, volume: 400000, marketCap: 45000000000 },
    { symbol: "EFIH", name: "e-Finance for Digital Services", sector: "Fintech", lastPrice: 16.4, changePct: -2.1, volume: 3300000, marketCap: 19500000000 },
    { symbol: "PHDC", name: "Palm Hills Developments", sector: "Real Estate", lastPrice: 4.9, changePct: 1.0, volume: 6700000, marketCap: 8900000000 },
  ];

  const stocks = await db.insert(schema.stocks).values(stockSeed).returning();
  const bySymbol = Object.fromEntries(stocks.map((s) => [s.symbol, s]));

  // ---------------- Price history (90 days synthetic walk) ----------------
  for (const stock of stocks) {
    let price = stock.lastPrice * 0.8;
    const rows = [];
    const today = new Date();
    for (let i = 90; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const changePct = (Math.random() - 0.47) * 3;
      const open = price;
      price = Math.max(0.5, price * (1 + changePct / 100));
      const close = i === 0 ? stock.lastPrice : price;
      const high = Math.max(open, close) * 1.01;
      const low = Math.min(open, close) * 0.99;
      rows.push({
        stockId: stock.id,
        date: d.toISOString().slice(0, 10),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.floor(200000 + Math.random() * 2000000),
      });
    }
    await db.insert(schema.priceHistory).values(rows);
  }

  // ---------------- News ----------------
  const newsSeed = [
    {
      slug: "cbe-holds-interest-rates-steady",
      title: "Central Bank of Egypt holds interest rates steady",
      excerpt:
        "The CBE's Monetary Policy Committee kept overnight rates unchanged, citing easing inflation trends.",
      content:
        "The Central Bank of Egypt's Monetary Policy Committee decided to keep the overnight deposit and lending rates unchanged at its latest meeting. The decision comes amid signs that headline inflation is moderating, though the committee noted it will continue to monitor external and domestic price pressures closely before any further easing.",
      category: "Macro",
      authorId: analyst.id,
      published: true,
      publishedAt: new Date().toISOString(),
    },
    {
      slug: "comi-reports-strong-q2-earnings",
      title: "CIB reports strong Q2 earnings, beats estimates",
      excerpt:
        "Commercial International Bank posted a double-digit rise in net income driven by higher net interest margins.",
      content:
        "Commercial International Bank (COMI) reported second-quarter net income well ahead of analyst estimates, supported by wider net interest margins and continued loan book growth. Management pointed to disciplined cost control and a stable asset quality profile as key drivers of the results.",
      category: "Earnings",
      authorId: analyst.id,
      published: true,
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      stockSymbol: "COMI",
    },
    {
      slug: "fawry-expands-merchant-network",
      title: "Fawry expands merchant payment network across Egypt",
      excerpt:
        "Fawry announced a new wave of merchant partnerships aimed at growing its digital payments footprint.",
      content:
        "Fawry for Banking Technology and Electronic Payments announced an expansion of its merchant network, adding thousands of new points of acceptance across retail and services sectors. The company said the move is part of its broader strategy to deepen financial inclusion and grow transaction volumes.",
      category: "Corporate",
      authorId: analyst.id,
      published: true,
      publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      stockSymbol: "FWRY",
    },
    {
      slug: "egx30-closes-higher-real-estate-rally",
      title: "EGX30 closes higher on real estate sector rally",
      excerpt:
        "The benchmark index advanced as real estate developers led gains on renewed investor appetite.",
      content:
        "The EGX30 benchmark index closed higher in Wednesday's session, led by gains across real estate developers including Talaat Moustafa Group and Palm Hills Developments. Traders cited improving sentiment around the sector's pre-sales outlook for the remainder of the year.",
      category: "Markets",
      authorId: analyst.id,
      published: true,
      publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      stockSymbol: "TMGH",
    },
  ];

  for (const n of newsSeed) {
    const { stockSymbol, ...rest } = n as any;
    const [article] = await db.insert(schema.newsArticles).values(rest).returning();
    if (stockSymbol && bySymbol[stockSymbol]) {
      await db.insert(schema.newsArticleStocks).values({
        newsId: article.id,
        stockId: bySymbol[stockSymbol].id,
      });
    }
  }

  // ---------------- Recommendations ----------------
  const recSeed = [
    {
      symbol: "COMI",
      action: "BUY" as const,
      entryPrice: 76.0,
      targetPrice: 92.0,
      stopLoss: 68.0,
      rationale:
        "Strong net interest margin trajectory and resilient asset quality support a re-rating toward regional bank peer multiples.",
      riskLevel: "Medium",
      timeHorizon: "6-12 months",
    },
    {
      symbol: "FWRY",
      action: "ACCUMULATE" as const,
      entryPrice: 6.5,
      targetPrice: 9.0,
      stopLoss: 5.2,
      rationale:
        "Merchant network expansion and rising transaction volumes point to accelerating revenue growth over the next few quarters.",
      riskLevel: "High",
      timeHorizon: "3-6 months",
    },
    {
      symbol: "TMGH",
      action: "BUY" as const,
      entryPrice: 13.8,
      targetPrice: 18.5,
      stopLoss: 11.9,
      rationale:
        "Pre-sales momentum and a healthy delivery pipeline underpin continued earnings growth into next year.",
      riskLevel: "Medium",
      timeHorizon: "12 months",
    },
    {
      symbol: "EAST",
      action: "HOLD" as const,
      entryPrice: 24.3,
      targetPrice: 26.0,
      stopLoss: 21.0,
      rationale:
        "Margins remain under pressure from input costs; awaiting clearer pricing power signals before adding exposure.",
      riskLevel: "Low",
      timeHorizon: "3 months",
    },
    {
      symbol: "EFIH",
      action: "REDUCE" as const,
      entryPrice: 18.0,
      targetPrice: 14.0,
      stopLoss: 19.5,
      rationale:
        "Recent contract renewal uncertainty and slower revenue growth warrant trimming position size.",
      riskLevel: "Medium",
      timeHorizon: "3 months",
    },
  ];

  for (const r of recSeed) {
    const stock = bySymbol[r.symbol];
    await db.insert(schema.recommendations).values({
      stockId: stock.id,
      action: r.action,
      entryPrice: r.entryPrice,
      targetPrice: r.targetPrice,
      stopLoss: r.stopLoss,
      rationale: r.rationale,
      riskLevel: r.riskLevel,
      timeHorizon: r.timeHorizon,
      authorId: analyst.id,
      status: "OPEN",
    });
  }

  // ---------------- Analysis ----------------
  await db.insert(schema.analyses).values([
    {
      slug: "egx30-technical-outlook-q3",
      title: "EGX30 Technical Outlook: Q3 Range and Key Levels",
      type: "Technical",
      summary: "The index is consolidating between key support and resistance bands ahead of Q3 earnings season.",
      content:
        "The EGX30 has traded within a well-defined range over the past several weeks, finding support near recent lows and facing resistance close to the psychological round-number level above. A decisive break above resistance on rising volume would open the way toward the next resistance band, while a break below support would shift the near-term bias more cautious. We recommend watching volume confirmation closely around both levels.",
      authorId: analyst.id,
      published: true,
    },
    {
      slug: "banking-sector-fundamental-review",
      title: "Banking Sector Fundamental Review: Margins Still Expanding",
      type: "Fundamental",
      summary: "Egyptian banks continue to benefit from elevated rates, though loan growth is moderating.",
      content:
        "Our review of the listed banking sector shows net interest margins remain elevated relative to historical averages, supporting continued earnings growth even as loan book expansion moderates from prior-year highs. Asset quality metrics remain broadly stable across the names we cover, though we continue to monitor provisioning trends given the macro backdrop.",
      authorId: analyst.id,
      published: true,
      stockId: bySymbol["COMI"].id,
    },
  ]);

  // ---------------- Packages ----------------
  await db.insert(schema.packages).values([
    {
      name: "Starter",
      nameAr: "الباقة الأساسية",
      slug: "starter",
      description: "Essential market data and news for self-directed investors.",
      priceMonthly: 0,
      priceYearly: 0,
      features: JSON.stringify([
        "Real-time-ish market quotes",
        "Daily market news",
        "Basic watchlist (up to 10 stocks)",
      ]),
    },
    {
      name: "Pro",
      nameAr: "الباقة الاحترافية",
      slug: "pro",
      description: "Full recommendation feed and portfolio tools for active investors.",
      priceMonthly: 299,
      priceYearly: 2990,
      features: JSON.stringify([
        "Everything in Starter",
        "Full analyst recommendations feed",
        "Unlimited watchlist & price alerts",
        "Portfolio tracking",
      ]),
    },
    {
      name: "Elite",
      nameAr: "الباقة المتميزة",
      slug: "elite",
      description: "Priority research access and dedicated support for serious traders.",
      priceMonthly: 799,
      priceYearly: 7990,
      features: JSON.stringify([
        "Everything in Pro",
        "Early access to new recommendations",
        "In-depth fundamental & technical reports",
        "Priority support",
      ]),
    },
  ]);

  console.log("Seed complete.");
  console.log("Demo logins (password: Password123!):");
  console.log("  admin@sfccapital.com (ADMIN)");
  console.log("  analyst@sfccapital.com (ANALYST)");
  console.log("  customer@sfccapital.com (CUSTOMER)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit(process.exitCode ?? 0);
  });
