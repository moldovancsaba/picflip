"use client";

import { useEffect, useRef, useState } from 'react';

const CONTENT_WIDTH = 1510;
const CONTENT_HEIGHT = 850;
const ASPECT_RATIO = CONTENT_HEIGHT / CONTENT_WIDTH;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeElement, setIframeElement] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    function getComputedDimensions(containerWidth: number) {
      // Calculate dimensions while maintaining aspect ratio
      const width = Math.min(containerWidth, CONTENT_WIDTH);
      const height = width * ASPECT_RATIO;
      return { width, height };
    }

    function createOrUpdateIframe() {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const { width, height } = getComputedDimensions(containerWidth);

      // Center position calculation
      const left = Math.max(0, (containerWidth - width) / 2);
      const top = Math.max(0, (containerHeight - height) / 2);

      const styles = {
        position: 'absolute',
        left: left + 'px',
        top: top + 'px',
        width: width + 'px',
        height: height + 'px',
        border: '3px solid white',
        borderRadius: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        backgroundColor: '#000' // Add background color for smoother loading
      };

      if (!iframeElement) {
        try {
          const iframe = document.createElement('iframe');
          iframe.src = 'https://api.seyu.hu/backend/backend/slideshow?event-id=1779&slideshow-id=2202&date-from=1748728800000&enable-poster=0&token=eyJhbGciOiJIUzI1NiJ9.eyJzbGlkZXNob3dJZCI6MjIwMn0.iLS_ebzWrDt665-bUo2FhGN7dNGer2gSvUSfo7Uwfqc';
          iframe.setAttribute('allowfullscreen', 'true');
          iframe.setAttribute('frameborder', '0');
          
          // Apply all styles
          Object.assign(iframe.style, styles);

          if (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
          containerRef.current.appendChild(iframe);
          setIframeElement(iframe);
        } catch (err) {
          console.error('Error creating iframe:', err);
        }
      } else {
        try {
          // Update existing iframe
          Object.assign(iframeElement.style, styles);
        } catch (err) {
          console.error('Error updating iframe:', err);
        }
      }
    }

    // Initial creation
    createOrUpdateIframe();

    // Handle resize
    let resizeTimer: NodeJS.Timeout;
    function handleResize() {
      // Debounce resize events
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(createOrUpdateIframe, 100);
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimer);
      };
    }
  }, [iframeElement]);

  return (
    <main className="bg-scroll flex items-center justify-center h-full w-full">
      <div 
        ref={containerRef} 
        className="w-[90vw] aspect-video relative overflow-hidden"
        style={{
          minHeight: '200px', // Ensure minimum height for very small screens
          backgroundColor: 'rgba(0,0,0,0.1)' // Visual placeholder while loading
        }}
      >
      </div>
    </main>
  );
}
