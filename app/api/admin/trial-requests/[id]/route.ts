import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

const STAFF = ["ADMIN", "SUPPORT", "ANALYST"];

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireApiRole(STAFF);
    const { id } = await ctx.params;
    const { status } = await req.json();
    await db.update(schema.trialRequests).set({ status }).where(eq(schema.trialRequests.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
