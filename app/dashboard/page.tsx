import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import { db, schema } from "@/db";
import { eq, count } from "drizzle-orm";
import { Card } from "@/components/ui/primitives";
import { Star, Briefcase, Bell, ArrowLeft } from "lucide-react";

export default async function DashboardOverviewPage() {
  const user = await requireUser();

  const [[watchlistCount], [portfolioCount], [alertsCount], subscriptionRows] = await Promise.all([
    db.select({ c: count() }).from(schema.watchlistItems).where(eq(schema.watchlistItems.userId, user.id)),
    db.select({ c: count() }).from(schema.portfolioItems).where(eq(schema.portfolioItems.userId, user.id)),
    db.select({ c: count() }).from(schema.alerts).where(eq(schema.alerts.userId, user.id)),
    db
      .select({ status: schema.subscriptions.status, name: schema.packages.name })
      .from(schema.subscriptions)
      .leftJoin(schema.packages, eq(schema.subscriptions.packageId, schema.packages.id))
      .where(eq(schema.subscriptions.userId, user.id)),
  ]);
  const subscription = subscriptionRows[0] ?? null;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">نظرة عامة</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Star} label="قائمة المتابعة" value={watchlistCount.c} href="/dashboard/watchlist" />
        <StatCard icon={Briefcase} label="مراكز المحفظة" value={portfolioCount.c} href="/dashboard/portfolio" />
        <StatCard icon={Bell} label="التنبيهات النشطة" value={alertsCount.c} href="/dashboard/alerts" />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate">الباقة الحالية</div>
            <div className="font-display text-lg text-ink">{subscription?.name || "الباقة الأساسية (مجانية)"}</div>
          </div>
          <Link href="/dashboard/subscription" className="text-sm text-gold flex items-center gap-1">
            إدارة <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link href={href} className="block rounded-sm border border-line bg-white p-5 hover:border-gold transition-colors">
      <Icon className="h-5 w-5 text-gold mb-3" />
      <div className="font-display text-2xl text-ink">{value}</div>
      <div className="text-sm text-slate">{label}</div>
    </Link>
  );
}
