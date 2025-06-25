import { useEffect, useCallback } from 'react';
import { type Role } from '@/lib/permissions/constants';

interface PermissionEvent {
  type: 'role_change';
  userId: string;
  organizationId: string;
  newRole: Role;
  timestamp: string;
}

interface UsePermissionUpdatesOptions {
  organizationId: string;
  userId: string;
  onRoleChange?: (newRole: Role) => void;
}

/**
 * Hook for subscribing to real-time permission updates via SSE
 */
export function usePermissionUpdates({
  organizationId,
  userId,
  onRoleChange,
}: UsePermissionUpdatesOptions) {
  const handleEvent = useCallback((event: PermissionEvent) => {
    if (
      event.type === 'role_change' &&
      event.userId === userId &&
      event.organizationId === organizationId &&
      onRoleChange
    ) {
      onRoleChange(event.newRole);
    }
  }, [userId, organizationId, onRoleChange]);

  useEffect(() => {
    const eventSource = new EventSource(
      `/api/permissions/events?organizationId=${organizationId}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleEvent(data);
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [organizationId, handleEvent]);
}

/**
 * Example usage in a React component:
 * 
 * function OrganizationDashboard({ organizationId, userId }) {
 *   const [userRole, setUserRole] = useState<Role>();
 * 
 *   usePermissionUpdates({
 *     organizationId,
 *     userId,
 *     onRoleChange: (newRole) => {
 *       setUserRole(newRole);
 *       // Optionally refresh UI or show notification
 *     },
 *   });
 * 
 *   return (
 *     <div>
 *       Current role: {userRole}
 *       {/* Rest of dashboard UI */}
 *     </div>
 *   );
 * }
 */
