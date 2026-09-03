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
    { label: "Users", value: users.c },
    { label: "Listed stocks", value: stocks.c },
    { label: "News articles", value: news.c },
    { label: "Open recommendations", value: recs.c },
    { label: "Open tickets", value: openTickets.c },
    { label: "Active subscriptions", value: activeSubs.c },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Admin overview</h1>
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
