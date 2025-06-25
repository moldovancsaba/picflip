import { AuditLogger, type PermissionAuditContext } from '../logger';
import { PERMISSIONS, ROLES } from '@/lib/permissions/constants';

// Mock console.log for development environment
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('AuditLogger', () => {
  beforeEach(() => {
    // Clear mock between tests
    mockConsoleLog.mockClear();
    process.env.NODE_ENV = 'development';
  });

  describe('logPermissionCheck', () => {
    const context: PermissionAuditContext = {
      userId: 'user123',
      organizationId: 'org456',
      userRole: ROLES.ADMIN,
      targetUserId: 'user789',
      requiredPermission: PERMISSIONS.CREATE_PROJECT,
    };

    it('logs successful permission check', async () => {
      await AuditLogger.logPermissionCheck(context, true);

      expect(mockConsoleLog).toHaveBeenCalledWith('[Audit Log]', expect.objectContaining({
        userId: 'user123',
        organizationId: 'org456',
        action: 'permission_check',
        details: expect.objectContaining({
          userRole: ROLES.ADMIN,
          requiredPermission: PERMISSIONS.CREATE_PROJECT,
          targetUserId: 'user789',
        }),
        status: 'success',
      }));
    });

    it('logs failed permission check with error message', async () => {
      await AuditLogger.logPermissionCheck(
        context,
        false,
        'Insufficient permissions'
      );

      expect(mockConsoleLog).toHaveBeenCalledWith('[Audit Log]', expect.objectContaining({
        status: 'failure',
        errorMessage: 'Insufficient permissions',
      }));
    });

    it('includes ISO 8601 timestamp', async () => {
      await AuditLogger.logPermissionCheck(context, true);

      const call = mockConsoleLog.mock.calls[0][1];
      expect(call.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });
  });

  describe('logRoleChange', () => {
    it('logs role change event', async () => {
      await AuditLogger.logRoleChange(
        'user123',
        'org456',
        'admin789',
        ROLES.MEMBER,
        ROLES.ADMIN
      );

      expect(mockConsoleLog).toHaveBeenCalledWith('[Audit Log]', expect.objectContaining({
        userId: 'admin789',
        organizationId: 'org456',
        action: 'role_change',
        details: expect.objectContaining({
          targetUserId: 'user123',
          oldRole: ROLES.MEMBER,
          newRole: ROLES.ADMIN,
        }),
        status: 'success',
      }));
    });

    it('includes ISO 8601 timestamp', async () => {
      await AuditLogger.logRoleChange(
        'user123',
        'org456',
        'admin789',
        ROLES.MEMBER,
        ROLES.ADMIN
      );

      const call = mockConsoleLog.mock.calls[0][1];
      expect(call.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });
  });

  describe('development vs production', () => {
    it('logs in development environment', async () => {
      process.env.NODE_ENV = 'development';
      await AuditLogger.logPermissionCheck({
        userId: 'user123',
        organizationId: 'org456',
        userRole: ROLES.MEMBER,
        requiredPermission: PERMISSIONS.VIEW_PROJECT,
      }, true);

      expect(mockConsoleLog).toHaveBeenCalled();
    });

    it('does not log in production environment', async () => {
      process.env.NODE_ENV = 'production';
      await AuditLogger.logPermissionCheck({
        userId: 'user123',
        organizationId: 'org456',
        userRole: ROLES.MEMBER,
        requiredPermission: PERMISSIONS.VIEW_PROJECT,
      }, true);

      expect(mockConsoleLog).not.toHaveBeenCalled();
    });
  });
});
