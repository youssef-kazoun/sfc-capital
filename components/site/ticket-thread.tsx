"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Textarea } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  body: string;
  createdAt: string;
  authorName: string;
  authorRole: string;
}
interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
}

export default function TicketThread({ ticketId, isStaff }: { ticketId: string; isStaff?: boolean }) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch(`/api/tickets/${ticketId}`);
    if (res.ok) {
      const data = await res.json();
      setTicket(data.ticket);
      setMessages(data.messages);
    }
  }

  useEffect(() => {
    load();
  }, [ticketId]);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setBusy(true);
    await fetch(`/api/tickets/${ticketId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply }),
    });
    setReply("");
    setBusy(false);
    load();
  }

  async function updateStatus(status: string) {
    await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (!ticket) return <p className="text-slate">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">{ticket.subject}</h1>
        <Badge tone={ticket.status === "RESOLVED" || ticket.status === "CLOSED" ? "neutral" : "gain"}>
          {ticket.status.replace("_", " ")}
        </Badge>
      </div>

      {isStaff && (
        <div className="flex gap-2 mb-6">
          {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              className={`text-xs px-2 py-1 rounded-sm border ${
                ticket.status === s ? "border-gold text-gold" : "border-line text-slate"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {messages.map((m) => (
          <div key={m.id} className="rounded-sm border border-line bg-white p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-ink">
                {m.authorName} {m.authorRole !== "CUSTOMER" && <Badge tone="gold">Staff</Badge>}
              </span>
              <span className="text-xs text-slate">{formatDate(m.createdAt)}</span>
            </div>
            <p className="text-sm text-ink/90">{m.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={sendReply} className="space-y-2">
        <Textarea rows={3} placeholder="Write a reply..." value={reply} onChange={(e) => setReply(e.target.value)} />
        <Button type="submit" disabled={busy}>
          {busy ? "Sending..." : "Send reply"}
        </Button>
      </form>
    </div>
  );
}
