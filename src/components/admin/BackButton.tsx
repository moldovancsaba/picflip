'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { tokens } from './tokens';

const Button = styled.button<{ $variant?: 'button' | 'link' }>`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  background: ${tokens.colors.background};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.borderRadius.base};
  color: ${tokens.colors.secondary};
  font-size: ${tokens.typography.fontSizes.sm};
  font-weight: ${tokens.typography.fontWeights.medium};
  text-decoration: none;
  cursor: pointer;
  transition: all ${tokens.transitions.base};
  
  &:hover {
    background: ${tokens.colors.backgroundSecondary};
    border-color: ${tokens.colors.textMuted};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${tokens.colors.focus};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  background: ${tokens.colors.background};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.borderRadius.base};
  color: ${tokens.colors.secondary};
  font-size: ${tokens.typography.fontSizes.sm};
  font-weight: ${tokens.typography.fontWeights.medium};
  text-decoration: none;
  cursor: pointer;
  transition: all ${tokens.transitions.base};
  
  &:hover {
    background: ${tokens.colors.backgroundSecondary};
    border-color: ${tokens.colors.textMuted};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${tokens.colors.focus};
  }
`;

const Icon = styled.span`
  font-size: ${tokens.typography.fontSizes.sm};
  line-height: 1;
`;

const Label = styled.span`
  line-height: 1;
`;

export interface BackButtonProps {
  /** Target URL to navigate to. If not provided, uses browser back navigation */
  href?: string;
  /** Custom label for the button. Defaults to "Back" */
  label?: string;
  /** Custom icon. Defaults to left arrow */
  icon?: string;
  /** Additional CSS class */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom click handler - only used when href is not provided */
  onClick?: () => void;
}

export default function BackButton({
  href,
  label = 'Back',
  icon = '←',
  className,
  disabled = false,
  onClick,
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  // If href is provided, render as Link
  if (href && !disabled) {
    return (
      <StyledLink href={href} className={className}>
        <Icon>{icon}</Icon>
        <Label>{label}</Label>
      </StyledLink>
    );
  }

  // Otherwise render as button with custom navigation
  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={className}
      $variant="button"
    >
      <Icon>{icon}</Icon>
      <Label>{label}</Label>
    </Button>
  );
}
