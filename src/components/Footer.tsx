'use client';

import styled from 'styled-components';
import { useEffect, useState } from 'react';

const FooterContainer = styled.footer`
  background: #f8f9fa;
  border-top: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  margin-top: auto;
  text-align: center;
`;

const VersionText = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
  font-family: monospace;
`;

export default function Footer() {
  const [version, setVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVersion() {
      try {
        const response = await fetch('/api/version', {
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          setVersion(data.version);
        }
      } catch (error) {
        console.error('Failed to fetch version:', error);
        setVersion(null); // Clear version on error
      } finally {
        setLoading(false);
      }
    }

    fetchVersion();
  }, []);

  return (
    <FooterContainer>
      <VersionText>
        {loading ? 'Loading...' : version ? `Picito v${version}` : 'Picito (version unavailable)'}
      </VersionText>
    </FooterContainer>
  );
}
