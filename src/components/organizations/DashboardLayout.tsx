import { ReactNode } from 'react';
import styled from 'styled-components';

interface DashboardLayoutProps {
  children: ReactNode;
}

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
  background: #f9fafb;
`;

const Sidebar = styled.aside`
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem;
`;

const MainContent = styled.main`
  padding: 2rem;
  overflow-y: auto;
`;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <LayoutContainer>
      <Sidebar>
        <nav>
          {/* Navigation content will be added later */}
        </nav>
      </Sidebar>
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
}
