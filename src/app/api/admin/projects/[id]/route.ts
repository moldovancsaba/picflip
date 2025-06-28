import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import OrganizationModel from '@/models/Organization';
import { z } from 'zod';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Validation schemas
const projectUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters').optional(),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug cannot exceed 50 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens').optional(),
  contentUrl: z.string().url('Content URL must be a valid URL').optional(),
  originalWidth: z.number().positive('Width must be positive').optional(),
  originalHeight: z.number().positive('Height must be positive').optional(),
  aspectRatioX: z.number().positive('Aspect ratio X must be positive').optional(),
  aspectRatioY: z.number().positive('Aspect ratio Y must be positive').optional(),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Background color must be a valid hex color').optional(),
  backgroundImageUrl: z.string().url('Background image URL must be a valid URL').or(z.literal('')).optional(),
  horizontalAlignment: z.enum(['left', 'center', 'right']).optional(),
  verticalAlignment: z.enum(['top', 'middle', 'bottom']).optional(),
  isPublic: z.boolean().optional(),
  organizationId: z.string().or(z.null()).optional()
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

    const settings = await Settings.findOne().lean() as any;
    if (!settings || !settings.configs) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    const config = settings.configs.get(id);
    if (!config) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Fetch all organizations for the admin
    const organizations = await OrganizationModel.find({})
      .sort({ name: 1 })
      .select('_id name slug description')
      .lean();

    // Fetch the current organization if assigned
    let currentOrganization = null;
    if (config.organizationId) {
      currentOrganization = await OrganizationModel.findById(config.organizationId)
        .select('_id name slug description')
        .lean();
    }

    const projectData = {
      id,
      name: config.name,
      slug: config.slug || '',
      contentUrl: config.contentUrl,
      originalWidth: config.originalWidth,
      originalHeight: config.originalHeight,
      aspectRatioX: config.aspectRatioX,
      aspectRatioY: config.aspectRatioY,
      backgroundColor: config.backgroundColor,
      backgroundImageUrl: config.backgroundImageUrl || '',
      horizontalAlignment: config.horizontalAlignment || 'center',
      verticalAlignment: config.verticalAlignment || 'middle',
      isPublic: config.isPublic || false,
      organizationId: config.organizationId || null,
      currentOrganization,
      organizations,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ project: projectData });
  } catch (error) {
    console.error('Error fetching project:', error);
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
    const validationResult = projectUpdateSchema.safeParse(body);
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

    // Validate organization exists if provided
    if (updateData.organizationId) {
      const orgExists = await OrganizationModel.findById(updateData.organizationId);
      if (!orgExists) {
        return NextResponse.json(
          { message: 'Organization not found' },
          { status: 404 }
        );
      }
    }

    const settings = await Settings.findOne();
    if (!settings || !settings.configs) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    const config = settings.configs.get(id);
    if (!config) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    // Update the config with new values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] !== undefined) {
        (config as any)[key] = updateData[key as keyof typeof updateData];
      }
    });

    settings.configs.set(id, config);
    settings.markModified('configs');
    await settings.save();

    // Return updated project data
    const updatedProject = {
      id,
      name: config.name,
      slug: config.slug || '',
      contentUrl: config.contentUrl,
      originalWidth: config.originalWidth,
      originalHeight: config.originalHeight,
      aspectRatioX: config.aspectRatioX,
      aspectRatioY: config.aspectRatioY,
      backgroundColor: config.backgroundColor,
      backgroundImageUrl: config.backgroundImageUrl || '',
      horizontalAlignment: config.horizontalAlignment || 'center',
      verticalAlignment: config.verticalAlignment || 'middle',
      isPublic: config.isPublic || false,
      organizationId: config.organizationId || null,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
