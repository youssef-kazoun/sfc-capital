import { getAllRecommendations } from "@/lib/data";
import { RecommendationCard } from "@/components/site/cards";
import { SectionHeading } from "@/components/ui/primitives";

export const metadata = { title: "التوصيات — SFC Capital" };

export default async function RecommendationsPage() {
  const recs = await getAllRecommendations();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="التوصيات"
        subtitle="مستويات الدخول، الهدف، ووقف الخسارة من فريق البحث"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recs.map((r) => (
          <RecommendationCard key={r.id} rec={r} />
        ))}
      </div>
    </div>
  );
}
