import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import type { Locale } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: "SFC Capital — Egyptian Market Intelligence",
  description:
    "Real-time quotes, expert recommendations, and portfolio tools for the Egyptian Exchange.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const initialLocale = (cookieStore.get("locale")?.value as Locale) || "en";

  return (
    <html
      lang={initialLocale}
      dir={initialLocale === "ar" ? "rtl" : "ltr"}
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <Providers initialLocale={initialLocale}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
