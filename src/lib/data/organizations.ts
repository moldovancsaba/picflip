import { connectDB } from '@/lib/db';
import Organization from '@/models/Organization';
import OrganizationMembership from '@/models/OrganizationMembership';
import { type Role } from '@/lib/permissions/constants';

export async function getOrganization(id: string) {
  await connectDB();
  return Organization.findById(id).lean();
}

export async function getOrganizationMembers(organizationId: string) {
  await connectDB();
  return OrganizationMembership.find({ organizationId })
    .populate('userId', 'email name')
    .lean();
}

export async function getMemberRole(organizationId: string, userId: string): Promise<Role | null> {
  await connectDB();
  const membership = await OrganizationMembership.findOne({
    organizationId,
    userId
  }).lean();
  return membership?.role || null;
}

export async function getOrganizationProjects(organizationId: string) {
  await connectDB();
  return Organization.findById(organizationId)
    .populate('projects')
    .lean();
}
