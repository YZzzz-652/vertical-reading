import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--font-body",
  display: "swap",
});

const notoSerifSc = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-zh",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vertical Reading",
  description: "A literary time and place visualization map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`h-full antialiased ${playfair.variable} ${garamond.variable} ${notoSerifSc.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
