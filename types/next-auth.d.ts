import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "ANALYST" | "SUPPORT" | "CUSTOMER";
      locale: string;
    } & DefaultSession["user"];
  }
}
