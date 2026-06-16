"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Loading } from "@/components/Loading";

export function AppGuard({ children }: { children: React.ReactNode }) {
  const { role, hydrated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !role) router.replace("/prihlaseni");
  }, [hydrated, role, router]);

  if (!hydrated) return <Loading />;
  if (!role) return <Loading label="Přesměrování na přihlášení…" />;
  return <>{children}</>;
}
