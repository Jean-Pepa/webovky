import { Sidebar } from "@/components/Sidebar";
import { AppGuard } from "@/components/AppGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppGuard>
      <div className="min-h-screen">
        <Sidebar />
        <div className="lg:pl-64">
          <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
        </div>
      </div>
    </AppGuard>
  );
}
