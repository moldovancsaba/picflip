import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
// Note: We use American English spelling convention (e.g., 'Organization' not 'Organisation')
import Organization from '@/models/Organization';
import OrganizationMembership, { hasPermission } from '@/models/OrganizationMembership';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Validate organization ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid organization ID' },
        { status: 400 }
      );
    }

    // Check if organization exists
    const organization = await Organization.findById(params.id);
    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Get current user
    const user = await User.findOne({ email: session.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is a member of this organization
    const userMembership = await OrganizationMembership.findOne({
      userId: user._id,
      organizationId: params.id
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: 'Access denied - not a member of this organization' },
        { status: 403 }
      );
    }

    // Get all members of the organization
    const memberships = await OrganizationMembership.find({
      organizationId: params.id
    })
    .populate('userId', 'email createdAt lastLoginAt')
    .sort({ role: -1, createdAt: 1 }) // Sort by role hierarchy, then by join date
    .lean();

    const members = memberships.map(membership => ({
      _id: membership._id,
      user: membership.userId,
      role: membership.role,
      joinedAt: membership.joinedAt,
      createdAt: membership.createdAt
    }));

    return NextResponse.json({
      members,
      count: members.length,
      organization: {
        _id: organization._id,
        name: organization.name,
        slug: organization.slug
      },
      userRole: userMembership.role
    });

  } catch (error) {
    console.error('Error fetching organization members:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email, role = 'member' } = await req.json();

    // Validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!['owner', 'admin', 'member'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: owner, admin, member' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Validate organization ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid organization ID' },
        { status: 400 }
      );
    }

    // Check if organization exists
    const organization = await Organization.findById(params.id);
    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Get current user and their membership
    const currentUser = await User.findOne({ email: session.email });
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Current user not found' },
        { status: 404 }
      );
    }

    const currentUserMembership = await OrganizationMembership.findOne({
      userId: currentUser._id,
      organizationId: params.id
    });

    if (!currentUserMembership) {
      return NextResponse.json(
        { error: 'Access denied - not a member of this organization' },
        { status: 403 }
      );
    }

    // Check permission to add members (admin or owner required)
    if (!hasPermission(currentUserMembership.role, 'admin')) {
      return NextResponse.json(
        { error: 'Insufficient permissions - admin role required to add members' },
        { status: 403 }
      );
    }

    // Check if trying to add owner role (only owners can add owners)
    if (role === 'owner' && currentUserMembership.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only organization owners can assign owner role' },
        { status: 403 }
      );
    }

    // Find or create the target user
    let targetUser = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!targetUser) {
      // Auto-create user account (following existing pattern)
      targetUser = new User({
        email: email.toLowerCase().trim(),
        role: 'user' // Default user role
      });
      await targetUser.save();
    }

    // Check if user is already a member
    const existingMembership = await OrganizationMembership.findOne({
      userId: targetUser._id,
      organizationId: params.id
    });

    if (existingMembership) {
      return NextResponse.json(
        { error: 'User is already a member of this organization' },
        { status: 409 }
      );
    }

    // Create new membership
    const membership = new OrganizationMembership({
      userId: targetUser._id,
      organizationId: params.id,
      role: role
    });

    await membership.save();

    // Return the created membership with user info
    const membershipData = {
      _id: membership._id,
      user: {
        _id: targetUser._id,
        email: targetUser.email,
        createdAt: targetUser.createdAt,
        lastLoginAt: targetUser.lastLoginAt
      },
      role: membership.role,
      joinedAt: membership.joinedAt,
      createdAt: membership.createdAt
    };

    return NextResponse.json({
      message: 'Member added successfully',
      membership: membershipData
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding organization member:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
