'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const AdminLayout = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

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
  gap: 2rem;
  justify-content: space-between;
`;

interface NavLinkProps {
  $active: boolean;
}

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

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

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const NavSection = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/organizations', label: 'Organizations' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <AdminLayout>
      <Nav>
        <NavContent>
          <NavLinks>
            {navItems.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                $active={pathname === href}
              >
                {label}
              </NavLink>
            ))}
          </NavLinks>
        </NavContent>
      </Nav>
      <MainContent>
        {children}
      </MainContent>
    </AdminLayout>
  );
}
