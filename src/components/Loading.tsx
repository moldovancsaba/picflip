'use client';

import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div<{ className?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #0070f3;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

interface LoadingProps {
  className?: string;
  minHeight?: string;
  background?: string;
}

export default function Loading({ 
  className, 
  minHeight = '100vh', 
  background = '#f5f5f5' 
}: LoadingProps = {}) {
  return (
    <LoadingContainer 
      className={className}
      style={{ minHeight, background }}
    >
      <Spinner />
    </LoadingContainer>
  );
}
