"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { Property } from "@/lib/store";
import { SAFETY_NOTE, findElement } from "@/lib/elements";
import { formatDay } from "@/lib/deadlines";
import { ElementChip } from "@/components/elements/ElementChip";
import { elementHref } from "@/components/elements/element-utils";
import { IconAlert, IconSearch, IconSparkles } from "@/components/Icons";
import {
  LOCATION_QUESTION_RE,
  bookContext,
  localSearch,
  type BookAnswer,
  type LocalHit,
} from "./book";

type State =
  | { kind: "idle" }
  | { kind: "loading"; question: string }
  | { kind: "ai"; question: string; answer: BookAnswer }
  | { kind: "local"; question: string; hits: LocalHit[]; reason: string };

const EXAMPLES = [
  "Kdy byla poslední revize elektroinstalace?",
  "Kudy vede kabel v obývacím pokoji?",
  "Kdy mám další servis kotle?",
  "Do kdy platí záruka na kotel?",
];

const LOCAL_REASONS: Record<string, string> = {
  not_configured: "AI tu zatím není zapnutá (ukázkový režim) — tady je, co jsem v knize našel:",
  failed: "AI teď neodpověděla — tady je, co jsem v knize našel:",
};

// „Zeptej se knihy": otázka na dům → odpověď jen z dat knihy (AI), bez AI hledání v zápisech.
// Nikdy netvrdí, že je někde bezpečné vrtat — u poloh vždy připomene detektor.
export function BookQuestion({
  property,
  elementId,
  className = "",
}: {
  property: Property;
  elementId?: string; // otázky k jednomu prvku (stránka „Vše o prvku")
  className?: string;
}) {
  const [question, setQuestion] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const run = useRef(0);
  const inputId = useId();
  const focus = findElement(property, elementId);

  async function ask(q: string) {
    const text = q.trim();
    if (!text) return;
    const my = ++run.current;
    setState({ kind: "loading", question: text });
    const full = focus ? `${text}\n(Otázka se týká prvku „${focus.name}“, id ${focus.id}.)` : text;
    let reason = "failed";
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: full, context: bookContext(property, focus?.id) }),
      });
      if (res.ok) {
        const data = (await res.json()) as Partial<BookAnswer>;
        if (my !== run.current) return;
        if (typeof data.answer === "string" && data.answer) {
          setState({
            kind: "ai",
            question: text,
            answer: { answer: data.answer, elementIds: Array.isArray(data.elementIds) ? data.elementIds : [] },
          });
          return;
        }
      } else if (res.status === 503) {
        reason = "not_configured";
      }
    } catch {
      // síť — spadneme na hledání v knize
    }
    if (my !== run.current) return;
    setState({ kind: "local", question: text, hits: localSearch(property, text), reason: LOCAL_REASONS[reason] });
  }

  const asked = state.kind === "idle" ? "" : state.question;
  const showSafety =
    state.kind !== "idle" &&
    state.kind !== "loading" &&
    (LOCATION_QUESTION_RE.test(asked) || (state.kind === "ai" && LOCATION_QUESTION_RE.test(state.answer.answer)));

  return (
    <section className={`card p-5 ${className}`}>
      <div className="flex items-center gap-2">
        <IconSparkles className="h-4 w-4 shrink-0 text-teal-700" />
        <h2 className="text-sm font-semibold text-stone-900">Zeptej se knihy</h2>
      </div>
      <p className="mt-1 text-xs text-stone-500">
        Odpovídá jen z toho, co je v knize domu{focus ? ` u prvku ${focus.name}` : ""} — nic si nevymýšlí.
      </p>

      <form
        className="mt-3 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Otázka
        </label>
        <input
          id={inputId}
          className="input min-h-11"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={focus ? `Např. Kdy byla poslední revize?` : "Např. Kdy byla poslední revize elektro?"}
          maxLength={500}
          enterKeyHint="send"
        />
        <button type="submit" className="btn-primary min-h-11 shrink-0" disabled={!question.trim() || state.kind === "loading"}>
          <IconSearch className="h-4 w-4" />
          Zeptat se
        </button>
      </form>

      {state.kind === "idle" && !focus && (
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setQuestion(q);
                ask(q);
              }}
              className="min-h-10 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-left text-xs text-stone-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {state.kind === "loading" && (
        <div role="status" aria-live="polite" className="mt-4 flex items-center gap-3 text-sm text-stone-500">
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-teal-700 border-t-transparent" aria-hidden />
          Listuji knihou domu…
        </div>
      )}

      {state.kind === "ai" && (
        <div className="mt-4 space-y-3" aria-live="polite">
          <p className="whitespace-pre-line break-words text-sm leading-relaxed text-stone-800">{state.answer.answer}</p>
          <AnswerElements property={property} ids={state.answer.elementIds} />
          <p className="text-xs text-stone-400">Odpověď AI z dat knihy — důležité věci ověřte v dokladech.</p>
        </div>
      )}

      {state.kind === "local" && (
        <div className="mt-4 space-y-2" aria-live="polite">
          <p className="text-xs text-stone-500">{state.reason}</p>
          {state.hits.length === 0 ? (
            <p className="text-sm text-stone-600">
              K této otázce jsem v knize nic nenašel. Zkuste jiná slova, nebo do knihy doplňte zápis či doklad.
            </p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {state.hits.map((h, i) => (
                <HitRow key={`${h.kind}-${i}`} property={property} hit={h} />
              ))}
            </ul>
          )}
        </div>
      )}

      {showSafety && (
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
          <IconAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          {SAFETY_NOTE}
        </p>
      )}
    </section>
  );
}

function AnswerElements({ property, ids }: { property: Property; ids: string[] }) {
  const els = ids.map((id) => findElement(property, id)).filter((e) => !!e);
  if (els.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {els.map((el) => (
        <ElementChip key={el.id} element={el} href={elementHref(property.id, el.id)} />
      ))}
    </div>
  );
}

function HitRow({ property, hit }: { property: Property; hit: LocalHit }) {
  const el = findElement(property, hit.elementId);
  const body = (
    <>
      <p className="text-xs text-stone-400">
        {hit.label}
        {hit.date ? ` · ${formatDay(hit.date)}` : ""}
        {el && hit.kind !== "element" ? ` · ${el.name}` : ""}
      </p>
      <p className="break-words text-sm font-medium text-stone-800">{hit.title}</p>
      {hit.detail && <p className="break-words text-xs text-stone-500">{hit.detail}</p>}
    </>
  );
  return (
    <li>
      {el ? (
        <Link href={elementHref(property.id, el.id)} className="block min-h-10 rounded-lg py-2 transition hover:bg-stone-50">
          {body}
        </Link>
      ) : (
        <div className="py-2">{body}</div>
      )}
    </li>
  );
}
