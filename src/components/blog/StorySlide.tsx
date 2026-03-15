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
    imageOpacity: 0.3,
    gridColor: "#fff",
    borderColor: "rgba(255,255,255,0.15)",
    tagBg: "rgba(255,255,255,0.1)",
  },
  light: {
    background: "linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 50%, #d4c5a0 100%)",
    color: "#1a1a1a",
    accent: "#c17817",
    imageOpacity: 0.25,
    gridColor: "#000",
    borderColor: "rgba(0,0,0,0.12)",
    tagBg: "rgba(0,0,0,0.06)",
  },
  orange: {
    background: "linear-gradient(135deg, #2d1810 0%, #3a2015 50%, #4a2c1a 100%)",
    color: "#fff",
    accent: "#e8730c",
    imageOpacity: 0.25,
    gridColor: "#e8730c",
    borderColor: "rgba(232,115,12,0.25)",
    tagBg: "rgba(232,115,12,0.15)",
  },
  blueprint: {
    background: "linear-gradient(135deg, #0a1628 0%, #122240 50%, #1a3a5c 100%)",
    color: "#c8ddf0",
    accent: "#ffffff",
    imageOpacity: 0.18,
    gridColor: "#4a7ab5",
    borderColor: "rgba(74,122,181,0.3)",
    tagBg: "rgba(74,122,181,0.2)",
  },
  minimal: {
    background: "#ffffff",
    color: "#111111",
    accent: "#111111",
    imageOpacity: 0.1,
    gridColor: "#ddd",
    borderColor: "rgba(0,0,0,0.1)",
    tagBg: "rgba(0,0,0,0.05)",
  },
};

export default function StorySlide({
  title,
  coverImage,
  storyData,
}: StorySlideProps) {
  const cfg = STYLE_CONFIGS[storyData.style] || STYLE_CONFIGS.dark;

  return (
    <div
      className="absolute inset-0"
      style={{
        background: cfg.background,
        color: cfg.color,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background image — full bleed */}
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

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id={`grid-${storyData.style}`}
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
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

      {/* Content — horizontal layout */}
      <div className="relative z-10 flex flex-col justify-end h-full px-8 sm:px-12 md:px-16 pb-8 sm:pb-10 pt-14">
        {/* Top label */}
        <div className="absolute top-4 left-8 sm:left-12 md:left-16 flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: cfg.accent }}
          />
          <span
            className="text-[10px] sm:text-[11px] uppercase tracking-[3px] font-medium"
            style={{ opacity: 0.6 }}
          >
            Arch Stories
          </span>
        </div>

        {/* Main content area */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8">
          {/* Left: title + subtitle */}
          <div className="flex-1 min-w-0">
            {storyData.subtitle && (
              <p
                className="text-[11px] sm:text-[12px] uppercase tracking-[2px] mb-2"
                style={{ opacity: 0.5 }}
              >
                {storyData.subtitle}
              </p>
            )}
            <h2
              className="text-[20px] sm:text-[26px] md:text-[32px] leading-[1.15] font-light"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {title}
            </h2>

            {/* Tags — inline under title */}
            {storyData.tags && storyData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {storyData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] sm:text-[10px] uppercase tracking-[1px] px-2.5 py-1 rounded-full"
                    style={{ background: cfg.tagBg, opacity: 0.8 }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: stats + architect */}
          <div className="flex-shrink-0 flex items-end gap-6 sm:gap-8">
            {storyData.stat1_label && (
              <div className="text-right">
                <span
                  className="block text-[9px] sm:text-[10px] uppercase tracking-[1.5px] mb-1"
                  style={{ opacity: 0.4 }}
                >
                  {storyData.stat1_label}
                </span>
                <span className="text-[14px] sm:text-[16px] font-light">
                  {storyData.stat1_value}
                </span>
              </div>
            )}
            {storyData.stat2_label && (
              <div className="text-right">
                <span
                  className="block text-[9px] sm:text-[10px] uppercase tracking-[1.5px] mb-1"
                  style={{ opacity: 0.4 }}
                >
                  {storyData.stat2_label}
                </span>
                <span className="text-[14px] sm:text-[16px] font-light">
                  {storyData.stat2_value}
                </span>
              </div>
            )}
            {storyData.architect && (
              <div
                className="text-right pl-6 sm:pl-8"
                style={{ borderLeft: `1px solid ${cfg.borderColor}` }}
              >
                <span
                  className="block text-[9px] sm:text-[10px] uppercase tracking-[1.5px] mb-1"
                  style={{ opacity: 0.4 }}
                >
                  Architect
                </span>
                <span className="text-[13px] sm:text-[15px] font-light">
                  {storyData.architect}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
