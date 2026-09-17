import type { NextAuthConfig } from "next-auth";

type AuthRole = "ADMIN" | "ANALYST" | "SUPPORT" | "CUSTOMER";

type AuthUser = {
  id?: string;
  role?: AuthRole;
  locale?: string;
};

export const authConfig: NextAuthConfig = {
  trustHost: true,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const authUser = user as AuthUser;

        if (authUser.role) {
          token.role = authUser.role;
        }

        if (authUser.locale) {
          token.locale = authUser.locale;
        }

        if (authUser.id) {
          token.id = authUser.id;
        }
      }

      return token;
    },

    session: async ({ session, token }) => {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id?: string;
          role?: AuthRole;
          locale?: string;
        };

        if (token.role) {
          sessionUser.role = token.role as AuthRole;
        }

        if (token.locale) {
          sessionUser.locale = token.locale as string;
        }

        if (token.id) {
          sessionUser.id = token.id as string;
        }
      }

      return session;
    },
  },
};