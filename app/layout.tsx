import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Carleton Marketplace — Buy, Sell & Trade for Carleton Students",
  description:
    "A student marketplace for Carleton University students in Ottawa to buy and sell textbooks, electronics, furniture, and more. Free and made for the Carleton community.",
  verification: {
    google: "YR4Psc9w9WqFAdYTk9z4cjxyya5XLxxGZ_ijk15R_so",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-body)" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}