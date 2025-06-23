import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Organization from '@/models/Organization';

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

    const organizations = await Organization.find({ isArchived: { $ne: true } })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    // Add member and iframe counts
    const orgsWithCounts = organizations.map(org => ({
      ...org,
      memberCount: org.members?.length || 0,
      iframeCount: 0 // This will be updated when we implement iframes
    }));

    return NextResponse.json({ organizations: orgsWithCounts });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, description, logoUrl } = body;

    if (!name || !description) {
      return NextResponse.json(
        { message: 'Name and description are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Generate unique slug
    const slug = await Organization.generateUniqueSlug(name);

    // Create organization with current user as admin
    const organization = await Organization.create({
      name,
      slug,
      description,
      logoUrl,
      members: [{ 
        email: session.email,
        role: 'admin',
        addedAt: new Date()
      }]
    });

    return NextResponse.json({
      message: 'Organization created successfully',
      organization: {
        ...organization.toObject(),
        memberCount: 1,
        iframeCount: 0
      }
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
