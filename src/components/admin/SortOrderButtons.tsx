"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface SortOrderButtonsProps {
  projectId: string;
  currentOrder: number;
  isFirst: boolean;
  isLast: boolean;
  /** All project IDs + sort_orders so we can swap */
  allProjects: { id: string; sort_order: number }[];
}

export default function SortOrderButtons({
  projectId,
  currentOrder,
  isFirst,
  isLast,
  allProjects,
}: SortOrderButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function swap(direction: "up" | "down") {
    setLoading(true);
    const sorted = [...allProjects].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((p) => p.id === projectId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) {
      setLoading(false);
      return;
    }

    const current = sorted[idx];
    const other = sorted[swapIdx];

    try {
      await Promise.all([
        fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: current.id, sort_order: other.sort_order }),
        }),
        fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: other.id, sort_order: current.sort_order }),
        }),
      ]);
      router.refresh();
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        onClick={() => swap("up")}
        disabled={isFirst || loading}
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.1)",
          backgroundColor: isFirst ? "transparent" : "#e8e8e8",
          cursor: isFirst || loading ? "default" : "pointer",
          opacity: isFirst ? 0.25 : 1,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Move up"
      >
        ▲
      </button>
      <span style={{ minWidth: 20, textAlign: "center" }}>{currentOrder}</span>
      <button
        onClick={() => swap("down")}
        disabled={isLast || loading}
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.1)",
          backgroundColor: isLast ? "transparent" : "#e8e8e8",
          cursor: isLast || loading ? "default" : "pointer",
          opacity: isLast ? 0.25 : 1,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Move down"
      >
        ▼
      </button>
    </div>
  );
}
