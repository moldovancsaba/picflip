"use client";

import { useEffect, useRef, useState } from 'react';

const CONTENT_WIDTH = 1510;
const CONTENT_HEIGHT = 850;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeElement, setIframeElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const scale = containerWidth / CONTENT_WIDTH;
      const height = CONTENT_HEIGHT * scale;
      const translateY = (containerHeight - height) / 2;

      // Create or update iframe with correct dimensions
      if (!iframeElement) {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://api.seyu.hu/backend/backend/slideshow?event-id=1779&slideshow-id=2202&date-from=1748728800000&enable-poster=0&token=eyJhbGciOiJIUzI1NiJ9.eyJzbGlkZXNob3dJZCI6MjIwMn0.iLS_ebzWrDt665-bUo2FhGN7dNGer2gSvUSfo7Uwfqc';
        iframe.className = 'border-0 absolute origin-top-left rounded-[20px]';
        iframe.allowFullscreen = true;
        iframe.style.width = `${CONTENT_WIDTH}px`;
        iframe.style.height = `${CONTENT_HEIGHT}px`;
        iframe.style.transform = `translate(0px, ${translateY}px) scale(${scale})`;
        
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(iframe);
        setIframeElement(iframe);
      } else {
        // Just update dimensions for existing iframe
        (iframeElement as HTMLElement).style.width = `${CONTENT_WIDTH}px`;
        (iframeElement as HTMLElement).style.height = `${CONTENT_HEIGHT}px`;
        (iframeElement as HTMLElement).style.transform = `translate(0px, ${translateY}px) scale(${scale})`;
      }
    };

    handleResize(); // Initial creation and sizing
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [iframeElement]);

  return (
    <main className="bg-scroll flex items-center justify-center h-full w-full">
      <div ref={containerRef} className="w-[90vw] aspect-video relative overflow-hidden rounded-[20px]">
      </div>
    </main>
  );
}
