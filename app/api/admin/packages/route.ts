import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";

export async function GET() {
  try {
    await requireApiRole(["ADMIN"]);
    const rows = await db.select().from(schema.packages);
    return NextResponse.json(rows);
  } catch (err) {
    return apiErrorResponse(err);
  }
}
