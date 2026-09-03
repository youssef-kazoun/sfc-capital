import { notFound } from "next/navigation";
import Link from "next/link";
import { getRecommendationById } from "@/lib/data";
import { Badge } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

export default async function RecommendationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getRecommendationById(id);
  if (!data || !data.stock) notFound();

  const { rec, stock, updates, author } = data;
  const tone =
    rec.action === "BUY" || rec.action === "ACCUMULATE"
      ? "gain"
      : rec.action === "SELL" || rec.action === "REDUCE"
      ? "loss"
      : "neutral";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link href={`/stocks/${stock.symbol}`} className="font-mono text-xs text-slate hover:text-gold">
        {stock.symbol}
      </Link>
      <div className="flex items-center gap-3 mt-1">
        <h1 className="font-display text-2xl text-ink">{stock.name}</h1>
        <Badge tone={tone as any}>{rec.action}</Badge>
        <Badge tone={rec.status === "OPEN" ? "gain" : "neutral"}>{rec.status}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 mb-8">
        <Stat label="Entry" value={rec.entryPrice} />
        <Stat label="Target" value={rec.targetPrice} tone="text-gain" />
        <Stat label="Stop loss" value={rec.stopLoss} tone="text-loss" />
      </div>

      <div className="flex gap-4 text-sm text-slate mb-6">
        <span>Risk: {rec.riskLevel}</span>
        <span>Horizon: {rec.timeHorizon}</span>
        {author && <span>By {author.name}</span>}
        <span>{formatDate(rec.createdAt)}</span>
      </div>

      <p className="text-ink/90 leading-relaxed">{rec.rationale}</p>

      {updates.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg text-ink mb-4">Updates</h2>
          <div className="space-y-4">
            {updates.map((u) => (
              <div key={u.id} className="border-l-2 border-gold pl-4">
                <div className="text-xs text-slate">{formatDate(u.createdAt)}</div>
                <p className="text-sm text-ink/90 mt-1">{u.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-sm border border-line bg-white p-4 text-center">
      <div className="text-xs text-slate">{label}</div>
      <div className={`font-mono text-lg mt-1 ${tone || "text-ink"}`}>{value}</div>
    </div>
  );
}
