import { NextResponse } from "next/server";
import { db, schema } from "@/db";

export async function GET() {
  const rows = await db
    .select({ id: schema.stocks.id, symbol: schema.stocks.symbol, name: schema.stocks.name, lastPrice: schema.stocks.lastPrice, currency: schema.stocks.currency })
    .from(schema.stocks)
    .orderBy(schema.stocks.symbol)
    ;
  return NextResponse.json(rows);
}
