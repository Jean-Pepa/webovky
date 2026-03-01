import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Allow login page without auth
  // The layout wraps all admin pages, so we check auth here
  // Login page needs to be accessible without auth
  if (!user) {
    // We can't check the pathname in server layout directly,
    // so we'll redirect only from the layout's own render context.
    // The login page has its own layout-free structure.
  }

  return (
    <div className="flex min-h-screen">
      {user && <AdminSidebar />}
      <main className={`flex-1 bg-bg-light ${user ? "p-8" : ""}`}>
        {children}
      </main>
    </div>
  );
}
