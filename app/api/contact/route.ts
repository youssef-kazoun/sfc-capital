import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getCrmProvider } from "@/services/crm";
import { auth } from "@/auth";
import { z } from "zod";

const validator = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(5),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = validator.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const session = await auth();
  const [row] = await db
    .insert(schema.contactSubmissions)
    .values({ ...parsed.data, userId: session?.user?.id })
    .returning();

  const crm = getCrmProvider();
  await crm.pushLead({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    source: "contact_form",
    message: parsed.data.message,
  });

  return NextResponse.json({ id: row.id }, { status: 201 });
}
