import { Suspense } from 'react';
import styled from 'styled-components';
import DashboardLayout from '@/components/organizations/DashboardLayout';
import MemberList from '@/components/organizations/MemberList';
import ProjectList from '@/components/organizations/ProjectList';
import ActivityFeed from '@/components/organizations/ActivityFeed';
import SearchBar from '@/components/organizations/SearchBar';
import { type SearchResult } from '@/components/organizations/SearchBar';
import { getOrganization } from '@/lib/data/organizations';
import { getUserSession } from '@/lib/auth/session';

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

interface OrganizationDashboardProps {
  params: {
    id: string;
  };
}

export default async function OrganizationDashboard({ params }: OrganizationDashboardProps) {
  const session = await getUserSession();
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const organization = await getOrganization(params.id);
  if (!organization) {
    return {
      notFound: true,
    };
  }

  function handleSearchResult(result: SearchResult) {
    if (result.type === 'member') {
      // Handle member click (e.g., show member details)
      console.log('Member clicked:', result);
    } else {
      // Handle project click (navigate to project)
      window.location.href = `/projects/${result._id}`;
    }
  }

  return (
    <DashboardLayout>
      <SearchBar
        organizationId={params.id}
        onResultClick={handleSearchResult}
      />

      <Grid>
        <MainColumn>
          <Suspense fallback={<LoadingPlaceholder />}>
            <ProjectList
              organizationId={params.id}
              userRole={session.userRole}
            />
          </Suspense>

          <Suspense fallback={<LoadingPlaceholder />}>
            <MemberList
              organizationId={params.id}
              userRole={session.userRole}
              userId={session.userId}
            />
          </Suspense>
        </MainColumn>

        <SideColumn>
          <Suspense fallback={<LoadingPlaceholder />}>
            <ActivityFeed
              organizationId={params.id}
              userRole={session.userRole}
            />
          </Suspense>
        </SideColumn>
      </Grid>
    </DashboardLayout>
  );
}
