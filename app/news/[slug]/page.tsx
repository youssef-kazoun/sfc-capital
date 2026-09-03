import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/data";
import { Badge } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article || !article.published) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex items-center gap-2 mb-3">
        <Badge tone="gold">{article.category}</Badge>
        {article.publishedAt && (
          <span className="text-xs text-slate">{formatDate(article.publishedAt)}</span>
        )}
      </div>
      <h1 className="font-display text-3xl text-ink leading-tight">{article.title}</h1>
      <p className="text-slate mt-4 text-lg leading-relaxed">{article.excerpt}</p>
      <div className="mt-8 prose-content text-ink/90 leading-relaxed space-y-4">
        {article.content.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
