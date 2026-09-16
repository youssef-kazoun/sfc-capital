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
      name: "مدير النظام",
      email: "admin@sfccapital.com",
      passwordHash,
      role: "ADMIN",
    })
    .returning();

  const [analyst] = await db
    .insert(schema.users)
    .values({
      name: "نور السيد",
      email: "analyst@sfccapital.com",
      passwordHash,
      role: "ANALYST",
    })
    .returning();

  const [customer] = await db
    .insert(schema.users)
    .values({
      name: "عميل تجريبي",
      email: "customer@sfccapital.com",
      passwordHash,
      role: "CUSTOMER",
    })
    .returning();

  // ---------------- Stocks: Saudi (Tadawul) + US (NASDAQ/NYSE) ----------------
  const stockSeed = [
    // Saudi market — Tadawul, priced in SAR
    { symbol: "2222", name: "أرامكو السعودية", exchange: "TADAWUL", sector: "الطاقة", currency: "SAR", lastPrice: 29.8, changePct: 0.6, volume: 12500000, marketCap: 7200000000000 },
    { symbol: "1120", name: "مصرف الراجحي", exchange: "TADAWUL", sector: "بنوك", currency: "SAR", lastPrice: 86.4, changePct: 1.4, volume: 3100000, marketCap: 216000000000 },
    { symbol: "2010", name: "سابك", exchange: "TADAWUL", sector: "صناعات كيماوية", currency: "SAR", lastPrice: 64.2, changePct: -0.5, volume: 1800000, marketCap: 192000000000 },
    { symbol: "7010", name: "الاتصالات السعودية STC", exchange: "TADAWUL", sector: "اتصالات", currency: "SAR", lastPrice: 41.5, changePct: 0.9, volume: 2200000, marketCap: 166000000000 },
    { symbol: "1211", name: "معادن", exchange: "TADAWUL", sector: "تعدين", currency: "SAR", lastPrice: 56.7, changePct: 2.1, volume: 2600000, marketCap: 113000000000 },
    { symbol: "2280", name: "المراعي", exchange: "TADAWUL", sector: "سلع استهلاكية", currency: "SAR", lastPrice: 48.3, changePct: -0.3, volume: 700000, marketCap: 45000000000 },
    // US market — NASDAQ/NYSE, priced in USD
    { symbol: "AAPL", name: "آبل", exchange: "NASDAQ", sector: "تكنولوجيا", currency: "USD", lastPrice: 194.5, changePct: 0.8, volume: 48000000, marketCap: 3000000000000 },
    { symbol: "MSFT", name: "مايكروسوفت", exchange: "NASDAQ", sector: "تكنولوجيا", currency: "USD", lastPrice: 421.3, changePct: 1.1, volume: 21000000, marketCap: 3100000000000 },
    { symbol: "NVDA", name: "إنفيديا", exchange: "NASDAQ", sector: "أشباه الموصلات", currency: "USD", lastPrice: 878.2, changePct: 3.4, volume: 39000000, marketCap: 2160000000000 },
    { symbol: "AMZN", name: "أمازون", exchange: "NASDAQ", sector: "تجزئة", currency: "USD", lastPrice: 178.9, changePct: -0.6, volume: 33000000, marketCap: 1860000000000 },
    { symbol: "TSLA", name: "تسلا", exchange: "NASDAQ", sector: "سيارات", currency: "USD", lastPrice: 244.8, changePct: -1.8, volume: 71000000, marketCap: 780000000000 },
    { symbol: "JPM", name: "جي بي مورجان تشيس", exchange: "NYSE", sector: "بنوك", currency: "USD", lastPrice: 204.6, changePct: 0.5, volume: 8200000, marketCap: 590000000000 },
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
      slug: "fed-holds-interest-rates-steady",
      title: "الاحتياطي الفيدرالي الأمريكي يبقي على أسعار الفائدة دون تغيير",
      excerpt:
        "لجنة السوق المفتوحة الفيدرالية أبقت على سعر الفائدة القياسي دون تغيير، مشيرة إلى ضرورة مزيد من الأدلة على تراجع التضخم.",
      content:
        "قرر الاحتياطي الفيدرالي الأمريكي الإبقاء على سعر الفائدة القياسي دون تغيير في اجتماعه الأخير، في خطوة كانت متوقعة على نطاق واسع من الأسواق. وأشار رئيس الاحتياطي الفيدرالي إلى أن اللجنة تحتاج إلى مزيد من الثقة في استمرار تراجع التضخم نحو المستوى المستهدف قبل الشروع في خفض أسعار الفائدة، مما أبقى الأسواق في حالة ترقب لمسار السياسة النقدية خلال الأشهر المقبلة.",
      category: "الاقتصاد الكلي",
      authorId: analyst.id,
      published: true,
      publishedAt: new Date().toISOString(),
    },
    {
      slug: "aramco-reports-strong-quarterly-results",
      title: "أرامكو السعودية تعلن نتائج فصلية قوية",
      excerpt:
        "أرامكو السعودية حققت نتائج تفوق توقعات المحللين مدعومة باستقرار أسعار النفط وكفاءة التشغيل.",
      content:
        "أعلنت أرامكو السعودية عن نتائج مالية فصلية تجاوزت توقعات المحللين، مدعومة باستقرار أسعار النفط العالمية وتحسن كفاءة التشغيل عبر مختلف قطاعات الشركة. وأكدت الشركة التزامها بخطط التوزيعات للمساهمين، مشيرة إلى استمرار الاستثمار في مشاريع التوسع بقطاعي التكرير والكيماويات.",
      category: "الأرباح",
      authorId: analyst.id,
      published: true,
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      stockSymbol: "2222",
    },
    {
      slug: "apple-expands-digital-services",
      title: "آبل تعلن عن توسع في خدماتها الرقمية",
      excerpt:
        "آبل كشفت عن خطط لتوسيع قطاع الخدمات الرقمية بعد نمو قوي في الإيرادات المتكررة.",
      content:
        "كشفت آبل عن خطط لتوسيع نطاق خدماتها الرقمية بعد أن سجل هذا القطاع نموًا قويًا في الإيرادات المتكررة خلال الأرباع الأخيرة. وقال مسؤولو الشركة إن التركيز المتزايد على الخدمات يأتي في إطار استراتيجية لتنويع مصادر الإيرادات بعيدًا عن مبيعات الأجهزة التقليدية.",
      category: "الشركات",
      authorId: analyst.id,
      published: true,
      publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      stockSymbol: "AAPL",
    },
    {
      slug: "tasi-closes-higher-banking-rally",
      title: "مؤشر تاسي يغلق مرتفعًا بدعم من قطاع البنوك",
      excerpt:
        "المؤشر العام للسوق السعودي ارتفع مع تصدّر الأسهم البنكية المكاسب وسط تحسن شهية المستثمرين.",
      content:
        "أغلق المؤشر العام للسوق السعودي (تاسي) مرتفعًا في جلسة تداول حديثة، بقيادة مكاسب في قطاع البنوك ومن أبرزها مصرف الراجحي. وأشار المتداولون إلى تحسن المعنويات حول أرباح القطاع المصرفي مع استمرار الطلب على التمويل واستقرار جودة الأصول.",
      category: "الأسواق",
      authorId: analyst.id,
      published: true,
      publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      stockSymbol: "1120",
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
      symbol: "2222",
      action: "BUY" as const,
      entryPrice: 29.0,
      targetPrice: 34.0,
      stopLoss: 26.5,
      rationale:
        "استقرار أسعار النفط وانضباط الإنفاق الرأسمالي يدعمان استمرار التوزيعات المرتفعة وإعادة تقييم تدريجية للسهم.",
      riskLevel: "Low",
      timeHorizon: "١٢ شهرًا",
    },
    {
      symbol: "NVDA",
      action: "ACCUMULATE" as const,
      entryPrice: 850.0,
      targetPrice: 1050.0,
      stopLoss: 720.0,
      rationale:
        "استمرار الطلب القوي على رقائق الذكاء الاصطناعي وتوسع هامش الربح يدعمان نموًا إضافيًا في الإيرادات.",
      riskLevel: "High",
      timeHorizon: "٦-١٢ شهرًا",
    },
    {
      symbol: "1120",
      action: "BUY" as const,
      entryPrice: 84.0,
      targetPrice: 96.0,
      stopLoss: 76.0,
      rationale:
        "نمو محفظة التمويل وتحسن جودة الأصول يدعمان استمرار نمو الأرباح في القطاع المصرفي السعودي.",
      riskLevel: "Medium",
      timeHorizon: "٦-١٢ شهرًا",
    },
    {
      symbol: "AMZN",
      action: "HOLD" as const,
      entryPrice: 178.0,
      targetPrice: 195.0,
      stopLoss: 160.0,
      rationale:
        "أداء قوي في قطاع الحوسبة السحابية يقابله ضغط على هوامش قطاع التجزئة؛ ننتظر وضوحًا أكبر قبل زيادة الوزن النسبي.",
      riskLevel: "Medium",
      timeHorizon: "٣ أشهر",
    },
    {
      symbol: "TSLA",
      action: "REDUCE" as const,
      entryPrice: 250.0,
      targetPrice: 210.0,
      stopLoss: 265.0,
      rationale:
        "تباطؤ نمو التسليمات وضغوط تنافسية متزايدة في قطاع السيارات الكهربائية يستدعيان تقليل حجم المركز.",
      riskLevel: "High",
      timeHorizon: "٣ أشهر",
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
      slug: "nasdaq-technical-outlook-q3",
      title: "التوقعات الفنية لمؤشر ناسداك: النطاق الحالي والمستويات الرئيسية",
      type: "فني",
      summary: "المؤشر يتماسك بين نطاقي دعم ومقاومة رئيسيين قبل موسم أرباح قطاع التكنولوجيا.",
      content:
        "تداول مؤشر ناسداك خلال الأسابيع الماضية في نطاق محدد بوضوح، مسجلًا دعمًا قرب أدنى مستوياته الأخيرة ومواجهًا مقاومة قريبة من القمم التاريخية. أي اختراق حاسم فوق المقاومة بحجم تداول مرتفع سيفتح الطريق نحو مستويات قياسية جديدة، في حين أن الاختراق تحت الدعم سينقل المشهد قصير المدى نحو مزيد من الحذر، خصوصًا مع اقتراب نتائج أعمال كبرى شركات التكنولوجيا.",
      authorId: analyst.id,
      published: true,
    },
    {
      slug: "saudi-banking-sector-fundamental-review",
      title: "مراجعة أساسية لقطاع البنوك السعودي: الهوامش لا تزال في توسع",
      type: "أساسي",
      summary: "البنوك السعودية تستمر في الاستفادة من نمو التمويل، مع استقرار جودة الأصول.",
      content:
        "تُظهر مراجعتنا لقطاع البنوك المدرجة في السوق السعودي أن هوامش الفائدة الصافية لا تزال في مستويات صحية، مدعومة بنمو مستمر في محافظ التمويل العقاري والتجاري. مؤشرات جودة الأصول لا تزال مستقرة عبر الأسماء التي نغطيها، مع تحسن تدريجي في كفاءة التكلفة بفعل التحول الرقمي المتسارع في القطاع.",
      authorId: analyst.id,
      published: true,
      stockId: bySymbol["1120"].id,
    },
  ]);

  // ---------------- Packages ----------------
  await db.insert(schema.packages).values([
    {
      name: "الباقة الأساسية",
      nameAr: "الباقة الأساسية",
      slug: "starter",
      description: "بيانات السوق والأخبار الأساسية للمستثمر المستقل.",
      priceMonthly: 0,
      priceYearly: 0,
      features: JSON.stringify([
        "أسعار السوق شبه اللحظية",
        "أخبار السوق اليومية",
        "قائمة متابعة أساسية (حتى ١٠ أسهم)",
      ]),
    },
    {
      name: "الباقة الاحترافية",
      nameAr: "الباقة الاحترافية",
      slug: "pro",
      description: "خلاصة كاملة للتوصيات وأدوات إدارة المحفظة للمستثمر النشط.",
      priceMonthly: 29,
      priceYearly: 290,
      features: JSON.stringify([
        "كل ما في الباقة الأساسية",
        "خلاصة كاملة لتوصيات المحللين",
        "قائمة متابعة وتنبيهات سعرية غير محدودة",
        "تتبّع المحفظة",
      ]),
    },
    {
      name: "الباقة المتميزة",
      nameAr: "الباقة المتميزة",
      slug: "elite",
      description: "أولوية الوصول للبحث ودعم مخصص للمتداولين الجادين.",
      priceMonthly: 79,
      priceYearly: 790,
      features: JSON.stringify([
        "كل ما في الباقة الاحترافية",
        "وصول مبكر للتوصيات الجديدة",
        "تقارير فنية وأساسية متعمقة",
        "دعم فني ذو أولوية",
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
