"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function AdminTab({ isEn }: { isEn: boolean }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="flex items-center">
      <div className="w-px h-4 bg-border-dark" style={{ marginLeft: 11, marginRight: 11 }} />
      <a
        href="#rozpocet"
        className="text-xs font-medium uppercase tracking-[0.12em] text-muted hover:text-primary transition-colors py-3 border-b-2 border-transparent hover:border-primary -mb-px"
      >
        {isEn ? "Budget" : "Rozpočet"}
      </a>
    </div>
  );
}
