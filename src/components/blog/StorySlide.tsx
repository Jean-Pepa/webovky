"use client";

import { StoryData } from "@/types/database";

interface StorySlideProps {
  title: string;
  coverImage: string | null;
  storyData: StoryData;
  locale: string;
}

export default function StorySlide({
  title,
  coverImage,
  storyData,
  locale,
}: StorySlideProps) {
  const isDark = storyData.style === "dark";

  return (
    <div
      className="absolute inset-0 flex flex-col justify-end"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
          : "linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 50%, #d4c5a0 100%)",
        color: isDark ? "#fff" : "#1a1a1a",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background image overlay */}
      {coverImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: isDark ? 0.25 : 0.2,
          }}
        />
      )}

      {/* SVG pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id={`grid-${isDark ? "dark" : "light"}`}
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? "#fff" : "#000"}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${isDark ? "dark" : "light"})`} />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Top label */}
        <div className="flex items-center gap-2 mt-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: isDark ? "#e94560" : "#c17817" }}
          />
          <span
            className="text-[10px] uppercase tracking-[3px] font-medium"
            style={{ opacity: 0.7 }}
          >
            Arch Stories
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Title area */}
        <div className="mb-4">
          {storyData.subtitle && (
            <p
              className="text-[11px] uppercase tracking-[2px] mb-2"
              style={{ opacity: 0.6 }}
            >
              {storyData.subtitle}
            </p>
          )}
          <h2
            className="text-[22px] leading-[1.2] font-light"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {title}
          </h2>
        </div>

        {/* Stats grid */}
        {(storyData.stat1_label || storyData.stat2_label) && (
          <div
            className="grid grid-cols-2 gap-3 mb-4 py-3 border-t border-b"
            style={{
              borderColor: isDark
                ? "rgba(255,255,255,0.15)"
                : "rgba(0,0,0,0.12)",
            }}
          >
            {storyData.stat1_label && (
              <div>
                <span
                  className="block text-[9px] uppercase tracking-[1.5px] mb-1"
                  style={{ opacity: 0.5 }}
                >
                  {storyData.stat1_label}
                </span>
                <span className="text-[15px] font-light">
                  {storyData.stat1_value}
                </span>
              </div>
            )}
            {storyData.stat2_label && (
              <div>
                <span
                  className="block text-[9px] uppercase tracking-[1.5px] mb-1"
                  style={{ opacity: 0.5 }}
                >
                  {storyData.stat2_label}
                </span>
                <span className="text-[15px] font-light">
                  {storyData.stat2_value}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {storyData.tags && storyData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {storyData.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] uppercase tracking-[1px] px-2.5 py-1 rounded-full"
                style={{
                  background: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.06)",
                  opacity: 0.8,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div>
            {storyData.architect && (
              <span className="text-[10px] font-medium" style={{ opacity: 0.7 }}>
                {storyData.architect}
              </span>
            )}
          </div>
          {storyData.year && (
            <span className="text-[10px]" style={{ opacity: 0.5 }}>
              {storyData.year}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
