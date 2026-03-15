"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { BlogPost } from "@/types/database";
import StorySlide from "./StorySlide";

interface ArchStoriesProps {
  locale: string;
}

export default function ArchStories({ locale }: ArchStoriesProps) {
  const [stories, setStories] = useState<BlogPost[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 7000;
  const TICK = 50;

  useEffect(() => {
    fetch("/api/stories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setStories(data);
        else setError("Nepodařilo se načíst stories");
      })
      .catch(() => setError("Chyba připojení"))
      .finally(() => setLoading(false));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= stories.length || index === current) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setProgress(0);
        setTimeout(() => setTransitioning(false), 50);
      }, 300);
    },
    [stories.length, current]
  );

  const goNext = useCallback(() => {
    if (current >= stories.length - 1) {
      setIsPlaying(false);
      return;
    }
    goTo(current + 1);
  }, [current, stories.length, goTo]);

  const goPrev = useCallback(() => {
    goTo(current - 1);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isPlaying && stories.length > 0) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + (TICK / DURATION) * 100;
          if (next >= 100) {
            goNext();
            return 0;
          }
          return next;
        });
      }, TICK);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, stories.length, goNext]);

  useEffect(() => {
    setProgress(0);
  }, [current]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="w-full aspect-[21/9] rounded-2xl bg-black/[0.03] animate-pulse" />
      </div>
    );
  }

  if (error || stories.length === 0) return null;

  const story = stories[current];
  const isEn = locale === "en";
  const title = isEn ? story.title_en : story.title_cs;

  return (
    <div className="w-full">
      {/* Main viewer */}
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-xl"
        style={{ aspectRatio: "21/9", minHeight: 280 }}
      >
        {/* Slide content with fade transition */}
        <div
          className="absolute inset-0"
          style={{
            opacity: transitioning ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {story.story_data && (
            <StorySlide
              title={title}
              coverImage={story.cover_image_url}
              storyData={story.story_data}
              locale={locale}
            />
          )}
        </div>

        {/* Progress bars — top */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-6 pt-4">
          {stories.map((_, i) => (
            <button
              key={i}
              className="h-[3px] flex-1 rounded-full overflow-hidden cursor-pointer"
              style={{ background: "rgba(255,255,255,0.2)" }}
              onClick={() => goTo(i)}
            >
              <div
                className="h-full rounded-full"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  width:
                    i < current
                      ? "100%"
                      : i === current
                      ? `${progress}%`
                      : "0%",
                  transition: i === current ? "none" : "width 0.3s",
                }}
              />
            </button>
          ))}
        </div>

        {/* Left/right click zones */}
        <div
          className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
          onClick={goPrev}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer"
          onClick={goNext}
        />
        <div
          className="absolute inset-y-0 left-1/3 right-1/3 z-10 cursor-pointer"
          onClick={() => setIsPlaying((p) => !p)}
        />

        {/* Arrow buttons */}
        {current > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8L10 13"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        {current < stories.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3L11 8L6 13"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Play overlay — first visit only */}
        {!isPlaying && progress === 0 && current === 0 && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
            onClick={() => setIsPlaying(true)}
            style={{ background: "rgba(0,0,0,0.2)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              <svg width="22" height="26" viewBox="0 0 20 24" fill="none">
                <path d="M3 1L17 12L3 23V1Z" fill="white" opacity="0.9" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar — counter + source info */}
      <div className="flex items-center justify-between mt-3 px-1">
        <span
          className="text-[11px] tracking-[2px] uppercase"
          style={{ opacity: 0.35 }}
        >
          {current + 1} / {stories.length}
        </span>
        {story.story_data?.subtitle && (
          <span
            className="text-[11px] tracking-[1px]"
            style={{ opacity: 0.3 }}
          >
            {story.story_data.subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
