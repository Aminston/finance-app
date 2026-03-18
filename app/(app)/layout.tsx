import LeftSidebarNav from "@/components/layout/LeftSidebarNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <LeftSidebarNav />
      <main className="flex-1 min-w-0 px-6 py-6">{children}</main>
    </div>
  );
}
