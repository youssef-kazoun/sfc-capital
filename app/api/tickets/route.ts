import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(schema.tickets)
    .where(eq(schema.tickets.userId, session.user.id))
    .orderBy(desc(schema.tickets.updatedAt))
    ;

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subject, message, priority } = await req.json();
  if (!subject || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const [ticket] = await db
    .insert(schema.tickets)
    .values({ userId: session.user.id, subject, priority: priority || "Normal" })
    .returning();

  await db.insert(schema.ticketMessages).values({
    ticketId: ticket.id,
    authorId: session.user.id,
    body: message,
  });

  return NextResponse.json(ticket, { status: 201 });
}
