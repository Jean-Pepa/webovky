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
          <p className="text-white/60 text-[22px] sm:text-[24px] mt-3 tracking-wide font-light"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
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

      {/* Gradient at bottom for caption readability */}
      <div
        className="absolute inset-0"
        style={{
          background: slide.caption
            ? "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.7) 100%)"
            : "linear-gradient(to bottom, transparent 80%, rgba(0,0,0,0.3) 100%)",
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

      {/* Caption text at bottom */}
      {slide.caption && (
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <p className="text-white/90 text-[11px] leading-[1.5] drop-shadow-lg">
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
      {/* INN SVG logo — same as Header */}
      <svg
        className="w-[160px] h-[47px] mb-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="5 0 186 80"
      >
        <path d="M36 8 L36 72" stroke="#fff" strokeWidth="2" fill="none" />
        <path d="M58 72 L58 8 L98 72 L98 8" stroke="#fff" strokeWidth="2" fill="none" strokeLinejoin="miter" />
        <path d="M120 72 L120 8 L160 72 L160 8" stroke="#fff" strokeWidth="2" fill="none" strokeLinejoin="miter" />
      </svg>

      {/* INVENTIO NOVI */}
      <span
        className="uppercase tracking-[0.18em] text-white/70 mb-8"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 9,
          fontWeight: 300,
        }}
      >
        INVENTIO NOVI
      </span>

      {/* Caption */}
      {slide.caption && (
        <p className="text-white/30 text-[11px] tracking-[2px] uppercase">
          {slide.caption}
        </p>
      )}
    </div>
  );
}
