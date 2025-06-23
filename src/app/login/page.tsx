'use client';

import LoginForm from '@/components/LoginForm';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
`;

const LoginCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const LoginTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

export default function LoginPage() {
  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Welcome to Picito</LoginTitle>
        <LoginForm />
      </LoginCard>
    </LoginContainer>
  );
}
