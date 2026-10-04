export interface ChargeResult {
  success: boolean;
  providerRef: string;
  status: "SUCCEEDED" | "FAILED" | "PENDING";
}

export interface PaymentProvider {
  charge(params: {
    amount: number;
    currency: string;
    description: string;
  }): Promise<ChargeResult>;
}

/**
 * MockPaymentProvider always "succeeds" instantly so the subscription flow
 * (packages -> checkout -> active subscription) is fully testable end to end
 * without a live payment gateway contract. Swap for a real Paymob/Fawry/Stripe
 * adapter here once credentials exist (PAYMENT_API_KEY / PAYMENT_API_SECRET).
 */
class MockPaymentProvider implements PaymentProvider {
  async charge({ amount, currency }: { amount: number; currency: string; description: string }): Promise<ChargeResult> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      success: true,
      providerRef: `mock_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
      status: "SUCCEEDED",
    };
  }
}

let instance: PaymentProvider | null = null;
export function getPaymentProvider(): PaymentProvider {
  if (!instance) {
    instance = new MockPaymentProvider();
  }
  return instance;
}
