import { NextResponse } from "next/server";
import { requireApiRole, apiErrorResponse } from "@/lib/api-guard";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";

const STAFF = ["ADMIN", "ANALYST"];

export async function GET() {
  try {
    await requireApiRole(STAFF);
    const rows = await db.select().from(schema.newsArticles).orderBy(desc(schema.newsArticles.createdAt));
    return NextResponse.json(rows);
  } catch (err) {
    return apiErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireApiRole(STAFF);
    const body = await req.json();

    const slug = (body.slug || body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const [row] = await db
      .insert(schema.newsArticles)
      .values({
        slug,
        title: body.title,
        titleAr: body.titleAr || null,
        excerpt: body.excerpt,
        content: body.content,
        category: body.category || "General",
        published: !!body.published,
        publishedAt: body.published ? new Date().toISOString() : null,
        authorId: user.id,
      })
      .returning();

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    return apiErrorResponse(err);
  }
}
