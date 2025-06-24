import mongoose from 'mongoose';

export type MembershipRole = 'owner' | 'admin' | 'member';

export interface IOrganisationMembership {
  _id?: string;
  userId: mongoose.Types.ObjectId | string;
  organisationId: mongoose.Types.ObjectId | string;
  role: MembershipRole;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const organisationMembershipSchema = new mongoose.Schema<IOrganisationMembership>({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  organisationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organisation', 
    required: true 
  },
  role: {
    type: String,
    enum: {
      values: ['owner', 'admin', 'member'],
      message: 'Role must be one of: owner, admin, member'
    },
    required: true,
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

// Create compound unique index to prevent duplicate memberships
organisationMembershipSchema.index(
  { userId: 1, organisationId: 1 }, 
  { unique: true, background: true }
);

// Create indexes for common queries
organisationMembershipSchema.index({ organisationId: 1, role: 1 }, { background: true });
organisationMembershipSchema.index({ userId: 1 }, { background: true });
organisationMembershipSchema.index({ createdAt: -1 }, { background: true });

// Validation to ensure at least one owner per organisation
organisationMembershipSchema.pre('save', async function(next) {
  try {
    // If this is a new membership with owner role, we're good
    if (this.isNew && this.role === 'owner') {
      return next();
    }
    
    // If updating an existing owner's role, ensure there's another owner
    if (!this.isNew && this.isModified('role') && this.role !== 'owner') {
      const originalDoc = await mongoose.models.OrganisationMembership
        .findById(this._id)
        .lean() as IOrganisationMembership | null;
      
      if (originalDoc?.role === 'owner') {
        const otherOwners = await mongoose.models.OrganisationMembership
          .countDocuments({
            organisationId: this.organisationId,
            role: 'owner',
            _id: { $ne: this._id }
          });
        
        if (otherOwners === 0) {
          throw new Error('Cannot remove the last owner from an organisation');
        }
      }
    }
    
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error('Unknown error occurred'));
  }
});

// Validation to prevent removing the last owner
organisationMembershipSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    if (this.role === 'owner') {
      const otherOwners = await mongoose.models.OrganisationMembership
        .countDocuments({
          organisationId: this.organisationId,
          role: 'owner',
          _id: { $ne: this._id }
        });
      
      if (otherOwners === 0) {
        throw new Error('Cannot remove the last owner from an organisation');
      }
    }
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error('Unknown error occurred'));
  }
});

// Helper methods for role hierarchy
export const roleHierarchy: Record<MembershipRole, number> = {
  owner: 3,
  admin: 2,
  member: 1
};

export function hasPermission(userRole: MembershipRole, requiredRole: MembershipRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canManageRole(userRole: MembershipRole, targetRole: MembershipRole): boolean {
  // Owners can manage any role except other owners
  if (userRole === 'owner') {
    return targetRole !== 'owner';
  }
  
  // Admins can only manage members
  if (userRole === 'admin') {
    return targetRole === 'member';
  }
  
  // Members cannot manage anyone
  return false;
}

export default mongoose.models.OrganisationMembership || 
  mongoose.model<IOrganisationMembership>('OrganisationMembership', organisationMembershipSchema);
