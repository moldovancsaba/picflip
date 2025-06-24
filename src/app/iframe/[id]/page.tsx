"use client";

import IframeViewer from '@/components/IframeViewer';
import { useSettings } from '@/lib/settings-context';
import { useParams, useRouter } from 'next/navigation';
import { createGlobalStyle } from 'styled-components';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

const AccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
`;

const AccessCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const LoginButton = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;

  &:hover {
    background: #0051cc;
  }
`;

export default function IframePage() {
  const { id } = useParams();
  const { getConfig } = useSettings();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const config = getConfig((id as string).replace(/_+/g, ' '));

  useEffect(() => {
    async function checkAccess() {
      if (!config) {
        setIsLoading(false);
        return;
      }

      // If project is public, allow access
      if (config.isPublic) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // If project is private, check authentication
      try {
        const response = await fetch('/api/settings', {
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(!!data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to check authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [config]);

  if (!config) {
    return (
      <AccessContainer>
        <AccessCard>
          <h2>Project Not Found</h2>
          <p>The requested project configuration could not be found.</p>
          <LoginButton onClick={() => router.push('/')}>Go Home</LoginButton>
        </AccessCard>
      </AccessContainer>
    );
  }

  if (isLoading) {
    return (
      <AccessContainer>
        <AccessCard>
          <h2>Loading...</h2>
          <p>Checking project access permissions...</p>
        </AccessCard>
      </AccessContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <AccessContainer>
        <AccessCard>
          <h2>Authentication Required</h2>
          <p>This project is private and requires authentication to view.</p>
          <p><strong>{config.name}</strong> is only accessible to authorized users.</p>
          <LoginButton onClick={() => router.push('/login')}>
            Login to Continue
          </LoginButton>
        </AccessCard>
      </AccessContainer>
    );
  }

  return (
    <>
      <GlobalStyle />
      <IframeViewer config={config} />
    </>
  );
}
