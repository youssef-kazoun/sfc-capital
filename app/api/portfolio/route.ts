import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      id: schema.portfolioItems.id,
      quantity: schema.portfolioItems.quantity,
      avgBuyPrice: schema.portfolioItems.avgBuyPrice,
      symbol: schema.stocks.symbol,
      name: schema.stocks.name,
      lastPrice: schema.stocks.lastPrice,
      currency: schema.stocks.currency,
    })
    .from(schema.portfolioItems)
    .leftJoin(schema.stocks, eq(schema.portfolioItems.stockId, schema.stocks.id))
    .where(eq(schema.portfolioItems.userId, session.user.id))
    ;

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { stockId, quantity, avgBuyPrice } = await req.json();
  if (!stockId || !quantity || !avgBuyPrice) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const [row] = await db
    .insert(schema.portfolioItems)
    .values({ userId: session.user.id, stockId, quantity, avgBuyPrice })
    .returning();

  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db
    .delete(schema.portfolioItems)
    .where(and(eq(schema.portfolioItems.id, id), eq(schema.portfolioItems.userId, session.user.id)));

  return NextResponse.json({ ok: true });
}
