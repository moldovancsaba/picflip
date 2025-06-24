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

const SelectWrapper = styled.div`
  position: relative;
`;

const SelectElement = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  padding-right: 2.5rem;
  border: 1px solid ${({ $hasError }) => $hasError ? tokens.colors.error : tokens.colors.borderLight};
  border-radius: ${tokens.borderRadius.base};
  font-size: ${tokens.typography.fontSizes.base};
  transition: all ${tokens.transitions.base};
  background: ${tokens.colors.background};
  color: ${tokens.colors.text};
  cursor: pointer;
  appearance: none;
  
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
`;

const SelectIcon = styled.div`
  position: absolute;
  right: ${tokens.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${tokens.colors.textMuted};
  font-size: ${tokens.typography.fontSizes.sm};
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

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  name: string;
  value?: string | number;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  className?: string;
}

export default function Select({
  label,
  name,
  value = '',
  options,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  onChange,
  onBlur,
  className,
}: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  const fieldId = `select-${name}`;
  const hasError = Boolean(error);

  return (
    <FieldContainer className={className}>
      <Label htmlFor={fieldId} $required={required}>
        {label}
      </Label>
      
      <SelectWrapper>
        <SelectElement
          id={fieldId}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          onBlur={onBlur}
          $hasError={hasError}
          aria-describedby={
            error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined
          }
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </SelectElement>
        
        <SelectIcon>
          ▼
        </SelectIcon>
      </SelectWrapper>
      
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
