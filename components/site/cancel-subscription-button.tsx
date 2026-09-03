"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/primitives";

export default function CancelSubscriptionButton({ subscriptionId }: { subscriptionId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleCancel() {
    if (!confirm("Cancel your subscription?")) return;
    setBusy(true);
    await fetch("/api/subscription/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: subscriptionId }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <Button variant="danger" onClick={handleCancel} disabled={busy}>
      {busy ? "Canceling..." : "Cancel subscription"}
    </Button>
  );
}
