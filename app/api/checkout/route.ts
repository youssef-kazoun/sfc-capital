import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { isMoyasarConfigured } from "@/services/payments/moyasar";
import { getPaymentProvider } from "@/services/payments";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "غير مصرح بالدخول" }, { status: 401 });

  const { packageId, billingCycle } = await req.json();
  const pkgRows = await db.select().from(schema.packages).where(eq(schema.packages.id, packageId));
  const pkg = pkgRows[0];
  if (!pkg) return NextResponse.json({ error: "الباقة غير موجودة" }, { status: 404 });

  const cycle = billingCycle === "yearly" ? "yearly" : "monthly";
  const displayAmount = cycle === "yearly" ? pkg.priceYearly : pkg.priceMonthly;
  const sarAmount = cycle === "yearly" ? pkg.priceYearlySar : pkg.priceMonthlySar;

  // Free plan: activate immediately, no payment needed.
  if (displayAmount === 0) {
    const [subscription] = await db
      .insert(schema.subscriptions)
      .values({ userId: session.user.id, packageId: pkg.id, billingCycle: cycle, status: "ACTIVE" })
      .returning();
    return NextResponse.json({ subscriptionId: subscription.id }, { status: 201 });
  }

  // ---- Real Moyasar checkout (when MOYASAR_SECRET_KEY is configured) ----
  if (isMoyasarConfigured()) {
    if (!sarAmount || sarAmount <= 0) {
      return NextResponse.json(
        { error: "لم يتم تحديد سعر بالريال السعودي لهذه الباقة بعد. يرجى التواصل مع الدعم." },
        { status: 400 }
      );
    }

    const [subscription] = await db
      .insert(schema.subscriptions)
      .values({ userId: session.user.id, packageId: pkg.id, billingCycle: cycle, status: "PENDING" })
      .returning();

    // The actual card form is rendered client-side on /checkout/[id] using
    // Moyasar's Payment Form widget, so we just hand back where to go next.
    return NextResponse.json(
      { subscriptionId: subscription.id, url: `/checkout/${subscription.id}` },
      { status: 201 }
    );
  }

  // ---- Mock flow fallback (no Moyasar configured — e.g. local/dev) ----
  const [subscription] = await db
    .insert(schema.subscriptions)
    .values({ userId: session.user.id, packageId: pkg.id, billingCycle: cycle, status: "PENDING" })
    .returning();

  const provider = getPaymentProvider();
  const charge = await provider.charge({
    amount: displayAmount,
    currency: "USD",
    description: `${pkg.name} subscription (${cycle})`,
  });

  await db.insert(schema.payments).values({
    subscriptionId: subscription.id,
    amount: displayAmount,
    status: charge.status,
    provider: "mock",
    providerRef: charge.providerRef,
  });

  if (charge.success) {
    await db.update(schema.subscriptions).set({ status: "ACTIVE" }).where(eq(schema.subscriptions.id, subscription.id));
  }

  return NextResponse.json({ subscriptionId: subscription.id }, { status: 201 });
}
