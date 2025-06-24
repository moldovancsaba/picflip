'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const BannerContainer = styled.div<{ $variant: 'error' | 'warning' | 'info' }>`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'error':
        return `
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
        `;
      case 'warning':
        return `
          color: #d97706;
          background: #fffbeb;
          border: 1px solid #fed7aa;
        `;
      case 'info':
        return `
          color: #0369a1;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
        `;
      default:
        return `
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
        `;
    }
  }}
`;

const BannerContent = styled.div`
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 1rem;
  opacity: 0.7;
  font-size: 1.2rem;
  line-height: 1;
  
  &:hover {
    opacity: 1;
  }
`;

interface ErrorBannerProps {
  children: React.ReactNode;
  variant?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  dismissible?: boolean;
  /** 
   * Automatically handle 401 errors by redirecting to login
   * This preserves the 401 redirect behavior as required
   */
  autoRedirectOn401?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ErrorBanner provides consistent error display with 401 redirect handling
 * 
 * Features:
 * - Consistent styling across error types
 * - Automatic 401 redirect preservation
 * - Dismissible banners
 * - Accessible error display
 * 
 * Usage:
 * ```tsx
 * <ErrorBanner 
 *   variant="error" 
 *   autoRedirectOn401={true}
 *   dismissible={true}
 *   onDismiss={() => setError(null)}
 * >
 *   {error?.message || 'An error occurred'}
 * </ErrorBanner>
 * ```
 */
export default function ErrorBanner({
  children,
  variant = 'error',
  onDismiss,
  dismissible = false,
  autoRedirectOn401 = true,
  className,
  style
}: ErrorBannerProps) {
  const router = useRouter();

  // Handle 401 redirect automatically if enabled
  useEffect(() => {
    if (autoRedirectOn401 && typeof children === 'string') {
      const errorMessage = children.toLowerCase();
      if (errorMessage.includes('401') || 
          errorMessage.includes('unauthorized') || 
          errorMessage.includes('authentication') ||
          errorMessage.includes('login required')) {
        console.warn('401 error detected, redirecting to login');
        router.push('/login');
      }
    }
  }, [children, autoRedirectOn401, router]);

  if (!children) {
    return null;
  }

  return (
    <BannerContainer 
      $variant={variant} 
      className={className} 
      style={style}
      role="alert"
      aria-live="polite"
    >
      <BannerContent>
        {children}
      </BannerContent>
      
      {dismissible && onDismiss && (
        <DismissButton 
          onClick={onDismiss}
          aria-label="Dismiss error message"
          title="Dismiss"
        >
          ×
        </DismissButton>
      )}
    </BannerContainer>
  );
}
