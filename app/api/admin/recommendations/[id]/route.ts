import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

const STAFF = ["ADMIN", "ANALYST"];

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireApiRole(STAFF);
    const { id } = await ctx.params;
    const body = await req.json();

    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (body.status) {
      updates.status = body.status;
      if (body.status === "CLOSED") {
        updates.closedAt = new Date().toISOString();
        updates.closePrice = body.closePrice ?? null;
      }
    }

    await db.update(schema.recommendations).set(updates).where(eq(schema.recommendations.id, id));

    if (body.note) {
      await db.insert(schema.recommendationUpdates).values({ recommendationId: id, note: body.note });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireApiRole(STAFF);
    const { id } = await ctx.params;
    await db.delete(schema.recommendations).where(eq(schema.recommendations.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
