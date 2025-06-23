"use client";

import { useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

// Original content dimensions
const ORIGINAL_WIDTH = 1400;
const ORIGINAL_HEIGHT = 1244;

const IFRAME_URL = 'https://api.seyu.hu/backend/backend/slideshow?event-id=1769&slideshow-id=2192&enable-poster=0&token=eyJhbGciOiJIUzI1NiJ9.eyJzbGlkZXNob3dJZCI6MjE5Mn0.GpxJfbgRUdkuI-NdT3e6qCQ7KNhdmq-MTvShHC5e-CU';

const Container = styled.div`
  position: fixed;
  inset: 0;
  margin: 0;
  padding: 0;
  display: block;
  background-color: red;
  overflow: hidden;
`;

const IframeWrapper = styled.div`
  background: transparent;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
`;

const ResponsiveIframe = styled.iframe`
  border: 0;
  background: #000;
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  margin: 0;
  padding: 0;
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

      // Always maximize to fill screen while maintaining aspect ratio
      // Try both width and height-based scaling and use the larger one
      const widthBasedHeight = Math.floor(viewportWidth * (9/8));
      const heightBasedWidth = Math.floor(viewportHeight * (8/9));
      
      if (widthBasedHeight <= viewportHeight) {
        // If scaling by width fits in viewport, use that
        targetWidth = viewportWidth;
        targetHeight = widthBasedHeight;
      } else {
        // Otherwise scale by height
        targetWidth = heightBasedWidth;
        targetHeight = viewportHeight;
      }

      // Set wrapper to target size
      wrapperRef.current.style.width = `${targetWidth}px`;
      wrapperRef.current.style.height = `${targetHeight}px`;

      // Calculate scale (how much we need to scale the original content)
      const scale = targetWidth / ORIGINAL_WIDTH;

      // Set iframe to original size and scale it
      iframeRef.current.style.width = `${ORIGINAL_WIDTH}px`;
      iframeRef.current.style.height = `${ORIGINAL_HEIGHT}px`;
      iframeRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;

      // console.log('Dimensions:', {
      //   viewport: `${viewportWidth}x${viewportHeight}`,
      //   target: `${targetWidth}x${targetHeight}`,
      //   scale: `${(scale * 100).toFixed(3)}%`,
      //   finalSize: `${Math.round(ORIGINAL_WIDTH * scale)}x${Math.round(ORIGINAL_HEIGHT * scale)}`,
      //   aspectRatio: (targetWidth / targetHeight).toFixed(3)
      // });
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);

    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  return (
    <Container>
      <GlobalStyle />
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
