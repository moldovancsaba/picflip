'use client';

import styled from 'styled-components';

const SuccessContainer = styled.div<{ className?: string }>`
  color: #059669;
  padding: 1rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 4px;
  font-size: 0.875rem;
`;

interface SuccessMessageProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function SuccessMessage({ 
  children, 
  className, 
  style 
}: SuccessMessageProps) {
  if (!children) {
    return null;
  }

  return (
    <SuccessContainer className={className} style={style}>
      {children}
    </SuccessContainer>
  );
}
