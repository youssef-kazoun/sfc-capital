"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@/components/ui/primitives";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "busy" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("busy");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "sent" : "error");
    if (res.ok) setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-2xl text-ink">Message sent</h1>
        <p className="text-slate mt-2">We'll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-2xl text-ink mb-6">Contact us</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate">Name</label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="text-xs text-slate">Email</label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label className="text-xs text-slate">Phone (optional)</label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="text-xs text-slate">Subject</label>
          <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
        </div>
        <div>
          <label className="text-xs text-slate">Message</label>
          <Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
        </div>
        {status === "error" && <p className="text-sm text-loss">Something went wrong. Please try again.</p>}
        <Button type="submit" className="w-full" disabled={status === "busy"}>
          {status === "busy" ? "Sending..." : "Send message"}
        </Button>
      </form>
    </div>
  );
}
