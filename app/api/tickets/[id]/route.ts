import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

const STAFF = ["ADMIN", "SUPPORT", "ANALYST"];

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const ticketRows = await db.select().from(schema.tickets).where(eq(schema.tickets.id, id));
  const ticket = ticketRows[0];
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (ticket.userId !== session.user.id && !STAFF.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await db
    .select({
      id: schema.ticketMessages.id,
      body: schema.ticketMessages.body,
      createdAt: schema.ticketMessages.createdAt,
      authorName: schema.users.name,
      authorRole: schema.users.role,
    })
    .from(schema.ticketMessages)
    .leftJoin(schema.users, eq(schema.ticketMessages.authorId, schema.users.id))
    .where(eq(schema.ticketMessages.ticketId, id))
    ;

  return NextResponse.json({ ticket, messages });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !STAFF.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await ctx.params;
  const { status } = await req.json();

  await db.update(schema.tickets).set({ status }).where(eq(schema.tickets.id, id));
  return NextResponse.json({ ok: true });
}
