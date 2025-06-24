import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Organisation from '@/models/Organisation';
import OrganisationMembership from '@/models/OrganisationMembership';
import User from '@/models/User';

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

    // Get user's organisations through memberships
    const user = await User.findOne({ email: session.email }).lean() as any;
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const memberships = await OrganisationMembership.find({ userId: user._id })
      .populate('organisationId')
      .sort({ createdAt: -1 })
      .lean() as any[];

    const organisations = memberships.map(membership => ({
      ...membership.organisationId,
      membershipRole: membership.role,
      joinedAt: membership.joinedAt
    }));

    return NextResponse.json({ 
      organisations,
      count: organisations.length
    });

  } catch (error) {
    console.error('Error fetching organisations:', error);
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
        { error: 'Organisation name is required and must be at least 2 characters' },
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

    // Create organisation (slug is auto-generated)
    const organisation = new Organisation({
      name: name.trim(),
      description: description?.trim() || ''
    });

    await organisation.save();

    // Create owner membership for the creator
    const membership = new OrganisationMembership({
      userId: user._id,
      organisationId: organisation._id,
      role: 'owner'
    });

    await membership.save();

    // Return the created organisation with membership info
    const organisationData = {
      _id: organisation._id,
      name: organisation.name,
      slug: organisation.slug,
      description: organisation.description,
      createdAt: organisation.createdAt,
      updatedAt: organisation.updatedAt,
      membershipRole: 'owner',
      joinedAt: membership.joinedAt
    };

    return NextResponse.json({
      message: 'Organisation created successfully',
      organisation: organisationData
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating organisation:', error);
    
    // Handle MongoDB duplicate key error (unlikely due to auto-slug generation)
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'Organisation with this name already exists' },
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
