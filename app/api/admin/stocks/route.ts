import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";
import { desc, eq } from "drizzle-orm";

const STAFF = ["ADMIN", "ANALYST"];

export async function GET() {
  try {
    await requireApiRole(STAFF);
    const rows = await db.select().from(schema.stocks).orderBy(desc(schema.stocks.createdAt));
    return NextResponse.json(rows);
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    await requireApiRole(STAFF);
    const body = await req.json();

    const symbol = String(body.symbol || "").toUpperCase().trim();
    if (!symbol) return NextResponse.json({ error: "الرمز مطلوب" }, { status: 400 });

    const existing = await db.select().from(schema.stocks).where(eq(schema.stocks.symbol, symbol));
    if (existing[0]) {
      return NextResponse.json({ error: "يوجد سهم بنفس الرمز بالفعل" }, { status: 409 });
    }

    const [row] = await db
      .insert(schema.stocks)
      .values({
        symbol,
        name: body.name,
        exchange: body.exchange,
        sector: body.sector || null,
        currency: body.currency,
        lastPrice: Number(body.lastPrice) || 0,
        changePct: Number(body.changePct) || 0,
        volume: Number(body.volume) || 0,
        marketCap: body.marketCap ? Number(body.marketCap) : null,
        isConventionalFinance: !!body.isConventionalFinance,
        debtRatio: body.debtRatio !== "" && body.debtRatio != null ? Number(body.debtRatio) : null,
        cashRatio: body.cashRatio !== "" && body.cashRatio != null ? Number(body.cashRatio) : null,
        nonCompliantIncomeRatio:
          body.nonCompliantIncomeRatio !== "" && body.nonCompliantIncomeRatio != null
            ? Number(body.nonCompliantIncomeRatio)
            : null,
      })
      .returning();

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
