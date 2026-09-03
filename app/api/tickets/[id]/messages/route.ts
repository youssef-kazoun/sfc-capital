import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

const STAFF = ["ADMIN", "SUPPORT", "ANALYST"];

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const ticketRows = await db.select().from(schema.tickets).where(eq(schema.tickets.id, id));
  const ticket = ticketRows[0];
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (ticket.userId !== session.user.id && !STAFF.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { body } = await req.json();
  if (!body) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const [message] = await db
    .insert(schema.ticketMessages)
    .values({ ticketId: id, authorId: session.user.id, body })
    .returning();

  await db
    .update(schema.tickets)
    .set({ updatedAt: new Date().toISOString(), status: STAFF.includes(session.user.role) ? "IN_PROGRESS" : ticket.status })
    .where(eq(schema.tickets.id, id));

  return NextResponse.json(message, { status: 201 });
}
