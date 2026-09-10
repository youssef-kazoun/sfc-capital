import { db, schema } from "@/db";
import { count, eq } from "drizzle-orm";
import { Card } from "@/components/ui/primitives";

export default async function AdminOverviewPage() {
  const [[users], [stocks], [news], [recs], [openTickets], [activeSubs]] = await Promise.all([
    db.select({ c: count() }).from(schema.users),
    db.select({ c: count() }).from(schema.stocks),
    db.select({ c: count() }).from(schema.newsArticles),
    db.select({ c: count() }).from(schema.recommendations).where(eq(schema.recommendations.status, "OPEN")),
    db.select({ c: count() }).from(schema.tickets).where(eq(schema.tickets.status, "OPEN")),
    db.select({ c: count() }).from(schema.subscriptions).where(eq(schema.subscriptions.status, "ACTIVE")),
  ]);

  const stats = [
    { label: "المستخدمون", value: users.c },
    { label: "الأسهم المسجلة", value: stocks.c },
    { label: "المقالات الإخبارية", value: news.c },
    { label: "التوصيات المفتوحة", value: recs.c },
    { label: "طلبات الدعم المفتوحة", value: openTickets.c },
    { label: "الاشتراكات النشطة", value: activeSubs.c },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">نظرة عامة للإدارة</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="font-display text-2xl text-ink">{s.value}</div>
            <div className="text-sm text-slate">{s.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
