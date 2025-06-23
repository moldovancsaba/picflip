import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Organization from '@/models/Organization';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const organization = await Organization.findById(params.id)
      .select('-__v')
      .lean();

    if (!organization) {
      return NextResponse.json(
        { message: 'Organization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      organization: {
        ...organization,
        memberCount: organization.members?.length || 0,
        iframeCount: 0 // This will be updated when we implement iframes
      }
    });
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    await dbConnect();

    const organization = await Organization.findById(params.id);
    if (!organization) {
      return NextResponse.json(
        { message: 'Organization not found' },
        { status: 404 }
      );
    }

    // Check if the current user is an admin of this organization
    const isOrgAdmin = organization.members.some(
      m => m.email === session.email && m.role === 'admin'
    );

    if (!isOrgAdmin && session.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update allowed fields
    const allowedFields = ['name', 'description', 'logoUrl', 'isArchived'];
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        organization[key] = body[key];
      }
    });

    // If name is updated, update slug
    if (body.name) {
      organization.slug = await Organization.generateUniqueSlug(body.name);
    }

    await organization.save();

    return NextResponse.json({
      message: 'Organization updated successfully',
      organization: {
        ...organization.toObject(),
        memberCount: organization.members?.length || 0,
        iframeCount: 0 // This will be updated when we implement iframes
      }
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(req);
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const organization = await Organization.findById(params.id);
    if (!organization) {
      return NextResponse.json(
        { message: 'Organization not found' },
        { status: 404 }
      );
    }

    // Instead of deleting, mark as archived
    organization.isArchived = true;
    await organization.save();

    return NextResponse.json({
      message: 'Organization archived successfully'
    });
  } catch (error) {
    console.error('Error archiving organization:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
