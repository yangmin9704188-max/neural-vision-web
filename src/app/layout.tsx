import type { Metadata } from "next";
import Link from "next/link";
import EngineBadge from "@/components/EngineBadge";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neural Vision Web",
  description: "Virtual fitting demo & seller portal — powered by Neural Vision Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Neural Vision
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link href="/demo" className="hover:text-blue-600 transition-colors">
                Demo
              </Link>
              <Link href="/showcase" className="hover:text-blue-600 transition-colors">
                Showcase
              </Link>
              <Link href="/seller" className="hover:text-blue-600 transition-colors">
                Seller
              </Link>
              <EngineBadge />
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
