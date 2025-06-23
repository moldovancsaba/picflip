import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { createToken, setUserCookie } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    await dbConnect();
    await seedDatabase();

    // Find or create user
    const isAdminEmail = email.toLowerCase() === 'moldovancsaba@gmail.com';
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { 
        $set: { 
          role: isAdminEmail ? 'admin' : 'user',
          lastLoginAt: new Date() 
        }
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    );

    // Create JWT token
    const token = await createToken({
      email: user.email,
      role: user.role
    });

    // Create response with user data
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        email: user.email,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
      }
    });

    // Set cookie
    return setUserCookie(response, token);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
