import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { getMoyasarPublishableKey } from "@/services/payments/moyasar";
import MoyasarCheckout from "@/components/site/moyasar-checkout";
import { SectionHeading } from "@/components/ui/primitives";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const subRows = await db.select().from(schema.subscriptions).where(eq(schema.subscriptions.id, id));
  const subscription = subRows[0];
  if (!subscription || subscription.userId !== user.id) notFound();

  if (subscription.status === "ACTIVE") {
    redirect("/dashboard/subscription");
  }

  const pkgRows = await db.select().from(schema.packages).where(eq(schema.packages.id, subscription.packageId));
  const pkg = pkgRows[0];
  if (!pkg) notFound();

  const amountSar = subscription.billingCycle === "yearly" ? pkg.priceYearlySar : pkg.priceMonthlySar;
  const publishableKey = getMoyasarPublishableKey();

  if (!amountSar || !publishableKey) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-loss">الدفع غير متاح حاليًا لهذه الباقة. يرجى التواصل مع الدعم الفني.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <SectionHeading
        title="إتمام الدفع"
        subtitle={`${pkg.name} — ${amountSar} ريال سعودي / ${subscription.billingCycle === "yearly" ? "سنويًا" : "شهريًا"}`}
      />
      <MoyasarCheckout
        subscriptionId={subscription.id}
        publishableKey={publishableKey}
        amountSar={amountSar}
        description={`${pkg.name} — SFC Capital (${subscription.billingCycle})`}
      />
      <p className="text-xs text-slate mt-4 text-center">
        الدفع مؤمَّن عبر Moyasar، بوابة دفع مرخّصة من البنك المركزي السعودي (ساما).
      </p>
    </div>
  );
}
