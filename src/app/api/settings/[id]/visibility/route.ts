import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';

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

    return NextResponse.json({
      id: params.id,
      name: config.name,
      isPublic: config.isPublic || false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching project visibility:', error);
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
    
    // Only authenticated users can change visibility
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - authentication required' },
        { status: 401 }
      );
    }

    const { isPublic } = await req.json();

    // Validation
    if (typeof isPublic !== 'boolean') {
      return NextResponse.json(
        { error: 'isPublic must be a boolean value' },
        { status: 400 }
      );
    }

    await dbConnect();

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

    // Update visibility
    config.isPublic = isPublic;
    settings.configs.set(params.id, config);
    
    // Mark the configs field as modified so Mongoose saves it
    settings.markModified('configs');
    await settings.save();

    return NextResponse.json({
      message: `Project visibility updated to ${isPublic ? 'public' : 'private'}`,
      project: {
        id: params.id,
        name: config.name,
        isPublic: config.isPublic,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error updating project visibility:', error);
    
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
