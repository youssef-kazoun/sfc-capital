import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";

export async function GET() {
  try {
    await requireApiRole(["ADMIN"]);
    const rows = await db.select().from(schema.siteSettings);
    return NextResponse.json(rows);
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    await requireApiRole(["ADMIN"]);
    const { key, value } = await req.json();
    if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

    await db
      .insert(schema.siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value, updatedAt: new Date().toISOString() } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
