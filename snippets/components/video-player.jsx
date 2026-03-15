import { useState } from "react";

export const VideoPlayer = ({
  src,
  aspectRatio = "16/9",
  thumbnail,
  title,
  youtubeHref,
  className = "",
}) => {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div
        className={`not-prose relative mx-auto w-full max-w-screen-md overflow-hidden rounded-lg ${className}`}
        style={{ aspectRatio }}
      >
        <video
          src={src}
          controls
          autoPlay
          playsInline
          className="h-full w-full object-contain"
        />
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {youtubeHref && (
            <a
              href={youtubeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-100 transition-colors hover:bg-neutral-200/75"
            >
              Watch on YouTube
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      style={{ aspectRatio }}
      className={`not-prose group relative mx-auto block w-full max-w-screen-md cursor-pointer overflow-hidden rounded-lg bg-neutral-100 ${className}`}
      onClick={() => setPlaying(true)}
    >
      <img
        src={thumbnail}
        alt={title}
        className="h-full w-full object-cover cursor-pointer"
      />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 to-transparent sm:h-32" />
      <div className="absolute bottom-8 flex w-full items-center justify-between px-8">
        <p className="max-w-xs text-left font-display text-lg font-bold leading-tight text-white xs:text-xl">
          {title}
        </p>
        <div className="rounded-full bg-white p-3 shadow-lg transition-all duration-300 group-hover:scale-110 group-active:scale-95">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        </div>
      </div>
    </button>
  );
};
