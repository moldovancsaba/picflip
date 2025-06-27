import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import Organization from '@/models/Organization';
import OrganizationMembership from '@/models/OrganizationMembership';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    await dbConnect();

    const settings = await Settings.findOne().lean() as any;
    if (!settings || !settings.configs) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      );
    }

    const config = settings.configs.get(params.id);
    if (!config) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    let organization = null;
    if (config.organizationId) {
      organization = await Organization.findById(config.organizationId).lean() as any;
    }

    return NextResponse.json({
      id: params.id,
      name: config.name,
      organizationId: config.organizationId || null,
      organization: organization ? {
        _id: organization._id,
        name: organization.name,
        slug: organization.slug,
        description: organization.description
      } : null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching project organization:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getSession(req);
    
    // Only authenticated users can assign projects to organizations
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      );
    }

    const { organizationId } = await req.json();

    // Validation
    if (organizationId !== null && typeof organizationId !== 'string') {
      return NextResponse.json(
        { error: 'organizationId must be a string or null' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify organization exists and user has permission
    if (organizationId) {
      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return NextResponse.json(
          { error: 'Organization not found' },
          { status: 404 }
        );
      }

      // Allow admins to assign to any organization, others need membership
      if (session.role !== 'admin') {
        // Check if user is a member of the organization
        const membership = await OrganizationMembership.findOne({
          userId: session.id,
          organizationId: organizationId
        });

        if (!membership) {
          return NextResponse.json(
            { error: 'Access denied - not a member of this organization' },
            { status: 403 }
          );
        }

        // Only owners and admins can assign projects
        if (!['owner', 'admin'].includes(membership.role)) {
          return NextResponse.json(
            { error: 'Access denied - insufficient permissions' },
            { status: 403 }
          );
        }
      }
    }

    const settings = await Settings.findOne();
    if (!settings || !settings.configs) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      );
    }

    const config = settings.configs.get(params.id);
    if (!config) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Update organization assignment
    config.organizationId = organizationId;
    settings.configs.set(params.id, config);
    
    // Mark the configs field as modified so Mongoose saves it
    settings.markModified('configs');
    await settings.save();

    // Fetch organization details for response
    let organization = null;
    if (organizationId) {
      organization = await Organization.findById(organizationId).lean() as any;
    }

    return NextResponse.json({
      message: organizationId 
        ? `Project assigned to organization "${organization?.name}"` 
        : 'Project unassigned from organization',
      project: {
        id: params.id,
        name: config.name,
        organizationId: config.organizationId,
        organization: organization ? {
          _id: organization._id,
          name: organization.name,
          slug: organization.slug,
          description: organization.description
        } : null,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error updating project organization:', error);
    
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
