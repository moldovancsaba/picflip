import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Organisation from '@/models/Organisation';
import OrganisationMembership from '@/models/OrganisationMembership';
import User from '@/models/User';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Check if user has admin role for deletion
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Find the organisation
    const organisation = await Organisation.findById(id);
    if (!organisation) {
      return NextResponse.json(
        { error: 'Organisation not found' },
        { status: 404 }
      );
    }

    // Delete all memberships first
    await OrganisationMembership.deleteMany({ organisationId: id });

    // Delete the organisation
    await Organisation.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'Organisation deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error deleting organisation:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
