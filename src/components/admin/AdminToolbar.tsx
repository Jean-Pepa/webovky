"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function AdminToolbar() {
  const { isAdmin, logout } = useAuth();

  if (!isAdmin) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center px-5 py-2 text-white"
      style={{
        background: "rgba(0,0,0,0.88)",
        backdropFilter: "blur(8px)",
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-60">
        Admin mód
      </span>
    </div>
  );
}
