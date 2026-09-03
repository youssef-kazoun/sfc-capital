import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { formatCurrency, formatDate } from "@/lib/utils";
import CancelSubscriptionButton from "@/components/site/cancel-subscription-button";

export default async function SubscriptionPage() {
  const user = await requireUser();

  const subscriptionRows = await db
    .select({
      id: schema.subscriptions.id,
      status: schema.subscriptions.status,
      billingCycle: schema.subscriptions.billingCycle,
      startedAt: schema.subscriptions.startedAt,
      packageName: schema.packages.name,
      priceMonthly: schema.packages.priceMonthly,
    })
    .from(schema.subscriptions)
    .leftJoin(schema.packages, eq(schema.subscriptions.packageId, schema.packages.id))
    .where(eq(schema.subscriptions.userId, user.id))
    .orderBy(desc(schema.subscriptions.startedAt));
  const subscription = subscriptionRows[0] ?? null;

  const payments = subscription
    ? await db
        .select()
        .from(schema.payments)
        .where(eq(schema.payments.subscriptionId, subscription.id))
        .orderBy(desc(schema.payments.createdAt))
    : [];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Subscription</h1>

      {!subscription ? (
        <div className="rounded-sm border border-dashed border-line p-10 text-center text-slate">
          You're on the free Starter plan.
          <div className="mt-4">
            <Link href="/packages">
              <Button variant="secondary">View packages</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate">Current plan</div>
                <div className="font-display text-xl text-ink">{subscription.packageName}</div>
                <div className="text-sm text-slate mt-1">
                  Started {formatDate(subscription.startedAt)} · {subscription.billingCycle}
                </div>
              </div>
              <Badge tone={subscription.status === "ACTIVE" ? "gain" : "neutral"}>{subscription.status}</Badge>
            </div>
            {subscription.status === "ACTIVE" && (
              <div className="mt-4">
                <CancelSubscriptionButton subscriptionId={subscription.id} />
              </div>
            )}
          </Card>

          {payments.length > 0 && (
            <div>
              <h2 className="font-display text-lg text-ink mb-3">Payment history</h2>
              <div className="rounded-sm border border-line bg-white divide-y divide-line">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span>{formatDate(p.createdAt)}</span>
                    <span className="font-mono">{formatCurrency(p.amount, p.currency)}</span>
                    <Badge tone={p.status === "SUCCEEDED" ? "gain" : "neutral"}>{p.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
