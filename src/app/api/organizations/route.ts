import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
// Note: We use American English spelling convention (e.g., 'Organization' not 'Organisation')
import Organization from '@/models/Organization';
import OrganizationMembership from '@/models/OrganizationMembership';
import User from '@/models/User';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.email }).lean() as any;
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if admin is requesting all organizations
    const isAdmin = user.role === 'admin';
    const { searchParams } = new URL(req.url);
    const adminView = searchParams.get('admin') === 'true';

    if (adminView && isAdmin) {
      // Admin view: fetch all organizations
      const organizations = await Organization.find({})
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ 
        organizations,
        count: organizations.length
      });
    } else {
      // Regular user view: fetch user's organizations through memberships
      const memberships = await OrganizationMembership.find({ userId: user._id })
        .populate('organizationId')
        .sort({ createdAt: -1 })
        .lean() as any[];

      const organizations = memberships.map(membership => ({
        ...membership.organizationId,
        membershipRole: membership.role,
        joinedAt: membership.joinedAt
      }));

      return NextResponse.json({ 
        organizations,
        count: organizations.length
      });
    }

  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, description } = await req.json();

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Organization name is required and must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (description && (typeof description !== 'string' || description.length > 500)) {
      return NextResponse.json(
        { error: 'Description must be a string and cannot exceed 500 characters' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get user
    const user = await User.findOne({ email: session.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create organization (slug is auto-generated)
    const organization = new Organization({
      name: name.trim(),
      description: description?.trim() || ''
    });

    await organization.save();

    // Create owner membership for the creator
    const membership = new OrganizationMembership({
      userId: user._id,
      organizationId: organization._id,
      role: 'owner'
    });

    await membership.save();

    // Return the created organization with membership info
    const organizationData = {
      _id: organization._id,
      name: organization.name,
      slug: organization.slug,
      description: organization.description,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      membershipRole: 'owner',
      joinedAt: membership.joinedAt
    };

    return NextResponse.json({
      message: 'Organization created successfully',
      organization: organizationData
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating organization:', error);
    
    // Handle MongoDB duplicate key error (unlikely due to auto-slug generation)
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'Organization with this name already exists' },
        { status: 409 }
      );
    }

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
