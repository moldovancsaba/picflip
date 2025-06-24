'use client';

import React from 'react';
import styled from 'styled-components';
import { tokens } from './tokens';

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.sm};
  margin-bottom: ${tokens.spacing.lg};
`;

const Label = styled.label<{ $required?: boolean }>`
  font-size: ${tokens.typography.fontSizes.sm};
  font-weight: ${tokens.typography.fontWeights.medium};
  color: ${tokens.colors.secondary};
  
  ${({ $required }) => $required && `
    &::after {
      content: ' *';
      color: ${tokens.colors.error};
    }
  `}
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  border: 1px solid ${({ $hasError }) => $hasError ? tokens.colors.error : tokens.colors.borderLight};
  border-radius: ${tokens.borderRadius.base};
  font-size: ${tokens.typography.fontSizes.base};
  transition: all ${tokens.transitions.base};
  background: ${tokens.colors.background};
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => $hasError ? tokens.colors.error : tokens.colors.primary};
    box-shadow: 0 0 0 2px ${({ $hasError }) => $hasError ? 'rgba(220, 38, 38, 0.2)' : tokens.colors.focus};
  }
  
  &:disabled {
    background: ${tokens.colors.backgroundSecondary};
    color: ${tokens.colors.textMuted};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${tokens.colors.textMuted};
  }
`;

const Textarea = styled.textarea<{ $hasError?: boolean }>`
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  border: 1px solid ${({ $hasError }) => $hasError ? tokens.colors.error : tokens.colors.borderLight};
  border-radius: ${tokens.borderRadius.base};
  font-size: ${tokens.typography.fontSizes.base};
  transition: all ${tokens.transitions.base};
  background: ${tokens.colors.background};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => $hasError ? tokens.colors.error : tokens.colors.primary};
    box-shadow: 0 0 0 2px ${({ $hasError }) => $hasError ? 'rgba(220, 38, 38, 0.2)' : tokens.colors.focus};
  }
  
  &:disabled {
    background: ${tokens.colors.backgroundSecondary};
    color: ${tokens.colors.textMuted};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${tokens.colors.textMuted};
  }
`;

const HelpText = styled.div`
  font-size: ${tokens.typography.fontSizes.xs};
  color: ${tokens.colors.textSecondary};
`;

const ErrorText = styled.div`
  font-size: ${tokens.typography.fontSizes.xs};
  color: ${tokens.colors.error};
  font-weight: ${tokens.typography.fontWeights.medium};
`;

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'url' | 'tel';
  value?: string | number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  autoComplete?: string;
  rows?: number;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value = '',
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  onChange,
  onBlur,
  className,
  autoComplete,
  rows = 3,
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  const fieldId = `field-${name}`;
  const hasError = Boolean(error);

  return (
    <FieldContainer className={className}>
      <Label htmlFor={fieldId} $required={required}>
        {label}
      </Label>
      
      {type === 'textarea' ? (
        <Textarea
          id={fieldId}
          name={name}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          onBlur={onBlur}
          rows={rows}
          $hasError={hasError}
          aria-describedby={
            error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined
          }
        />
      ) : (
        <Input
          id={fieldId}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          $hasError={hasError}
          aria-describedby={
            error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined
          }
        />
      )}
      
      {error && (
        <ErrorText id={`${fieldId}-error`} role="alert">
          {error}
        </ErrorText>
      )}
      
      {helpText && !error && (
        <HelpText id={`${fieldId}-help`}>
          {helpText}
        </HelpText>
      )}
    </FieldContainer>
  );
}
