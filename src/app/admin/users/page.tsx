'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { UsersList } from '@/components/UsersList';
import { IUser } from '@/models/User';
import Loading from '@/components/Loading';
import Link from 'next/link';

const UsersContainer = styled.div`
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

const ErrorMessage = styled.div`
  color: #dc2626;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const AdminNav = styled.div`
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const AdminNavTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
`;

const AdminNavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

interface AdminNavLinkProps {
  $active: boolean;
}

const AdminNavLink = styled(Link)<AdminNavLinkProps>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.$active ? '#0070f3' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  text-decoration: none;
  border: 1px solid ${props => props.$active ? '#0070f3' : '#ddd'};
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.$active ? '#0051cc' : '#f5f5f5'};
    border-color: ${props => props.$active ? '#0051cc' : '#ccc'};
  }
`;

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
      setFilteredUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (email: string, newRole: 'admin' | 'user') => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.email === email ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <UsersContainer>
      <AdminNav>
        <AdminNavTitle>Admin Panel</AdminNavTitle>
        <AdminNavLinks>
          <AdminNavLink href="/admin" $active={false}>
            Projects
          </AdminNavLink>
          <AdminNavLink href="/admin/users" $active={true}>
            Users
          </AdminNavLink>
          <AdminNavLink href="/admin/organizations" $active={false}>
            Organizations
          </AdminNavLink>
        </AdminNavLinks>
      </AdminNav>
      <Header>
        <Title>User Management</Title>
        <SearchInput
          type="text"
          placeholder="Search users by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <UsersList
        users={filteredUsers}
        onRoleChange={handleRoleChange}
      />
    </UsersContainer>
  );
}
