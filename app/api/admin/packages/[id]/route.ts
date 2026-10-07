import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireApiRole(["ADMIN"]);
    const { id } = await ctx.params;
    const body = await req.json();

    await db
      .update(schema.packages)
      .set({
        name: body.name,
        nameAr: body.nameAr || null,
        description: body.description,
        priceMonthly: Number(body.priceMonthly) || 0,
        priceYearly: Number(body.priceYearly) || 0,
        priceMonthlySar: body.priceMonthlySar !== "" && body.priceMonthlySar != null ? Number(body.priceMonthlySar) : null,
        priceYearlySar: body.priceYearlySar !== "" && body.priceYearlySar != null ? Number(body.priceYearlySar) : null,
        features: JSON.stringify(body.features || []),
        isActive: !!body.isActive,
      })
      .where(eq(schema.packages.id, id));

    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
