import Link from "next/link";
import { getAllStocks } from "@/lib/data";
import StockCard from "@/components/site/stock-card";
import { SectionHeading, Button } from "@/components/ui/primitives";
import { BarChart3 } from "lucide-react";

export const metadata = { title: "الأسواق — SFC Capital" };

export default async function MarketsPage() {
  const stocks = await getAllStocks();

  const sectors = Array.from(new Set(stocks.map((s) => s.sector).filter(Boolean))) as string[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="الأسواق"
        subtitle={`${stocks.length} شركة مسجلة في ${sectors.length} قطاعات`}
        action={
          <Link href="/market-overview">
            <Button variant="secondary">
              <span className="flex items-center gap-1.5"><BarChart3 className="h-4 w-4" /> نظرة عامة على السوق</span>
            </Button>
          </Link>
        }
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((s) => (
          <StockCard key={s.id} stock={s} />
        ))}
      </div>
    </div>
  );
}
