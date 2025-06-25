import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { type Role } from '@/lib/permissions/constants';
import { usePermission } from '@/hooks/usePermissionUpdates';
import { PERMISSIONS } from '@/lib/permissions/constants';

interface Project {
  _id: string;
  name: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectListProps {
  organizationId: string;
  userRole: Role;
}

const ListContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const CreateButton = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0051a8;
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
`;

const ProjectCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const ProjectDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const ProjectMeta = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VisibilityTag = styled.span<{ isPublic: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${({ isPublic }) => isPublic ? '#dcfce7' : '#fee2e2'};
  color: ${({ isPublic }) => isPublic ? '#166534' : '#991b1b'};
`;

const ViewButton = styled.a`
  display: inline-block;
  background: none;
  border: 1px solid #e2e8f0;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

export default function ProjectList({ organizationId, userRole }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canCreateProject = usePermission({
    userRole,
    requiredPermission: PERMISSIONS.CREATE_PROJECT,
  });

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(`/api/organizations/${organizationId}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [organizationId]);

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ListContainer>
      <Header>
        <Title>Organization Projects</Title>
        {canCreateProject && (
          <CreateButton>Create Project</CreateButton>
        )}
      </Header>

      <ProjectGrid>
        {projects.map(project => (
          <ProjectCard key={project._id}>
            <ProjectName>{project.name}</ProjectName>
            <ProjectDescription>
              {project.description}
            </ProjectDescription>
            <ProjectMeta>
              <VisibilityTag isPublic={project.isPublic}>
                {project.isPublic ? 'Public' : 'Private'}
              </VisibilityTag>
              <ViewButton href={`/projects/${project._id}`}>
                View Project
              </ViewButton>
            </ProjectMeta>
          </ProjectCard>
        ))}
        {projects.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748b' }}>
            No projects found. {canCreateProject && 'Create your first project!'}
          </div>
        )}
      </ProjectGrid>
    </ListContainer>
  );
}
