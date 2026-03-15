"use client";

import { useState, useEffect, useCallback } from "react";
import { BlogPost, StorySlideData } from "@/types/database";
import StorySlide from "./StorySlide";

interface ArchStoriesProps {
  stories: BlogPost[];
  locale: string;
}

/** Convert old single-slide stories to slides format */
function getSlides(story: BlogPost, locale: string): StorySlideData[] {
  if (story.story_data?.slides && story.story_data.slides.length > 0) {
    return story.story_data.slides;
  }

  // Legacy: single cover slide from old data
  const title = locale === "en" ? story.title_en : story.title_cs;
  return [
    {
      type: "cover",
      image: story.cover_image_url || undefined,
      headline: title,
      caption: story.story_data?.architect,
    },
  ];
}

export default function ArchStories({ stories, locale }: ArchStoriesProps) {
  const [storyIdx, setStoryIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  if (stories.length === 0) return null;

  const currentStory = stories[storyIdx];
  const slides = getSlides(currentStory, locale);
  const currentSlide = slides[slideIdx];

  const goToSlide = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= slides.length) return;
      setTransitioning(true);
      setTimeout(() => {
        setSlideIdx(idx);
        setTimeout(() => setTransitioning(false), 50);
      }, 200);
    },
    [slides.length]
  );

  const selectStory = useCallback(
    (idx: number) => {
      if (idx === storyIdx) return;
      setTransitioning(true);
      setTimeout(() => {
        setStoryIdx(idx);
        setSlideIdx(0);
        setTimeout(() => setTransitioning(false), 50);
      }, 200);
    },
    [storyIdx]
  );

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goToSlide(slideIdx - 1);
      else if (e.key === "ArrowRight") goToSlide(slideIdx + 1);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goToSlide, slideIdx]);

  function downloadSlide(index: number) {
    const a = document.createElement("a");
    a.href = `/api/stories/render?id=${currentStory.id}&slide=${index}`;
    a.download = `inn-story-${storyIdx + 1}-slide-${index + 1}.png`;
    a.click();
  }

  async function downloadAll() {
    for (let i = 0; i < slides.length; i++) {
      downloadSlide(i);
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Story selector — horizontal scroll */}
      {stories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto mb-6 pb-2 max-w-full px-2 no-scrollbar">
          {stories.map((s, i) => {
            const isActive = i === storyIdx;
            const title =
              locale === "en" ? s.title_en : s.title_cs;
            return (
              <button
                key={s.id}
                onClick={() => selectStory(i)}
                className="flex-shrink-0 px-4 py-2 text-[12px] rounded-full transition-all whitespace-nowrap"
                style={{
                  background: isActive ? "#111" : "rgba(0,0,0,0.05)",
                  color: isActive ? "#fff" : "rgba(0,0,0,0.5)",
                }}
              >
                {title.length > 30 ? title.slice(0, 30) + "..." : title}
              </button>
            );
          })}
        </div>
      )}

      {/* Main viewer — 9:16 aspect ratio */}
      <div
        className="relative w-full max-w-[380px] rounded-xl overflow-hidden shadow-xl"
        style={{ aspectRatio: "9/16" }}
      >
        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
          {slides.map((_, i) => (
            <div
              key={i}
              className="h-[2px] flex-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.25)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  width: i <= slideIdx ? "100%" : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Slide content with fade */}
        <div
          className="absolute inset-0"
          style={{
            opacity: transitioning ? 0 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          <StorySlide slide={currentSlide} />
        </div>

        {/* Click zones: left half = prev, right half = next */}
        <div
          className="absolute inset-y-0 left-0 w-1/2 z-10 cursor-pointer"
          onClick={() => goToSlide(slideIdx - 1)}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2 z-10 cursor-pointer"
          onClick={() => goToSlide(slideIdx + 1)}
        />

        {/* Arrow hints on hover */}
        {slideIdx > 0 && (
          <button
            onClick={() => goToSlide(slideIdx - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 3L5 8L10 13"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        {slideIdx < slides.length - 1 && (
          <button
            onClick={() => goToSlide(slideIdx + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3L11 8L6 13"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-5">
        <span className="text-[11px] text-black/30 tracking-wider">
          {slideIdx + 1} / {slides.length}
        </span>

        <button
          onClick={() => downloadSlide(slideIdx)}
          className="flex items-center gap-2 px-4 py-2 text-[12px] rounded-full transition-all"
          style={{ background: "#111", color: "#fff" }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2v8m0 0L5 7m3 3l3-3M3 13h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Download
        </button>

        {slides.length > 1 && (
          <button
            onClick={downloadAll}
            className="flex items-center gap-2 px-4 py-2 text-[12px] rounded-full transition-all border"
            style={{ borderColor: "rgba(0,0,0,0.15)", color: "rgba(0,0,0,0.6)" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2v8m0 0L5 7m3 3l3-3M3 13h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All ({slides.length})
          </button>
        )}
      </div>

      {/* Source link */}
      {currentStory.story_data?.source_url && (
        <a
          href={currentStory.story_data.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-[11px] text-black/30 hover:text-black/50 transition-colors underline"
        >
          {currentStory.story_data.source_name || "Source"}
        </a>
      )}
    </div>
  );
}
