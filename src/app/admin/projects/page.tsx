'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { IframeConfig, Organization } from '@/lib/types';
import Loading from '@/components/Loading';

const ProjectsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const EditOrgButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: 0.5rem;
  
  &:hover {
    background: #059669;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ProjectsList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ProjectCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ProjectName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const ProjectId = styled.div`
  color: #666;
  font-size: 0.875rem;
  font-family: monospace;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
`;

const ProjectUrl = styled.div`
  color: #666;
  margin: 0.5rem 0;
  line-height: 1.5;
  word-break: break-all;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  align-items: center;
  flex-wrap: wrap;
`;

const OrganizationSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const OrganizationSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const AssignButton = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0051cc;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const OrganizationTag = styled.span`
  background: #e0f2fe;
  color: #0277bd;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #b3e5fc;
`;

const VisibilityToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
`;

const ToggleSlider = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #0070f3;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const VisibilityLabel = styled.span<{ isPublic: boolean }>`
  font-weight: 500;
  color: ${props => props.isPublic ? '#059669' : '#dc2626'};
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: #059669;
  padding: 1rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const StatsCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
`;

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<IframeConfig[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<IframeConfig | null>(null);
  const [assigningOrg, setAssigningOrg] = useState(false);
  const [updatingVisibility, setUpdatingVisibility] = useState<Set<string>>(new Set());
  const [updatingOrganization, setUpdatingOrganization] = useState<Set<string>>(new Set());
  const [selectedOrganizations, setSelectedOrganizations] = useState<Record<string, string>>({});
  
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
    fetchOrganizations();
  }, []);

  const fetchProjects = async () => {
    try {
      setError(null);
      const response = await fetch('/api/settings');
      
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      const projectsArray = Object.values(data.configs || {}) as IframeConfig[];
      setProjects(projectsArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations?admin=true');
      
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      
      const data = await response.json();
      setOrganizations(data.organizations);
    } catch (err) {
      console.error('Error fetching organizations:', err);
      // Don't show error for organizations fetching as it's not critical
    }
  };

  const toggleVisibility = async (projectId: string, currentVisibility: boolean) => {
    setUpdatingVisibility(prev => new Set(prev).add(projectId));
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/settings/${projectId}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic: !currentVisibility }),
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update visibility');
      }

      const data = await response.json();
      setSuccess(`Project "${data.project.name}" visibility updated to ${data.project.isPublic ? 'public' : 'private'}`);
      
      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, isPublic: !currentVisibility }
          : project
      ));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update visibility');
    } finally {
      setUpdatingVisibility(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const assignToOrganization = async (projectId: string, organizationId: string | null) => {
    setUpdatingOrganization(prev => new Set(prev).add(projectId));
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/settings/${projectId}/organization`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId: organizationId }),
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update organization assignment');
      }

      const data = await response.json();
      setSuccess(data.message);
      
      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, organizationId: organizationId || undefined }
          : project
      ));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update organization assignment');
    } finally {
      setUpdatingOrganization(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const getOrganizationName = (organizationId: string | undefined) => {
    if (!organizationId) return null;
    const org = organizations.find(o => o._id === organizationId);
    return org?.name || 'Unknown Organization';
  };

  const formatTimestamp = (date: Date | string) => {
    const d = new Date(date);
    return d.toISOString();
  };

  if (isLoading) {
    return <Loading />;
  }

  const publicProjectsCount = projects.filter(p => p.isPublic).length;
  const privateProjectsCount = projects.filter(p => !p.isPublic).length;

  return (
    <ProjectsContainer>
      <Header>
        <Title>Project Management</Title>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <StatsCard>
        <StatsGrid>
          <StatItem>
            <StatValue>{projects.length}</StatValue>
            <StatLabel>Total Projects</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{publicProjectsCount}</StatValue>
            <StatLabel>Public Projects</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{privateProjectsCount}</StatValue>
            <StatLabel>Private Projects</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsCard>

      <ProjectsList>
        {projects.length === 0 ? (
          <div>No projects found.</div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectHeader>
                <div>
                  <ProjectName>{project.name}</ProjectName>
                  <ProjectId>{project.id}</ProjectId>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <VisibilityToggle>
                    <VisibilityLabel isPublic={project.isPublic}>
                      {project.isPublic ? 'Public' : 'Private'}
                    </VisibilityLabel>
                    <ToggleSwitch>
                      <ToggleSlider
                        type="checkbox"
                        checked={project.isPublic}
                        onChange={() => toggleVisibility(project.id, project.isPublic)}
                        disabled={updatingVisibility.has(project.id)}
                      />
                      <Slider />
                    </ToggleSwitch>
                  </VisibilityToggle>
                  <EditOrgButton onClick={() => router.push(`/admin/projects/${project.id}`)}>
                    View Details
                  </EditOrgButton>
                </div>
              </ProjectHeader>
              
              <ProjectUrl>
                <strong>Content URL:</strong> {project.contentUrl}
              </ProjectUrl>
              
              <ProjectMeta>
                <div><strong>Dimensions:</strong> {project.originalWidth} × {project.originalHeight}</div>
                <div><strong>Aspect Ratio:</strong> {project.aspectRatioX}:{project.aspectRatioY}</div>
                <div><strong>Background:</strong> {project.backgroundColor}</div>
                <div><strong>Alignment:</strong> {project.horizontalAlignment} / {project.verticalAlignment}</div>
              </ProjectMeta>
              
              <OrganizationSection>
                <div>
                  <strong>Organization:</strong>
                  {project.organizationId ? (
                    <OrganizationTag style={{ marginLeft: '0.5rem' }}>
                      {getOrganizationName(project.organizationId)}
                    </OrganizationTag>
                  ) : (
                    <span style={{ marginLeft: '0.5rem', color: '#666', fontStyle: 'italic' }}>Personal Project</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <OrganizationSelect
                    value={selectedOrganizations[project.id] ?? (project.organizationId || '')}
                    onChange={(e) => setSelectedOrganizations(prev => ({
                      ...prev,
                      [project.id]: e.target.value
                    }))}
                    disabled={updatingOrganization.has(project.id)}
                  >
                    <option value="">Personal Project</option>
                    {organizations.map((org) => (
                      <option key={org._id} value={org._id}>
                        {org.name}
                      </option>
                    ))}
                  </OrganizationSelect>
                  <AssignButton
                    onClick={() => {
                      const newOrgId = selectedOrganizations[project.id] ?? (project.organizationId || '');
                      assignToOrganization(project.id, newOrgId || null);
                    }}
                    disabled={updatingOrganization.has(project.id) || 
                      (selectedOrganizations[project.id] ?? (project.organizationId || '')) === (project.organizationId || '')}
                  >
                    {updatingOrganization.has(project.id) ? 'Updating...' : 'Assign'}
                  </AssignButton>
                </div>
              </OrganizationSection>
            </ProjectCard>
          ))
        )}
      </ProjectsList>
    </ProjectsContainer>
  );
}
