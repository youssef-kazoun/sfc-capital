"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  Select,
  Badge,
  SectionHeading,
  Button,
} from "@/components/ui/primitives";
import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";

interface StockOption {
  id: string;
  symbol: string;
  name: string;
}

interface CheckResult {
  symbol: string;
  name: string;
  status: "COMPLIANT" | "REVIEW" | "NOT_COMPLIANT" | "UNKNOWN";
  statusLabel: string;
  reasons: string[];
}

type StatusStyle = {
  icon: typeof ShieldCheck;
  tone: "gain" | "gold" | "loss" | "neutral";
};

const STATUS_STYLES: Record<string, StatusStyle> = {
  COMPLIANT: { icon: ShieldCheck, tone: "gain" },
  REVIEW: { icon: ShieldQuestion, tone: "gold" },
  NOT_COMPLIANT: { icon: ShieldAlert, tone: "loss" },
  UNKNOWN: { icon: ShieldQuestion, tone: "neutral" },
};

function ShariahCheckerContent() {
  const searchParams = useSearchParams();
  const preselect = searchParams.get("symbol");
  const [stocks, setStocks] = useState<StockOption[]>([]);
  const [symbol, setSymbol] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/stocks")
      .then((r) => r.json())
      .then((rows: StockOption[]) => {
        setStocks(rows);

        if (preselect) {
          setSymbol(preselect);
        } else if (rows[0]) {
          setSymbol(rows[0].symbol);
        }
      });
  }, [preselect]);

  async function check() {
    if (!symbol) return;

    setBusy(true);

    const res = await fetch(`/api/shariah-check?symbol=${symbol}`);

    if (res.ok) {
      setResult(await res.json());
    }

    setBusy(false);
  }

  const style = result ? STATUS_STYLES[result.status] : null;
  const Icon = style?.icon;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <SectionHeading
        title="فحص شرعية السهم"
        subtitle="فحص تقريبي لمدى توافق السهم مع الضوابط الشرعية بناءً على نسبه المالية"
      />

      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-slate">اختر السهم</label>

            <Select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            >
              {stocks.map((s) => (
                <option key={s.id} value={s.symbol}>
                  {s.symbol} — {s.name}
                </option>
              ))}
            </Select>
          </div>

          <Button onClick={check} disabled={busy}>
            {busy ? "جاري الفحص..." : "فحص السهم"}
          </Button>
        </div>
      </Card>

      {result && style && (
        <Card>
          <div className="flex items-center gap-3 mb-4">
            {Icon && (
              <Icon
                className={`h-8 w-8 ${
                  result.status === "COMPLIANT"
                    ? "text-gain"
                    : result.status === "NOT_COMPLIANT"
                      ? "text-loss"
                      : "text-gold"
                }`}
              />
            )}

            <div>
              <div className="font-mono text-xs text-slate">
                {result.symbol}
              </div>

              <div className="font-display text-lg text-ink">
                {result.name}
              </div>
            </div>

            <Badge tone={style.tone}>
              {result.statusLabel}
            </Badge>
          </div>

          <ul className="space-y-2 text-sm text-ink/80">
            {result.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-gold mt-0.5">•</span>
                {r}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p className="text-xs text-slate mt-6 leading-relaxed">
        هذا فحص تقريبي آلي يعتمد على نسب مالية محدودة، وليس فتوى شرعية
        رسمية. للحصول على رأي شرعي معتمد يرجى الرجوع لهيئة شرعية مرخّصة.
        اقرأ{" "}
        <Link href="/disclaimer" className="text-gold underline">
          إخلاء المسؤولية الكامل
        </Link>
        .
      </p>
    </div>
  );
}

export default function ShariahCheckerPage() {
  return (
    <Suspense>
      <ShariahCheckerContent />
    </Suspense>
  );
}