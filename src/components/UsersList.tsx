'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { IUser } from '@/models/User';

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
  const [changingRole, setChangingRole] = useState<string | null>(null);

  const handleRoleChange = async (email: string, newRole: 'admin' | 'user') => {
    setChangingRole(email);
    await onRoleChange(email, newRole);
    setChangingRole(null);
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
          <Th>Last Login</Th>
          <Th>Created At</Th>
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
            <DateCell>
              {user.lastLoginAt ? new Date(user.lastLoginAt).toISOString().slice(0, -1) + '.000Z' : 'Never'}
            </DateCell>
            <DateCell>
              {user.createdAt ? new Date(user.createdAt).toISOString().slice(0, -1) + '.000Z' : 'N/A'}
            </DateCell>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
