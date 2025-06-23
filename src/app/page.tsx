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

import { useSettings } from '@/lib/settings-context';

const AdminLink = styled.a`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-family: system-ui;
  z-index: 1000;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const Container = styled.div<{ $bgColor: string }>`
  position: fixed;
  inset: 0;
  margin: 0;
  padding: 0;
  display: block;
  background-color: ${props => props.$bgColor};
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
  const { settings } = useSettings();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateDimensions = () => {
      if (!wrapperRef.current || !iframeRef.current) return;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate scales to fit width and height while maintaining aspect ratio
      const scaleToFitWidth = viewportWidth / settings.originalWidth;
      const scaleToFitHeight = viewportHeight / settings.originalHeight;

      // Use the smaller scale to ensure content fits within viewport
      const scale = Math.min(scaleToFitWidth, scaleToFitHeight);

      // Calculate final dimensions
      const targetWidth = Math.round(settings.originalWidth * scale);
      const targetHeight = Math.round(settings.originalHeight * scale);

      // Set wrapper to target size
      wrapperRef.current.style.width = `${targetWidth}px`;
      wrapperRef.current.style.height = `${targetHeight}px`;

      // Set iframe to original size and scale it
      iframeRef.current.style.width = `${settings.originalWidth}px`;
      iframeRef.current.style.height = `${settings.originalHeight}px`;
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
    <Container $bgColor={settings.backgroundColor}>
      <GlobalStyle />
      <AdminLink href="/admin">⚙️ Settings</AdminLink>
      <IframeWrapper ref={wrapperRef}>
        <ResponsiveIframe
          ref={iframeRef}
          src={settings.contentUrl}
          title="Slideshow"
          allow="fullscreen"
        />
      </IframeWrapper>
    </Container>
  );
}
