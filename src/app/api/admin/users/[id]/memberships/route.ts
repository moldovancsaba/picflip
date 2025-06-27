import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import OrganizationMembership from '@/models/OrganizationMembership';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const session = await getSession(req);
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    let userId = id;
    
    // If the id is an email, find the user by email first
    if (id.includes('@')) {
      const user = await User.findOne({ email: id }).select('_id');
      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }
      userId = user._id.toString();
    } else {
      // Verify user exists by ID
      const user = await User.findById(id).select('_id');
      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }
    }

    // Fetch all memberships for the user with organization details
    const memberships = await OrganizationMembership.find({ userId })
      .populate('organizationId', 'name slug description')
      .sort({ role: -1, joinedAt: 1 })
      .lean();

    const formattedMemberships = memberships.map((membership: any) => ({
      _id: membership._id,
      role: membership.role,
      joinedAt: membership.joinedAt.toISOString(),
      organization: {
        _id: membership.organizationId._id,
        name: membership.organizationId.name,
        slug: membership.organizationId.slug,
        description: membership.organizationId.description || ''
      }
    }));

    return NextResponse.json({ memberships: formattedMemberships });
  } catch (error) {
    console.error('Error fetching user memberships:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
