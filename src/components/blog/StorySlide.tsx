"use client";

import { StoryData } from "@/types/database";

interface StorySlideProps {
  title: string;
  coverImage: string | null;
  storyData: StoryData;
  locale: string;
}

interface StyleConfig {
  background: string;
  color: string;
  accent: string;
  imageOpacity: number;
  gridColor: string;
  borderColor: string;
  tagBg: string;
}

const STYLE_CONFIGS: Record<string, StyleConfig> = {
  dark: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    color: "#fff",
    accent: "#e94560",
    imageOpacity: 0.25,
    gridColor: "#fff",
    borderColor: "rgba(255,255,255,0.15)",
    tagBg: "rgba(255,255,255,0.1)",
  },
  light: {
    background: "linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 50%, #d4c5a0 100%)",
    color: "#1a1a1a",
    accent: "#c17817",
    imageOpacity: 0.2,
    gridColor: "#000",
    borderColor: "rgba(0,0,0,0.12)",
    tagBg: "rgba(0,0,0,0.06)",
  },
  orange: {
    background: "linear-gradient(135deg, #2d1810 0%, #3a2015 50%, #4a2c1a 100%)",
    color: "#fff",
    accent: "#e8730c",
    imageOpacity: 0.2,
    gridColor: "#e8730c",
    borderColor: "rgba(232,115,12,0.25)",
    tagBg: "rgba(232,115,12,0.15)",
  },
  blueprint: {
    background: "linear-gradient(135deg, #0a1628 0%, #122240 50%, #1a3a5c 100%)",
    color: "#c8ddf0",
    accent: "#ffffff",
    imageOpacity: 0.15,
    gridColor: "#4a7ab5",
    borderColor: "rgba(74,122,181,0.3)",
    tagBg: "rgba(74,122,181,0.2)",
  },
  minimal: {
    background: "#ffffff",
    color: "#111111",
    accent: "#111111",
    imageOpacity: 0.08,
    gridColor: "#ddd",
    borderColor: "rgba(0,0,0,0.1)",
    tagBg: "rgba(0,0,0,0.05)",
  },
};

export default function StorySlide({
  title,
  coverImage,
  storyData,
  locale,
}: StorySlideProps) {
  const cfg = STYLE_CONFIGS[storyData.style] || STYLE_CONFIGS.dark;

  return (
    <div
      className="absolute inset-0 flex flex-col justify-end"
      style={{
        background: cfg.background,
        color: cfg.color,
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
            opacity: cfg.imageOpacity,
          }}
        />
      )}

      {/* SVG pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id={`grid-${storyData.style}`}
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={cfg.gridColor}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#grid-${storyData.style})`}
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Top label */}
        <div className="flex items-center gap-2 mt-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: cfg.accent }}
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
            style={{ borderColor: cfg.borderColor }}
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
                  background: cfg.tagBg,
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
              <span
                className="text-[10px] font-medium"
                style={{ opacity: 0.7 }}
              >
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
