import {
  generateSlug,
  hasPermission,
  canManageRole,
  getAssignableRoles,
  formatTimestamp,
  validateOrganizationName,
  validateOrganizationDescription,
  getRoleDisplayName,
  getRoleColors,
  roleHierarchy
} from '../organizationHelpers';
import { MembershipRole } from '../types';

describe('organizationHelpers', () => {
  describe('generateSlug', () => {
    it('should generate a basic slug from a simple name', () => {
      expect(generateSlug('My Organization')).toBe('my-organization');
    });

    it('should handle special characters', () => {
      expect(generateSlug('My Org@nization! #123')).toBe('my-orgnization-123');
    });

    it('should handle multiple spaces', () => {
      expect(generateSlug('My    Organization    Name')).toBe('my-organization-name');
    });

    it('should handle leading and trailing spaces', () => {
      expect(generateSlug('  My Organization  ')).toBe('my-organization');
    });

    it('should handle multiple hyphens', () => {
      expect(generateSlug('My---Organization')).toBe('my-organization');
    });

    it('should handle leading and trailing hyphens', () => {
      expect(generateSlug('-My Organization-')).toBe('my-organization');
    });

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('');
    });

    it('should handle only special characters', () => {
      expect(generateSlug('!@#$%^&*()')).toBe('');
    });

    it('should handle mixed case with numbers', () => {
      expect(generateSlug('Organization 123 Test')).toBe('organization-123-test');
    });
  });

  describe('roleHierarchy', () => {
    it('should have correct hierarchy values', () => {
      expect(roleHierarchy.owner).toBe(3);
      expect(roleHierarchy.admin).toBe(2);
      expect(roleHierarchy.member).toBe(1);
    });
  });

  describe('hasPermission', () => {
    it('should allow owner to access all permission levels', () => {
      expect(hasPermission('owner', 'owner')).toBe(true);
      expect(hasPermission('owner', 'admin')).toBe(true);
      expect(hasPermission('owner', 'member')).toBe(true);
    });

    it('should allow admin to access admin and member levels', () => {
      expect(hasPermission('admin', 'owner')).toBe(false);
      expect(hasPermission('admin', 'admin')).toBe(true);
      expect(hasPermission('admin', 'member')).toBe(true);
    });

    it('should allow member to access only member level', () => {
      expect(hasPermission('member', 'owner')).toBe(false);
      expect(hasPermission('member', 'admin')).toBe(false);
      expect(hasPermission('member', 'member')).toBe(true);
    });
  });

  describe('canManageRole', () => {
    it('should allow owner to manage admin and member roles', () => {
      expect(canManageRole('owner', 'admin')).toBe(true);
      expect(canManageRole('owner', 'member')).toBe(true);
    });

    it('should not allow owner to manage other owners', () => {
      expect(canManageRole('owner', 'owner')).toBe(false);
    });

    it('should allow admin to manage only members', () => {
      expect(canManageRole('admin', 'owner')).toBe(false);
      expect(canManageRole('admin', 'admin')).toBe(false);
      expect(canManageRole('admin', 'member')).toBe(true);
    });

    it('should not allow member to manage anyone', () => {
      expect(canManageRole('member', 'owner')).toBe(false);
      expect(canManageRole('member', 'admin')).toBe(false);
      expect(canManageRole('member', 'member')).toBe(false);
    });
  });

  describe('getAssignableRoles', () => {
    it('should return correct assignable roles for owner', () => {
      const roles = getAssignableRoles('owner');
      expect(roles).toEqual(['admin', 'member']);
    });

    it('should return correct assignable roles for admin', () => {
      const roles = getAssignableRoles('admin');
      expect(roles).toEqual(['member']);
    });

    it('should return empty array for member', () => {
      const roles = getAssignableRoles('member');
      expect(roles).toEqual([]);
    });
  });

  describe('formatTimestamp', () => {
    it('should format Date object to ISO string', () => {
      const date = new Date('2025-01-13T12:34:56.789Z');
      expect(formatTimestamp(date)).toBe('2025-01-13T12:34:56.789Z');
    });

    it('should format date string to ISO string', () => {
      const dateString = '2025-01-13T12:34:56.789Z';
      expect(formatTimestamp(dateString)).toBe('2025-01-13T12:34:56.789Z');
    });

    it('should handle different date formats', () => {
      const dateString = '2025-01-13';
      const result = formatTimestamp(dateString);
      expect(result).toMatch(/2025-01-13T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
    });
  });

  describe('validateOrganizationName', () => {
    it('should validate correct organization names', () => {
      expect(validateOrganizationName('My Organization')).toEqual({ isValid: true });
      expect(validateOrganizationName('AB')).toEqual({ isValid: true });
      expect(validateOrganizationName('A'.repeat(100))).toEqual({ isValid: true });
    });

    it('should reject empty name', () => {
      expect(validateOrganizationName('')).toEqual({
        isValid: false,
        error: 'Organisation name is required'
      });
    });

    it('should reject whitespace-only name', () => {
      expect(validateOrganizationName('   ')).toEqual({
        isValid: false,
        error: 'Organisation name is required'
      });
    });

    it('should reject name that is too short', () => {
      expect(validateOrganizationName('A')).toEqual({
        isValid: false,
        error: 'Organisation name must be at least 2 characters'
      });
    });

    it('should reject name that is too long', () => {
      expect(validateOrganizationName('A'.repeat(101))).toEqual({
        isValid: false,
        error: 'Organisation name cannot exceed 100 characters'
      });
    });

    it('should trim whitespace before validation', () => {
      expect(validateOrganizationName('  AB  ')).toEqual({ isValid: true });
    });
  });

  describe('validateOrganizationDescription', () => {
    it('should validate correct descriptions', () => {
      expect(validateOrganizationDescription('')).toEqual({ isValid: true });
      expect(validateOrganizationDescription('This is a valid description')).toEqual({ isValid: true });
      expect(validateOrganizationDescription('A'.repeat(500))).toEqual({ isValid: true });
    });

    it('should reject description that is too long', () => {
      expect(validateOrganizationDescription('A'.repeat(501))).toEqual({
        isValid: false,
        error: 'Description cannot exceed 500 characters'
      });
    });
  });

  describe('getRoleDisplayName', () => {
    it('should capitalize role names correctly', () => {
      expect(getRoleDisplayName('owner')).toBe('Owner');
      expect(getRoleDisplayName('admin')).toBe('Admin');
      expect(getRoleDisplayName('member')).toBe('Member');
    });
  });

  describe('getRoleColors', () => {
    it('should return correct colors for owner role', () => {
      const colors = getRoleColors('owner');
      expect(colors).toEqual({
        bg: '#fef3c7',
        text: '#92400e',
        border: '#f59e0b'
      });
    });

    it('should return correct colors for admin role', () => {
      const colors = getRoleColors('admin');
      expect(colors).toEqual({
        bg: '#dbeafe',
        text: '#1e40af',
        border: '#3b82f6'
      });
    });

    it('should return correct colors for member role', () => {
      const colors = getRoleColors('member');
      expect(colors).toEqual({
        bg: '#f3f4f6',
        text: '#374151',
        border: '#6b7280'
      });
    });

    it('should return default colors for invalid role', () => {
      const colors = getRoleColors('invalid' as MembershipRole);
      expect(colors).toEqual({
        bg: '#f3f4f6',
        text: '#374151',
        border: '#6b7280'
      });
    });
  });
});
