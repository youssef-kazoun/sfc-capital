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

  async function handleClick() {
    if (!session?.user) {
      router.push("/login?callbackUrl=/packages");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId, billingCycle }),
    });
    setBusy(false);
    if (res.ok) router.push("/dashboard/subscription");
  }

  return (
    <Button onClick={handleClick} disabled={busy} className="w-full">
      {busy ? "Processing..." : isFree ? "Start free" : "Subscribe"}
    </Button>
  );
}
