/**
 * Organization Permission System
 * Defines the core permission constants and types for role-based access control.
 */

// Permission Constants
export const PERMISSIONS = {
  // Project Permissions
  CREATE_PROJECT: 'create_project',
  EDIT_PROJECT: 'edit_project',
  DELETE_PROJECT: 'delete_project',
  VIEW_PROJECT: 'view_project',
  
  // Member Management
  MANAGE_MEMBERS: 'manage_members',
  INVITE_MEMBERS: 'invite_members',
  REMOVE_MEMBERS: 'remove_members',
  VIEW_MEMBERS: 'view_members',
  
  // Organization Management
  EDIT_ORGANIZATION: 'edit_organization',
  DELETE_ORGANIZATION: 'delete_organization',
  VIEW_ORGANIZATION: 'view_organization',
  
  // Settings & Configuration
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_SETTINGS: 'view_settings',
} as const;

// Permission Type
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Organization Roles
export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Role to Permission Mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.OWNER]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.INVITE_MEMBERS,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.VIEW_ORGANIZATION,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_SETTINGS,
  ],
  [ROLES.MEMBER]: [
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.VIEW_ORGANIZATION,
    PERMISSIONS.VIEW_SETTINGS,
  ],
};

/**
 * Validates if a user has the required permission based on their role.
 * @param role The user's role in the organization
 * @param permission The permission to check
 * @returns boolean indicating if the user has the permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/**
 * Get all permissions for a given role.
 * @param role The organization role
 * @returns Array of permissions assigned to the role
 */
export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}
