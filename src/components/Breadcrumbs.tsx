'use client';

import styled from 'styled-components';

const BreadcrumbsContainer = styled.nav<{ className?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const BreadcrumbItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BreadcrumbLink = styled.a`
  color: #0070f3;
  text-decoration: none;
  transition: color 0.2s;
  
  &:hover {
    color: #0051cc;
    text-decoration: underline;
  }
`;

const BreadcrumbCurrent = styled.span`
  color: #374151;
  font-weight: 500;
`;

const BreadcrumbSeparator = styled.span`
  color: #9ca3af;
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
