import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Toetally – A Budget Tracker App",
  description:
    "Track your income, expenses, and stay on top of your budget with Toetally.",
  keywords: [
    "budget tracker",
    "Toetally",
    "expense manager",
    "income tracker",
    "personal finance",
  ],
  authors: [{ name: "Toetally Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
