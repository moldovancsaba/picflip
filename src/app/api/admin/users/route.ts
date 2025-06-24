import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (email) {
      // Find a specific user by email
      const user = await User.findOne({ email })
        .select('-__v')
        .lean();

      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ user });
    }

    // Get all users
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email, role } = await req.json();

    if (!email || !role || !['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Prevent self-demotion
    if (session.email === email && role !== 'admin') {
      return NextResponse.json(
        { message: 'Cannot demote yourself from admin role' },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email },
      { role },
      { new: true }
    ).select('-__v');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
