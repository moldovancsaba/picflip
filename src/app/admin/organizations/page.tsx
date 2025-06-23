'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IOrganization } from '@/models/Organization';
import Loading from '@/components/Loading';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const CreateButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #059669;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled.div<{ $isArchived?: boolean }>`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  opacity: ${props => props.$isArchived ? 0.7 : 1};
  
  ${props => props.$isArchived && `
    background: #f9fafb;
  `}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
  background: #f3f4f6;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: #111827;
`;

const Description = styled.p`
  color: #6b7280;
  margin: 0.5rem 0;
  font-size: 0.875rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ $variant?: 'danger' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  ${props => {
    switch (props.$variant) {
      case 'danger':
        return `
          background-color: #ef4444;
          color: white;
          &:hover { background-color: #dc2626; }
        `;
      case 'secondary':
        return `
          background-color: #e5e7eb;
          color: #374151;
          &:hover { background-color: #d1d5db; }
        `;
      default:
        return `
          background-color: #0070f3;
          color: white;
          &:hover { background-color: #0051cc; }
        `;
    }
  }}
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

interface Organization extends IOrganization {
  memberCount: number;
  iframeCount: number;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = organizations.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrgs(filtered);
    } else {
      setFilteredOrgs(organizations);
    }
  }, [searchTerm, organizations]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/admin/organizations');
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      const data = await response.json();
      setOrganizations(data.organizations);
      setFilteredOrgs(data.organizations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrganization = () => {
    // This will be implemented in the next task
    console.log('Create organization');
  };

  const handleArchiveToggle = async (orgId: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/admin/organizations/${orgId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isArchived: !currentState }),
      });

      if (!response.ok) {
        throw new Error('Failed to update organization');
      }

      setOrganizations(orgs =>
        orgs.map(org =>
          org._id === orgId ? { ...org, isArchived: !currentState } : org
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update organization');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Header>
        <Title>Organizations</Title>
        <CreateButton onClick={handleCreateOrganization}>
          Create Organization
        </CreateButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div style={{ marginBottom: '2rem' }}>
        <SearchInput
          type="text"
          placeholder="Search organizations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredOrgs.length === 0 ? (
        <EmptyState>
          <h2>No organizations found</h2>
          <p>Create your first organization to get started.</p>
        </EmptyState>
      ) : (
        <Grid>
          {filteredOrgs.map((org) => (
            <Card key={org._id} $isArchived={org.isArchived}>
              <CardHeader>
                {org.logoUrl ? (
                  <Logo src={org.logoUrl} alt={org.name} />
                ) : (
                  <Logo src="/placeholder-logo.png" alt="Default logo" />
                )}
                <CardTitle>{org.name}</CardTitle>
              </CardHeader>
              <Description>{org.description}</Description>
              <Stats>
                <span>{org.memberCount} members</span>
                <span>•</span>
                <span>{org.iframeCount} iframes</span>
              </Stats>
              <ButtonGroup>
                <Button onClick={() => {}}>
                  Manage
                </Button>
                <Button
                  $variant="secondary"
                  onClick={() => handleArchiveToggle(org._id, org.isArchived)}
                >
                  {org.isArchived ? 'Unarchive' : 'Archive'}
                </Button>
              </ButtonGroup>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
}
