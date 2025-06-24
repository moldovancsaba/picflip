import { NextRequest, NextResponse } from 'next/server';
import { clearUserCookie } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({
      message: 'Logged out successfully'
    });
    
    return clearUserCookie(response);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
