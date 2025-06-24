'use client';

import React from 'react';
import styled from 'styled-components';
import { tokens } from './tokens';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${tokens.spacing.xl};
  padding-bottom: ${tokens.spacing.lg};
  border-bottom: 1px solid ${tokens.colors.border};
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${tokens.typography.fontSizes['2xl']};
  font-weight: ${tokens.typography.fontWeights.bold};
  color: ${tokens.colors.text};
  margin: 0 0 ${tokens.spacing.sm} 0;
`;

const MetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacing.xs};
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  font-size: ${tokens.typography.fontSizes.sm};
  color: ${tokens.colors.textSecondary};
`;

const MetadataLabel = styled.span`
  font-weight: ${tokens.typography.fontWeights.medium};
  min-width: 80px;
`;

const MetadataValue = styled.span`
  color: ${tokens.colors.text};
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: ${tokens.spacing.sm};
  align-items: flex-start;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${tokens.spacing.sm} ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.base};
  font-size: ${tokens.typography.fontSizes.sm};
  font-weight: ${tokens.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${tokens.transitions.base};
  border: 1px solid;
  
  ${({ $variant = 'secondary' }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${tokens.colors.primary};
          color: white;
          border-color: ${tokens.colors.primary};
          
          &:hover:not(:disabled) {
            background: ${tokens.colors.primaryHover};
            border-color: ${tokens.colors.primaryHover};
          }
        `;
      case 'danger':
        return `
          background: ${tokens.colors.error};
          color: white;
          border-color: ${tokens.colors.error};
          
          &:hover:not(:disabled) {
            background: #b91c1c;
            border-color: #b91c1c;
          }
        `;
      default:
        return `
          background: ${tokens.colors.background};
          color: ${tokens.colors.secondary};
          border-color: ${tokens.colors.border};
          
          &:hover:not(:disabled) {
            background: ${tokens.colors.backgroundSecondary};
            border-color: ${tokens.colors.textMuted};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${tokens.colors.focus};
  }
`;

export interface MetadataItem {
  label: string;
  value: string | React.ReactNode;
}

export interface ActionButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

interface DetailHeaderProps {
  title: string;
  metadata?: MetadataItem[];
  actions?: ActionButton[];
  className?: string;
}

export default function DetailHeader({ 
  title, 
  metadata = [], 
  actions = [],
  className 
}: DetailHeaderProps) {
  return (
    <HeaderContainer className={className}>
      <HeaderContent>
        <Title>{title}</Title>
        {metadata.length > 0 && (
          <MetadataContainer>
            {metadata.map((item, index) => (
              <MetadataItem key={index}>
                <MetadataLabel>{item.label}:</MetadataLabel>
                <MetadataValue>{item.value}</MetadataValue>
              </MetadataItem>
            ))}
          </MetadataContainer>
        )}
      </HeaderContent>
      
      {actions.length > 0 && (
        <ActionsContainer>
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              $variant={action.variant}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </ActionButton>
          ))}
        </ActionsContainer>
      )}
    </HeaderContainer>
  );
}
