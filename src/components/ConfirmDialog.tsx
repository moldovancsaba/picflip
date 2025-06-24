'use client';

import { useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
`;

const Message = styled.p`
  margin: 0 0 2rem 0;
  color: #6b7280;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const CancelButton = styled(Button)`
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  
  &:hover:not(:disabled) {
    background: #e5e7eb;
  }
`;

const ConfirmButton = styled(Button)<{ variant?: 'danger' | 'primary' }>`
  background: ${props => props.variant === 'danger' ? '#dc2626' : '#0070f3'};
  color: white;
  
  &:hover:not(:disabled) {
    background: ${props => props.variant === 'danger' ? '#b91c1c' : '#0051cc'};
  }
`;

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  className?: string;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
  onConfirm,
  onCancel,
  className
}: ConfirmDialogProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isLoading, onCancel]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  const handleConfirm = async () => {
    if (!isLoading) {
      await onConfirm();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick} className={className}>
      <Dialog role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-message">
        <Title id="dialog-title">{title}</Title>
        <Message id="dialog-message">{message}</Message>
        <Actions>
          <CancelButton 
            onClick={onCancel} 
            disabled={isLoading}
            type="button"
          >
            {cancelText}
          </CancelButton>
          <ConfirmButton 
            onClick={handleConfirm} 
            disabled={isLoading}
            variant={variant}
            type="button"
          >
            {isLoading ? 'Processing...' : confirmText}
          </ConfirmButton>
        </Actions>
      </Dialog>
    </Overlay>
  );
}
