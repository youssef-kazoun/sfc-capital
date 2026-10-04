import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";
import { desc, eq } from "drizzle-orm";

const STAFF = ["ADMIN", "SUPPORT", "ANALYST"];

export async function GET() {
  try {
    await requireApiRole(STAFF);
    const rows = await db
      .select({
        id: schema.tickets.id,
        subject: schema.tickets.subject,
        status: schema.tickets.status,
        priority: schema.tickets.priority,
        updatedAt: schema.tickets.updatedAt,
        customerName: schema.users.name,
        customerEmail: schema.users.email,
      })
      .from(schema.tickets)
      .leftJoin(schema.users, eq(schema.tickets.userId, schema.users.id))
      .orderBy(desc(schema.tickets.updatedAt))
      ;
    return NextResponse.json(rows);
  } catch (err) {
    return apiErrorResponse(err);
  }
}
