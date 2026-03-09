"use client";

import { useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <div className="mt-12 mb-10 flex justify-center">
      <div
        className="relative w-[60%] border border-black/20 rounded"
        style={{ maxHeight: "80vh" }}
      >
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          controls={playing}
          className="w-full rounded"
          style={{ maxHeight: "80vh", display: "block" }}
          onEnded={() => setPlaying(false)}
        />

        {!playing && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-white/80 transition-opacity hover:bg-white/60"
          >
            <div className="w-16 h-16 rounded-full border-2 border-black/30 flex items-center justify-center">
              <svg
                width="24"
                height="28"
                viewBox="0 0 24 28"
                fill="none"
                className="ml-1"
              >
                <path d="M24 14L0 28V0L24 14Z" fill="black" fillOpacity="0.4" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
