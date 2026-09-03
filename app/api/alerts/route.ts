import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      id: schema.alerts.id,
      condition: schema.alerts.condition,
      targetPrice: schema.alerts.targetPrice,
      triggered: schema.alerts.triggered,
      createdAt: schema.alerts.createdAt,
      symbol: schema.stocks.symbol,
      name: schema.stocks.name,
      lastPrice: schema.stocks.lastPrice,
    })
    .from(schema.alerts)
    .leftJoin(schema.stocks, eq(schema.alerts.stockId, schema.stocks.id))
    .where(eq(schema.alerts.userId, session.user.id))
    ;

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { stockId, targetPrice, condition } = await req.json();
  if (!stockId || !targetPrice || !condition) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const [row] = await db
    .insert(schema.alerts)
    .values({ userId: session.user.id, stockId, targetPrice, condition })
    .returning();

  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db
    .delete(schema.alerts)
    .where(and(eq(schema.alerts.id, id), eq(schema.alerts.userId, session.user.id)));

  return NextResponse.json({ ok: true });
}
