"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonProgress, Routine, Settings } from "@/lib/store";
import { LESSONS, type Lesson, type QuizQ } from "./lessons";
import { LessonCtx } from "./widgets";

type Progress = Record<string, LessonProgress>;
type SetProgress = (fn: (p: Progress) => Progress) => void;

const EMPTY: LessonProgress = { opened: false, completed: false, seconds: 0, interactions: 0, step: 0 };

const isUnlocked = (i: number, progress: Progress) =>
  i < 3 || LESSONS.slice(0, i).every((l) => progress[l.id]?.completed);

export default function Learning({
  progress,
  setProgress,
  onClose,
  onPractice,
  onAddRoutine,
}: {
  progress: Progress;
  setProgress: SetProgress;
  onClose: () => void;
  onPractice: (p: Partial<Settings>) => void;
  onAddRoutine: (r: Routine) => void;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const done = LESSONS.filter((l) => progress[l.id]?.completed).length;

  const patch = (id: string, fn: (p: LessonProgress) => Partial<LessonProgress>) =>
    setProgress((all) => {
      const cur = { ...EMPTY, ...all[id] };
      return { ...all, [id]: { ...cur, ...fn(cur) } };
    });

  const start = (i: number) => {
    patch(LESSONS[i].id, () => ({ opened: true }));
    setOpenIdx(i);
  };

  return (
    <div className="learn" role="dialog" aria-label="Lessons">
      <div className="learn-head">
        <h1 className="learn-title">
          All Lessons | {done} of {LESSONS.length} completed
        </h1>
        <button type="button" className="close-circle" aria-label="Close lessons" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="lessons">
        {LESSONS.map((l, i) => {
          const p = progress[l.id];
          const unlocked = isUnlocked(i, progress);
          const completed = !!p?.completed;
          return (
            <div key={l.id} className={`lesson-card ${unlocked ? "" : "locked"} ${completed ? "done" : ""}`}>
              <span className="lesson-icon" aria-hidden="true">
                {!unlocked ? "🔒" : completed ? "✅" : "📖"}
              </span>
              <div className="lesson-text">
                <div className="lesson-num">Lesson {i + 1}</div>
                <div className="lesson-name">{l.title}</div>
                {unlocked && p?.opened && (
                  <div className="lesson-stats">
                    Time spent: {Math.floor((p.seconds ?? 0) / 60)} min • Interactions: {p.interactions ?? 0}
                  </div>
                )}
              </div>
              {unlocked ? (
                <button type="button" className={`start-btn ${completed ? "review" : ""}`} onClick={() => start(i)}>
                  {completed ? "Review" : p?.opened && (p.step ?? 0) > 0 ? "Continue" : "Start"}
                </button>
              ) : (
                <span className="locked-note">Complete the previous lessons to unlock</span>
              )}
            </div>
          );
        })}
      </div>

      {openIdx !== null && (
        <LessonView
          key={openIdx}
          lesson={LESSONS[openIdx]}
          index={openIdx}
          prog={{ ...EMPTY, ...progress[LESSONS[openIdx].id] }}
          patch={(fn) => patch(LESSONS[openIdx].id, fn)}
          nextUnlocked={openIdx + 1 < LESSONS.length}
          onClose={() => setOpenIdx(null)}
          onNext={() => start(openIdx + 1)}
          ctx={{
            practice: onPractice,
            addRoutine: onAddRoutine,
          }}
        />
      )}
    </div>
  );
}

// --------------------------------------------------------------- lekce

function LessonView({
  lesson,
  index,
  prog,
  patch,
  nextUnlocked,
  onClose,
  onNext,
  ctx,
}: {
  lesson: Lesson;
  index: number;
  prog: LessonProgress;
  patch: (fn: (p: LessonProgress) => Partial<LessonProgress>) => void;
  nextUnlocked: boolean;
  onClose: () => void;
  onNext: () => void;
  ctx: { practice: (p: Partial<Settings>) => void; addRoutine: (r: Routine) => void };
}) {
  const last = lesson.steps.length - 1;
  const [step, setStep] = useState(() => (prog.completed ? 0 : Math.min(prog.step ?? 0, last)));
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);
  const pending = useRef(0);
  const patchRef = useRef(patch);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    patchRef.current = patch;
  }, [patch]);

  // Čas strávený v lekci (ukládá se po 5 s a při zavření).
  useEffect(() => {
    const flush = () => {
      const add = pending.current;
      if (!add) return;
      pending.current = 0;
      patchRef.current((p) => ({ seconds: (p.seconds ?? 0) + add }));
    };
    const t = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      pending.current += 1;
      if (pending.current >= 5) flush();
    }, 1000);
    return () => {
      window.clearInterval(t);
      flush();
    };
  }, []);

  const lessonCtx = useMemo(
    () => ({
      interact: () => patchRef.current((p) => ({ interactions: (p.interactions ?? 0) + 1 })),
      practice: ctx.practice,
      addRoutine: ctx.addRoutine,
    }),
    [ctx.practice, ctx.addRoutine],
  );

  const go = (n: number) => {
    setStep(n);
    if (!prog.completed) patch(() => ({ step: n }));
    bodyRef.current?.scrollTo({ top: 0 });
  };

  const s = lesson.steps[step];
  const needsQuiz = !!s.quiz && !prog.completed;

  return (
    <LessonCtx.Provider value={lessonCtx}>
      <div className="lesson-view" role="dialog" aria-label={lesson.title}>
        <div className="lv-head">
          <button type="button" className="lv-back" onClick={onClose}>
            ‹ All Lessons
          </button>
          <div className="lv-titles">
            <div className="lv-kicker">Lesson {index + 1}</div>
            <div className="lv-title">{lesson.title}</div>
          </div>
          <div className="lv-meta">
            Step {step + 1} of {lesson.steps.length}
            <br />
            {Math.floor((prog.seconds ?? 0) / 60)} min • {prog.interactions ?? 0} interactions
          </div>
        </div>
        <div className="lv-progress" aria-hidden="true">
          {lesson.steps.map((_, i) => (
            <span key={i} className={i <= step || finished ? "done" : ""} />
          ))}
        </div>

        <div className="lv-body" ref={bodyRef}>
          <div className="lv-card">
            {finished ? (
              <div className="lv-done">
                <div className="big">🎉</div>
                <h3>Lesson complete!</h3>
                <p>
                  {lesson.title} — {Math.floor((prog.seconds ?? 0) / 60)} min, {prog.interactions ?? 0} interactions.
                </p>
                <div className="actions">
                  <button type="button" className="lv-btn" onClick={onClose}>
                    All Lessons
                  </button>
                  {nextUnlocked && (
                    <button type="button" className="lv-btn primary" onClick={onNext}>
                      Next lesson ›
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <h2 className="lv-step-title">{s.title}</h2>
                <div className="lv-text">{s.body}</div>
                {s.widget && <div className="lv-widget">{s.widget}</div>}
                {s.quiz && (
                  <div className="lv-widget">
                    <Quiz key={step} questions={s.quiz} onSolved={setSolved} interact={lessonCtx.interact} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {!finished && (
          <div className="lv-foot">
            <button type="button" className="lv-btn" disabled={step === 0} onClick={() => go(step - 1)}>
              ‹ Previous
            </button>
            {step < last ? (
              <button type="button" className="lv-btn primary" onClick={() => go(step + 1)}>
                Next ›
              </button>
            ) : (
              <button
                type="button"
                className="lv-btn success"
                disabled={needsQuiz && !solved}
                onClick={() => {
                  patch(() => ({ completed: true, step: 0 }));
                  setFinished(true);
                }}
              >
                {needsQuiz && !solved ? "Answer all questions" : prog.completed ? "Finish review ✓" : "Complete Lesson ✓"}
              </button>
            )}
          </div>
        )}
      </div>
    </LessonCtx.Provider>
  );
}

// ----------------------------------------------------------------- kvíz

function Quiz({
  questions,
  onSolved,
  interact,
}: {
  questions: QuizQ[];
  onSolved: (ok: boolean) => void;
  interact: () => void;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const correct = answers.filter((a, i) => a === questions[i].answer).length;

  const answer = (qi: number, oi: number) => {
    interact();
    const next = answers.map((a, i) => (i === qi ? oi : a));
    setAnswers(next);
    onSolved(next.every((a, i) => a === questions[i].answer));
  };

  return (
    <div className="quiz">
      {questions.map((q, qi) => {
        const a = answers[qi];
        return (
          <div className="quiz-q" key={qi}>
            <div className="q">
              {qi + 1}. {q.q}
            </div>
            <div className="quiz-opts">
              {q.options.map((o, oi) => (
                <button
                  key={oi}
                  type="button"
                  className={`quiz-opt ${a === oi ? (oi === q.answer ? "right" : "wrong") : ""}`}
                  onClick={() => answer(qi, oi)}
                >
                  {o}
                </button>
              ))}
            </div>
            {a !== null && (
              <div className="quiz-exp">
                {a === q.answer ? "✓ Correct. " : "✗ Not quite. "}
                {a === q.answer ? q.explain : "Try another answer."}
              </div>
            )}
          </div>
        );
      })}
      <div className="quiz-score">
        {correct} / {questions.length} correct
      </div>
    </div>
  );
}
