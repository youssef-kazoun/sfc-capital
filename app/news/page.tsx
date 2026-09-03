import { getAllNews } from "@/lib/data";
import { NewsCard } from "@/components/site/cards";
import { SectionHeading } from "@/components/ui/primitives";

export const metadata = { title: "News — SFC Capital" };

export default async function NewsPage() {
  const news = await getAllNews();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading title="News" subtitle="Market-moving stories from Egypt and the region" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((n) => (
          <NewsCard key={n.id} article={n} />
        ))}
      </div>
    </div>
  );
}
