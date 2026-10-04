import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await requireApiRole(["ADMIN"]);
    const rows = await db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
        isActive: schema.users.isActive,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .orderBy(desc(schema.users.createdAt))
      ;
    return NextResponse.json(rows);
  } catch (err) {
    return apiErrorResponse(err);
  }
}
