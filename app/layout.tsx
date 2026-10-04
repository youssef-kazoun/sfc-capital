import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import type { Locale } from "@/lib/i18n/context";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SFC Capital — الأسواق السعودية والأمريكية",
    template: "%s | SFC Capital",
  },
  description:
    "أسعار لحظية، توصيات من خبراء، وأدوات لإدارة المحفظة للأسواق السعودية والأمريكية.",
  openGraph: {
    title: "SFC Capital",
    description:
      "أسعار لحظية، توصيات من خبراء، وأدوات لإدارة المحفظة للأسواق السعودية والأمريكية.",
    url: siteUrl,
    siteName: "SFC Capital",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SFC Capital",
    description:
      "أسعار لحظية، توصيات من خبراء، وأدوات لإدارة المحفظة للأسواق السعودية والأمريكية.",
  },
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
