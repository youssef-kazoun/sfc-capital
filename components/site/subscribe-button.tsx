"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/primitives";

export default function SubscribeButton({
  packageId,
  billingCycle,
  isFree,
}: {
  packageId: string;
  billingCycle: "monthly" | "yearly";
  isFree: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!session?.user) {
      router.push("/login?callbackUrl=/packages");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId, billingCycle }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "حدث خطأ ما.");
      return;
    }
    if (data.url) {
      router.push(data.url);
    } else {
      router.push("/dashboard/subscription");
    }
  }

  return (
    <div>
      <Button onClick={handleClick} disabled={busy} className="w-full">
        {busy ? "جاري المعالجة..." : isFree ? "ابدأ مجانًا" : "اشترك"}
      </Button>
      {error && <p className="text-xs text-loss mt-2 text-center">{error}</p>}
    </div>
  );
}
