import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import OrganizationMembership from '@/models/OrganizationMembership';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function DELETE(
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

    // Find and delete the membership
    const membership = await OrganizationMembership.findByIdAndDelete(id);
    
    if (!membership) {
      return NextResponse.json(
        { message: 'Membership not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'User removed from organization successfully'
    });
  } catch (error) {
    console.error('Error removing membership:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
