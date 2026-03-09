"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  endpoint: string;
  label?: string;
  confirmMessage?: string;
}

export default function DeleteButton({
  endpoint,
  label = "Smazat",
  confirmMessage = "Opravdu chcete smazat tuto položku?",
}: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(confirmMessage)) return;

    setLoading(true);

    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Chyba při mazání");
        return;
      }
      router.refresh();
    } catch {
      alert("Chyba při mazání");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 disabled:opacity-50"
    >
      {loading ? "..." : label}
    </button>
  );
}
