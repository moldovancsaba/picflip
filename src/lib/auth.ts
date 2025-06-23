import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_jwt_secret_key_please_change_in_production'
);

export interface UserJwtPayload extends Record<string, any> {
  email: string;
  role: string;
}

export async function createToken(payload: UserJwtPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
  
  return token;
}

export async function verifyToken(token: string): Promise<UserJwtPayload> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as UserJwtPayload;
  } catch (err) {
    throw new Error('Invalid token');
  }
}

export async function getSession(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export function setUserCookie(response: NextResponse, token: string) {
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  });
  return response;
}

export function clearUserCookie(response: NextResponse) {
  response.cookies.delete('token');
  return response;
}
