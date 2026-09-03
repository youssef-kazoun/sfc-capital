import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { getPaymentProvider } from "@/services/payments";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { packageId, billingCycle } = await req.json();
  const pkgRows = await db.select().from(schema.packages).where(eq(schema.packages.id, packageId));
  const pkg = pkgRows[0];
  if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });

  const amount = billingCycle === "yearly" ? pkg.priceYearly : pkg.priceMonthly;

  const [subscription] = await db
    .insert(schema.subscriptions)
    .values({
      userId: session.user.id,
      packageId: pkg.id,
      billingCycle: billingCycle || "monthly",
      status: amount === 0 ? "ACTIVE" : "PENDING",
    })
    .returning();

  if (amount > 0) {
    const provider = getPaymentProvider();
    const charge = await provider.charge({
      amount,
      currency: "EGP",
      description: `${pkg.name} subscription (${billingCycle})`,
    });

    await db.insert(schema.payments).values({
      subscriptionId: subscription.id,
      amount,
      status: charge.status,
      provider: "mock",
      providerRef: charge.providerRef,
    });

    if (charge.success) {
      await db
        .update(schema.subscriptions)
        .set({ status: "ACTIVE" })
        .where(eq(schema.subscriptions.id, subscription.id));
    }
  }

  return NextResponse.json({ subscriptionId: subscription.id }, { status: 201 });
}
