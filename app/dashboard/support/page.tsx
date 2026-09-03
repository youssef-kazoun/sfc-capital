"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Button, Input, Textarea } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  updatedAt: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/tickets");
    if (res.ok) setTickets(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });
    setBusy(false);
    setShowForm(false);
    setSubject("");
    setMessage("");
    load();
  }

  if (tickets === null) return <p className="text-slate">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Support</h1>
        <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
          <span className="flex items-center gap-1.5"><Plus className="h-4 w-4" /> New ticket</span>
        </Button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="rounded-sm border border-line bg-white p-4 mb-6 space-y-3">
          <div>
            <label className="text-xs text-slate">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs text-slate">Message</label>
            <Textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <Button type="submit" disabled={busy}>{busy ? "Submitting..." : "Submit ticket"}</Button>
        </form>
      )}

      {tickets.length === 0 ? (
        <div className="rounded-sm border border-dashed border-line p-10 text-center text-slate">
          No support tickets yet.
        </div>
      ) : (
        <div className="rounded-sm border border-line bg-white divide-y divide-line">
          {tickets.map((t) => (
            <Link key={t.id} href={`/dashboard/support/${t.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-paper-dim">
              <div>
                <div className="font-medium text-ink">{t.subject}</div>
                <div className="text-xs text-slate">Updated {formatDate(t.updatedAt)}</div>
              </div>
              <Badge tone={t.status === "RESOLVED" || t.status === "CLOSED" ? "neutral" : "gain"}>
                {t.status.replace("_", " ")}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
