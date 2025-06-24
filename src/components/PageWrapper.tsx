'use client';

import React, { Suspense, ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import Loading from './Loading';

interface PageWrapperProps {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** 
   * Custom loading props to pass to the Loading component 
   * Allows for different loading styles per page if needed
   */
  loadingProps?: {
    minHeight?: string;
    background?: string;
    className?: string;
  };
}

/**
 * PageWrapper provides consistent loading and error handling for all detail pages
 * 
 * Features:
 * - Suspense boundary with customizable loading fallback
 * - Error boundary with retry functionality
 * - 401 redirect preservation
 * - Consistent UX across all pages
 * 
 * Usage:
 * ```tsx
 * export default function MyPage() {
 *   return (
 *     <PageWrapper>
 *       <MyPageContent />
 *     </PageWrapper>
 *   );
 * }
 * ```
 */
export default function PageWrapper({
  children,
  loadingFallback,
  errorFallback,
  onError,
  loadingProps = {}
}: PageWrapperProps) {
  // Default loading fallback with customizable props
  const defaultLoadingFallback = (
    <Loading 
      minHeight="60vh"
      background="transparent"
      {...loadingProps}
    />
  );

  return (
    <ErrorBoundary 
      fallback={errorFallback}
      onError={onError}
    >
      <Suspense fallback={loadingFallback || defaultLoadingFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
