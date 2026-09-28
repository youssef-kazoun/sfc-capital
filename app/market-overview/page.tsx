import Link from "next/link";
import { getMarketOverview } from "@/lib/data";
import { SectionHeading } from "@/components/ui/primitives";
import { PriceChange } from "@/components/ui/primitives";
import { formatPct } from "@/lib/utils";

export const metadata = { title: "نظرة عامة على السوق — SFC Capital" };

export default async function MarketOverviewPage() {
  const { topGainers, topLosers, mostActive, sectors, saudiAvg, usAvg, saudiCount, usCount } =
    await getMarketOverview();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title="نظرة عامة على السوق" subtitle="أداء السوق السعودي والأمريكي اليوم" />

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="rounded-sm border border-line bg-white p-5">
          <div className="text-sm text-slate mb-1">السوق السعودي (تداول) — {saudiCount} أسهم</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-ink">متوسط التغيّر</span>
            <PriceChange value={saudiAvg} className="text-lg" />
          </div>
        </div>
        <div className="rounded-sm border border-line bg-white p-5">
          <div className="text-sm text-slate mb-1">السوق الأمريكي (ناسداك/نيويورك) — {usCount} أسهم</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-ink">متوسط التغيّر</span>
            <PriceChange value={usAvg} className="text-lg" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        <StockRankList title="الأكثر ارتفاعًا" stocks={topGainers} />
        <StockRankList title="الأكثر انخفاضًا" stocks={topLosers} />
        <StockRankList title="الأكثر تداولًا" stocks={mostActive} showVolume />
      </div>

      <h2 className="font-display text-xl text-ink mb-4">أداء القطاعات</h2>
      <div className="rounded-sm border border-line bg-white divide-y divide-line">
        {sectors
          .sort((a, b) => b.avgChange - a.avgChange)
          .map((s) => (
            <div key={s.sector} className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="font-medium text-ink">{s.sector}</span>
                <span className="text-xs text-slate mr-2">({s.count} أسهم)</span>
              </div>
              <PriceChange value={s.avgChange} />
            </div>
          ))}
      </div>
    </div>
  );
}

function StockRankList({
  title,
  stocks,
  showVolume,
}: {
  title: string;
  stocks: { id: string; symbol: string; name: string; changePct: number; volume: number }[];
  showVolume?: boolean;
}) {
  return (
    <div>
      <h3 className="font-display text-lg text-ink mb-3">{title}</h3>
      <div className="rounded-sm border border-line bg-white divide-y divide-line">
        {stocks.map((s) => (
          <Link
            key={s.id}
            href={`/stocks/${s.symbol}`}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-paper-dim"
          >
            <div>
              <div className="font-mono text-xs text-slate">{s.symbol}</div>
              <div className="text-sm text-ink">{s.name}</div>
            </div>
            {showVolume ? (
              <span className="text-xs font-mono text-slate">{s.volume.toLocaleString()}</span>
            ) : (
              <PriceChange value={s.changePct} />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
