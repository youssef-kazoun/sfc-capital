import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

const STAFF = ["ADMIN", "ANALYST"];

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireApiRole(STAFF);
    const { id } = await ctx.params;
    const rows = await db.select().from(schema.stocks).where(eq(schema.stocks.id, id));
    if (!rows[0]) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireApiRole(STAFF);
    const { id } = await ctx.params;
    const body = await req.json();

    await db
      .update(schema.stocks)
      .set({
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
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.stocks.id, id));

    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireApiRole(STAFF);
    const { id } = await ctx.params;
    await db.delete(schema.stocks).where(eq(schema.stocks.id, id));
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const pgCode = err?.cause?.code || err?.code;
    const pgMessage = String(err?.cause?.message || err?.message || "");
    if (pgCode === "23503" || /foreign key/i.test(pgMessage)) {
      return NextResponse.json(
        {
          error:
            "لا يمكن حذف هذا السهم لأنه مرتبط بتوصيات، تحليلات، مراكز محفظة، أو أخبار. احذف المرتبط أولًا أو استخدم التعديل بدلًا من الحذف.",
        },
        { status: 409 }
      );
    }
    return apiErrorResponse(err);
  }
}
