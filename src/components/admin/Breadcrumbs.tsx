'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { tokens } from './tokens';

const BreadcrumbsContainer = styled.nav<{ className?: string }>`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  font-size: ${tokens.typography.fontSizes.sm};
  color: ${tokens.colors.textSecondary};
  margin-bottom: ${tokens.spacing.md};
`;

const BreadcrumbItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
`;

const BreadcrumbLink = styled(Link)`
  color: ${tokens.colors.primary};
  text-decoration: none;
  transition: color ${tokens.transitions.base};
  
  &:hover {
    color: ${tokens.colors.primaryLight};
    text-decoration: underline;
  }
`;

const BreadcrumbCurrent = styled.span`
  color: ${tokens.colors.secondary};
  font-weight: ${tokens.typography.fontWeights.medium};
`;

const BreadcrumbSeparator = styled.span`
  color: ${tokens.colors.textMuted};
  user-select: none;
`;

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
}

export default function Breadcrumbs({ 
  items, 
  separator = '/', 
  className 
}: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <BreadcrumbsContainer className={className} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <BreadcrumbItem key={index}>
            {item.href && !isLast ? (
              <BreadcrumbLink href={item.href}>
                {item.label}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbCurrent aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </BreadcrumbCurrent>
            )}
            {!isLast && (
              <BreadcrumbSeparator aria-hidden="true">
                {separator}
              </BreadcrumbSeparator>
            )}
          </BreadcrumbItem>
        );
      })}
    </BreadcrumbsContainer>
  );
}
