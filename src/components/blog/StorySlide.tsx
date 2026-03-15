"use client";

import { StorySlideData } from "@/types/database";

interface StorySlideProps {
  slide: StorySlideData;
}

export default function StorySlide({ slide }: StorySlideProps) {
  switch (slide.type) {
    case "cover":
      return <CoverSlide slide={slide} />;
    case "photo":
      return <PhotoSlide slide={slide} />;
    case "info":
      return <InfoSlide slide={slide} />;
    case "closing":
      return <ClosingSlide slide={slide} />;
    default:
      return <CoverSlide slide={slide} />;
  }
}

function CoverSlide({ slide }: { slide: StorySlideData }) {
  return (
    <div className="absolute inset-0 bg-black">
      {/* Background photo */}
      {slide.image && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Dark gradient from bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 50%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* INN logo top-left */}
      <div className="absolute top-6 left-6 z-10">
        <span
          className="text-white font-bold text-[16px] tracking-[4px]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          INN
        </span>
      </div>

      {/* Headline at bottom */}
      <div className="absolute bottom-8 left-6 right-6 z-10">
        {/* Accent line */}
        <div className="w-10 h-[3px] bg-white mb-4" />

        {/* Title */}
        <h2
          className="text-white text-[20px] sm:text-[22px] leading-[1.2] font-bold"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {slide.headline}
        </h2>

        {/* Architect / caption */}
        {slide.caption && (
          <p className="text-white/60 text-[12px] mt-2 tracking-wide">
            {slide.caption}
          </p>
        )}
      </div>
    </div>
  );
}

function PhotoSlide({ slide }: { slide: StorySlideData }) {
  return (
    <div className="absolute inset-0 bg-black">
      {/* Full photo */}
      {slide.image && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Subtle gradient at bottom for caption */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* INN logo top-left */}
      <div className="absolute top-6 left-6 z-10">
        <span
          className="text-white font-bold text-[14px] tracking-[4px] drop-shadow-lg"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          INN
        </span>
      </div>

      {/* Caption at bottom */}
      {slide.caption && (
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <p className="text-white/80 text-[12px] drop-shadow-lg">
            {slide.caption}
          </p>
        </div>
      )}
    </div>
  );
}

function InfoSlide({ slide }: { slide: StorySlideData }) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-center"
      style={{ background: "#111" }}
    >
      {/* INN logo top-left */}
      <div className="absolute top-6 left-6">
        <span
          className="text-white font-bold text-[14px] tracking-[4px]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          INN
        </span>
      </div>

      {/* Content */}
      <div className="px-8">
        {/* Accent line */}
        <div className="w-10 h-[3px] bg-white mb-6" />

        {/* Headline */}
        {slide.headline && (
          <h2
            className="text-white text-[18px] leading-[1.3] font-bold mb-8"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {slide.headline}
          </h2>
        )}

        {/* Facts */}
        {slide.facts && (
          <div className="flex flex-col gap-5">
            {slide.facts.map((fact, i) => (
              <div key={i}>
                <span className="block text-white/40 text-[10px] uppercase tracking-[2px] mb-1">
                  {fact.label}
                </span>
                <span className="block text-white text-[15px] font-light">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClosingSlide({ slide }: { slide: StorySlideData }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: "#111" }}
    >
      {/* INN logo — large, centered */}
      <span
        className="text-white font-bold text-[40px] tracking-[10px] mb-6"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {slide.headline || "INN"}
      </span>

      {/* Accent line */}
      <div className="w-12 h-[2px] bg-white/30 mb-6" />

      {/* Caption */}
      {slide.caption && (
        <p className="text-white/40 text-[12px] tracking-[2px] uppercase">
          {slide.caption}
        </p>
      )}
    </div>
  );
}
