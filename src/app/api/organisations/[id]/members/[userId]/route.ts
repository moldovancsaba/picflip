import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Organisation from '@/models/Organisation';
import OrganisationMembership, { canManageRole } from '@/models/OrganisationMembership';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string; userId: string }> }
) {
  const params = await context.params;
  try {
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(params.id) || !mongoose.Types.ObjectId.isValid(params.userId)) {
      return NextResponse.json(
        { error: 'Invalid organisation or user ID' },
        { status: 400 }
      );
    }

    // Check if organisation exists
    const organisation = await Organisation.findById(params.id);
    if (!organisation) {
      return NextResponse.json(
        { error: 'Organisation not found' },
        { status: 404 }
      );
    }

    // Get current user and their membership
    const currentUser = await User.findOne({ email: session.email });
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Current user not found' },
        { status: 404 }
      );
    }

    const currentUserMembership = await OrganisationMembership.findOne({
      userId: currentUser._id,
      organisationId: params.id
    });

    if (!currentUserMembership) {
      return NextResponse.json(
        { error: 'Access denied - not a member of this organisation' },
        { status: 403 }
      );
    }

    // Find the target membership to remove
    const targetMembership = await OrganisationMembership.findOne({
      userId: params.userId,
      organisationId: params.id
    });

    if (!targetMembership) {
      return NextResponse.json(
        { error: 'User is not a member of this organisation' },
        { status: 404 }
      );
    }

    // Check if user is trying to remove themselves
    const isSelfRemoval = currentUser._id.toString() === params.userId;

    if (isSelfRemoval) {
      // Users can always remove themselves, but check if they're the last owner
      if (targetMembership.role === 'owner') {
        const otherOwners = await OrganisationMembership.countDocuments({
          organisationId: params.id,
          role: 'owner',
          _id: { $ne: targetMembership._id }
        });

        if (otherOwners === 0) {
          return NextResponse.json(
            { error: 'Cannot leave organisation - you are the last owner. Transfer ownership first.' },
            { status: 400 }
          );
        }
      }
    } else {
      // Check permission to remove other members
      if (!canManageRole(currentUserMembership.role, targetMembership.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions to remove this member' },
          { status: 403 }
        );
      }

      // Prevent owners from removing other owners
      if (targetMembership.role === 'owner' && currentUserMembership.role === 'owner') {
        return NextResponse.json(
          { error: 'Owners cannot remove other owners. Use role change instead.' },
          { status: 403 }
        );
      }
    }

    // Store membership data before deletion for response
    const membershipData = {
      _id: targetMembership._id,
      userId: targetMembership.userId,
      organisationId: targetMembership.organisationId,
      role: targetMembership.role,
      joinedAt: targetMembership.joinedAt
    };

    // Remove the membership
    await OrganisationMembership.findByIdAndDelete(targetMembership._id);

    return NextResponse.json({
      message: isSelfRemoval 
        ? 'Successfully left the organisation' 
        : 'Member removed successfully',
      removedMembership: membershipData
    });

  } catch (error) {
    console.error('Error removing organisation member:', error);
    
    // Handle specific mongoose errors
    if (error instanceof Error && error.message.includes('Cannot remove the last owner')) {
      return NextResponse.json(
        { error: 'Cannot remove the last owner from an organisation' },
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

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; userId: string }> }
) {
  const params = await context.params;
  try {
    const session = await getSession(req);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { role } = await req.json();

    // Validation
    if (!role || !['owner', 'admin', 'member'].includes(role)) {
      return NextResponse.json(
        { error: 'Valid role is required. Must be one of: owner, admin, member' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(params.id) || !mongoose.Types.ObjectId.isValid(params.userId)) {
      return NextResponse.json(
        { error: 'Invalid organisation or user ID' },
        { status: 400 }
      );
    }

    // Check if organisation exists
    const organisation = await Organisation.findById(params.id);
    if (!organisation) {
      return NextResponse.json(
        { error: 'Organisation not found' },
        { status: 404 }
      );
    }

    // Get current user and their membership
    const currentUser = await User.findOne({ email: session.email });
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Current user not found' },
        { status: 404 }
      );
    }

    const currentUserMembership = await OrganisationMembership.findOne({
      userId: currentUser._id,
      organisationId: params.id
    });

    if (!currentUserMembership) {
      return NextResponse.json(
        { error: 'Access denied - not a member of this organisation' },
        { status: 403 }
      );
    }

    // Find the target membership to update
    const targetMembership = await OrganisationMembership.findOne({
      userId: params.userId,
      organisationId: params.id
    });

    if (!targetMembership) {
      return NextResponse.json(
        { error: 'User is not a member of this organisation' },
        { status: 404 }
      );
    }

    // Users cannot change their own role
    const isSelfUpdate = currentUser._id.toString() === params.userId;
    if (isSelfUpdate) {
      return NextResponse.json(
        { error: 'Cannot change your own role. Ask another admin or owner to change it.' },
        { status: 403 }
      );
    }

    // Check permission to change roles
    if (!canManageRole(currentUserMembership.role, targetMembership.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to change this member\'s role' },
        { status: 403 }
      );
    }

    // Only owners can assign owner role
    if (role === 'owner' && currentUserMembership.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only organisation owners can assign owner role' },
        { status: 403 }
      );
    }

    // Owners cannot demote other owners
    if (targetMembership.role === 'owner' && role !== 'owner' && currentUserMembership.role === 'owner') {
      return NextResponse.json(
        { error: 'Owners cannot demote other owners directly. Transfer ownership first.' },
        { status: 403 }
      );
    }

    // Update the role
    targetMembership.role = role;
    await targetMembership.save();

    // Get updated membership with user info
    const updatedMembership = await OrganisationMembership.findById(targetMembership._id)
      .populate('userId', 'email createdAt lastLoginAt')
      .lean() as any;

    return NextResponse.json({
      message: 'Member role updated successfully',
      membership: {
        _id: updatedMembership._id,
        user: updatedMembership.userId,
        role: updatedMembership.role,
        joinedAt: updatedMembership.joinedAt,
        createdAt: updatedMembership.createdAt,
        updatedAt: updatedMembership.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating member role:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Handle specific business logic errors
    if (error instanceof Error && error.message.includes('Cannot remove the last owner')) {
      return NextResponse.json(
        { error: 'Cannot change role - this would remove the last owner from the organisation' },
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
