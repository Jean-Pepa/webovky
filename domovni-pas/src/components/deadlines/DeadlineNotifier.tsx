"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { canSeeProperty } from "@/lib/access";
import { countDeadlines, deadlineSummaryText, localIsoDate } from "@/lib/deadlines";
import { NOTIFIED_DAY_KEY, notificationsSupported, showSystemNotification } from "./notify";

// Upozornění na termíny po přihlášení: nejvýš jednou denně v tomto prohlížeči,
// a jen když uživatel upozornění sám povolil (o povolení se tu nikdy neptáme).
export function DeadlineNotifier() {
  const { properties, hydrated, role } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated || !role) return;
    if (!notificationsSupported() || Notification.permission !== "granted") return;

    const today = localIsoDate();
    try {
      if (localStorage.getItem(NOTIFIED_DAY_KEY) === today) return;
    } catch {
      return; // bez úložiště bychom upozorňovali při každém načtení
    }

    const counts = countDeadlines(properties.filter((p) => canSeeProperty(p, role)));
    if (counts.overdue + counts.soon === 0) return;

    try {
      localStorage.setItem(NOTIFIED_DAY_KEY, today);
    } catch {
      return;
    }
    void showSystemNotification("BULO – termíny a revize", deadlineSummaryText(counts), () =>
      router.push("/pripominky"),
    );
  }, [hydrated, role, properties, router]);

  return null;
}
