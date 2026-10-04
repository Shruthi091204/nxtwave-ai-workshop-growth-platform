import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { UTMTracker } from "@/components/UTMTracker";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Build Your First AI Project in 60 Minutes | NxtWave",
  description: "Free live workshop for final-year engineering students. No prior AI experience needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-bg-dark text-text-main`}>
        <Suspense fallback={null}>
          <UTMTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
