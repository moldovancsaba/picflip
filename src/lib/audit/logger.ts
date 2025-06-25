import { type Permission, type Role } from '@/lib/permissions/constants';

export interface AuditLogEntry {
  timestamp: string;
  userId: string;
  organizationId: string;
  action: string;
  details: Record<string, unknown>;
  status: 'success' | 'failure';
  errorMessage?: string;
}

export interface PermissionAuditContext {
  userId: string;
  organizationId: string;
  userRole: Role;
  targetUserId?: string;
  requiredPermission: Permission;
}

export class AuditLogger {
  /**
   * Log a permission check event
   */
  static async logPermissionCheck(
    context: PermissionAuditContext,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      userId: context.userId,
      organizationId: context.organizationId,
      action: 'permission_check',
      details: {
        userRole: context.userRole,
        requiredPermission: context.requiredPermission,
        targetUserId: context.targetUserId,
      },
      status: success ? 'success' : 'failure',
      errorMessage,
    };

    await this.writeLog(entry);
  }

  /**
   * Log a role change event
   */
  static async logRoleChange(
    userId: string,
    organizationId: string,
    performedBy: string,
    oldRole: Role,
    newRole: Role
  ): Promise<void> {
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      userId: performedBy,
      organizationId,
      action: 'role_change',
      details: {
        targetUserId: userId,
        oldRole,
        newRole,
      },
      status: 'success',
    };

    await this.writeLog(entry);
  }

  /**
   * Write the audit log entry to storage
   */
  private static async writeLog(entry: AuditLogEntry): Promise<void> {
    // In a production environment, this would write to a secure audit log storage
    // For now, we'll just console.log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Audit Log]', entry);
    }
    
    // TODO: Implement secure audit log storage
    // Options:
    // 1. Write to a separate MongoDB collection
    // 2. Use a specialized audit logging service
    // 3. Write to secure log files
  }
}
