import { notFound } from "next/navigation";
import { getNewsBySlug, getRelatedArticles, getUserById } from "@/lib/data";
import { NewsCard } from "@/components/site/cards";
import ShareButton from "@/components/site/share-button";
import { Badge } from "@/components/ui/primitives";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import { Clock } from "lucide-react";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article || !article.published) notFound();

  const [author, related] = await Promise.all([
    getUserById(article.authorId),
    getRelatedArticles(article.id, article.category, 3),
  ]);

  const readingTime = estimateReadingTime(article.content);

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      {article.coverImage && (
        <div className="mb-6 rounded-sm overflow-hidden border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.coverImage} alt={article.title} className="w-full h-auto" />
        </div>
      )}

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Badge tone="gold">{article.category}</Badge>
        {article.publishedAt && (
          <span className="text-xs text-slate">{formatDate(article.publishedAt)}</span>
        )}
        <span className="text-xs text-slate flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {readingTime} دقائق قراءة
        </span>
      </div>

      <h1 className="font-display text-3xl text-ink leading-tight">{article.title}</h1>
      <p className="text-slate mt-4 text-lg leading-relaxed">{article.excerpt}</p>

      <div className="flex items-center justify-between mt-6 pb-6 border-b border-line">
        {author && (
          <div className="text-sm text-ink/70">
            بقلم <span className="font-medium text-ink">{author.name}</span>
          </div>
        )}
        <ShareButton title={article.title} />
      </div>

      <div className="mt-8 prose-content text-ink/90 leading-relaxed space-y-4">
        {article.content.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-xl text-ink mb-4">مقالات ذات صلة</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((r) => (
              <NewsCard key={r.id} article={r} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
