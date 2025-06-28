import mongoose from 'mongoose';

export type MembershipRole = 'ADMIN' | 'MEMBER';

export interface IOrganizationMembership {
  _id?: string;
  userId: mongoose.Types.ObjectId | string;
  organizationId: mongoose.Types.ObjectId | string;
  role: MembershipRole;
  createdAt: Date;
  updatedAt: Date;
}

const organizationMembershipSchema = new mongoose.Schema<IOrganizationMembership>({
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  role: {
    type: String,
    enum: {
      values: ['ADMIN', 'MEMBER'],
      message: 'Role must be one of: ADMIN, MEMBER'
    },
    required: true
  }
}, {
  timestamps: {
    currentTime: () => new Date() // Returns native Date object
  }
});

// Create compound index for organizationId and userId
organizationMembershipSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

// Helper methods for role hierarchy
export const roleHierarchy: Record<MembershipRole, number> = {
  ADMIN: 2,
  MEMBER: 1
};

export function hasPermission(userRole: MembershipRole, requiredRole: MembershipRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canManageRole(userRole: MembershipRole, targetRole: MembershipRole): boolean {
  // ADMINs can only manage MEMBERs
  if (userRole === 'ADMIN') {
    return targetRole === 'MEMBER';
  }
  
  // MEMBERs cannot manage anyone
  return false;
}

export default mongoose.models.OrganizationMembership || 
  mongoose.model<IOrganizationMembership>('OrganizationMembership', organizationMembershipSchema);
