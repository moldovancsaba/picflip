import mongoose from 'mongoose';
import { type Role } from '@/lib/permissions/constants';

export interface IOrganizationMembership {
  _id?: string;
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: Role;
  joinedAt: Date;
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
    enum: ['owner', 'admin', 'member'],
    required: true,
    default: 'member'
  },
  joinedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

// Create compound unique index for organizationId + userId
organizationMembershipSchema.index(
  { organizationId: 1, userId: 1 },
  { unique: true, background: true }
);

// Create index for looking up memberships by userId
organizationMembershipSchema.index(
  { userId: 1, role: 1 },
  { background: true }
);

export default mongoose.models.OrganizationMembership || mongoose.model<IOrganizationMembership>('OrganizationMembership', organizationMembershipSchema);
