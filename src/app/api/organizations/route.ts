import { NextRequest } from 'next/server';
import { createApiResponse } from '@/middleware/responseHandler';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
// Note: We use American English spelling convention (e.g., 'Organization' not 'Organisation')
import Organization from '@/models/Organization';
import OrganizationMembership from '@/models/OrganizationMembership';
import User from '@/models/User';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session) {
      return createApiResponse(null, 401, null, 'Unauthorized');
    }

    await dbConnect();

    const user = await User.findOne({ email: session.email }).lean() as any;
    if (!user) {
      return createApiResponse(null, 404, null, 'User not found');
    }

    // Check if admin is requesting all organizations
    const isAdmin = user.role === 'admin';
    const { searchParams } = new URL(req.url);
    const adminView = searchParams.get('admin') === 'true';

    if (adminView && isAdmin) {
      // Admin view: fetch all organizations
      const organizations = await Organization.find({})
        .sort({ createdAt: -1 })
        .lean();

      const serializedOrgs = organizations.map(org => serializeDocument(org));
      
      return createApiResponse({
        organizations: serializedOrgs,
        count: serializedOrgs.length
      });
    } else {
      // Regular user view: fetch user's organizations through memberships
      const memberships = await OrganizationMembership.find({ userId: user._id })
        .populate('organizationId')
        .sort({ createdAt: -1 })
        .lean() as any[];

      const organizations = memberships.map(membership => {
        const org = serializeDocument({
          ...membership.organizationId,
          membershipRole: membership.role,
          joinedAt: membership.joinedAt
        });
        return org;
      });

      return createApiResponse({
        organizations,
        count: organizations.length
      });
    }

  } catch (error) {
    console.error('Error fetching organizations:', error);
    return createApiResponse(
      null,
      500,
      null,
      'Internal server error'
    );
  }
}

// Helper to safely serialize dates and ObjectIds
function serializeDocument(doc: any) {
  const serialized = { ...doc };
  
  // Handle dates
  if (serialized.createdAt) {
    serialized.createdAt = new Date(serialized.createdAt).toISOString();
  }
  if (serialized.updatedAt) {
    serialized.updatedAt = new Date(serialized.updatedAt).toISOString();
  }
  if (serialized.joinedAt) {
    serialized.joinedAt = new Date(serialized.joinedAt).toISOString();
  }
  
  // Handle MongoDB ObjectIds
  if (serialized._id) {
    serialized._id = serialized._id.toString();
  }
  if (serialized.userId) {
    serialized.userId = serialized.userId.toString();
  }
  if (serialized.organizationId) {
    serialized.organizationId = serialized.organizationId.toString();
  }
  
  return serialized;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    
    if (!session) {
      return createApiResponse(null, 401, null, 'Unauthorized');
    }

    const { name, description } = await req.json();

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return createApiResponse(
        null,
        400,
        null,
        'Organization name is required and must be at least 2 characters'
      );
    }

    if (description && (typeof description !== 'string' || description.length > 500)) {
      return createApiResponse(
        null,
        400,
        null,
        'Description must be a string and cannot exceed 500 characters'
      );
    }

    await dbConnect();

    // Get user
    const user = await User.findOne({ email: session.email });
    if (!user) {
      return createApiResponse(null, 404, null, 'User not found');
    }

    // Create organization (slug is auto-generated)
    const organization = new Organization({
      name: name.trim(),
      description: description?.trim() || ''
    });

    await organization.save();

    // Create owner membership for the creator
    const membership = new OrganizationMembership({
      userId: user._id,
      organizationId: organization._id,
      role: 'owner'
    });

    await membership.save();

    // Return the created organization with membership info
    const organizationData = serializeDocument({
      _id: organization._id,
      name: organization.name,
      slug: organization.slug,
      description: organization.description,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt,
      membershipRole: 'owner',
      joinedAt: membership.joinedAt
    });

    return createApiResponse(
      { organization: organizationData },
      201,
      'Organization created successfully'
    );

  } catch (error) {
    console.error('Error creating organization:', error);
    
    // Handle MongoDB duplicate key error (unlikely due to auto-slug generation)
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return createApiResponse(
        null,
        409,
        null,
        'Organization with this name already exists'
      );
    }

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return createApiResponse(null, 400, null, error.message);
    }

    return createApiResponse(null, 500, null, 'Internal server error');
  }
}
