import type { Metadata } from "next";
import RightSidebarNav from "@/components/layout/RightSidebarNav";
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
          <main className="flex-1 min-w-0 px-6 py-6">{children}</main>
          <aside className="w-64 shrink-0 border-l bg-muted/30">
            <div className="sticky top-0 h-screen overflow-y-auto">
              <RightSidebarNav />
            </div>
          </aside>
        </div>
      </body>
    </html>
  );
}
