import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { type Role } from '@/lib/permissions/constants';

interface Activity {
  _id: string;
  type: 'member_added' | 'member_removed' | 'project_created' | 'project_updated' | 'role_changed';
  userId: string;
  userEmail: string;
  details: Record<string, any>;
  timestamp: string;
}

interface ActivityFeedProps {
  organizationId: string;
  userRole: Role;
}

const FeedContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const ActivityList = styled.div`
  padding: 1rem 0;
`;

const ActivityItem = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.span`
  font-weight: 500;
  color: #1e293b;
`;

const Timestamp = styled.span`
  font-size: 0.875rem;
  color: #64748b;
`;

const ActivityContent = styled.div`
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
`;

const ActivityTag = styled.span<{ type: Activity['type'] }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
  background: ${({ type }) => {
    switch (type) {
      case 'member_added':
      case 'project_created':
        return '#dcfce7';
      case 'member_removed':
        return '#fee2e2';
      case 'project_updated':
        return '#dbeafe';
      case 'role_changed':
        return '#fef3c7';
      default:
        return '#f3f4f6';
    }
  }};
  color: ${({ type }) => {
    switch (type) {
      case 'member_added':
      case 'project_created':
        return '#166534';
      case 'member_removed':
        return '#991b1b';
      case 'project_updated':
        return '#1e40af';
      case 'role_changed':
        return '#92400e';
      default:
        return '#4b5563';
    }
  }};
`;

function formatActivityContent(activity: Activity): string {
  switch (activity.type) {
    case 'member_added':
      return `added ${activity.details.addedEmail} to the organization`;
    case 'member_removed':
      return `removed ${activity.details.removedEmail} from the organization`;
    case 'project_created':
      return `created project "${activity.details.projectName}"`;
    case 'project_updated':
      return `updated project "${activity.details.projectName}"`;
    case 'role_changed':
      return `changed ${activity.details.targetEmail}'s role from ${activity.details.oldRole} to ${activity.details.newRole}`;
    default:
      return 'performed an action';
  }
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export default function ActivityFeed({ organizationId }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch(`/api/organizations/${organizationId}/activities`);
        if (!response.ok) throw new Error('Failed to fetch activities');
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchActivities();

    // Set up polling for new activities
    const pollInterval = setInterval(fetchActivities, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [organizationId]);

  if (isLoading) return <div>Loading activities...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <FeedContainer>
      <Header>
        <Title>Recent Activity</Title>
      </Header>

      <ActivityList>
        {activities.map(activity => (
          <ActivityItem key={activity._id}>
            <ActivityHeader>
              <div>
                <UserEmail>{activity.userEmail}</UserEmail>
                <ActivityTag type={activity.type}>
                  {activity.type.replace('_', ' ')}
                </ActivityTag>
              </div>
              <Timestamp>{formatTimestamp(activity.timestamp)}</Timestamp>
            </ActivityHeader>
            <ActivityContent>
              {formatActivityContent(activity)}
            </ActivityContent>
          </ActivityItem>
        ))}
        {activities.length === 0 && (
          <div style={{ padding: '1rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
            No recent activity
          </div>
        )}
      </ActivityList>
    </FeedContainer>
  );
}
