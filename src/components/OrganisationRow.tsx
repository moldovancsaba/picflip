'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Organisation, OrganisationMembershipSummary, MembershipRole } from '@/lib/types';

const RowContainer = styled.div<{ isClickable?: boolean }>`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  
  &:hover {
    ${props => props.isClickable ? 'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);' : ''}
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const LeftSection = styled.div`
  flex: 1;
`;

const RightSection = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`;

const OrganisationName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-size: 1.125rem;
  font-weight: 600;
`;

const SlugBadge = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: #f9fafb;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  border: 1px solid #e5e7eb;
`;

const RoleBadge = styled.div<{ role: MembershipRole }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  ${props => {
    switch (props.role) {
      case 'owner':
        return `
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #f59e0b;
        `;
      case 'admin':
        return `
          background: #dbeafe;
          color: #1e40af;
          border: 1px solid #3b82f6;
        `;
      case 'member':
        return `
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #6b7280;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #6b7280;
        `;
    }
  }}
`;

const Description = styled.p`
  color: #6b7280;
  margin: 0.5rem 0;
  line-height: 1.5;
  font-size: 0.875rem;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaLabel = styled.span`
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const MetaValue = styled.span`
  color: #374151;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
`;

const ActionButton = styled.button`
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(ActionButton)`
  color: #dc2626;
  border-color: #fca5a5;
  
  &:hover:not(:disabled) {
    background: #fef2f2;
    border-color: #dc2626;
  }
`;

interface OrganisationRowProps {
  organisation: Organisation | OrganisationMembershipSummary;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  showRole?: boolean;
  className?: string;
}

// Type guard to check if organisation has membership info
function isMembershipSummary(org: Organisation | OrganisationMembershipSummary): org is OrganisationMembershipSummary {
  return 'membershipRole' in org;
}

// Format timestamp according to ISO 8601 with milliseconds
function formatTimestamp(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString();
}

export default function OrganisationRow({
  organisation,
  onClick,
  onEdit,
  onDelete,
  showActions = false,
  showRole = false,
  className
}: OrganisationRowProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const membershipInfo = isMembershipSummary(organisation) ? organisation : null;

  const handleAction = async (action: () => void) => {
    setIsLoading(true);
    try {
      action();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RowContainer 
      className={className}
      isClickable={!!onClick}
      onClick={onClick}
    >
      <Header>
        <LeftSection>
          <OrganisationName>{organisation.name}</OrganisationName>
          <SlugBadge>/{organisation.slug}</SlugBadge>
        </LeftSection>
        <RightSection>
          {showRole && membershipInfo && (
            <RoleBadge role={membershipInfo.membershipRole}>
              {membershipInfo.membershipRole}
            </RoleBadge>
          )}
          {showActions && (
            <>
              {onEdit && (
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(onEdit);
                  }}
                  disabled={isLoading}
                >
                  Edit
                </ActionButton>
              )}
              {onDelete && (
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(onDelete);
                  }}
                  disabled={isLoading}
                >
                  Delete
                </DeleteButton>
              )}
            </>
          )}
        </RightSection>
      </Header>

      {organisation.description && (
        <Description>{organisation.description}</Description>
      )}

      <MetaInfo>
        <MetaItem>
          <MetaLabel>Created</MetaLabel>
          <MetaValue>{formatTimestamp(organisation.createdAt)}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>Updated</MetaLabel>
          <MetaValue>{formatTimestamp(organisation.updatedAt)}</MetaValue>
        </MetaItem>
        {membershipInfo && (
          <MetaItem>
            <MetaLabel>Joined</MetaLabel>
            <MetaValue>{formatTimestamp(membershipInfo.joinedAt)}</MetaValue>
          </MetaItem>
        )}
      </MetaInfo>
    </RowContainer>
  );
}
