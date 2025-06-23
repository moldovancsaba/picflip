"use client";

import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { IframeConfig } from '@/lib/types';

const Container = styled.div<{ $bgColor: string; $bgImage: string }>`
  position: fixed;
  inset: 0;
  margin: 0;
  padding: 0;
  display: block;
  background-color: ${props => props.$bgColor};
  ${props => props.$bgImage && `
    background-image: url('${props.$bgImage}');
    background-repeat: repeat;
    background-position: center;
  `}
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

interface IframeViewerProps {
  config: IframeConfig;
}

export default function IframeViewer({ config }: IframeViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateDimensions = () => {
      if (!wrapperRef.current || !iframeRef.current) return;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate scales to fit width and height while maintaining aspect ratio
      const scaleToFitWidth = viewportWidth / config.originalWidth;
      const scaleToFitHeight = viewportHeight / config.originalHeight;

      // Use the smaller scale to ensure content fits within viewport
      const scale = Math.min(scaleToFitWidth, scaleToFitHeight);

      // Calculate final dimensions
      const targetWidth = Math.round(config.originalWidth * scale);
      const targetHeight = Math.round(config.originalHeight * scale);

      // Set wrapper to target size
      wrapperRef.current.style.width = `${targetWidth}px`;
      wrapperRef.current.style.height = `${targetHeight}px`;

      // Set iframe to original size and scale it
      iframeRef.current.style.width = `${config.originalWidth}px`;
      iframeRef.current.style.height = `${config.originalHeight}px`;
      iframeRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);

    return () => window.removeEventListener('resize', calculateDimensions);
  }, [config]);

  return (
    <Container 
      $bgColor={config.backgroundColor}
      $bgImage={config.backgroundImageUrl}
    >
      <IframeWrapper 
        ref={wrapperRef}
        $hAlign={config.horizontalAlignment}
        $vAlign={config.verticalAlignment}
      >
        <ResponsiveIframe
          ref={iframeRef}
          src={config.contentUrl}
          title="Slideshow"
          allow="fullscreen"
        />
      </IframeWrapper>
    </Container>
  );
}
