'use client';

import React, { Component, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import ErrorMessage from './ErrorMessage';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: #dc2626;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ErrorDetails = styled.pre`
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #374151;
  max-width: 600px;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid #e5e7eb;
`;

const RetryButton = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background: #0051cc;
  }
`;

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Hook-based error boundary wrapper for functional components
export function withErrorBoundary<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  return function WrappedComponent(props: T) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ 
  error, 
  retry 
}) => (
  <ErrorContainer>
    <ErrorTitle>Something went wrong</ErrorTitle>
    <ErrorMessage>
      An unexpected error occurred while loading this page. 
      Please try refreshing or contact support if the problem persists.
    </ErrorMessage>
    
    {process.env.NODE_ENV === 'development' && (
      <ErrorDetails>
        {error.message}
        {error.stack && '\n\n' + error.stack}
      </ErrorDetails>
    )}
    
    <RetryButton onClick={retry}>
      Try Again
    </RetryButton>
  </ErrorContainer>
);

// Error boundary class component (required for componentDidCatch)
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state to trigger fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Check if error is due to 401 unauthorized and redirect
    // This preserves 401 redirects as required
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      // Use router to redirect to login
      // Note: We cannot use useRouter hook in class component, 
      // so we handle this in the fetch error handling in pages
      console.warn('401 error detected, should redirect to login');
    }
  }

  retry = () => {
    // Reset error state to retry rendering
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback: CustomFallback } = this.props;

    if (hasError && error) {
      // Render custom fallback or default error UI
      const FallbackComponent = CustomFallback || DefaultErrorFallback;
      return <FallbackComponent error={error} retry={this.retry} />;
    }

    // Render children normally when no error
    return children;
  }
}

export default ErrorBoundary;
