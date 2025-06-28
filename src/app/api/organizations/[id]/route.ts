import { NextRequest } from 'next/server';
import { createApiResponse } from '@/middleware/responseHandler';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Organization from '@/models/Organization';
import OrganizationMembership from '@/models/OrganizationMembership';
import User from '@/models/User';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getSession(req);
    
    if (!session) {
      return createApiResponse(null, 401, null, 'Unauthorized');
    }

    await dbConnect();

    // Get user
    const user = await User.findOne({ email: session.email });
    if (!user) {
      return createApiResponse(null, 404, null, 'User not found');
    }

    // Check if user has admin role for deletion
    if (user.role !== 'admin') {
      return createApiResponse(null, 403, null, 'Forbidden: Admin access required');
    }

    // Find the organisation
    const organization = await Organization.findById(id);
    if (!organization) {
      return createApiResponse(null, 404, null, 'Organization not found');
    }

    // Delete all memberships first
    await OrganizationMembership.deleteMany({ organizationId: id });

    // Delete the organization
    await Organization.findByIdAndDelete(id);

    return createApiResponse({
      message: 'Organization deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error deleting organisation:', error);
    return createApiResponse(null, 500, null, 'Internal server error');
  }
}
