import Link from "next/link";
import { Badge } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

export function NewsCard({
  article,
}: {
  article: {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    publishedAt: string | null;
  };
}) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="block rounded-sm border border-line bg-white p-5 hover:border-gold transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge tone="gold">{article.category}</Badge>
        {article.publishedAt && (
          <span className="text-xs text-slate">{formatDate(article.publishedAt)}</span>
        )}
      </div>
      <h3 className="font-display text-lg text-ink leading-snug">{article.title}</h3>
      <p className="text-sm text-slate mt-2 line-clamp-2">{article.excerpt}</p>
    </Link>
  );
}

const ACTION_LABELS: Record<string, string> = {
  BUY: "شراء",
  SELL: "بيع",
  HOLD: "احتفاظ",
  ACCUMULATE: "تجميع",
  REDUCE: "تخفيف",
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: "مفتوحة",
  CLOSED: "مغلقة",
  EXPIRED: "منتهية",
};

const RISK_LABELS: Record<string, string> = {
  Low: "منخفضة",
  Medium: "متوسطة",
  High: "عالية",
};

export function RecommendationCard({
  rec,
}: {
  rec: {
    id: string;
    action: string;
    entryPrice: number;
    targetPrice: number;
    stopLoss: number;
    status: string;
    riskLevel: string;
    stockSymbol: string;
    stockName: string;
  };
}) {
  const tone =
    rec.action === "BUY" || rec.action === "ACCUMULATE"
      ? "gain"
      : rec.action === "SELL" || rec.action === "REDUCE"
      ? "loss"
      : "neutral";

  return (
    <Link
      href={`/recommendations/${rec.id}`}
      className="block rounded-sm border border-line bg-white p-5 hover:border-gold transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-mono text-xs text-slate">{rec.stockSymbol}</div>
          <div className="font-medium text-ink">{rec.stockName}</div>
        </div>
        <Badge tone={tone as any}>{ACTION_LABELS[rec.action] || rec.action}</Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="text-slate">الدخول</div>
          <div className="font-mono font-medium text-ink">{rec.entryPrice}</div>
        </div>
        <div>
          <div className="text-slate">الهدف</div>
          <div className="font-mono font-medium text-gain">{rec.targetPrice}</div>
        </div>
        <div>
          <div className="text-slate">وقف الخسارة</div>
          <div className="font-mono font-medium text-loss">{rec.stopLoss}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Badge>مخاطرة {RISK_LABELS[rec.riskLevel] || rec.riskLevel}</Badge>
        <Badge tone={rec.status === "OPEN" ? "gain" : "neutral"}>{STATUS_LABELS[rec.status] || rec.status}</Badge>
      </div>
    </Link>
  );
}
