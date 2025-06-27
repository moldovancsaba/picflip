'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { IUser } from '@/models/User';
import { Organization } from '@/lib/types';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
  
  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

const NoUsers = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const DateCell = styled(Td)`
  white-space: nowrap;
`;

interface UsersListProps {
  users: IUser[];
  onRoleChange: (email: string, role: 'admin' | 'user') => void;
}

export function UsersList({ users, onRoleChange }: UsersListProps) {
  const router = useRouter();
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [userMemberships, setUserMemberships] = useState<Record<string, any[]>>({});
  const [loadingMemberships, setLoadingMemberships] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    fetchOrganizations();
    // Auto-load memberships for all users
    users.forEach(user => {
      fetchUserMemberships(user.email);
    });
  }, [users]);
  
  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations?admin=true');
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.organizations);
      }
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
    }
  };
  
  const fetchUserMemberships = async (userEmail: string) => {
    if (loadingMemberships.has(userEmail)) return;
    
    setLoadingMemberships(prev => new Set(prev).add(userEmail));
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(userEmail)}/memberships`);
      if (response.ok) {
        const data = await response.json();
        setUserMemberships(prev => ({ ...prev, [userEmail]: data.memberships }));
      }
    } catch (err) {
      console.error('Failed to fetch user memberships:', err);
    } finally {
      setLoadingMemberships(prev => {
        const newSet = new Set(prev);
        newSet.delete(userEmail);
        return newSet;
      });
    }
  };

  const handleRoleChange = async (email: string, newRole: 'admin' | 'user') => {
    setChangingRole(email);
    await onRoleChange(email, newRole);
    setChangingRole(null);
  };
  
  const handleAssignToOrganization = async (userEmail: string, organizationId: string) => {
    if (!organizationId) return;
    
    try {
      const response = await fetch(`/api/organizations/${organizationId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: userEmail,
          role: 'member'
        }),
      });
      
      if (response.ok) {
        // Refresh the user's memberships
        await fetchUserMemberships(userEmail);
      } else {
        const errorData = await response.json();
        alert(`Failed to assign user: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Failed to assign user to organization:', err);
      alert('Failed to assign user to organization');
    }
  };
  
  const handleRemoveFromOrganization = async (userEmail: string, membershipId: string, orgName: string) => {
    if (!confirm(`Remove ${userEmail} from "${orgName}"?`)) return;
    
    try {
      const response = await fetch(`/api/organizations/membership/${membershipId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh the user's memberships
        await fetchUserMemberships(userEmail);
      } else {
        const errorData = await response.json();
        alert(`Failed to remove user: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Failed to remove user from organization:', err);
      alert('Failed to remove user from organization');
    }
  };

  if (users.length === 0) {
    return <NoUsers>No users found</NoUsers>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Email</Th>
          <Th>Role</Th>
          <Th>Organizations</Th>
          <Th>Last Login</Th>
          <Th>Created At</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.email}>
            <Td>{user.email}</Td>
            <Td>
              <Select
                value={user.role}
                onChange={(e) => handleRoleChange(user.email, e.target.value as 'admin' | 'user')}
                disabled={changingRole === user.email}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </Td>
            <Td>
              {userMemberships[user.email] ? (
                <div>
                  {userMemberships[user.email].map((membership: any) => (
                    <div key={membership._id} style={{ 
                      marginBottom: '0.25rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: '#f8f9fa',
                      padding: '0.375rem 0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div>
                        <span style={{ fontWeight: 500 }}>{membership.organization.name}</span>
                        <span style={{ 
                          color: '#6b7280', 
                          fontSize: '0.75rem', 
                          marginLeft: '0.5rem',
                          background: '#f3f4f6',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '12px'
                        }}>
                          {membership.role}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFromOrganization(user.email, membership._id, membership.organization.name)}
                        style={{
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '0.125rem 0.375rem',
                          fontSize: '0.65rem',
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                        title={`Remove from ${membership.organization.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {userMemberships[user.email].length === 0 && (
                    <span style={{ color: '#6b7280', fontStyle: 'italic' }}>No organizations</span>
                  )}
                </div>
              ) : loadingMemberships.has(user.email) ? (
                <span style={{ color: '#6b7280' }}>Loading...</span>
              ) : (
                <button
                  onClick={() => fetchUserMemberships(user.email)}
                  style={{
                    background: '#0070f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Load
                </button>
              )}
              <div style={{ marginTop: '0.5rem' }}>
                <Select
                  value=""
                  onChange={(e) => handleAssignToOrganization(user.email, e.target.value)}
                  style={{ fontSize: '0.75rem' }}
                >
                  <option value="">Assign to organization...</option>
                  {organizations.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.name}
                    </option>
                  ))}
                </Select>
              </div>
            </Td>
            <DateCell>
              {user.lastLoginAt ? new Date(user.lastLoginAt).toISOString().slice(0, -1) + '.000Z' : 'Never'}
            </DateCell>
            <DateCell>
              {user.createdAt ? new Date(user.createdAt).toISOString().slice(0, -1) + '.000Z' : 'N/A'}
            </DateCell>
            <Td>
              <button
                onClick={() => router.push(`/admin/users/${user._id}`)}
                style={{
                  background: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#0051cc'}
                onMouseOut={(e) => e.currentTarget.style.background = '#0070f3'}
              >
                View Details
              </button>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
