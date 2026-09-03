import Link from "next/link";
import { ArrowRight, LineChart, ShieldCheck, Newspaper } from "lucide-react";
import { SectionHeading, Button } from "@/components/ui/primitives";
import StockCard from "@/components/site/stock-card";
import { NewsCard, RecommendationCard } from "@/components/site/cards";
import {
  getTrendingStocks,
  getLatestNews,
  getLatestRecommendations,
} from "@/lib/data";

export default async function HomePage() {
  const [stocks, news, recs] = await Promise.all([
    getTrendingStocks(6),
    getLatestNews(3),
    getLatestRecommendations(3),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl leading-tight text-paper">
              Invest with confidence in the Egyptian market
            </h1>
            <p className="mt-5 text-paper/70 text-lg leading-relaxed max-w-md">
              Live quotes, analyst-backed recommendations, and portfolio
              tools built for the EGX — in one platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register">
                <Button variant="primary" className="bg-gold text-ink hover:bg-gold-bright px-6 py-3 text-base">
                  Get started free
                </Button>
              </Link>
              <Link href="/markets">
                <Button variant="secondary" className="border-paper/40 text-paper hover:bg-paper hover:text-ink px-6 py-3 text-base">
                  Explore markets
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stocks.slice(0, 4).map((s) => (
              <div key={s.id} className="rounded-sm border border-paper/15 p-4">
                <div className="font-mono text-xs text-paper/50">{s.symbol}</div>
                <div className="font-display text-xl mt-1">{s.lastPrice.toFixed(2)}</div>
                <div className={s.changePct >= 0 ? "text-gain text-sm" : "text-loss text-sm"}>
                  {s.changePct >= 0 ? "+" : ""}
                  {s.changePct.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-4 py-16 grid sm:grid-cols-3 gap-8">
        {[
          { icon: LineChart, title: "Live market data", body: "Quotes and charts across EGX-listed names, refreshed continuously." },
          { icon: ShieldCheck, title: "Analyst recommendations", body: "Entry, target and stop-loss levels with the reasoning behind each call." },
          { icon: Newspaper, title: "Market news, curated", body: "The stories that actually move Egyptian equities, without the noise." },
        ].map((f) => (
          <div key={f.title}>
            <f.icon className="h-6 w-6 text-gold" strokeWidth={1.75} />
            <h3 className="font-display text-lg mt-3 text-ink">{f.title}</h3>
            <p className="text-sm text-slate mt-1.5 leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>

      {/* Trending stocks */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading
          title="Trending stocks"
          action={
            <Link href="/markets" className="text-sm text-ink/70 hover:text-gold flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((s) => (
            <StockCard key={s.id} stock={s} />
          ))}
        </div>
      </section>

      {/* Latest recommendations */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading
          title="Latest recommendations"
          action={
            <Link href="/recommendations" className="text-sm text-ink/70 hover:text-gold flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recs.map((r) => (
            <RecommendationCard key={r.id} rec={r} />
          ))}
        </div>
      </section>

      {/* Latest news */}
      <section className="mx-auto max-w-6xl px-4 py-12 pb-20">
        <SectionHeading
          title="Latest news"
          action={
            <Link href="/news" className="text-sm text-ink/70 hover:text-gold flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((n) => (
            <NewsCard key={n.id} article={n} />
          ))}
        </div>
      </section>
    </div>
  );
}
