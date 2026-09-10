import { getActivePackages } from "@/lib/data";
import { SectionHeading, Badge } from "@/components/ui/primitives";
import SubscribeButton from "@/components/site/subscribe-button";
import { Check } from "lucide-react";

export const metadata = { title: "الباقات — SFC Capital" };

export default async function PackagesPage() {
  const packages = await getActivePackages();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading title="الباقات" subtitle="اختر الباقة التي تناسب أسلوبك في الاستثمار" />
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg, idx) => {
          const features: string[] = JSON.parse(pkg.features);
          const isFree = pkg.priceMonthly === 0;
          const isPopular = idx === 1;
          return (
            <div
              key={pkg.id}
              className={`rounded-sm border bg-white p-6 flex flex-col ${
                isPopular ? "border-gold ring-1 ring-gold" : "border-line"
              }`}
            >
              {isPopular && <Badge tone="gold">الأكثر اختيارًا</Badge>}
              <h3 className="font-display text-xl text-ink mt-2">{pkg.nameAr || pkg.name}</h3>
              <p className="text-sm text-slate mt-1">{pkg.description}</p>
              <div className="mt-4 font-display text-3xl text-ink">
                {isFree ? "مجانًا" : `${pkg.priceMonthly} جنيه`}
                {!isFree && <span className="text-sm text-slate font-sans">/شهريًا</span>}
              </div>
              <ul className="mt-6 space-y-2 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink/80">
                    <Check className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <SubscribeButton packageId={pkg.id} billingCycle="monthly" isFree={isFree} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
