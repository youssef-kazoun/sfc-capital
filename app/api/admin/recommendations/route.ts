import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";
import { desc, eq } from "drizzle-orm";

const STAFF = ["ADMIN", "ANALYST"];

export async function GET() {
  try {
    await requireApiRole(STAFF);
    const rows = await db
      .select({
        id: schema.recommendations.id,
        action: schema.recommendations.action,
        status: schema.recommendations.status,
        entryPrice: schema.recommendations.entryPrice,
        targetPrice: schema.recommendations.targetPrice,
        stopLoss: schema.recommendations.stopLoss,
        createdAt: schema.recommendations.createdAt,
        symbol: schema.stocks.symbol,
        name: schema.stocks.name,
      })
      .from(schema.recommendations)
      .leftJoin(schema.stocks, eq(schema.recommendations.stockId, schema.stocks.id))
      .orderBy(desc(schema.recommendations.createdAt))
      ;
    return NextResponse.json(rows);
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireApiRole(STAFF);
    const body = await req.json();

    const [row] = await db
      .insert(schema.recommendations)
      .values({
        stockId: body.stockId,
        action: body.action,
        entryPrice: Number(body.entryPrice),
        targetPrice: Number(body.targetPrice),
        stopLoss: Number(body.stopLoss),
        rationale: body.rationale,
        riskLevel: body.riskLevel || "Medium",
        timeHorizon: body.timeHorizon || "Medium-term",
        authorId: user.id,
      })
      .returning();

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
