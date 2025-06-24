'use client';

import styled from 'styled-components';

const ErrorContainer = styled.div<{ className?: string }>`
  color: #dc2626;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  font-size: 0.875rem;
`;

interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ErrorMessage({ 
  children, 
  className, 
  style 
}: ErrorMessageProps) {
  if (!children) {
    return null;
  }

  return (
    <ErrorContainer className={className} style={style}>
      {children}
    </ErrorContainer>
  );
}
