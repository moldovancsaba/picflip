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

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.md};
`;

const ToggleContainer = styled.label<{ $disabled?: boolean }>`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.6 : 1};
`;

const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

const Slider = styled.span<{ $checked?: boolean; $disabled?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ $checked }) => $checked ? tokens.colors.primary : tokens.colors.textMuted};
  transition: all ${tokens.transitions.base};
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: ${({ $checked }) => $checked ? '22px' : '2px'};
    bottom: 2px;
    background-color: white;
    transition: all ${tokens.transitions.base};
    border-radius: 50%;
    box-shadow: ${tokens.shadows.sm};
  }
  
  ${HiddenInput}:focus + & {
    box-shadow: 0 0 0 2px ${tokens.colors.focus};
  }
  
  ${({ $checked, $disabled }) => !$disabled && `
    &:hover {
      background-color: ${$checked ? tokens.colors.primaryHover : '#8b8b8b'};
    }
  `}
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

const Description = styled.div`
  font-size: ${tokens.typography.fontSizes.xs};
  color: ${tokens.colors.textSecondary};
  margin-top: ${tokens.spacing.xs};
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

export interface ToggleProps {
  label: string;
  name: string;
  checked?: boolean;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  className?: string;
}

export default function Toggle({
  label,
  name,
  checked = false,
  description,
  required = false,
  disabled = false,
  error,
  helpText,
  onChange,
  onBlur,
  className,
}: ToggleProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  const fieldId = `toggle-${name}`;

  return (
    <FieldContainer className={className}>
      <ToggleWrapper>
        <ToggleContainer $disabled={disabled}>
          <HiddenInput
            id={fieldId}
            name={name}
            type="checkbox"
            checked={checked}
            required={required}
            disabled={disabled}
            onChange={handleChange}
            onBlur={onBlur}
            aria-describedby={
              error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined
            }
          />
          <Slider $checked={checked} $disabled={disabled} />
        </ToggleContainer>
        
        <div>
          <Label htmlFor={fieldId} $required={required}>
            {label}
          </Label>
          {description && (
            <Description>{description}</Description>
          )}
        </div>
      </ToggleWrapper>
      
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
