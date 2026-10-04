import Link from "next/link";
import { getAllAnalyses } from "@/lib/data";
import { Badge, SectionHeading } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "التحليلات — SFC Capital" };

export default async function AnalysisPage() {
  const analyses = await getAllAnalyses();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading title="التحليلات" subtitle="تحليلات فنية وأساسية من فريق البحث" />
      <div className="space-y-4">
        {analyses.map((a) => (
          <Link
            key={a.id}
            href={`/analysis/${a.slug}`}
            className="block rounded-sm border border-line bg-white p-5 hover:border-gold transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge tone="gold">{a.type}</Badge>
              <span className="text-xs text-slate">{formatDate(a.createdAt)}</span>
            </div>
            <h3 className="font-display text-lg text-ink">{a.title}</h3>
            <p className="text-sm text-slate mt-1">{a.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
