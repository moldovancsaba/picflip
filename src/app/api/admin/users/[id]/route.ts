import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import OrganizationMembership from '@/models/OrganizationMembership';
import Organization from '@/models/Organization';
import { z } from 'zod';
import mongoose from 'mongoose';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Validation schemas
const membershipActionSchema = z.object({
  organizationId: z.string(),
  role: z.enum(['owner', 'admin', 'member']),
  action: z.enum(['add', 'remove'])
});

const userUpdateSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  role: z.enum(['admin', 'user']).optional(),
  memberships: z.array(membershipActionSchema).optional()
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

    // Fetch the user
    const user = await User.findById(id).lean() as any;
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch all user's memberships with organization details
    const memberships = await OrganizationMembership.find({ userId: id })
      .populate('organizationId', 'name slug description')
      .sort({ role: -1, joinedAt: 1 })
      .lean();

    const membershipSummary = memberships.map((membership: any) => ({
      _id: membership._id,
      organizationId: membership.organizationId._id,
      organizationName: membership.organizationId.name,
      organizationSlug: membership.organizationId.slug,
      role: membership.role,
      joinedAt: membership.joinedAt.toISOString()
    }));

    // Fetch all available organizations for potential membership management
    const allOrganizations = await Organization.find({})
      .sort({ name: 1 })
      .select('_id name slug description')
      .lean();

    const userData = {
      _id: user._id,
      email: user.email,
      role: user.role,
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      termsAcceptedAt: user.termsAcceptedAt?.toISOString() || null,
      privacyAcceptedAt: user.privacyAcceptedAt?.toISOString() || null,
      memberships: membershipSummary,
      allOrganizations
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('Error fetching user:', error);
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
    const validationResult = userUpdateSchema.safeParse(body);
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

    // Fetch the user first
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent self-demotion from admin role
    if (session.email === user.email && updateData.role && updateData.role !== 'admin') {
      return NextResponse.json(
        { message: 'Cannot demote yourself from admin role' },
        { status: 400 }
      );
    }

    // Update basic user fields
    const userUpdateFields: any = {};
    if (updateData.email) userUpdateFields.email = updateData.email;
    if (updateData.role) userUpdateFields.role = updateData.role;

    if (Object.keys(userUpdateFields).length > 0) {
      await User.findByIdAndUpdate(id, userUpdateFields, { runValidators: true });
    }

    // Handle membership changes
    if (updateData.memberships && updateData.memberships.length > 0) {
      for (const membershipAction of updateData.memberships) {
        const { organisationId, role, action } = membershipAction;

        // Verify organization exists
        const orgExists = await Organisation.findById(organisationId);
        if (!orgExists) {
          return NextResponse.json(
            { message: `Organisation ${organisationId} not found` },
            { status: 404 }
          );
        }

        if (action === 'add') {
          // Check if membership already exists
          const existingMembership = await OrganisationMembership.findOne({
            userId: id,
            organisationId
          });

          if (existingMembership) {
            // Update existing membership role
            existingMembership.role = role;
            await existingMembership.save();
          } else {
            // Create new membership
            await OrganisationMembership.create({
              userId: id,
              organisationId,
              role
            });
          }
        } else if (action === 'remove') {
          // Check if this is the last owner before removing
          const membership = await OrganisationMembership.findOne({
            userId: id,
            organisationId
          });

          if (membership && membership.role === 'owner') {
            const otherOwners = await OrganisationMembership.countDocuments({
              organisationId,
              role: 'owner',
              userId: { $ne: id }
            });

            if (otherOwners === 0) {
              return NextResponse.json(
                { message: 'Cannot remove the last owner from an organisation' },
                { status: 400 }
              );
            }
          }

          // Remove the membership
          await OrganisationMembership.deleteOne({
            userId: id,
            organisationId
          });
        }
      }
    }

    // Fetch updated user data with memberships
    const updatedUser = await User.findById(id).lean() as any;
    const updatedMemberships = await OrganisationMembership.find({ userId: id })
      .populate('organisationId', 'name slug description')
      .sort({ role: -1, joinedAt: 1 })
      .lean();

    const membershipSummary = updatedMemberships.map((membership: any) => ({
      _id: membership._id,
      organisationId: membership.organisationId._id,
      organisationName: membership.organisationId.name,
      organisationSlug: membership.organisationId.slug,
      role: membership.role,
      joinedAt: membership.joinedAt.toISOString()
    }));

    const responseUser = {
      _id: updatedUser._id,
      email: updatedUser.email,
      role: updatedUser.role,
      lastLoginAt: updatedUser.lastLoginAt?.toISOString() || null,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
      termsAcceptedAt: updatedUser.termsAcceptedAt?.toISOString() || null,
      privacyAcceptedAt: updatedUser.privacyAcceptedAt?.toISOString() || null,
      memberships: membershipSummary
    };

    return NextResponse.json({
      message: 'User updated successfully',
      user: responseUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
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

    // Handle duplicate key errors (e.g., email already exists)
    if ((error as any)?.code === 11000) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
