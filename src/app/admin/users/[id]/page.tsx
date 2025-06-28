'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DetailHeader from '@/components/admin/DetailHeader';
import FormField from '@/components/admin/FormField';
import Select from '@/components/admin/Select';
import { PageWrapper, ErrorBanner } from '@/components';
import { MembershipRole } from '@/lib/types';
import { tokens } from '@/components/admin/tokens';
import {
  Container,
  TabContainer,
  TabList,
  Tab,
  TabContent,
  Section,
  SectionHeader,
  SectionTitle,
  Button,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Badge,
  Message,
  ActivityItem,
  ActivityLabel,
  ActivityValue
} from '@/components/admin/shared';
import styled from 'styled-components';

const AddMembershipForm = styled.form`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: ${tokens.spacing.md};
  align-items: end;
  margin-top: ${tokens.spacing.lg};
  padding: ${tokens.spacing.lg};
  background: ${tokens.colors.backgroundSecondary};
  border-radius: ${tokens.borderRadius.base};
`;

// Types
interface UserMembership {
  _id: string;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: MembershipRole;
  joinedAt: string;
}

interface Organization {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface UserData {
  _id: string;
  email: string;
  role: 'admin' | 'user';
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  memberships: UserMembership[];
  allOrganizations: Organization[];
}

type TabType = 'account' | 'memberships' | 'activity';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selfDemotionWarning, setSelfDemotionWarning] = useState<string | null>(null);
  
  // Form states
  const [editedEmail, setEditedEmail] = useState('');
  const [editedRole, setEditedRole] = useState<'admin' | 'user'>('user');
  const [newMembershipOrgId, setNewMembershipOrgId] = useState('');
  const [newMembershipRole, setNewMembershipRole] = useState<MembershipRole>('member');
  const [isAddingMembership, setIsAddingMembership] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/users/${id}`);

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setUser(data.user);
      setEditedEmail(data.user.email);
      setEditedRole(data.user.role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toISOString();
  };

  const handleAccountSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);
    setSelfDemotionWarning(null);

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: editedEmail,
          role: editedRole,
        }),
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === 'Cannot demote yourself from admin role') {
          setSelfDemotionWarning(errorData.message);
        } else {
          throw new Error(errorData.message || 'Failed to update user');
        }
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setSuccess('User account updated successfully');
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMembershipOrgId) return;

    setIsAddingMembership(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberships: [{
            organizationId: newMembershipOrgId,
            role: newMembershipRole,
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
        throw new Error(errorData.message || 'Failed to add membership');
      }

      setNewMembershipOrgId('');
      setNewMembershipRole('member');
      setSuccess('Membership added successfully');
      
      // Refresh user data
      await fetchUser();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add membership');
    } finally {
      setIsAddingMembership(false);
    }
  };

  const handleMembershipRoleChange = async (membershipId: string, orgId: string, newRole: MembershipRole) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberships: [{
            organizationId: orgId,
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
        throw new Error(errorData.message || 'Failed to update membership role');
      }

      setSuccess('Membership role updated successfully');
      
      // Refresh user data
      await fetchUser();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update membership role');
    }
  };

  const handleRemoveMembership = async (orgId: string, orgName: string) => {
    if (!confirm(`Are you sure you want to remove this user from "${orgName}"?`)) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberships: [{
            organizationId: orgId,
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
        throw new Error(errorData.message || 'Failed to remove membership');
      }

      setSuccess('Membership removed successfully');
      
      // Refresh user data
      await fetchUser();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove membership');
    }
  };

  // Main page content component to be wrapped
  const UserPageContent = () => {
    if (!user) {
      return (
        <Container>
          <ErrorBanner variant="error" autoRedirectOn401={true}>
            User not found
          </ErrorBanner>
        </Container>
      );
    }

    const headerMetadata = [
      { label: 'ID', value: user._id },
      { label: 'Role', value: user.role },
      { label: 'Created', value: formatTimestamp(user.createdAt) },
      { label: 'Updated', value: formatTimestamp(user.updatedAt) }
    ];

    // No header actions needed - navigation handled by admin layout
    const headerActions: never[] = [];

    const availableOrganizations = user.allOrganizations.filter(org => 
      !user.memberships.some(membership => membership.organizationId === org._id)
    );

    return (
      <Container>
        <DetailHeader
          title={user.email}
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
        {selfDemotionWarning && <Message $type="warning">{selfDemotionWarning}</Message>}

      <TabContainer>
        <TabList>
          <Tab
            $active={activeTab === 'account'}
            onClick={() => setActiveTab('account')}
          >
            Account
          </Tab>
          <Tab
            $active={activeTab === 'memberships'}
            onClick={() => setActiveTab('memberships')}
          >
            Memberships ({user.memberships.length})
          </Tab>
          <Tab
            $active={activeTab === 'activity'}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </Tab>
        </TabList>
      </TabContainer>

      <TabContent>
        {activeTab === 'account' && (
          <Section>
            <SectionHeader>
              <SectionTitle>Account Settings</SectionTitle>
              <Button 
                $variant="primary" 
                onClick={handleAccountSave} 
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </SectionHeader>

            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={editedEmail}
              onChange={setEditedEmail}
              required
              disabled={isSaving}
            />

            <Select
              label="Role"
              name="role"
              value={editedRole}
              onChange={(value) => setEditedRole(value as 'admin' | 'user')}
              disabled={isSaving}
              options={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' }
              ]}
            />
          </Section>
        )}

        {activeTab === 'memberships' && (
          <Section>
            <SectionHeader>
              <SectionTitle>Organization Memberships</SectionTitle>
            </SectionHeader>

            {availableOrganizations.length > 0 && (
              <AddMembershipForm onSubmit={handleAddMembership}>
                <Select
                  label="Organization"
                  name="organization"
                  value={newMembershipOrgId}
                  onChange={setNewMembershipOrgId}
                  disabled={isAddingMembership}
                  options={[
                    { value: '', label: 'Select organization...' },
                    ...availableOrganizations.map(org => ({
                      value: org._id,
                      label: org.name
                    }))
                  ]}
                />
                
                <Select
                  label="Role"
                  name="role"
                  value={newMembershipRole}
                  onChange={(value) => setNewMembershipRole(value as MembershipRole)}
                  disabled={isAddingMembership}
                  options={[
                    { value: 'member', label: 'Member' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'owner', label: 'Owner' }
                  ]}
                />
                
                <Button 
                  type="submit" 
                  $variant="primary" 
                  disabled={isAddingMembership || !newMembershipOrgId}
                  style={{ alignSelf: 'end' }}
                >
                  {isAddingMembership ? 'Adding...' : 'Add Membership'}
                </Button>
              </AddMembershipForm>
            )}

            <Table>
              <thead>
                <tr>
                  <TableHeader>Organization</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Joined</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {user.memberships.map((membership) => (
                  <TableRow key={membership._id}>
                    <TableCell>
                      <div>
                        <div style={{ fontWeight: tokens.typography.fontWeights.medium }}>
                          {membership.organizationName}
                        </div>
                        <div style={{ fontSize: tokens.typography.fontSizes.sm, color: tokens.colors.textSecondary }}>
                          /{membership.organizationSlug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge $variant={membership.role}>
                        {membership.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatTimestamp(membership.joinedAt)}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
                        <Select
                          label=""
                          name={`role-${membership._id}`}
                          value={membership.role}
                          onChange={(value) => handleMembershipRoleChange(membership._id, membership.organizationId, value as MembershipRole)}
                          options={[
                            { value: 'member', label: 'Member' },
                            { value: 'admin', label: 'Admin' },
                            { value: 'owner', label: 'Owner' }
                          ]}
                        />
                        <Button
                          $variant="danger"
                          onClick={() => handleRemoveMembership(membership.organizationId, membership.organizationName)}
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

            {user.memberships.length === 0 && (
              <div style={{ textAlign: 'center', padding: tokens.spacing.xl, color: tokens.colors.textSecondary }}>
                No organization memberships found.
              </div>
            )}
          </Section>
        )}

        {activeTab === 'activity' && (
          <Section>
            <SectionHeader>
              <SectionTitle>Activity & Timestamps</SectionTitle>
            </SectionHeader>

            <ActivityItem>
              <ActivityLabel>Last Login:</ActivityLabel>
              <ActivityValue>{formatTimestamp(user.lastLoginAt)}</ActivityValue>
            </ActivityItem>

            <ActivityItem>
              <ActivityLabel>Account Created:</ActivityLabel>
              <ActivityValue>{formatTimestamp(user.createdAt)}</ActivityValue>
            </ActivityItem>

            <ActivityItem>
              <ActivityLabel>Last Updated:</ActivityLabel>
              <ActivityValue>{formatTimestamp(user.updatedAt)}</ActivityValue>
            </ActivityItem>
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
          <div>Loading user details...</div>
        </PageWrapper>
    );
  }

  // Return wrapped content with global error boundary and suspense
  return (
    <PageWrapper
      loadingProps={{ minHeight: '60vh', background: 'transparent' }}
    >
      <UserPageContent />
    </PageWrapper>
  );
}
