'use client';

import styled from 'styled-components';
import { useVersion } from '@/hooks/useVersion';

const FooterContainer = styled.footer`
  background: #f8f9fa;
  border-top: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  margin-top: auto;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
`;

const VersionText = styled.span`
  opacity: 0.8;
`;

export default function Footer() {
  const { version, loading, error } = useVersion();

  return (
    <FooterContainer>
      <VersionText>
        {loading ? 'Loading version...' : error ? 'Version unavailable' : `v${version}`}
      </VersionText>
    </FooterContainer>
  );
}
