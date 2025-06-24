'use client';

import styled from 'styled-components';
// Import version from package.json at build time
const version = "1.2.0";

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
  return (
    <FooterContainer>
      <VersionText>
        Picito v{version}
      </VersionText>
    </FooterContainer>
  );
}
