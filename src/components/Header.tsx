'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const Nav = styled.nav`
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

interface NavLinkProps {
  $active: boolean;
}

const NavLink = styled(Link)<NavLinkProps>`
  color: ${props => props.$active ? '#0070f3' : '#374151'};
  text-decoration: none;
  font-weight: ${props => props.$active ? '600' : '500'};
  padding: 0.5rem 0;
  border-bottom: 2px solid ${props => props.$active ? '#0070f3' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    color: #0070f3;
  }
`;

const AdminLink = styled(NavLink)`
  color: #10b981 !important;
  
  &:hover {
    color: #059669 !important;
  }
`;

const DocsLink = styled(NavLink)`
  color: #6366f1 !important;
  
  &:hover {
    color: #4f46e5 !important;
  }
`;

const AuthButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.children === 'Login' ? '#0070f3' : '#ef4444'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.children === 'Login' ? '#0051cc' : '#dc2626'};
  }
`;

interface User {
  email: string;
  role: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const currentPath = usePathname();

  // Check user session
  const checkSession = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to check session:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, [currentPath]); // Re-check session when path changes

  const handleAuth = async () => {
    if (user) {
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Logout failed');
        }

        setUser(null);
        router.push('/login');
        router.refresh();
      } catch (error) {
        console.error('Logout error:', error);
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <Nav>
      <NavContent>
        <NavLinks>
          <NavLink href="/" $active={currentPath === '/'}>
            Home
          </NavLink>
          {user && user.role === 'admin' && (
            <AdminLink href="/admin" $active={currentPath.startsWith('/admin')}>
              Admin
            </AdminLink>
          )}
          <DocsLink href="/docs/guide" $active={currentPath.startsWith('/docs')}>
            Documentation
          </DocsLink>
        </NavLinks>
        <NavLinks>
          {user && (
            <>
              <span style={{ color: '#666' }}>{user.email}</span>
              <AuthButton onClick={handleAuth}>Logout</AuthButton>
            </>
          )}
          {!user && (
            <AuthButton onClick={handleAuth}>Login</AuthButton>
          )}
        </NavLinks>
      </NavContent>
    </Nav>
  );
}
