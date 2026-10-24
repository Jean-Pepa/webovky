"use client";

import Link from "next/link";
import { Suspense, useState, useSyncExternalStore } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useStore, type Invite, type Property } from "@/lib/store";
import { canEditProperty, canSeeProperty } from "@/lib/access";
import { ELEMENT_CATEGORIES, ELEMENT_CATEGORY_ORDER, findElement } from "@/lib/elements";
import { INVITE_ROLES, type InviteRole } from "@/lib/submission";
import { publishInvite, revokeInviteRemote, type PublishResult } from "@/lib/inbox";
import { isInviteExpired, todayIso } from "@/lib/submission-proposal";
import { addDays, formatDay } from "@/lib/deadlines";
import { sortElements, elementHref } from "@/components/elements/element-utils";
import { Loading } from "@/components/Loading";
import { BackLink } from "@/components/BackLink";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { PrintButton } from "@/components/ui/PrintButton";
import { QrCode } from "@/components/QrCode";
import { Logo } from "@/components/Logo";
import { IconExternal, IconShield, IconUsers } from "@/components/Icons";

// Platnost pozvánky (dny)
const VALIDITY_OPTIONS = [
  { days: 7, label: "Týden" },
  { days: 30, label: "Měsíc" },
  { days: 90, label: "3 měsíce" },
  { days: 365, label: "Rok" },
] as const;

const noopSubscribe = () => () => {};

type Shown = { token: string; publish: PublishResult | "pending" };

export default function InvitesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Invites />
    </Suspense>
  );
}

function Invites() {
  const { id } = useParams<{ id: string }>();
  const prvek = useSearchParams().get("prvek") ?? undefined;
  const { getProperty, hydrated, role, createInvite, revokeInvite, ensureOwnerKey } = useStore();
  const origin = useSyncExternalStore(noopSubscribe, () => window.location.origin, () => "");
  const [shown, setShown] = useState<Shown | null>(null);
  const [revokeError, setRevokeError] = useState<{ token: string; message: string } | null>(null);

  if (!hydrated) return <Loading />;

  const property = getProperty(id);
  const visible = property && (!role || canSeeProperty(property, role));
  const editable = property && role ? canEditProperty(property, role) : false;
  if (!property || !visible || !editable) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-stone-500">
          {!property
            ? "Nemovitost nenalezena."
            : !visible
              ? "K této nemovitosti nemáte přístup."
              : "Tuto nemovitost máte jen ke čtení — pozvánky pro řemeslníky může vytvářet jen ten, kdo ji spravuje."}
        </p>
        <Link href={property && visible ? `/nemovitost/${id}` : "/prehled"} className="btn-secondary mt-4">
          {property && visible ? "Zpět na nemovitost" : "Zpět na přehled"}
        </Link>
      </div>
    );
  }

  const element = findElement(property, prvek);
  const invites = [...(property.invites ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const shownInvite = shown ? invites.find((i) => i.token === shown.token) : undefined;

  async function publish(p: Property, invite: Invite, ownerKey: string) {
    setShown({ token: invite.token, publish: "pending" });
    const result = await publishInvite(p, invite, ownerKey);
    setShown((s) => (s && s.token === invite.token ? { ...s, publish: result } : s));
  }

  function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!property) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const roleValue = String(fd.get("role") ?? "");
    const inviteRole: InviteRole = roleValue === "INSPECTOR" ? "INSPECTOR" : "CRAFTSMAN";
    const elementId = String(fd.get("elementId") ?? "") || undefined;
    const label = String(fd.get("label") ?? "").trim().slice(0, 120) || undefined;
    const days = Number(fd.get("days")) || 30;
    const invite = createInvite(id, {
      role: inviteRole,
      elementId: elementId && findElement(property, elementId) ? elementId : undefined,
      label,
      expiresAt: addDays(todayIso(), days),
    });
    const ownerKey = ensureOwnerKey(id);
    form.reset();
    void publish(property, invite, ownerKey);
  }

  function show(invite: Invite) {
    if (!property) return;
    setRevokeError(null);
    // znovu zveřejníme (aktuální prvky domu) a zjistíme, jestli běží server
    void publish(property, invite, ensureOwnerKey(id));
  }

  async function revoke(invite: Invite) {
    if (!property) return;
    if (!confirm("Zrušit pozvánku? Odkaz a QR kód přestanou fungovat.")) return;
    revokeInvite(id, invite.token);
    if (shown?.token === invite.token) setShown(null);
    setRevokeError(null);
    const r = await revokeInviteRemote(invite.token, property.ownerKey);
    if (!r.ok) setRevokeError({ token: invite.token, message: r.message });
  }

  async function retryRevoke(token: string) {
    if (!property) return;
    setRevokeError(null);
    const r = await revokeInviteRemote(token, property.ownerKey);
    if (!r.ok) setRevokeError({ token, message: r.message });
  }

  const elements = sortElements(property.elements ?? []);
  const today = todayIso();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="no-print">
        {element ? (
          <BackLink href={elementHref(id, element.id)}>Zpět na prvek</BackLink>
        ) : (
          <BackLink href={`/nemovitost/${id}`}>Zpět na nemovitost</BackLink>
        )}
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-stone-900">Pozvat řemeslníka</h1>
        <p className="mt-1 break-words text-sm text-stone-500">
          {property.name}
          {element ? ` · ${element.name}` : ""}
        </p>
        <p className="mt-3 text-sm text-stone-600">
          Pošlete odkaz nebo nalepte QR kód (třeba na rozvaděč). Řemeslník nebo revizní technik do
          knihy zapíše práci a nahraje protokol či fotky — bez registrace. Do knihy se nic neuloží,
          dokud to nepotvrdíte.
        </p>

        <form onSubmit={create} className="card mt-6 space-y-4 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="role">
                Koho zvete
              </label>
              <select id="role" name="role" className="input min-h-10" defaultValue="CRAFTSMAN">
                {Object.entries(INVITE_ROLES).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="days">
                Platnost
              </label>
              <select id="days" name="days" className="input min-h-10" defaultValue="30">
                {VALIDITY_OPTIONS.map((o) => (
                  <option key={o.days} value={o.days}>
                    {o.label} (do {formatDay(addDays(today, o.days))})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="elementId">
              Ke kterému prvku
            </label>
            <select
              key={element?.id ?? "-"}
              id="elementId"
              name="elementId"
              className="input min-h-10"
              defaultValue={element?.id ?? ""}
            >
              <option value="">Celý dům (řemeslník si prvek vybere)</option>
              {ELEMENT_CATEGORY_ORDER.map((cat) => {
                const list = elements.filter((el) => el.category === cat);
                if (list.length === 0) return null;
                return (
                  <optgroup key={cat} label={ELEMENT_CATEGORIES[cat]}>
                    {list.map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.name}
                        {el.room ? ` (${el.room})` : ""}
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
            <p className="mt-1.5 text-xs text-stone-400">
              Pozvánka k prvku je nejbezpečnější — řemeslník neuvidí ani názvy ostatních prvků.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="label">
              Pro koho
            </label>
            <input
              id="label"
              name="label"
              maxLength={120}
              className="input"
              placeholder="Např. Elektro Dvořák, revize rozvaděče"
            />
          </div>

          <button type="submit" className="btn-primary w-full sm:w-auto">
            <IconUsers className="h-4 w-4" />
            Vytvořit pozvánku
          </button>
        </form>
      </div>

      {shown && shownInvite && (
        <InvitePanel
          property={property}
          invite={shownInvite}
          publish={shown.publish}
          origin={origin}
          onRetry={() => show(shownInvite)}
          onClose={() => setShown(null)}
        />
      )}

      <section className="no-print mt-8">
        <h2 className="text-lg font-semibold text-stone-900">Pozvánky</h2>
        {revokeError && (
          <div role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">
            <p className="break-words">
              Pozvánka je zrušená tady, ale na serveru se ji nepodařilo vypnout: {revokeError.message}
            </p>
            <button
              type="button"
              onClick={() => retryRevoke(revokeError.token)}
              className="mt-1 min-h-10 font-medium underline"
            >
              Zkusit znovu
            </button>
          </div>
        )}
        {invites.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">Zatím žádná pozvánka.</p>
        ) : (
          <ul className="card mt-3 divide-y divide-stone-100">
            {invites.map((inv) => {
              const expired = isInviteExpired(inv, today);
              const active = !inv.revoked && !expired;
              const el = findElement(property, inv.elementId);
              return (
                <li key={inv.token} className="p-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {inv.revoked ? (
                      <Badge color="gray">Zrušená</Badge>
                    ) : expired ? (
                      <Badge color="amber">Vypršela</Badge>
                    ) : (
                      <Badge color="emerald">Aktivní</Badge>
                    )}
                    <Badge color={inv.role === "INSPECTOR" ? "violet" : "blue"}>
                      {INVITE_ROLES[inv.role] ?? inv.role}
                    </Badge>
                  </div>
                  <p className="mt-1.5 break-words text-sm font-medium text-stone-900">
                    {inv.label || "Bez označení"}
                  </p>
                  <p className="mt-0.5 break-words text-xs text-stone-500">
                    {el ? el.name : inv.elementId ? "Prvek už v knize není" : "Celý dům"}
                    {" · "}
                    {expired && !inv.revoked ? "platila do " : "platí do "}
                    {formatDay(inv.expiresAt)}
                  </p>
                  {active && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => show(inv)}
                        className="btn-secondary btn-sm min-h-10"
                      >
                        Odkaz a QR
                      </button>
                      <button
                        type="button"
                        onClick={() => revoke(inv)}
                        className="btn-danger btn-sm min-h-10"
                      >
                        Zrušit
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="no-print mt-8 rounded-2xl bg-stone-100/70 p-5 text-sm text-stone-600">
        <h2 className="flex items-center gap-2 font-semibold text-stone-900">
          <IconShield className="h-4 w-4 text-teal-700" />
          Co řemeslník uvidí a může
        </h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            Jen název domu a obec, a prvek, ke kterému ho zvete. U pozvánky na celý dům i seznam
            prvků (název, místnost), aby mohl vybrat, čeho se práce týká.
          </li>
          <li>
            Formulář pro zápis: typ práce, datum, popis, cena, protokol nebo faktura a fotky. Z
            protokolu může údaje předvyplnit AI.
          </li>
          <li>Historii, dokumenty ani nic dalšího z knihy domu neuvidí.</li>
          <li>
            Každý zápis počká v sekci „Čeká na tebe“ na detailu domu. Do knihy se uloží, až ho
            jedním klepnutím potvrdíte — nebo ho odmítnete.
          </li>
          <li>Pozvánku můžete kdykoli zrušit; po konci platnosti přestane fungovat sama.</li>
        </ul>
      </section>
    </div>
  );
}

function InvitePanel({
  property,
  invite,
  publish,
  origin,
  onRetry,
  onClose,
}: {
  property: Property;
  invite: Invite;
  publish: PublishResult | "pending";
  origin: string;
  onRetry: () => void;
  onClose: () => void;
}) {
  const url = origin ? `${origin}/zapis/${invite.token}` : "";
  const el = findElement(property, invite.elementId);
  const failed = typeof publish === "object";

  return (
    <section className="mt-6">
      <div className="no-print card p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-stone-900">Odkaz pro řemeslníka</h2>
            <p className="mt-0.5 break-words text-xs text-stone-500">
              {invite.label || INVITE_ROLES[invite.role]} · {el ? el.name : "celý dům"} · platí do{" "}
              {formatDay(invite.expiresAt)}
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-ghost btn-sm min-h-10 shrink-0">
            Skrýt
          </button>
        </div>

        {publish === "pending" && <p className="mt-3 text-xs text-stone-500">Zveřejňuji pozvánku…</p>}
        {publish === "server" && (
          <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">
            Pozvánka je aktivní — odkaz i QR fungují na jakémkoli telefonu.
          </p>
        )}
        {publish === "local" && (
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            <strong>Ukázkový režim: odkaz funguje jen v tomto prohlížeči.</strong> Server pro
            pozvánky není nastavený, takže zápis můžete vyzkoušet tady (otevřete odkaz v nové
            záložce). V ostrém provozu odkaz funguje pro kohokoli.
          </p>
        )}
        {failed && (
          <div role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">
            <p className="break-words">Pozvánku se nepodařilo zveřejnit: {publish.error}</p>
            <button type="button" onClick={onRetry} className="mt-1 min-h-10 font-medium underline">
              Zkusit znovu
            </button>
          </div>
        )}

        {url && (
          <>
            <input
              readOnly
              value={url}
              aria-label="Odkaz pro řemeslníka"
              onFocus={(e) => e.currentTarget.select()}
              className="input mt-3 font-mono text-xs"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton text={url} className="btn-secondary btn-sm min-h-10" />
              <a href={url} target="_blank" rel="noreferrer" className="btn-ghost btn-sm min-h-10">
                <IconExternal className="h-4 w-4" />
                Otevřít
              </a>
              <PrintButton />
            </div>
          </>
        )}
      </div>

      {/* Samolepka s QR — při tisku zůstane jen ona */}
      {url && (
        <div className="card print-clean mx-auto mt-4 max-w-sm p-5 text-center sm:p-8">
          <div className="-mx-5 -mt-5 mb-5 h-1.5 rounded-t-2xl bg-brass sm:-mx-8 sm:-mt-8" />
          <Logo />
          <p className="mt-4 break-words text-lg font-semibold tracking-tight text-stone-900">
            {property.name}
          </p>
          {el && <p className="mt-0.5 break-words text-sm font-medium text-teal-700">{el.name}</p>}
          <div className="mt-5 flex justify-center">
            <QrCode value={url} size={176} />
          </div>
          <p className="mt-4 text-sm font-medium text-stone-800">
            Naskenujte a zapište práci do knihy domu
          </p>
          <p className="mt-1 text-xs text-stone-400">
            {INVITE_ROLES[invite.role]} · bez registrace · platí do {formatDay(invite.expiresAt)}
          </p>
          <p className="mt-5 border-t border-stone-200 pt-3 text-xs tracking-[0.2em] text-stone-400">
            BULO · KNIHA DOMU
          </p>
        </div>
      )}
    </section>
  );
}
