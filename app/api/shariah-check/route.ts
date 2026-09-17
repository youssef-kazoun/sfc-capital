import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { checkShariahCompliance } from "@/lib/shariah";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "الرمز مطلوب" }, { status: 400 });

  const rows = await db.select().from(schema.stocks).where(eq(schema.stocks.symbol, symbol.toUpperCase()));
  const stock = rows[0];
  if (!stock) return NextResponse.json({ error: "السهم غير موجود" }, { status: 404 });

  const result = checkShariahCompliance({
    sector: stock.sector,
    isConventionalFinance: stock.isConventionalFinance,
    debtRatio: stock.debtRatio,
    cashRatio: stock.cashRatio,
    nonCompliantIncomeRatio: stock.nonCompliantIncomeRatio,
  });

  return NextResponse.json({
    symbol: stock.symbol,
    name: stock.name,
    ...result,
  });
}
