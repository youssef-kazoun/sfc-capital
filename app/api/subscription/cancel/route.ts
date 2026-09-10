import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db
    .update(schema.subscriptions)
    .set({ status: "CANCELED" })
    .where(and(eq(schema.subscriptions.id, id), eq(schema.subscriptions.userId, session.user.id)));

  return NextResponse.json({ ok: true });
}
