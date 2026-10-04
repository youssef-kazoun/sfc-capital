import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MarketFilterTabs({
  basePath,
  active,
}: {
  basePath: string;
  active?: "SAUDI" | "US";
}) {
  const tabs: { label: string; value?: "SAUDI" | "US" }[] = [
    { label: "الكل" },
    { label: "السوق السعودي", value: "SAUDI" },
    { label: "السوق الأمريكي", value: "US" },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((t) => {
        const href = t.value ? `${basePath}?market=${t.value}` : basePath;
        const isActive = active === t.value;
        return (
          <Link
            key={t.label}
            href={href}
            className={cn(
              "text-sm px-3 py-1.5 rounded-sm border",
              isActive ? "border-gold text-gold bg-gold/10" : "border-line text-slate hover:text-ink"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
