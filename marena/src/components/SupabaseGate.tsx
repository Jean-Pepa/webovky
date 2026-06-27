"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { sameName } from "@/lib/names";
import { Loading } from "@/components/Loading";

// Když je zapnutý Supabase, jméno se neptáme ručně — odvodí se z přihlášeného
// e-mailu: najde se člen se stejným e-mailem (nebo se napojí existující člen
// jen podle jména, pokud ještě e-mail neměl), jinak se založí nový — čekající.
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
      const metaName = (user?.user_metadata?.name as string | undefined)?.trim() || "";
      const metaPhone = (user?.user_metadata?.phone as string | undefined)?.trim() || "";

      // 1) podle e-mailu
      let member = currentYear.members.find((m) => (m.email ?? "").trim().toLowerCase() === email.toLowerCase());

      // 2) jinak napoj existujícího člena podle jména — JEN když ještě e-mail nemá
      //    (migrace starých členů ze jmenného režimu; nepřepíše cizí e-mailový účet).
      if (!member && metaName) {
        const byName = currentYear.members.find((m) => sameName(m.name, metaName) && !(m.email ?? "").trim());
        if (byName) {
          if (canEditCurrentYear) {
            await dispatch({
              type: "updateMember",
              yearId: currentYear.id,
              memberId: byName.id,
              patch: { email, phone: byName.phone || metaPhone || undefined },
            });
          }
          member = byName;
        }
      }

      if (member) {
        setMe(member.name);
        return;
      }

      // 3) nový člen → čeká na schválení správcem
      const name = metaName || email.split("@")[0];
      if (metaName) {
        await dispatch({ type: "addMember", yearId: currentYear.id, name, roleIds: [], email, phone: metaPhone || undefined, approved: false });
      }
      setMe(name);
    })();
  }, [me, currentYear, canEditCurrentYear, setMe, dispatch]);

  return <Loading label="Načítám tvůj účet…" />;
}
