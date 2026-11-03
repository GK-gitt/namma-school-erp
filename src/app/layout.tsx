import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Namma School ERP — One source of truth for the entire school",
  description:
    "One beautiful platform for Bangalore schools — attendance, fees, report cards and more, all in one place. Namma Shaale, Namma Future.",
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
