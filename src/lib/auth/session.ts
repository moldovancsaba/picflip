import { cookies } from 'next/headers';
import { verify } from 'jose';

export async function getSession() {
  const token = cookies().get('token')?.value;
  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await verify(token, secret);
    return payload;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}
