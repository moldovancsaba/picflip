import { 
  PERMISSIONS,
  ROLES,
  hasPermission,
  getPermissionsForRole
} from '../constants';

describe('Permission System', () => {
  describe('hasPermission', () => {
    it('owner has all permissions', () => {
      Object.values(PERMISSIONS).forEach(permission => {
        expect(hasPermission(ROLES.OWNER, permission)).toBe(true);
      });
    });

    it('admin has limited permissions', () => {
      // Admin should have these permissions
      expect(hasPermission(ROLES.ADMIN, PERMISSIONS.CREATE_PROJECT)).toBe(true);
      expect(hasPermission(ROLES.ADMIN, PERMISSIONS.EDIT_PROJECT)).toBe(true);
      expect(hasPermission(ROLES.ADMIN, PERMISSIONS.VIEW_PROJECT)).toBe(true);
      expect(hasPermission(ROLES.ADMIN, PERMISSIONS.MANAGE_MEMBERS)).toBe(true);
      
      // Admin should not have these permissions
      expect(hasPermission(ROLES.ADMIN, PERMISSIONS.DELETE_ORGANIZATION)).toBe(false);
      expect(hasPermission(ROLES.ADMIN, PERMISSIONS.DELETE_PROJECT)).toBe(false);
    });

    it('member has basic view permissions only', () => {
      // Member should have these permissions
      expect(hasPermission(ROLES.MEMBER, PERMISSIONS.VIEW_PROJECT)).toBe(true);
      expect(hasPermission(ROLES.MEMBER, PERMISSIONS.VIEW_MEMBERS)).toBe(true);
      expect(hasPermission(ROLES.MEMBER, PERMISSIONS.VIEW_ORGANIZATION)).toBe(true);
      
      // Member should not have these permissions
      expect(hasPermission(ROLES.MEMBER, PERMISSIONS.CREATE_PROJECT)).toBe(false);
      expect(hasPermission(ROLES.MEMBER, PERMISSIONS.EDIT_PROJECT)).toBe(false);
      expect(hasPermission(ROLES.MEMBER, PERMISSIONS.MANAGE_MEMBERS)).toBe(false);
    });
  });

  describe('getPermissionsForRole', () => {
    it('returns all permissions for owner', () => {
      const ownerPermissions = getPermissionsForRole(ROLES.OWNER);
      expect(ownerPermissions.length).toBe(Object.keys(PERMISSIONS).length);
      Object.values(PERMISSIONS).forEach(permission => {
        expect(ownerPermissions).toContain(permission);
      });
    });

    it('returns correct permissions for admin', () => {
      const adminPermissions = getPermissionsForRole(ROLES.ADMIN);
      expect(adminPermissions).toContain(PERMISSIONS.CREATE_PROJECT);
      expect(adminPermissions).toContain(PERMISSIONS.EDIT_PROJECT);
      expect(adminPermissions).not.toContain(PERMISSIONS.DELETE_ORGANIZATION);
    });

    it('returns basic permissions for member', () => {
      const memberPermissions = getPermissionsForRole(ROLES.MEMBER);
      expect(memberPermissions).toContain(PERMISSIONS.VIEW_PROJECT);
      expect(memberPermissions).toContain(PERMISSIONS.VIEW_MEMBERS);
      expect(memberPermissions).not.toContain(PERMISSIONS.CREATE_PROJECT);
    });
  });
});
