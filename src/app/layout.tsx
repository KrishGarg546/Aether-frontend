import type { Metadata } from "next";
import { GlobalNav } from "@/components/layout/global-nav";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aether",
  description: "Goal-driven marketing orchestration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <QueryProvider>
          <GlobalNav />

          <main className="pt-14">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}