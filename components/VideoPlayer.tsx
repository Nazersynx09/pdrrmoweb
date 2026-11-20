'use client';

import { useEffect, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  embedUrl: string;
}

export default function VideoPlayer({ title, embedUrl }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  return (
    <div
      role={isFullscreen ? 'dialog' : undefined}
      aria-modal={isFullscreen ? true : undefined}
      aria-label={isFullscreen ? `${title} full-screen video` : undefined}
      className={
        isFullscreen
          ? 'fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center bg-black p-4 sm:p-8'
          : 'relative aspect-video w-full overflow-hidden rounded-t-xl bg-black'
      }
    >
      <iframe
        src={embedUrl}
        title={title}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      {isFullscreen ? (
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-4 text-white sm:left-8 sm:right-8 sm:top-6">
          <p className="truncate font-semibold drop-shadow">{title}</p>
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            aria-label="Exit full-screen video"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-black/70 px-3 py-2 text-sm font-medium hover:bg-black"
          >
            <Minimize2 className="h-4 w-4" />
            <span className="hidden sm:inline">Exit full screen</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          aria-label={`View ${title} full screen`}
          className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-lg bg-black/70 px-3 py-2 text-sm font-medium text-white hover:bg-black"
        >
          <Maximize2 className="h-4 w-4" />
          <span className="hidden sm:inline">Full screen</span>
        </button>
      )}
    </div>
  );
}
