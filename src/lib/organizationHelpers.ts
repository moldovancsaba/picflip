import { MembershipRole } from './types';

/**
 * Generate a slug from an organization name
 * @param name The organization name
 * @returns A URL-safe slug
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Role hierarchy for permission checking
 */
export const roleHierarchy: Record<MembershipRole, number> = {
  owner: 3,
  admin: 2,
  member: 1
};

/**
 * Check if a user role has the required permission level
 * @param userRole The user's current role
 * @param requiredRole The minimum required role
 * @returns True if user has sufficient permissions
 */
export function hasPermission(userRole: MembershipRole, requiredRole: MembershipRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if a user can manage (add/remove/change role of) another user with a specific role
 * @param userRole The managing user's role
 * @param targetRole The role of the user being managed
 * @returns True if the user can manage the target role
 */
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

/**
 * Get available roles that a user can assign
 * @param userRole The user's current role
 * @returns Array of roles that can be assigned
 */
export function getAssignableRoles(userRole: MembershipRole): MembershipRole[] {
  switch (userRole) {
    case 'owner':
      return ['admin', 'member'];
    case 'admin':
      return ['member'];
    case 'member':
      return [];
    default:
      return [];
  }
}

/**
 * Format timestamp to ISO 8601 with milliseconds
 * @param date Date object or string
 * @returns Formatted timestamp string
 */
export function formatTimestamp(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString();
}

/**
 * Validate organization name
 * @param name The organization name to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateOrganizationName(name: string): { isValid: boolean; error?: string } {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return { isValid: false, error: 'Organisation name is required' };
  }
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Organisation name must be at least 2 characters' };
  }
  
  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Organisation name cannot exceed 100 characters' };
  }
  
  return { isValid: true };
}

/**
 * Validate organization description
 * @param description The organization description to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateOrganizationDescription(description: string): { isValid: boolean; error?: string } {
  if (description && description.length > 500) {
    return { isValid: false, error: 'Description cannot exceed 500 characters' };
  }
  
  return { isValid: true };
}

/**
 * Get role display name with proper formatting
 * @param role The membership role
 * @returns Formatted role name
 */
export function getRoleDisplayName(role: MembershipRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

/**
 * Get role color for UI display
 * @param role The membership role
 * @returns Color object with background, text, and border colors
 */
export function getRoleColors(role: MembershipRole): { bg: string; text: string; border: string } {
  switch (role) {
    case 'owner':
      return { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' };
    case 'admin':
      return { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' };
    case 'member':
      return { bg: '#f3f4f6', text: '#374151', border: '#6b7280' };
    default:
      return { bg: '#f3f4f6', text: '#374151', border: '#6b7280' };
  }
}
