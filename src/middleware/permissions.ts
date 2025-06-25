import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hasPermission, type Permission, type Role } from '@/lib/permissions/constants';
import { AuditLogger } from '@/lib/audit/logger';

export interface PermissionContext {
  organizationId: string;
  userRole: Role;
  userId: string;
  targetUserId?: string;
}

/**
 * Middleware to check if a user has the required permission for an operation.
 * @param handler The API route handler to protect
 * @param requiredPermission The permission required to access the route
 */
export function withPermission(
  handler: (req: NextRequest, context: PermissionContext) => Promise<NextResponse>,
  requiredPermission: Permission
) {
  return async (req: NextRequest, context: PermissionContext) => {
    const { userRole, userId, organizationId, targetUserId } = context;

    const hasRequiredPermission = hasPermission(userRole, requiredPermission);

    // Log the permission check
    await AuditLogger.logPermissionCheck(
      {
        userId,
        organizationId,
        userRole,
        targetUserId,
        requiredPermission,
      },
      hasRequiredPermission,
      hasRequiredPermission ? undefined : 'Insufficient permissions'
    );

    if (!hasRequiredPermission) {
      return new NextResponse(
        JSON.stringify({
          error: 'Insufficient permissions',
          required: requiredPermission,
        }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return handler(req, context);
  };
}

/**
 * Example usage in an API route:
 * 
 * export async function POST(req: NextRequest) {
 *   return withPermission(
 *     async (req, context) => {
 *       // Your protected API logic here
 *       return NextResponse.json({ success: true });
 *     },
 *     PERMISSIONS.CREATE_PROJECT
 *   )(req, { organizationId: '123', userRole: 'admin' });
 * }
 */
