import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const display = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-white text-[#16100F]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}