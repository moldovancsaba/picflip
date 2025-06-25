import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { type Role } from '@/lib/permissions/constants';
import { usePermission } from '@/hooks/usePermissionUpdates';
import { PERMISSIONS } from '@/lib/permissions/constants';

interface Member {
  _id: string;
  email: string;
  role: Role;
  joinedAt: string;
}

interface MemberListProps {
  organizationId: string;
  userRole: Role;
  userId: string;
}

const ListContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const AddButton = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0051a8;
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

const MemberTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  color: #64748b;
  font-weight: 500;
  font-size: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
`;

const RoleTag = styled.span<{ role: Role }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ role }) => {
    switch (role) {
      case 'owner':
        return '#fef3c7';
      case 'admin':
        return '#dbeafe';
      default:
        return '#f3f4f6';
    }
  }};
  color: ${({ role }) => {
    switch (role) {
      case 'owner':
        return '#92400e';
      case 'admin':
        return '#1e40af';
      default:
        return '#4b5563';
    }
  }};
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid #e2e8f0;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function MemberList({ organizationId, userRole, userId }: MemberListProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManageMembers = usePermission({
    userRole,
    requiredPermission: PERMISSIONS.MANAGE_MEMBERS,
  });

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch(`/api/organizations/${organizationId}/members`);
        if (!response.ok) throw new Error('Failed to fetch members');
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMembers();
  }, [organizationId]);

  async function handleRemoveMember(memberId: string) {
    if (!canManageMembers) return;

    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/members/${memberId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to remove member');

      setMembers(members.filter(member => member._id !== memberId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    }
  }

  if (isLoading) return <div>Loading members...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ListContainer>
      <Header>
        <Title>Organization Members</Title>
        {canManageMembers && (
          <AddButton>Add Member</AddButton>
        )}
      </Header>

      <MemberTable>
        <thead>
          <tr>
            <TableHeader>Email</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Joined</TableHeader>
            {canManageMembers && <TableHeader>Actions</TableHeader>}
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member._id}>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <RoleTag role={member.role}>{member.role}</RoleTag>
              </TableCell>
              <TableCell>
                {new Date(member.joinedAt).toLocaleDateString()}
              </TableCell>
              {canManageMembers && (
                <TableCell>
                  <ActionButton
                    onClick={() => handleRemoveMember(member._id)}
                    disabled={member._id === userId} // Can't remove self
                  >
                    Remove
                  </ActionButton>
                </TableCell>
              )}
            </tr>
          ))}
        </tbody>
      </MemberTable>
    </ListContainer>
  );
}
