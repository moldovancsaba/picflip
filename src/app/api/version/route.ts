import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Version, { getCurrentVersion, updateVersion } from '@/models/Version';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get current active version
    const currentVersion = await getCurrentVersion();
    
    return NextResponse.json({ 
      version: currentVersion,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching version:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch version',
        version: '2.10.0', // fallback
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    // Only admins can update version
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 401 }
      );
    }

    const { version, description } = await req.json();

    // Validation
    if (!version || typeof version !== 'string') {
      return NextResponse.json(
        { error: 'Version is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate semantic versioning format
    const versionRegex = /^\d+\.\d+\.\d+$/;
    if (!versionRegex.test(version)) {
      return NextResponse.json(
        { error: 'Version must follow semantic versioning format (e.g., 2.7.1)' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Update version in database
    const newVersion = await updateVersion(version, description);

    return NextResponse.json({
      message: 'Version updated successfully',
      version: newVersion.version,
      description: newVersion.description,
      releaseDate: newVersion.releaseDate,
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('Error updating version:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Handle duplicate version error
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'Version already exists' },
        { status: 409 }
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
