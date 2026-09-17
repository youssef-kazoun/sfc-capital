import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getCrmProvider } from "@/services/crm";
import { auth } from "@/auth";
import { z } from "zod";

const validator = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phone: z.string().min(6, "رقم الهاتف غير صالح"),
  serviceType: z.string().min(1, "اختر نوع الخدمة"),
  market: z.enum(["SAUDI", "US"]),
  liquiditySize: z.string().optional(),
  currency: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = validator.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" }, { status: 400 });
  }

  const session = await auth();
  const [row] = await db
    .insert(schema.trialRequests)
    .values({ ...parsed.data, userId: session?.user?.id })
    .returning();

  const crm = getCrmProvider();
  await crm.pushLead({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    source: "free_trial",
    message: `الخدمة: ${parsed.data.serviceType} | السوق: ${parsed.data.market}`,
  });

  return NextResponse.json({ id: row.id }, { status: 201 });
}
