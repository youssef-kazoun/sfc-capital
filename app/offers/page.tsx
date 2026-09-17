import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { SectionHeading } from "@/components/ui/primitives";
import { Gift } from "lucide-react";

export const metadata = { title: "العروض الخاصة — SFC Capital" };

interface Offer {
  title: string;
  description: string;
  badge?: string;
}

export default async function OffersPage() {
  const rows = await db
    .select()
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.key, "special_offers"));

  let offers: Offer[] = [];
  try {
    offers = JSON.parse(rows[0]?.value || "[]");
  } catch {
    offers = [];
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading title="العروض الخاصة" subtitle="عروض وخصومات محدودة على باقات الاشتراك" />
      {offers.length === 0 ? (
        <div className="rounded-sm border border-dashed border-line p-10 text-center text-slate">
          لا توجد عروض متاحة حاليًا. تابعنا للإعلان عن العروض القادمة.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {offers.map((o, i) => (
            <div key={i} className="rounded-sm border border-gold/40 bg-gold/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-gold" />
                {o.badge && (
                  <span className="text-xs font-medium text-gold bg-gold/15 rounded-sm px-2 py-0.5">{o.badge}</span>
                )}
              </div>
              <h3 className="font-display text-lg text-ink">{o.title}</h3>
              <p className="text-sm text-slate mt-1.5 leading-relaxed">{o.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
