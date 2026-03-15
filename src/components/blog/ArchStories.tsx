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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 7000; // 7s per slide
  const TICK = 50; // progress update interval

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

  const goNext = useCallback(() => {
    setCurrent((prev) => {
      if (prev >= stories.length - 1) {
        // Stop at end
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
    setProgress(0);
  }, [stories.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => Math.max(0, prev - 1));
    setProgress(0);
  }, []);

  // Auto-advance timer
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

  // Reset progress on slide change
  useEffect(() => {
    setProgress(0);
  }, [current]);

  function handleTap(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const third = rect.width / 3;

    if (x < third) {
      goPrev();
    } else if (x > third * 2) {
      goNext();
    } else {
      setIsPlaying((p) => !p);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-[280px] h-[500px] rounded-[40px] bg-black/[0.03] animate-pulse" />
      </div>
    );
  }

  if (error || stories.length === 0) {
    return null; // Don't show anything if no stories
  }

  const story = stories[current];
  const isEn = locale === "en";
  const title = isEn ? story.title_en : story.title_cs;

  return (
    <div className="flex flex-col items-center">
      {/* Phone mockup */}
      <div className="relative" style={{ width: 280, height: 500 }}>
        {/* Phone frame */}
        <div
          className="absolute inset-0 rounded-[40px] overflow-hidden shadow-2xl"
          style={{
            border: "6px solid #1a1a1a",
            background: "#000",
          }}
        >
          {/* Notch */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-30"
            style={{
              width: 100,
              height: 22,
              background: "#1a1a1a",
              borderRadius: "0 0 16px 16px",
            }}
          />

          {/* Progress bars */}
          <div className="absolute top-[28px] left-3 right-3 z-20 flex gap-1">
            {stories.map((_, i) => (
              <div
                key={i}
                className="h-[2px] flex-1 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.25)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    width:
                      i < current
                        ? "100%"
                        : i === current
                        ? `${progress}%`
                        : "0%",
                    transition: i === current ? "none" : "width 0.3s",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Story content */}
          <div
            className="absolute inset-0 cursor-pointer select-none"
            onClick={handleTap}
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

          {/* Play overlay (only before first play) */}
          {!isPlaying && progress === 0 && current === 0 && (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
              onClick={() => setIsPlaying(true)}
              style={{ background: "rgba(0,0,0,0.3)" }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <svg
                  width="20"
                  height="24"
                  viewBox="0 0 20 24"
                  fill="none"
                >
                  <path d="M2 1L18 12L2 23V1Z" fill="white" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Story counter */}
      <p
        className="mt-4 text-[12px] tracking-[2px] uppercase"
        style={{ opacity: 0.4 }}
      >
        {current + 1} / {stories.length}
      </p>
    </div>
  );
}
