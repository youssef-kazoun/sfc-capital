import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import type { Locale } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: "SFC Capital — بيانات السوق المصري",
  description:
    "أسعار لحظية، توصيات من خبراء، وأدوات لإدارة المحفظة للبورصة المصرية.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const initialLocale = (cookieStore.get("locale")?.value as Locale) || "ar";

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
