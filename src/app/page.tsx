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

const Container = styled.div<{ $bgColor: string }>`
  position: fixed;
  inset: 0;
  margin: 0;
  padding: 0;
  display: block;
  background-color: ${props => props.$bgColor};
  overflow: hidden;
`;

const IframeWrapper = styled.div<{ $hAlign: string, $vAlign: string }>`
  background: transparent;
  overflow: hidden;
  position: absolute;
  ${props => {
    switch (props.$hAlign) {
      case 'left': return 'left: 0; transform: translateX(0);';
      case 'right': return 'right: 0; transform: translateX(0);';
      default: return 'left: 50%; transform: translateX(-50%);';
    }
  }}
  ${props => {
    switch (props.$vAlign) {
      case 'top': return 'top: 0; transform: translateY(0);';
      case 'bottom': return 'bottom: 0; transform: translateY(0);';
      default: return 'top: 50%; transform: translateY(-50%);';
    }
  }}
  ${props => {
    // Combine transforms based on alignment
    const transforms = [];
    if (props.$hAlign === 'center') transforms.push('translateX(-50%)');
    if (props.$vAlign === 'middle') transforms.push('translateY(-50%)');
    if (transforms.length > 0) {
      return `transform: ${transforms.join(' ')};`;
    }
    return '';
  }}
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
      <IframeWrapper 
        ref={wrapperRef}
        $hAlign={settings.horizontalAlignment}
        $vAlign={settings.verticalAlignment}
      >
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
