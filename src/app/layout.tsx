import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Namma School ERP — Namma Shaale, Namma Future",
  description:
    "The modern, WhatsApp-first School ERP for Bangalore schools. Attendance, fees, and report cards parents love.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
