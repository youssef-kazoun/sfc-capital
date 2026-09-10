import Link from "next/link";
import { PriceChange } from "@/components/ui/primitives";
import { formatCurrency } from "@/lib/utils";

export interface StockCardData {
  symbol: string;
  name: string;
  lastPrice: number;
  changePct: number;
  currency: string;
  sector?: string | null;
}

export default function StockCard({ stock }: { stock: StockCardData }) {
  return (
    <Link
      href={`/stocks/${stock.symbol}`}
      className="block rounded-sm border border-line bg-white p-4 hover:border-gold transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-xs text-slate">{stock.symbol}</div>
          <div className="font-medium text-ink mt-0.5">{stock.name}</div>
        </div>
        <PriceChange value={stock.changePct} />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-lg font-display text-ink">
          {formatCurrency(stock.lastPrice, stock.currency)}
        </div>
        {stock.sector && (
          <span className="text-xs text-slate">{stock.sector}</span>
        )}
      </div>
    </Link>
  );
}
