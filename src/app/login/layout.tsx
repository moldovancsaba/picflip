import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Picito',
  description: 'Login to Picito using your email address'
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
