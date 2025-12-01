import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Tailor Shift | Luxury Retail Talent Platform",
    template: "%s | Tailor Shift",
  },
  description:
    "Connect exceptional retail professionals with prestigious luxury maisons. The intelligent matching platform for luxury retail careers.",
  keywords: [
    "luxury retail",
    "talent matching",
    "retail careers",
    "luxury brands",
    "boutique management",
    "retail professionals",
  ],
  authors: [{ name: "Tailor Shift" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tailor Shift",
    title: "Tailor Shift | Luxury Retail Talent Platform",
    description:
      "Connect exceptional retail professionals with prestigious luxury maisons.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-ivory font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
