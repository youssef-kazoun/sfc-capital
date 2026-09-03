import { notFound } from "next/navigation";
import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";
import { getMarketDataProvider } from "@/services/market-data";
import PriceChart from "@/components/site/price-chart";
import StockActions from "@/components/site/stock-actions";
import { NewsCard } from "@/components/site/cards";
import { Badge, PriceChange } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/utils";

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const stockRows = await db
    .select()
    .from(schema.stocks)
    .where(eq(schema.stocks.symbol, symbol.toUpperCase()));
  const stock = stockRows[0];

  if (!stock) notFound();

  const provider = getMarketDataProvider();
  const history = await provider.getHistory(stock.symbol, 90);

  const relatedNewsLinks = await db
    .select({ newsId: schema.newsArticleStocks.newsId })
    .from(schema.newsArticleStocks)
    .where(eq(schema.newsArticleStocks.stockId, stock.id));

  const relatedNews = relatedNewsLinks.length
    ? await db
        .select()
        .from(schema.newsArticles)
        .where(eq(schema.newsArticles.id, relatedNewsLinks[0].newsId))
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-slate">{stock.symbol}</span>
            <Badge>{stock.exchange}</Badge>
            {stock.sector && <Badge tone="gold">{stock.sector}</Badge>}
          </div>
          <h1 className="font-display text-3xl text-ink mt-1">{stock.name}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-display text-3xl text-ink">
              {formatCurrency(stock.lastPrice, stock.currency)}
            </span>
            <PriceChange value={stock.changePct} className="text-base" />
          </div>
        </div>
        <StockActions stockId={stock.id} lastPrice={stock.lastPrice} />
      </div>

      <div className="rounded-sm border border-line bg-white p-5 mb-8">
        <PriceChart data={history.map((h) => ({ date: h.date.slice(5), close: h.close }))} />
      </div>

      <div className="grid sm:grid-cols-4 gap-4 mb-12">
        <StatBox label="Volume" value={stock.volume.toLocaleString()} />
        <StatBox label="Market cap" value={stock.marketCap ? formatCurrency(stock.marketCap, stock.currency) : "—"} />
        <StatBox label="Currency" value={stock.currency} />
        <StatBox label="Exchange" value={stock.exchange} />
      </div>

      {relatedNews.length > 0 && (
        <div>
          <h2 className="font-display text-xl text-ink mb-4">Related news</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedNews.map((n) => (
              <NewsCard key={n.id} article={n} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-line bg-white p-4">
      <div className="text-xs text-slate">{label}</div>
      <div className="font-mono text-lg text-ink mt-1">{value}</div>
    </div>
  );
}
