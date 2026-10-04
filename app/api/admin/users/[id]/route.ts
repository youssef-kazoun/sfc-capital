import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireApiRole(["ADMIN"]);
    const { id } = await ctx.params;
    const body = await req.json();

    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (body.role) updates.role = body.role;
    if (typeof body.isActive === "boolean") updates.isActive = body.isActive;

    await db.update(schema.users).set(updates).where(eq(schema.users.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
