/**
 * Moyasar (https://moyasar.com) is a SAMA-licensed Saudi payment gateway
 * that settles directly to Saudi bank accounts in SAR. Unlike Stripe,
 * Saudi Arabia is not a Stripe-supported settlement country, so Moyasar
 * (or another SAMA-licensed Saudi gateway) is the correct choice for a
 * business that needs real riyals landing in a real Saudi bank account.
 *
 * Moyasar's card/Apple Pay/STC Pay flow is client-side: the browser submits
 * card details directly to Moyasar via their hosted "Payment Form" JS
 * widget (so raw card numbers never touch our server — good for PCI scope).
 * Our server's job is only to:
 *   1. Create a pending subscription + know the expected amount/currency.
 *   2. After Moyasar redirects the browser back with a payment id, fetch
 *      that payment from Moyasar's API server-side and verify status,
 *      amount and currency match what we expect before activating anything.
 *
 * This file only handles step 2 (server-side verification). The Payment
 * Form itself is rendered in app/checkout/[subscriptionId]/page.tsx.
 */

export interface MoyasarPayment {
  id: string;
  status: "initiated" | "paid" | "failed" | "authorized" | "captured" | "refunded" | "voided";
  amount: number; // in halalas (SAR * 100)
  currency: string;
  description?: string;
  source?: { type: string };
}

export function isMoyasarConfigured(): boolean {
  return !!process.env.MOYASAR_SECRET_KEY;
}

export function getMoyasarPublishableKey(): string | null {
  return process.env.MOYASAR_PUBLISHABLE_KEY || null;
}

/**
 * Fetches a payment from Moyasar's API using the secret key (Basic Auth,
 * secret key as username, empty password — Moyasar's documented scheme).
 */
export async function fetchMoyasarPayment(paymentId: string): Promise<MoyasarPayment> {
  const secretKey = process.env.MOYASAR_SECRET_KEY;
  if (!secretKey) throw new Error("MOYASAR_SECRET_KEY is not set");

  const res = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Moyasar payment lookup failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Verifies a Moyasar payment actually succeeded and matches the amount
 * (in SAR, not halalas) and currency we expected to charge. Always verify
 * server-side like this before activating anything — never trust the
 * client-side redirect alone.
 */
export async function verifyMoyasarPayment(
  paymentId: string,
  expectedAmountSar: number,
  expectedCurrency = "SAR"
): Promise<{ ok: boolean; payment: MoyasarPayment }> {
  const payment = await fetchMoyasarPayment(paymentId);
  const expectedHalalas = Math.round(expectedAmountSar * 100);

  const ok =
    payment.status === "paid" &&
    payment.amount === expectedHalalas &&
    payment.currency === expectedCurrency;

  return { ok, payment };
}
