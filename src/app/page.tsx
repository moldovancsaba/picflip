"use client";

import { useEffect, useRef } from 'react';
import styled from 'styled-components';

// Original content dimensions
const ORIGINAL_WIDTH = 1510;
const ORIGINAL_HEIGHT = 850;
const ASPECT_RATIO = 850/1510;

const IFRAME_URL = 'https://api.seyu.hu/backend/backend/slideshow?event-id=1779&slideshow-id=2202&date-from=1748728800000&enable-poster=0&token=eyJhbGciOiJIUzI1NiJ9.eyJzbGlkZXNob3dJZCI6MjIwMn0.iLS_ebzWrDt665-bUo2FhGN7dNGer2gSvUSfo7Uwfqc';

const Container = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  overflow: hidden;
`;

const IframeWrapper = styled.div`
  background: transparent;
  overflow: hidden;
  position: relative;
  border-radius: 20px;
  border: 3px solid white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const ResponsiveIframe = styled.iframe`
  border: none;
  background: #000;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
`;

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateDimensions = () => {
      if (!wrapperRef.current || !iframeRef.current) return;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let targetWidth, targetHeight;

      // Calculate the maximum size that maintains the original aspect ratio
      if ((viewportWidth / viewportHeight) > (ORIGINAL_WIDTH / ORIGINAL_HEIGHT)) {
        // Screen is wider than content - height is limiting factor
        targetHeight = viewportHeight * 0.9; // 90% of viewport height
        targetWidth = Math.floor(targetHeight / ASPECT_RATIO);
      } else {
        // Screen is narrower than content - width is limiting factor
        targetWidth = viewportWidth * 0.9; // 90% of viewport width
        targetHeight = Math.floor(targetWidth * ASPECT_RATIO);
      }

      // Set wrapper to target size
      wrapperRef.current.style.width = `${targetWidth}px`;
      wrapperRef.current.style.height = `${targetHeight}px`;

      // Calculate scale (how much we need to scale the original content)
      const scale = targetWidth / ORIGINAL_WIDTH;

      // Set iframe to original size and scale it
      iframeRef.current.style.width = `${ORIGINAL_WIDTH}px`;
      iframeRef.current.style.height = `${ORIGINAL_HEIGHT}px`;
      iframeRef.current.style.transform = `scale(${scale})`;

      console.log('Dimensions:', {
        viewport: `${viewportWidth}x${viewportHeight}`,
        target: `${targetWidth}x${targetHeight}`,
        scale: `${(scale * 100).toFixed(3)}%`,
        finalSize: `${Math.round(ORIGINAL_WIDTH * scale)}x${Math.round(ORIGINAL_HEIGHT * scale)}`,
        aspectRatio: (targetWidth / targetHeight).toFixed(3)
      });
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);

    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  return (
    <Container>
      <IframeWrapper ref={wrapperRef}>
        <ResponsiveIframe
          ref={iframeRef}
          src={IFRAME_URL}
          title="Slideshow"
          allow="fullscreen"
        />
      </IframeWrapper>
    </Container>
  );
}
