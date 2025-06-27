'use client';

import { Suspense } from 'react';
import styled from 'styled-components';
import MemberList from '@/components/organizations/MemberList';
import ProjectList from '@/components/organizations/ProjectList';
import ActivityFeed from '@/components/organizations/ActivityFeed';
import SearchBar from '@/components/organizations/SearchBar';
import { type SearchResult } from '@/components/organizations/SearchBar';
import { type Role } from '@/lib/permissions/constants';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const LoadingPlaceholder = styled.div`
  background: #f1f5f9;
  border-radius: 8px;
  height: 200px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }
`;

interface DashboardContentProps {
  organizationId: string;
  userId: string;
  userRole: Role;
}

export default function DashboardContent({ organizationId, userId, userRole }: DashboardContentProps) {
  const handleSearchResult = (result: SearchResult) => {
    if (result.type === 'project') {
      window.location.href = `/projects/${result._id}`;
    } else {
      window.location.href = `/members/${result._id}`;
    }
  };

  return (
    <>
      <SearchBar
        organizationId={organizationId}
        onResultClick={handleSearchResult}
      />

      <Grid>
        <MainColumn>
          <Suspense fallback={<LoadingPlaceholder />}>
            <ProjectList
              organizationId={organizationId}
              userRole={userRole}
            />
          </Suspense>

          <Suspense fallback={<LoadingPlaceholder />}>
            <MemberList
              organizationId={organizationId}
              userRole={userRole}
              userId={userId}
            />
          </Suspense>
        </MainColumn>

        <SideColumn>
          <Suspense fallback={<LoadingPlaceholder />}>
            <ActivityFeed
              organizationId={organizationId}
              userRole={userRole}
            />
          </Suspense>
        </SideColumn>
      </Grid>
    </>
  );
}
