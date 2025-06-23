"use client";

import IframeViewer from '@/components/IframeViewer';
import { useSettings } from '@/lib/settings-context';
import { useParams } from 'next/navigation';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

export default function IframePage() {
  const { id } = useParams();
  const { getConfig } = useSettings();
  const config = getConfig(id as string);

  if (!config) {
    return <div>Iframe configuration not found</div>;
  }

  return (
    <>
      <GlobalStyle />
      <IframeViewer config={config} />
    </>
  );
}
