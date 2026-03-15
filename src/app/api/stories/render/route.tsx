import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { StorySlideData } from "@/types/database";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const slideIndex = parseInt(request.nextUrl.searchParams.get("slide") || "0");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post || !post.story_data) {
    return new Response("Story not found", { status: 404 });
  }

  // Get slides (handle legacy format)
  const slides: StorySlideData[] =
    post.story_data.slides && post.story_data.slides.length > 0
      ? post.story_data.slides
      : [
          {
            type: "cover" as const,
            image: post.cover_image_url || undefined,
            headline: post.title_cs,
            caption: post.story_data.architect,
          },
        ];

  const slide = slides[slideIndex] || slides[0];

  return new ImageResponse(renderSlide(slide), {
    width: 1080,
    height: 1920,
    headers: {
      "Content-Disposition": `attachment; filename="inn-story-slide-${slideIndex + 1}.png"`,
    },
  });
}

function renderSlide(slide: StorySlideData) {
  switch (slide.type) {
    case "cover":
      return renderCover(slide);
    case "photo":
      return renderPhoto(slide);
    case "info":
      return renderInfo(slide);
    case "closing":
      return renderClosing(slide);
    default:
      return renderCover(slide);
  }
}

function renderCover(slide: StorySlideData) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "#000",
      }}
    >
      {slide.image && (
        <img
          src={slide.image}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))",
          display: "flex",
        }}
      />

      {/* Top gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "15%",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)",
          display: "flex",
        }}
      />

      {/* INN logo */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          display: "flex",
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "white",
            letterSpacing: 8,
          }}
        >
          INN
        </span>
      </div>

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 60,
            height: 4,
            background: "white",
            marginBottom: 30,
            display: "flex",
          }}
        />
        <span
          style={{
            fontSize: 54,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.15,
          }}
        >
          {slide.headline || ""}
        </span>
        {slide.caption && (
          <span
            style={{
              fontSize: 42,
              fontWeight: 300,
              color: "rgba(255,255,255,0.6)",
              marginTop: 16,
            }}
          >
            {slide.caption}
          </span>
        )}
      </div>
    </div>
  );
}

function renderPhoto(slide: StorySlideData) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "#000",
      }}
    >
      {slide.image && (
        <img
          src={slide.image}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Bottom gradient — stronger when caption present */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: slide.caption ? "40%" : "20%",
          background: slide.caption
            ? "linear-gradient(to bottom, transparent, rgba(0,0,0,0.75))"
            : "linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))",
          display: "flex",
        }}
      />

      {/* INN logo */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          display: "flex",
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "white",
            letterSpacing: 6,
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          INN
        </span>
      </div>

      {slide.caption && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 60,
            right: 60,
            display: "flex",
          }}
        >
          <span
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.5,
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {slide.caption}
          </span>
        </div>
      )}
    </div>
  );
}

function renderInfo(slide: StorySlideData) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#111",
        padding: 80,
      }}
    >
      {/* INN logo */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 60,
          display: "flex",
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "white",
            letterSpacing: 6,
          }}
        >
          INN
        </span>
      </div>

      {/* Accent line */}
      <div
        style={{
          width: 60,
          height: 4,
          background: "white",
          marginBottom: 40,
          display: "flex",
        }}
      />

      {/* Title */}
      {slide.headline && (
        <span
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.2,
            marginBottom: 50,
          }}
        >
          {slide.headline}
        </span>
      )}

      {/* Facts */}
      {slide.facts && (
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {slide.facts.map((fact, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {fact.label}
              </span>
              <span style={{ fontSize: 28, color: "white", fontWeight: 300 }}>
                {fact.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function renderClosing(slide: StorySlideData) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#111",
      }}
    >
      <span
        style={{
          fontSize: 84,
          fontWeight: 700,
          color: "white",
          letterSpacing: 16,
          marginBottom: 40,
        }}
      >
        INN
      </span>

      {slide.caption && (
        <span
          style={{
            position: "absolute",
            bottom: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            fontSize: 16,
            color: "rgba(255,255,255,0.25)",
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          <span style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}>↓</span>
          link
        </span>
      )}
    </div>
  );
}
