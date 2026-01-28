import type { Metadata } from "next";
import LeftSidebarNav from "@/components/layout/LeftSidebarNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinanceFlow",
  description: "Personal finance management"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="min-h-screen flex">
          <LeftSidebarNav />
          <main className="flex-1 min-w-0 px-6 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
