import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify JWT token (middleware also checks, but this is defense-in-depth)
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
      await jwtVerify(token, secret);
      isAuthenticated = true;
    } catch {
      // Invalid token
    }
  }

  if (!isAuthenticated) {
    redirect("/cs/login");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-[#f7f7f7] text-black" style={{ padding: '40px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
