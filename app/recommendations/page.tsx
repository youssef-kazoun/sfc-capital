import { getAllRecommendations } from "@/lib/data";
import { RecommendationCard } from "@/components/site/cards";
import { SectionHeading } from "@/components/ui/primitives";
import MarketFilterTabs from "@/components/site/market-filter-tabs";

export const metadata = { title: "التوصيات — SFC Capital" };

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ market?: string }>;
}) {
  const { market } = await searchParams;
  const validMarket = market === "SAUDI" || market === "US" ? market : undefined;
  const recs = await getAllRecommendations(validMarket);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="التوصيات"
        subtitle="مستويات الدخول، الهدف، ووقف الخسارة من فريق البحث"
      />
      <MarketFilterTabs basePath="/recommendations" active={validMarket} />
      {recs.length === 0 ? (
        <p className="text-slate">لا توجد توصيات في هذا القسم حاليًا.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recs.map((r) => (
  <RecommendationCard
    key={r.id}
    rec={{
      ...r,
      stockSymbol: r.stockSymbol ?? "",
      stockName: r.stockName ?? "",
    }}
  />
))}
        </div>
      )}
    </div>
  );
}
