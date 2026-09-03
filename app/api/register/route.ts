import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schemaValidator = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schemaValidator.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  const existingRows = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase()));
  const existing = existingRows[0];
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(schema.users)
    .values({ name, email: email.toLowerCase(), passwordHash, role: "CUSTOMER" })
    .returning();

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
