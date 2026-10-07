"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/primitives";

declare global {
  interface Window {
    Moyasar?: { init: (config: Record<string, unknown>) => void };
  }
}

export default function MoyasarCheckout({
  subscriptionId,
  publishableKey,
  amountSar,
  description,
}: {
  subscriptionId: string;
  publishableKey: string;
  amountSar: number;
  description: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading-form" | "ready" | "verifying" | "success" | "error">(
    "loading-form"
  );
  const [error, setError] = useState<string | null>(null);

  // After Moyasar redirects back here with a payment id, verify it server-side.
  useEffect(() => {
    const paymentId = searchParams.get("id");
    if (!paymentId) return;

    setStatus("verifying");
    fetch("/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId, moyasarPaymentId: paymentId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.ok) {
          setStatus("success");
          setTimeout(() => router.push("/dashboard/subscription"), 1500);
        } else {
          setStatus("error");
          setError(data.error || "لم يتم تأكيد الدفعة.");
        }
      })
      .catch(() => {
        setStatus("error");
        setError("تعذّر الاتصال بالخادم للتحقق من الدفعة.");
      });
  }, [searchParams, subscriptionId, router]);

  // Load the Moyasar Payment Form widget when no payment id is present yet.
  useEffect(() => {
    if (searchParams.get("id")) return;

    const cssId = "moyasar-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.css";
      document.head.appendChild(link);
    }

    const scriptId = "moyasar-js";
    const initForm = () => {
      if (!window.Moyasar || !formRef.current) return;
      window.Moyasar.init({
        element: formRef.current,
        amount: Math.round(amountSar * 100),
        currency: "SAR",
        description,
        publishable_api_key: publishableKey,
        callback_url: window.location.href,
        methods: ["creditcard"],
      });
      setStatus("ready");
    };

    if (document.getElementById(scriptId)) {
      initForm();
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.js";
    script.onload = initForm;
    document.body.appendChild(script);
  }, [searchParams, amountSar, description, publishableKey]);

  if (status === "verifying") {
    return <Card className="text-center py-10 text-slate">جاري التحقق من الدفعة...</Card>;
  }
  if (status === "success") {
    return <Card className="text-center py-10 text-gain">تم تأكيد الدفعة بنجاح! جاري تحويلك...</Card>;
  }
  if (status === "error") {
    return (
      <Card className="text-center py-10">
        <p className="text-loss mb-2">{error}</p>
        <p className="text-sm text-slate">إذا تم خصم مبلغ من حسابك، تواصل مع الدعم الفني فورًا.</p>
      </Card>
    );
  }

  return (
    <Card>
      {status === "loading-form" && <p className="text-slate text-center py-6">جاري تحميل نموذج الدفع...</p>}
      <div ref={formRef} className="mysr-form" />
    </Card>
  );
}
