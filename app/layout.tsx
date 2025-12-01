import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${playfair.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-off-white font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
