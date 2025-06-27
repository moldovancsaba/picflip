'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styled from 'styled-components';
import { tokens } from '@/components/admin/tokens';
import DetailHeader from '@/components/admin/DetailHeader';
import FormField from '@/components/admin/FormField';
import Select from '@/components/admin/Select';
import { PageWrapper, ErrorBanner } from '@/components';
import { MembershipRole, User } from '@/lib/types';

// Styled components
const Container = styled.div`
  padding: ${tokens.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const TabContainer = styled.div`
  border-bottom: 1px solid ${tokens.colors.border};
  margin-bottom: ${tokens.spacing.xl};
`;

const TabList = styled.div`
  display: flex;
  gap: ${tokens.spacing.lg};
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: ${tokens.spacing.md} 0;
  font-size: ${tokens.typography.fontSizes.base};
  font-weight: ${tokens.typography.fontWeights.medium};
  color: ${({ $active }) => $active ? tokens.colors.primary : tokens.colors.textSecondary};
  border-bottom: 2px solid ${({ $active }) => $active ? tokens.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all ${tokens.transitions.base};
  
  &:hover {
    color: ${tokens.colors.primary};
  }
`;

const TabContent = styled.div`
  min-height: 400px;
`;

const Section = styled.div`
  background: ${tokens.colors.background};
  border: 1px solid ${tokens.colors.border};
  border-radius: ${tokens.borderRadius.lg};
  padding: ${tokens.spacing.xl};
  margin-bottom: ${tokens.spacing.xl};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${tokens.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${tokens.typography.fontSizes.lg};
  font-weight: ${tokens.typography.fontWeights.semibold};
  color: ${tokens.colors.text};
  margin: 0;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
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

const StatCard = styled.div`
  background: ${tokens.colors.backgroundSecondary};
  padding: ${tokens.spacing.lg};
  border-radius: ${tokens.borderRadius.base};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${tokens.typography.fontSizes['2xl']};
  font-weight: ${tokens.typography.fontWeights.bold};
  color: ${tokens.colors.text};
`;

const StatLabel = styled.div`
  font-size: ${tokens.typography.fontSizes.sm};
  color: ${tokens.colors.textSecondary};
  margin-top: ${tokens.spacing.xs};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${tokens.spacing.lg};
  margin-bottom: ${tokens.spacing.xl};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${tokens.spacing.lg};
`;

const TableHeader = styled.th`
  text-align: left;
  padding: ${tokens.spacing.md};
  border-bottom: 1px solid ${tokens.colors.border};
  font-weight: ${tokens.typography.fontWeights.semibold};
  color: ${tokens.colors.secondary};
`;

const TableCell = styled.td`
  padding: ${tokens.spacing.md};
  border-bottom: 1px solid ${tokens.colors.borderLight};
`;

const TableRow = styled.tr`
  &:hover {
    background: ${tokens.colors.backgroundSecondary};
  }
`;

const Badge = styled.span<{ $variant: 'public' | 'private' | 'owner' | 'admin' | 'member' }>`
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
  border-radius: ${tokens.borderRadius.base};
  font-size: ${tokens.typography.fontSizes.xs};
  font-weight: ${tokens.typography.fontWeights.medium};
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'public':
        return `
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        `;
      case 'private':
        return `
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        `;
      case 'owner':
        return `
          background: #eef2ff;
          color: #3730a3;
          border: 1px solid #c7d2fe;
        `;
      case 'admin':
        return `
          background: #fffbeb;
          color: #92400e;
          border: 1px solid #fed7aa;
        `;
      case 'member':
        return `
          background: #f0f9ff;
          color: #0369a1;
          border: 1px solid #bae6fd;
        `;
    }
  }}
`;

const AddMemberForm = styled.form`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: ${tokens.spacing.md};
  align-items: end;
  margin-top: ${tokens.spacing.lg};
  padding: ${tokens.spacing.lg};
  background: ${tokens.colors.backgroundSecondary};
  border-radius: ${tokens.borderRadius.base};
`;

const Message = styled.div<{ $type: 'success' | 'error' }>`
  padding: ${tokens.spacing.md};
  border-radius: ${tokens.borderRadius.base};
  margin-bottom: ${tokens.spacing.lg};
  
  ${({ $type }) => $type === 'success' ? `
    background: ${tokens.colors.successBackground};
    color: ${tokens.colors.success};
    border: 1px solid #a7f3d0;
  ` : `
    background: ${tokens.colors.errorBackground};
    color: ${tokens.colors.error};
    border: 1px solid #fecaca;
  `}
`;

const ProjectItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${tokens.spacing.md};
  border: 1px solid ${tokens.colors.borderLight};
  border-radius: ${tokens.borderRadius.base};
  margin-bottom: ${tokens.spacing.sm};
  
  &:hover {
    background: ${tokens.colors.backgroundSecondary};
  }
`;

// Types
interface OrganizationMember {
  _id: string;
  userId: string;
  email: string;
  userRole: 'admin' | 'user';
  membershipRole: MembershipRole;
  joinedAt: string;
  lastLoginAt: string | null;
  createdAt: string;
}

interface OrganizationProject {
  id: string;
  name: string;
  isPublic: boolean;
  contentUrl: string;
}

interface OrganizationData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  members: OrganizationMember[];
  projects: OrganizationProject[];
}

type TabType = 'overview' | 'members' | 'projects';

export default function OrganizationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<MembershipRole>('member');
  const [isAddingMember, setIsAddingMember] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrganization();
    }
  }, [id]);

  const fetchOrganization = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/organizations/${id}`);

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch organization details');
      }

      const data = await response.json();
      setOrganization(data.organization);
      setEditedName(data.organization.name);
      setEditedDescription(data.organization.description || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (date: string) => {
    return new Date(date).toISOString();
  };

  const handleOverviewSave = async () => {
    if (!organization) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/organizations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedName,
          description: editedDescription,
        }),
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update organization');
      }

      const data = await response.json();
      setOrganization(data.organization);
      setSuccess('Organization updated successfully');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    setIsAddingMember(true);
    setError(null);
    setSuccess(null);

    try {
      // First, find the user by email
      const userResponse = await fetch(`/api/admin/users?email=${encodeURIComponent(newMemberEmail)}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }

      const userData = await userResponse.json();
      const userId = userData.user._id;

      // Add the membership
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberships: [{
            organizationId: id,
            role: newMemberRole,
            action: 'add'
          }]
        }),
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add member');
      }

      setNewMemberEmail('');
      setNewMemberRole('member');
      setSuccess('Member added successfully');
      
      // Refresh organization data
      await fetchOrganization();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add member');
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRoleChange = async (memberId: string, userId: string, newRole: MembershipRole) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberships: [{
            organizationId: id,
            role: newRole,
            action: 'add' // This will update existing membership
          }]
        }),
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update member role');
      }

      setSuccess('Member role updated successfully');
      
      // Refresh organization data
      await fetchOrganization();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member from the organization?')) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberships: [{
            organizationId: id,
            role: 'member', // Role doesn't matter for removal
            action: 'remove'
          }]
        }),
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove member');
      }

      setSuccess('Member removed successfully');
      
      // Refresh organization data
      await fetchOrganization();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    }
  };

  // Main page content component to be wrapped
  const OrganizationPageContent = () => {
    if (!organization) {
      return (
        <Container>
          <ErrorBanner variant="error" autoRedirectOn401={true}>
            Organization not found
          </ErrorBanner>
        </Container>
      );
    }

    const headerMetadata = [
      { label: 'ID', value: organization._id },
      { label: 'Slug', value: `/${organization.slug}` },
      { label: 'Created', value: formatTimestamp(organization.createdAt) },
      { label: 'Updated', value: formatTimestamp(organization.updatedAt) }
    ];

    // No header actions needed - navigation handled by admin layout
    const headerActions: never[] = [];

    const memberCount = organization.members.length;
    const projectCount = organization.projects.length;
    const ownerCount = organization.members.filter(m => m.membershipRole === 'owner').length;

    return (
      <Container>
        <DetailHeader
          title={organization.name}
          metadata={headerMetadata}
          actions={headerActions}
        />

        {error && (
          <ErrorBanner 
            variant="error" 
            autoRedirectOn401={true}
            dismissible={true}
            onDismiss={() => setError(null)}
          >
            {error}
          </ErrorBanner>
        )}
        {success && <Message $type="success">{success}</Message>}

      <TabContainer>
        <TabList>
          <Tab
            $active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Tab>
          <Tab
            $active={activeTab === 'members'}
            onClick={() => setActiveTab('members')}
          >
            Members ({memberCount})
          </Tab>
          <Tab
            $active={activeTab === 'projects'}
            onClick={() => setActiveTab('projects')}
          >
            Projects ({projectCount})
          </Tab>
        </TabList>
      </TabContainer>

      <TabContent>
        {activeTab === 'overview' && (
          <>
            <StatsGrid>
              <StatCard>
                <StatValue>{memberCount}</StatValue>
                <StatLabel>Total Members</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{projectCount}</StatValue>
                <StatLabel>Projects</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{ownerCount}</StatValue>
                <StatLabel>Owners</StatLabel>
              </StatCard>
            </StatsGrid>

            <Section>
              <SectionHeader>
                <SectionTitle>Basic Information</SectionTitle>
                <Button 
                  $variant="primary" 
                  onClick={handleOverviewSave} 
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </SectionHeader>

              <FormField
                label="Organization Name"
                name="name"
                value={editedName}
                onChange={setEditedName}
                required
                disabled={isSaving}
              />

              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={editedDescription}
                onChange={setEditedDescription}
                disabled={isSaving}
                helpText="Optional description for the organization"
              />
            </Section>
          </>
        )}

        {activeTab === 'members' && (
          <Section>
            <SectionHeader>
              <SectionTitle>Organization Members</SectionTitle>
            </SectionHeader>

            <AddMemberForm onSubmit={handleAddMember}>
              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={newMemberEmail}
                onChange={setNewMemberEmail}
                placeholder="user@example.com"
                required
                disabled={isAddingMember}
              />
              
              <Select
                label="Role"
                name="role"
                value={newMemberRole}
                onChange={(value) => setNewMemberRole(value as MembershipRole)}
                disabled={isAddingMember}
                options={[
                  { value: 'member', label: 'Member' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'owner', label: 'Owner' }
                ]}
              />
              
              <Button 
                type="submit" 
                $variant="primary" 
                disabled={isAddingMember || !newMemberEmail.trim()}
                style={{ alignSelf: 'end' }}
              >
                {isAddingMember ? 'Adding...' : 'Add Member'}
              </Button>
            </AddMemberForm>

            <Table>
              <thead>
                <tr>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Joined</TableHeader>
                  <TableHeader>Last Login</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {organization.members.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge $variant={member.membershipRole}>
                        {member.membershipRole}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatTimestamp(member.joinedAt)}</TableCell>
                    <TableCell>
                      {member.lastLoginAt ? formatTimestamp(member.lastLoginAt) : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
                        <Select
                          label=""
                          name={`role-${member._id}`}
                          value={member.membershipRole}
                          onChange={(value) => handleRoleChange(member._id, member.userId, value as MembershipRole)}
                          options={[
                            { value: 'member', label: 'Member' },
                            { value: 'admin', label: 'Admin' },
                            { value: 'owner', label: 'Owner' }
                          ]}
                        />
                        <Button
                          $variant="danger"
                          onClick={() => handleRemoveMember(member.userId)}
                          style={{ fontSize: tokens.typography.fontSizes.xs, padding: `${tokens.spacing.xs} ${tokens.spacing.sm}` }}
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>

            {organization.members.length === 0 && (
              <div style={{ textAlign: 'center', padding: tokens.spacing.xl, color: tokens.colors.textSecondary }}>
                No members found. Add the first member above.
              </div>
            )}
          </Section>
        )}

        {activeTab === 'projects' && (
          <Section>
            <SectionHeader>
              <SectionTitle>Associated Projects</SectionTitle>
            </SectionHeader>

            {organization.projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: tokens.spacing.xl, color: tokens.colors.textSecondary, fontStyle: 'italic' }}>
                No projects assigned to this organization.
              </div>
            ) : (
              <div>
                {organization.projects.map((project) => (
                  <ProjectItem key={project.id}>
                    <div>
                      <div style={{ fontWeight: tokens.typography.fontWeights.medium, marginBottom: tokens.spacing.xs }}>
                        {project.name}
                      </div>
                      <div style={{ fontSize: tokens.typography.fontSizes.sm, color: tokens.colors.textSecondary }}>
                        ID: {project.id}
                      </div>
                      {project.contentUrl && (
                        <div style={{ fontSize: tokens.typography.fontSizes.sm, color: tokens.colors.textMuted, marginTop: tokens.spacing.xs }}>
                          {project.contentUrl}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
                      <Badge $variant={project.isPublic ? 'public' : 'private'}>
                        {project.isPublic ? 'Public' : 'Private'}
                      </Badge>
                      <Button
                        onClick={() => router.push(`/admin/projects/${project.id}`)}
                        style={{ fontSize: tokens.typography.fontSizes.xs }}
                      >
                        View Details
                      </Button>
                    </div>
                  </ProjectItem>
                ))}
              </div>
            )}
          </Section>
        )}
      </TabContent>
    </Container>
  );
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <PageWrapper 
        loadingProps={{ minHeight: '60vh', background: 'transparent' }}
      >
        <div>Loading organization details...</div>
      </PageWrapper>
    );
  }

  // Return wrapped content with global error boundary and suspense
  return (
    <PageWrapper 
      loadingProps={{ minHeight: '60vh', background: 'transparent' }}
    >
      <OrganizationPageContent />
    </PageWrapper>
  );
}
