import { 
  PERMISSIONS,
  ROLES,
  type Permission,
  type Role,
  hasPermission
} from './constants';

interface PermissionCheckOptions {
  userRole: Role;
  requiredPermission: Permission;
}

/**
 * Client-side permission check utility.
 * Use this to conditionally render UI elements based on user permissions.
 */
export function usePermission({ userRole, requiredPermission }: PermissionCheckOptions): boolean {
  return hasPermission(userRole, requiredPermission);
}

/**
 * Get a list of all available actions for a user based on their role.
 * Useful for dynamically building menus and action lists.
 */
export function getAvailableActions(userRole: Role): Permission[] {
  return Object.values(PERMISSIONS).filter(permission => 
    hasPermission(userRole, permission)
  );
}

/**
 * Example usage in a React component:
 * 
 * function ProjectActions({ userRole }: { userRole: Role }) {
 *   const canCreateProject = usePermission({
 *     userRole,
 *     requiredPermission: PERMISSIONS.CREATE_PROJECT
 *   });
 * 
 *   return (
 *     <div>
 *       {canCreateProject && (
 *         <button>Create New Project</button>
 *       )}
 *     </div>
 *   );
 * }
 */
