import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { DocsPanel } from "@/components/DocsPanel";
import { AppGuard } from "@/components/AppGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppGuard>
      <div className="min-h-screen">
        <Sidebar />
        <div className="pl-16 lg:pl-64">
          <TopBar />
          <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
        </div>
        <DocsPanel />
      </div>
    </AppGuard>
  );
}
