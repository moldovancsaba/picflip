"use client";

import { useEffect, useRef } from 'react';

const CONTENT_WIDTH = 1510;
const CONTENT_HEIGHT = 850;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && iframeRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        // Use the container width to determine scale, maintaining aspect ratio
        const scale = containerWidth / CONTENT_WIDTH;
        
        // Calculate height for vertical centering
        const height = CONTENT_HEIGHT * scale;
        const translateY = (containerHeight - height) / 2;

        // Apply transform
        iframeRef.current.style.transform = `translate(0px, ${translateY}px) scale(${scale})`;
        iframeRef.current.style.width = `${CONTENT_WIDTH}px`;
        iframeRef.current.style.height = `${CONTENT_HEIGHT}px`;
      }
    };

    handleResize(); // Initial resize
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className="bg-scroll flex items-center justify-center h-full w-full">
      <div ref={containerRef} className="w-[90vw] aspect-video relative overflow-hidden rounded-[20px]">
        <iframe
          src="https://api.seyu.hu/backend/backend/slideshow?event-id=1779&slideshow-id=2202&date-from=1748728800000&enable-poster=0&token=eyJhbGciOiJIUzI1NiJ9.eyJzbGlkZXNob3dJZCI6MjIwMn0.iLS_ebzWrDt665-bUo2FhGN7dNGer2gSvUSfo7Uwfqc"
          ref={iframeRef}
          className="border-0 absolute origin-top-left rounded-[20px]"
          allowFullScreen
        />
      </div>
    </main>
  );
}
