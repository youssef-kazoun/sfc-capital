import { getAllNews } from "@/lib/data";
import { NewsCard } from "@/components/site/cards";
import { SectionHeading } from "@/components/ui/primitives";
import MarketFilterTabs from "@/components/site/market-filter-tabs";

export const metadata = { title: "الأخبار — SFC Capital" };

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ market?: string }>;
}) {
  const { market } = await searchParams;
  const validMarket = market === "SAUDI" || market === "US" ? market : undefined;
  const news = await getAllNews(validMarket);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title="الأخبار" subtitle="أخبار مؤثرة من الأسواق السعودية والأمريكية" />
      <MarketFilterTabs basePath="/news" active={validMarket} />
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
