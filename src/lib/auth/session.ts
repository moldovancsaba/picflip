import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { type Role } from '@/lib/permissions/constants';

interface UserSession {
  userId: string;
  userRole: Role;
  email: string;
}

export async function getUserSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const session: UserSession = {
      userId: payload.sub as string,
      userRole: payload.role as Role,
      email: payload.email as string
    };
    return session;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}
