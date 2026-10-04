import { notFound } from "next/navigation";
import { getAnalysisBySlug } from "@/lib/data";
import { Badge } from "@/components/ui/primitives";

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const analysis = await getAnalysisBySlug(slug);
  if (!analysis || !analysis.published) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <Badge tone="gold">{analysis.type}</Badge>
      <h1 className="font-display text-3xl text-ink leading-tight mt-3">{analysis.title}</h1>
      <p className="text-slate mt-4 text-lg leading-relaxed">{analysis.summary}</p>
      <div className="mt-8 text-ink/90 leading-relaxed space-y-4">
        {analysis.content.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
