import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
// Note: We use American English spelling convention (e.g., 'Organization' not 'Organisation')
import Organization from '@/models/Organization';
import OrganizationMembership from '@/models/OrganizationMembership';
import User from '@/models/User';
import Settings from '@/models/Settings';
import { z } from 'zod';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Validation schemas
const organizationUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters').optional(),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug cannot exceed 50 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens').optional(),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional()
});

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

    // Fetch the organization
    const organization = await Organization.findById(id).lean() as any;
    if (!organization) {
      return NextResponse.json(
        { message: 'Organization not found' },
        { status: 404 }
      );
    }

    // Fetch all members with user details
    const memberships = await OrganizationMembership.find({ organizationId: id })
      .populate('userId', 'email role lastLoginAt createdAt')
      .sort({ role: -1, joinedAt: 1 })
      .lean();

    const members = memberships.map((membership: any) => ({
      _id: membership._id,
      userId: membership.userId._id,
      email: membership.userId.email,
      userRole: membership.userId.role,
      membershipRole: membership.role,
      joinedAt: membership.joinedAt.toISOString(),
      lastLoginAt: membership.userId.lastLoginAt?.toISOString() || null,
      createdAt: membership.userId.createdAt.toISOString()
    }));

    // Fetch projects assigned to this organization
    const settings = await Settings.findOne().lean() as any;
    const projects: any[] = [];
    
    if (settings && settings.configs) {
      const configsMap = settings.configs;
      // Handle both Map and plain object formats
      if (configsMap instanceof Map) {
        for (const [projectId, config] of configsMap) {
          if (config.organizationId && config.organizationId.toString() === id) {
            projects.push({
              id: projectId,
              name: config.name,
              isPublic: config.isPublic || false,
              contentUrl: config.contentUrl
            });
          }
        }
      } else {
        // Handle plain object (from .lean() query)
        for (const [projectId, config] of Object.entries(configsMap)) {
          const typedConfig = config as any;
          if (typedConfig.organizationId && typedConfig.organizationId.toString() === id) {
            projects.push({
              id: projectId,
              name: typedConfig.name,
              isPublic: typedConfig.isPublic || false,
              contentUrl: typedConfig.contentUrl
            });
          }
        }
      }
    }

    const organizationData = {
      _id: organization._id,
      name: organization.name,
      slug: organization.slug,
      description: organization.description || '',
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
      members,
      projects
    };

    return NextResponse.json({ organization: organizationData });
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

    const body = await req.json();
    
    // Validate input with zod
    const validationResult = organizationUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Invalid request data',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    await dbConnect();

    // Update the organization
    const organization = await Organization.findByIdAndUpdate(
      id,
      { 
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.slug && { slug: updateData.slug }),
        ...(updateData.description !== undefined && { description: updateData.description })
      },
      { new: true, runValidators: true }
    );

    if (!organization) {
      return NextResponse.json(
        { message: 'Organization not found' },
        { status: 404 }
      );
    }

    // Fetch updated members and projects for the response
    const memberships = await OrganizationMembership.find({ organizationId: id })
      .populate('userId', 'email role lastLoginAt createdAt')
      .sort({ role: -1, joinedAt: 1 })
      .lean();

    const members = memberships.map((membership: any) => ({
      _id: membership._id,
      userId: membership.userId._id,
      email: membership.userId.email,
      userRole: membership.userId.role,
      membershipRole: membership.role,
      joinedAt: membership.joinedAt.toISOString(),
      lastLoginAt: membership.userId.lastLoginAt?.toISOString() || null,
      createdAt: membership.userId.createdAt.toISOString()
    }));

    const settings = await Settings.findOne().lean() as any;
    const projects: any[] = [];
    
    if (settings && settings.configs) {
      const configsMap = settings.configs;
      // Handle both Map and plain object formats
      if (configsMap instanceof Map) {
        for (const [projectId, config] of configsMap) {
          if (config.organisationId && config.organisationId.toString() === id) {
            projects.push({
              id: projectId,
              name: config.name,
              isPublic: config.isPublic || false,
              contentUrl: config.contentUrl
            });
          }
        }
      } else {
        // Handle plain object (from .lean() query)
        for (const [projectId, config] of Object.entries(configsMap)) {
          const typedConfig = config as any;
          if (typedConfig.organisationId && typedConfig.organisationId.toString() === id) {
            projects.push({
              id: projectId,
              name: typedConfig.name,
              isPublic: typedConfig.isPublic || false,
              contentUrl: typedConfig.contentUrl
            });
          }
        }
      }
    }

    const updatedOrganization = {
      _id: organization._id,
      name: organization.name,
      slug: organization.slug,
      description: organization.description || '',
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
      members,
      projects
    };

    return NextResponse.json({
      message: 'Organization updated successfully',
      organization: updatedOrganization
    });
  } catch (error) {
    console.error('Error updating organization:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          message: 'Validation error',
          errors: Object.values((error as any).errors).map((err: any) => ({
            field: err.path,
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
