import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as any).role;
        token.locale = (user as any).locale;
        token.id = (user as any).id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).locale = token.locale;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};
