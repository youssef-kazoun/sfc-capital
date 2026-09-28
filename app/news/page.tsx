import Link from "next/link";
import { getAllNews, getNewsCategories } from "@/lib/data";
import { NewsCard } from "@/components/site/cards";
import { SectionHeading } from "@/components/ui/primitives";
import MarketFilterTabs from "@/components/site/market-filter-tabs";
import { cn } from "@/lib/utils";

export const metadata = { title: "الأخبار — SFC Capital" };

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ market?: string; category?: string }>;
}) {
  const { market, category } = await searchParams;
  const validMarket = market === "SAUDI" || market === "US" ? market : undefined;
  const [news, categories] = await Promise.all([
    getAllNews(validMarket, category),
    getNewsCategories(),
  ]);

  const qs = validMarket ? `?market=${validMarket}` : "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title="الأخبار" subtitle="أخبار مؤثرة من الأسواق السعودية والأمريكية" />
      <MarketFilterTabs basePath="/news" active={validMarket} />

      {categories.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <Link
            href={`/news${qs}`}
            className={cn(
              "text-xs px-2.5 py-1 rounded-sm border",
              !category ? "border-gold text-gold bg-gold/10" : "border-line text-slate hover:text-ink"
            )}
          >
            كل الفئات
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/news${qs}${qs ? "&" : "?"}category=${encodeURIComponent(c)}`}
              className={cn(
                "text-xs px-2.5 py-1 rounded-sm border",
                category === c ? "border-gold text-gold bg-gold/10" : "border-line text-slate hover:text-ink"
              )}
            >
              {c}
            </Link>
          ))}
        </div>
      )}

      {news.length === 0 ? (
        <p className="text-slate">لا توجد أخبار في هذا القسم حاليًا.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((n) => (
            <NewsCard key={n.id} article={n} />
          ))}
        </div>
      )}
    </div>
  );
}
