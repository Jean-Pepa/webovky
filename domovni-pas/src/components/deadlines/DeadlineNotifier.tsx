"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { canEditProperty } from "@/lib/access";
import { countDeadlines, deadlineSummaryText, localIsoDate } from "@/lib/deadlines";
import { NOTIFIED_DAY_KEY, notificationsSupported, showSystemNotification } from "./notify";

// Upozornění na termíny po přihlášení: nejvýš jednou denně v tomto prohlížeči,
// a jen když uživatel upozornění sám povolil (o povolení se tu nikdy neptáme).
// Architekt termíny neřeší (stejně jako „Vyžaduje pozornost" na přehledu) — předané
// projekty má jen ke čtení a stránku termínů v menu nemá.
export function DeadlineNotifier() {
  const { properties, hydrated, role } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated || !role || role === "ARCHITECT") return;
    if (!notificationsSupported() || Notification.permission !== "granted") return;

    const today = localIsoDate();
    try {
      if (localStorage.getItem(NOTIFIED_DAY_KEY) === today) return;
    } catch {
      return; // bez úložiště bychom upozorňovali při každém načtení
    }

    // jen termíny, se kterými uživatel může něco udělat
    const counts = countDeadlines(properties.filter((p) => canEditProperty(p, role)));
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
