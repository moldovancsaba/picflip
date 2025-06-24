export type HorizontalAlignment = 'left' | 'center' | 'right';
export type VerticalAlignment = 'top' | 'middle' | 'bottom';

export interface IframeConfig {
  id: string;
  name: string;
  slug?: string;
  contentUrl: string;
  originalWidth: number;
  originalHeight: number;
  aspectRatioX: number;
  aspectRatioY: number;
  backgroundColor: string;
  backgroundImageUrl: string;
  horizontalAlignment: HorizontalAlignment;
  verticalAlignment: VerticalAlignment;
  isPublic: boolean;
  organisationId?: string; // Optional - null for personal projects
}

// Organization types
export type MembershipRole = 'owner' | 'admin' | 'member';

export interface Organisation {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface OrganisationMembership {
  _id?: string;
  userId: string;
  organisationId: string;
  role: MembershipRole;
  joinedAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface OrganisationMembershipSummary {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  membershipRole: MembershipRole;
  joinedAt: Date | string;
}

export interface OrganisationFormData {
  name: string;
  description: string;
}

export interface User {
  _id?: string;
  email: string;
  name?: string;
  role?: 'admin' | 'user';
  createdAt: Date | string;
  updatedAt: Date | string;
}
