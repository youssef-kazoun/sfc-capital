import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      id: schema.watchlistItems.id,
      stockId: schema.stocks.id,
      symbol: schema.stocks.symbol,
      name: schema.stocks.name,
      lastPrice: schema.stocks.lastPrice,
      changePct: schema.stocks.changePct,
      currency: schema.stocks.currency,
    })
    .from(schema.watchlistItems)
    .leftJoin(schema.stocks, eq(schema.watchlistItems.stockId, schema.stocks.id))
    .where(eq(schema.watchlistItems.userId, session.user.id));

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { stockId } = await req.json();
  if (!stockId) return NextResponse.json({ error: "stockId required" }, { status: 400 });

  const existingRows = await db
    .select()
    .from(schema.watchlistItems)
    .where(
      and(eq(schema.watchlistItems.userId, session.user.id), eq(schema.watchlistItems.stockId, stockId))
    );
  const existing = existingRows[0];

  if (existing) return NextResponse.json(existing);

  const [row] = await db
    .insert(schema.watchlistItems)
    .values({ userId: session.user.id, stockId })
    .returning();

  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db
    .delete(schema.watchlistItems)
    .where(and(eq(schema.watchlistItems.id, id), eq(schema.watchlistItems.userId, session.user.id)));

  return NextResponse.json({ ok: true });
}
