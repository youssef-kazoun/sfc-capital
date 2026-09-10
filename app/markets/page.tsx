import { getAllStocks } from "@/lib/data";
import StockCard from "@/components/site/stock-card";
import { SectionHeading } from "@/components/ui/primitives";

export const metadata = { title: "الأسواق — SFC Capital" };

export default async function MarketsPage() {
  const stocks = await getAllStocks();

  const sectors = Array.from(new Set(stocks.map((s) => s.sector).filter(Boolean))) as string[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        title="الأسواق"
        subtitle={`${stocks.length} شركة مسجلة في ${sectors.length} قطاعات`}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((s) => (
          <StockCard key={s.id} stock={s} />
        ))}
      </div>
    </div>
  );
}
