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

  // ---------------- Stocks (EGX-flavored demo set) ----------------
  const stockSeed = [
    { symbol: "COMI", name: "البنك التجاري الدولي", sector: "بنوك", lastPrice: 78.4, changePct: 1.2, volume: 3200000, marketCap: 190000000000 },
    { symbol: "HRHO", name: "المجموعة المالية هيرميس القابضة", sector: "خدمات مالية", lastPrice: 22.1, changePct: -0.8, volume: 1800000, marketCap: 25000000000 },
    { symbol: "TMGH", name: "مجموعة طلعت مصطفى", sector: "عقارات", lastPrice: 14.6, changePct: 2.4, volume: 5400000, marketCap: 60000000000 },
    { symbol: "SWDY", name: "السويدي إليكتريك", sector: "صناعات", lastPrice: 19.9, changePct: 0.5, volume: 2100000, marketCap: 42000000000 },
    { symbol: "EAST", name: "الشرقية للدخان", sector: "سلع استهلاكية", lastPrice: 24.3, changePct: -1.5, volume: 900000, marketCap: 33000000000 },
    { symbol: "ETEL", name: "المصرية للاتصالات", sector: "اتصالات", lastPrice: 27.8, changePct: 0.9, volume: 2600000, marketCap: 58000000000 },
    { symbol: "ORAS", name: "أوراسكوم للإنشاءات", sector: "مقاولات", lastPrice: 45.2, changePct: 3.1, volume: 700000, marketCap: 22000000000 },
    { symbol: "ABUK", name: "أبو قير للأسمدة", sector: "كيماويات", lastPrice: 62.5, changePct: -0.3, volume: 500000, marketCap: 37000000000 },
    { symbol: "FWRY", name: "فوري لتكنولوجيا البنوك", sector: "تكنولوجيا مالية", lastPrice: 6.8, changePct: 4.2, volume: 8100000, marketCap: 11000000000 },
    { symbol: "MFPC", name: "مصر لإنتاج الأسمدة", sector: "كيماويات", lastPrice: 88.1, changePct: 1.8, volume: 400000, marketCap: 45000000000 },
    { symbol: "EFIH", name: "إي فاينانس للاستثمارات المالية", sector: "تكنولوجيا مالية", lastPrice: 16.4, changePct: -2.1, volume: 3300000, marketCap: 19500000000 },
    { symbol: "PHDC", name: "بالم هيلز للتعمير", sector: "عقارات", lastPrice: 4.9, changePct: 1.0, volume: 6700000, marketCap: 8900000000 },
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
      title: "البنك المركزي المصري يثبّت أسعار الفائدة",
      excerpt:
        "لجنة السياسة النقدية بالبنك المركزي أبقت على أسعار الفائدة دون تغيير، مشيرة إلى تراجع معدلات التضخم.",
      content:
        "قررت لجنة السياسة النقدية بالبنك المركزي المصري الإبقاء على أسعار عائد الإيداع والإقراض لليلة واحدة دون تغيير في اجتماعها الأخير. يأتي القرار وسط مؤشرات على تراجع التضخم العام، وإن كانت اللجنة أشارت إلى أنها ستستمر في مراقبة الضغوط السعرية الداخلية والخارجية عن كثب قبل أي تيسير إضافي.",
      category: "الاقتصاد الكلي",
      authorId: analyst.id,
      published: true,
      publishedAt: new Date().toISOString(),
    },
    {
      slug: "comi-reports-strong-q2-earnings",
      title: "البنك التجاري الدولي يعلن نتائج قوية للربع الثاني",
      excerpt:
        "البنك التجاري الدولي حقق ارتفاعًا كبيرًا في صافي الربح مدفوعًا بارتفاع هامش الفائدة الصافي.",
      content:
        "أعلن البنك التجاري الدولي (COMI) عن نتائج صافي ربح للربع الثاني تجاوزت توقعات المحللين بشكل كبير، مدعومة بتوسع هامش الفائدة الصافي واستمرار نمو محفظة القروض. وأشارت الإدارة إلى الانضباط في ضبط التكاليف واستقرار جودة الأصول كعاملين رئيسيين وراء هذه النتائج.",
      category: "الأرباح",
      authorId: analyst.id,
      published: true,
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      stockSymbol: "COMI",
    },
    {
      slug: "fawry-expands-merchant-network",
      title: "فوري توسّع شبكة تحصيل المدفوعات في مصر",
      excerpt:
        "أعلنت فوري عن موجة جديدة من الشراكات مع التجار بهدف توسيع نطاق خدمات الدفع الرقمي.",
      content:
        "أعلنت شركة فوري لتكنولوجيا البنوك والمدفوعات الإلكترونية عن توسيع شبكة التجار المرتبطين بها، بإضافة آلاف نقاط القبول الجديدة في قطاعي التجزئة والخدمات. وقالت الشركة إن هذه الخطوة تأتي في إطار استراتيجيتها الأوسع لتعميق الشمول المالي وزيادة حجم المعاملات.",
      category: "الشركات",
      authorId: analyst.id,
      published: true,
      publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      stockSymbol: "FWRY",
    },
    {
      slug: "egx30-closes-higher-real-estate-rally",
      title: "مؤشر EGX30 يغلق مرتفعًا بدعم من قطاع العقارات",
      excerpt:
        "المؤشر الرئيسي ارتفع مع تصدّر شركات التطوير العقاري المكاسب وسط تحسن شهية المستثمرين.",
      content:
        "أغلق مؤشر EGX30 القياسي مرتفعًا في جلسة يوم الأربعاء، بقيادة مكاسب في شركات التطوير العقاري ومن بينها مجموعة طلعت مصطفى وبالم هيلز للتعمير. وأشار المتداولون إلى تحسن المعنويات حول توقعات المبيعات التعاقدية للقطاع خلال بقية العام.",
      category: "الأسواق",
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
        "مسار قوي لهامش الفائدة الصافي وجودة أصول مرنة يدعمان إعادة تقييم السهم نحو مضاعفات أقرب لنظرائه الإقليميين.",
      riskLevel: "Medium",
      timeHorizon: "٦-١٢ شهرًا",
    },
    {
      symbol: "FWRY",
      action: "ACCUMULATE" as const,
      entryPrice: 6.5,
      targetPrice: 9.0,
      stopLoss: 5.2,
      rationale:
        "توسع شبكة التجار وارتفاع حجم المعاملات يشيران إلى تسارع نمو الإيرادات خلال الأرباع القادمة.",
      riskLevel: "High",
      timeHorizon: "٣-٦ أشهر",
    },
    {
      symbol: "TMGH",
      action: "BUY" as const,
      entryPrice: 13.8,
      targetPrice: 18.5,
      stopLoss: 11.9,
      rationale:
        "زخم المبيعات التعاقدية وخط تسليم صحي يدعمان استمرار نمو الأرباح خلال العام المقبل.",
      riskLevel: "Medium",
      timeHorizon: "١٢ شهرًا",
    },
    {
      symbol: "EAST",
      action: "HOLD" as const,
      entryPrice: 24.3,
      targetPrice: 26.0,
      stopLoss: 21.0,
      rationale:
        "الهوامش لا تزال تحت ضغط تكاليف المدخلات؛ ننتظر إشارات أوضح للقدرة التسعيرية قبل زيادة الوزن النسبي.",
      riskLevel: "Low",
      timeHorizon: "٣ أشهر",
    },
    {
      symbol: "EFIH",
      action: "REDUCE" as const,
      entryPrice: 18.0,
      targetPrice: 14.0,
      stopLoss: 19.5,
      rationale:
        "عدم اليقين الأخير حول تجديد العقود وتباطؤ نمو الإيرادات يستدعيان تقليل حجم المركز.",
      riskLevel: "Medium",
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
      slug: "egx30-technical-outlook-q3",
      title: "التوقعات الفنية لمؤشر EGX30: نطاق الربع الثالث والمستويات الرئيسية",
      type: "فني",
      summary: "المؤشر يتماسك بين نطاقي دعم ومقاومة رئيسيين قبل موسم أرباح الربع الثالث.",
      content:
        "تداول مؤشر EGX30 خلال الأسابيع الماضية في نطاق محدد بوضوح، مسجلًا دعمًا قرب أدنى مستوياته الأخيرة ومواجهًا مقاومة قريبة من المستوى النفسي المستدير أعلاه. أي اختراق حاسم فوق المقاومة بحجم تداول مرتفع سيفتح الطريق نحو نطاق المقاومة التالي، في حين أن الاختراق تحت الدعم سينقل المشهد قصير المدى نحو مزيد من الحذر. ننصح بمراقبة تأكيد حجم التداول عند المستويين بعناية.",
      authorId: analyst.id,
      published: true,
    },
    {
      slug: "banking-sector-fundamental-review",
      title: "مراجعة أساسية لقطاع البنوك: الهوامش لا تزال في توسع",
      type: "أساسي",
      summary: "البنوك المصرية تستمر في الاستفادة من أسعار الفائدة المرتفعة، مع تباطؤ نمو محفظة القروض.",
      content:
        "تُظهر مراجعتنا لقطاع البنوك المسجلة أن هوامش الفائدة الصافية لا تزال مرتفعة قياسًا بمتوسطاتها التاريخية، وهو ما يدعم استمرار نمو الأرباح حتى مع تباطؤ توسع محفظة القروض عن مستوياتها المرتفعة في العام السابق. مؤشرات جودة الأصول لا تزال مستقرة بشكل عام عبر الأسماء التي نغطيها، وإن كنا نتابع اتجاهات المخصصات عن كثب في ظل الخلفية الاقتصادية الكلية الحالية.",
      authorId: analyst.id,
      published: true,
      stockId: bySymbol["COMI"].id,
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
      priceMonthly: 299,
      priceYearly: 2990,
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
      priceMonthly: 799,
      priceYearly: 7990,
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
