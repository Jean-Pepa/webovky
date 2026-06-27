"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { Loading } from "@/components/Loading";

// Když je zapnutý Supabase, jméno se neptáme ručně — odvodí se z přihlášeného
// e-mailu: najde se člen se stejným e-mailem, nebo se založí z jména z registrace.
export function SupabaseGate() {
  const { currentYear, canEditCurrentYear, me, setMe, dispatch } = useStore();
  const done = useRef(false);

  useEffect(() => {
    if (done.current || me || !currentYear) return;
    done.current = true;
    (async () => {
      const supabase = createSupabaseBrowser();
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      const email = (user?.email ?? "").trim();
      if (!email) {
        done.current = false;
        return;
      }
      const member = currentYear.members.find((m) => (m.email ?? "").trim().toLowerCase() === email.toLowerCase());
      if (member) {
        setMe(member.name);
        return;
      }
      const metaName = (user?.user_metadata?.name as string | undefined)?.trim();
      const name = metaName || email.split("@")[0];
      // První přihlášení bez člena → založ ho (jen jde-li ročník upravovat).
      if (canEditCurrentYear && metaName) {
        await dispatch({ type: "addMember", yearId: currentYear.id, name, roleIds: [], email });
      }
      setMe(name);
    })();
  }, [me, currentYear, canEditCurrentYear, setMe, dispatch]);

  return <Loading label="Načítám tvůj účet…" />;
}
