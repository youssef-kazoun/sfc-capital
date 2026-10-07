import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { verifyMoyasarPayment } from "@/services/payments/moyasar";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "غير مصرح بالدخول" }, { status: 401 });

  const { subscriptionId, moyasarPaymentId } = await req.json();
  if (!subscriptionId || !moyasarPaymentId) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const subRows = await db
    .select()
    .from(schema.subscriptions)
    .where(and(eq(schema.subscriptions.id, subscriptionId), eq(schema.subscriptions.userId, session.user.id)));
  const subscription = subRows[0];
  if (!subscription) return NextResponse.json({ error: "غير موجود" }, { status: 404 });

  if (subscription.status === "ACTIVE") {
    return NextResponse.json({ ok: true, alreadyActive: true });
  }

  const pkgRows = await db.select().from(schema.packages).where(eq(schema.packages.id, subscription.packageId));
  const pkg = pkgRows[0];
  if (!pkg) return NextResponse.json({ error: "الباقة غير موجودة" }, { status: 404 });

  const expectedSar =
    subscription.billingCycle === "yearly" ? pkg.priceYearlySar : pkg.priceMonthlySar;
  if (!expectedSar) {
    return NextResponse.json({ error: "تعذّر التحقق من السعر" }, { status: 400 });
  }

  let result;
  try {
    result = await verifyMoyasarPayment(moyasarPaymentId, expectedSar);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "تعذّر التحقق من الدفعة مع Moyasar" }, { status: 502 });
  }

  await db.insert(schema.payments).values({
    subscriptionId: subscription.id,
    amount: expectedSar,
    currency: "SAR",
    status: result.ok ? "SUCCEEDED" : "FAILED",
    provider: "moyasar",
    moyasarPaymentId,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "لم يتم التحقق من نجاح الدفعة. إذا تم خصم المبلغ، تواصل مع الدعم." },
      { status: 402 }
    );
  }

  await db
    .update(schema.subscriptions)
    .set({ status: "ACTIVE" })
    .where(eq(schema.subscriptions.id, subscription.id));

  return NextResponse.json({ ok: true });
}
