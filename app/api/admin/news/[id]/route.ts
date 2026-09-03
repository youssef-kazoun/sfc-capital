import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

const STAFF = ["ADMIN", "ANALYST"];

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireApiRole(STAFF);
    const { id } = await ctx.params;
    const rowRows = await db.select().from(schema.newsArticles).where(eq(schema.newsArticles.id, id));
  const row = rowRows[0];
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireApiRole(STAFF);
    const { id } = await ctx.params;
    const body = await req.json();

    await db
      .update(schema.newsArticles)
      .set({
        title: body.title,
        titleAr: body.titleAr || null,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category,
        published: !!body.published,
        publishedAt: body.published ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.newsArticles.id, id));

    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireApiRole(STAFF);
    const { id } = await ctx.params;
    await db.delete(schema.newsArticles).where(eq(schema.newsArticles.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
