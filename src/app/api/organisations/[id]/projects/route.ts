import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import Organisation from '@/models/Organisation';
import OrganisationMembership from '@/models/OrganisationMembership';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getSession(req);

    // Only authenticated users can access organization projects
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Verify organization exists
    const organization = await Organisation.findById(params.id) as any;
    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Check if user is a member of the organization
    const membership = await OrganisationMembership.findOne({
      userId: session.id,
      organisationId: params.id
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Access denied - not a member of this organization' },
        { status: 403 }
      );
    }

    // Fetch all projects assigned to this organization
    const settings = await Settings.findOne().lean() as any;
    if (!settings || !settings.configs) {
      return NextResponse.json({
        organization: {
          _id: organization._id,
          name: organization.name,
          slug: organization.slug,
          description: organization.description
        },
        projects: [],
        membershipRole: membership.role,
        timestamp: new Date().toISOString()
      });
    }

    const projects = [];
    for (const [id, config] of settings.configs) {
      if (config.organisationId && config.organisationId.toString() === params.id) {
        projects.push({
          id: id,
          name: config.name,
          contentUrl: config.contentUrl,
          originalWidth: config.originalWidth,
          originalHeight: config.originalHeight,
          aspectRatioX: config.aspectRatioX,
          aspectRatioY: config.aspectRatioY,
          backgroundColor: config.backgroundColor,
          backgroundImageUrl: config.backgroundImageUrl || '',
          horizontalAlignment: config.horizontalAlignment,
          verticalAlignment: config.verticalAlignment,
          isPublic: config.isPublic || false,
          organisationId: config.organisationId
        });
      }
    }

    return NextResponse.json({
      organization: {
        _id: organization._id,
        name: organization.name,
        slug: organization.slug,
        description: organization.description
      },
      projects: projects,
      membershipRole: membership.role,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching organization projects:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
