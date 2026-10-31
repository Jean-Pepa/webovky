"use client";

import { useEffect, useRef } from "react";
import { tabOf, type Pos } from "@/lib/harmonica";
import { midiName, mod12, type Pattern } from "@/lib/music";
import type { SongDef, SongEvent } from "@/lib/songs";
import type { PracticeState } from "./hooks";

const LEVEL = ["", "●○○", "●●○", "●●●"];

/**
 * Lišta písničky: název, tlačítka a tabulatura (4 = foukání, -4 = tah, < = šoupátko).
 * Ťuknutím na notu se z ní začne hrát / procvičovat.
 */
export default function SongBar({
  def,
  keyLabel,
  events,
  positions,
  pattern,
  activeIdx,
  cursor,
  practice,
  targetIdx,
  sound,
  best,
  onSeek,
  onToggleSound,
  onTogglePractice,
  onRestart,
}: {
  def: SongDef;
  keyLabel: string;
  events: SongEvent[];
  positions: (Pos | null)[];
  pattern: Pattern;
  activeIdx: number | null;
  cursor: number;
  practice: PracticeState;
  targetIdx: number | null;
  sound: boolean;
  best: number | null;
  onSeek: (idx: number) => void;
  onToggleSound: () => void;
  onTogglePractice: () => void;
  onRestart: () => void;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const focusIdx = activeIdx ?? cursor;

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>(`[data-idx="${focusIdx}"]`);
    if (!item) return;
    const left = item.offsetLeft - el.clientWidth / 2 + item.offsetWidth / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [focusIdx, def.id, keyLabel]);

  const notes = events.filter((e) => e.midi !== null);
  const doneCount = Object.keys(practice.marks).length;
  const firstTry = Object.values(practice.marks).filter((m) => m === "ok").length;
  const target = targetIdx !== null ? events[targetIdx] : null;
  const targetPos = targetIdx !== null ? positions[targetIdx] : null;

  return (
    <section className="song-bar" aria-label="Song">
      <div className="song-head">
        <div className="song-title">
          {def.title}
          <span className="song-by"> · {def.by}</span>
          <span className="song-level" title={`Level ${def.level}`}>
            {" "}
            {LEVEL[def.level]}
          </span>
        </div>
        <div className="song-meta">
          Key {keyLabel} · {notes.length} notes{best !== null ? ` · best ${best}%` : ""}
        </div>
        <div className="song-actions">
          {practice.on && target && (
            <span className="song-stat" role="status">
              Play <b>{targetPos ? tabOf(targetPos) : "?"}</b> {target.name}
              {practice.wrong !== null && <span className="song-wrong"> · you play {midiName(practice.wrong)}</span>} ·{" "}
              {doneCount}/{doneCount + notes.filter((n) => n.idx >= (target?.idx ?? 0)).length}
            </span>
          )}
          {practice.done && (
            <span className="song-stat done" role="status">
              🎉 {doneCount ? Math.round((firstTry / doneCount) * 100) : 0}% first try · {practice.misses} miss
              {practice.misses === 1 ? "" : "es"}
            </span>
          )}
          <button
            type="button"
            className={`song-btn ${sound ? "on" : ""}`}
            aria-pressed={sound}
            onClick={onToggleSound}
            title="When on, ▶ plays the melody. When off, ▶ only highlights the holes so you can play along."
          >
            {sound ? "🔈 Melody" : "🔇 Play-along"}
          </button>
          <button type="button" className={`song-btn ${practice.on ? "on" : ""}`} aria-pressed={practice.on} onClick={onTogglePractice}>
            🎤 {practice.done ? "Again" : "Practice"}
          </button>
          <button type="button" className="song-btn" aria-label="Back to start" onClick={onRestart}>
            ⏮
          </button>
        </div>
      </div>

      <div className="song-strip" ref={strip}>
        {events.map((e) => {
          const pos = positions[e.idx];
          const w = 0.82 + 0.22 * Math.min(e.dur, 3);
          const mark = practice.marks[e.idx];
          const cls = [
            "tab",
            e.midi === null ? "rest" : mod12(e.midi) === pattern.rootPc ? "root" : "in",
            !pos && e.midi !== null ? "off" : "",
            activeIdx === e.idx ? "now" : "",
            mark ?? "",
            activeIdx === null && cursor === e.idx && cursor > 0 ? "cursor" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <span key={e.idx} className="tab-wrap">
              {e.bar && <span className="bar-line" aria-hidden="true" />}
              <button
                type="button"
                className={cls}
                data-idx={e.idx}
                style={{ ["--w" as string]: w }}
                onClick={() => onSeek(e.idx)}
                aria-label={e.midi === null ? "Rest" : `${e.name}, ${pos ? tabOf(pos) : "out of range"}`}
              >
                {e.midi === null ? (
                  <span className="n">𝄽</span>
                ) : (
                  <>
                    <span className="t">{pos ? tabOf(pos) : "–"}</span>
                    <span className="n">{e.name}</span>
                  </>
                )}
              </button>
            </span>
          );
        })}
      </div>
    </section>
  );
}
