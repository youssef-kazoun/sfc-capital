import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";

const STAFF = ["ADMIN", "SUPPORT", "ANALYST"];

export async function GET() {
  try {
    await requireApiRole(STAFF);
    const rows = await db.select().from(schema.trialRequests).orderBy(desc(schema.trialRequests.createdAt));
    return NextResponse.json(rows);
  } catch (err) {
    return apiErrorResponse(err);
  }
}
