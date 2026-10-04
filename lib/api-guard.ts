import { auth } from "@/auth";
import { NextResponse } from "next/server";

export class ApiAuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function requireApiUser() {
  const session = await auth();
  if (!session?.user) throw new ApiAuthError(401, "غير مصرح بالدخول");
  return session.user;
}

export async function requireApiRole(roles: string[]) {
  const user = await requireApiUser();
  if (!roles.includes(user.role)) throw new ApiAuthError(403, "ليس لديك صلاحية");
  return user;
}

export function apiErrorResponse(err: unknown) {
  if (err instanceof ApiAuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error(err);
  return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
}
