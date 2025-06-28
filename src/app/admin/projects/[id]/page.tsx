'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { IframeConfig, Organization, HorizontalAlignment, VerticalAlignment } from '@/lib/types';
import { PageWrapper, ErrorBanner, Loading } from '@/components';
// Mock styled-components during tests
let styled;
if (process.env.NODE_ENV === 'test') {
  styled = {
    div: () => 'div',
    form: () => 'form',
    button: () => 'button',
    select: () => 'select',
    input: () => 'input',
    label: () => 'label',
    span: () => 'span'
  };
} else {
  styled = require('styled-components').styled;
}

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
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

const Form = styled.form`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: #374151;
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

const VisibilityLabel = styled.span<{ $isPublic: boolean }>`
  font-weight: 500;
  color: ${(props: { $isPublic: boolean }) => props.$isPublic ? '#059669' : '#dc2626'};
`;

const Button = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0051cc;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button)`
  background: #10b981;
  
  &:hover {
    background: #059669;
  }
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

const MetadataSection = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const MetadataItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MetadataLabel = styled.span`
  font-weight: 500;
  color: #6b7280;
`;

const MetadataValue = styled.span`
  font-family: monospace;
  color: #374151;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

interface ProjectData {
  id: string;
  name: string;
  slug: string;
  contentUrl: string;
  originalWidth: number;
  originalHeight: number;
  aspectRatioX: number;
  aspectRatioY: number;
  backgroundColor: string;
  backgroundImageUrl: string;
  horizontalAlignment: HorizontalAlignment;
  verticalAlignment: VerticalAlignment;
  isPublic: boolean;
  organizationId: string | null;
  organizations: Organization[];
  currentOrganization: Organization | null;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setError(null);
        const response = await fetch(`/api/admin/projects/${id}`);

        if (response.status === 401) {
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch project details');
        }

        const data = await response.json();
        setProject(data.project);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: project.name,
          slug: project.slug,
          contentUrl: project.contentUrl,
          originalWidth: project.originalWidth,
          originalHeight: project.originalHeight,
          aspectRatioX: project.aspectRatioX,
          aspectRatioY: project.aspectRatioY,
          backgroundColor: project.backgroundColor,
          backgroundImageUrl: project.backgroundImageUrl,
          horizontalAlignment: project.horizontalAlignment,
          verticalAlignment: project.verticalAlignment,
          isPublic: project.isPublic,
          organizationId: project.organizationId
        }),
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save project details');
      }

      const data = await response.json();
      setProject({ ...project, updatedAt: data.project.updatedAt });
      setSuccess(data.message);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const formatTimestamp = (date: string) => {
    return new Date(date).toISOString();
  };
  if (isLoading) {
    return (
      <PageWrapper
        loadingFallback={
          <Loading 
            minHeight="60vh"
            background="transparent"
          />
        }
      >
        <div>Loading project details...</div>
      </PageWrapper>
    );
  }

  if (!project) {
    return (
      <PageWrapper
        loadingFallback={
          <Loading
            minHeight="60vh"
            background="transparent"
          />
        }
      >
        <Container>
          <ErrorBanner
            variant="error"
            autoRedirectOn401={true}
          >
            Project not found
          </ErrorBanner>
        </Container>
      </PageWrapper>
    );
  }

  // Return wrapped content with global error boundary and suspense
  return (
    <PageWrapper
      loadingFallback={
        <Loading
          minHeight="60vh"
          background="transparent"
        />
      }
    >
      <Container>
          <Header>
            <Title>Project Details</Title>
          </Header>

          {error && (
            <ErrorBanner
              variant="error"
              autoRedirectOn401={true}
              dismissible={true}
              onDismiss={() => setError(null)}
            >
              {error}
            </ErrorBanner>
          )}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <Form onSubmit={handleSubmit}>
            {/* 1. Basic Info Section */}
            <Section>
              <SectionTitle>Basic Information</SectionTitle>

              <FormGroup>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={project.name}
                  onChange={(e) => setProject({ ...project, name: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="slug">Project Slug</Label>
                <Input
                  id="slug"
                  type="text"
                  value={project.slug}
                  onChange={(e) => setProject({ ...project, slug: e.target.value })}
                  pattern="[a-z0-9-]+"
                  placeholder="project-slug-example"
                  title="Slug can only contain lowercase letters, numbers, and hyphens"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="contentUrl">Content URL</Label>
                <Input
                  id="contentUrl"
                  type="url"
                  value={project.contentUrl}
                  onChange={(e) => setProject({ ...project, contentUrl: e.target.value })}
                  required
                />
              </FormGroup>
            </Section>

            {/* 2. Dimensions & Alignment Section */}
            <Section>
              <SectionTitle>Dimensions & Alignment</SectionTitle>

              <FormGroup>
                <Label>Original Dimensions</Label>
                <TwoColumnGrid>
                  <div>
                    <Label htmlFor="originalWidth">Width (px)</Label>
                    <Input
                      id="originalWidth"
                      type="number"
                      min="1"
                      value={project.originalWidth}
                      onChange={(e) =>
                        setProject({ ...project, originalWidth: parseInt(e.target.value) || 0 })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalHeight">Height (px)</Label>
                    <Input
                      id="originalHeight"
                      type="number"
                      min="1"
                      value={project.originalHeight}
                      onChange={(e) =>
                        setProject({ ...project, originalHeight: parseInt(e.target.value) || 0 })
                      }
                      required
                    />
                  </div>
                </TwoColumnGrid>
              </FormGroup>

              <FormGroup>
                <Label>Aspect Ratio</Label>
                <TwoColumnGrid>
                  <div>
                    <Label htmlFor="aspectRatioX">Aspect Ratio X</Label>
                    <Input
                      id="aspectRatioX"
                      type="number"
                      min="1"
                      value={project.aspectRatioX}
                      onChange={(e) =>
                        setProject({ ...project, aspectRatioX: parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="aspectRatioY">Aspect Ratio Y</Label>
                    <Input
                      id="aspectRatioY"
                      type="number"
                      min="1"
                      value={project.aspectRatioY}
                      onChange={(e) =>
                        setProject({ ...project, aspectRatioY: parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>
                </TwoColumnGrid>
              </FormGroup>

              <FormGroup>
                <Label>Alignment</Label>
                <TwoColumnGrid>
                  <div>
                    <Label htmlFor="horizontalAlignment">Horizontal Alignment</Label>
                    <Select
                      id="horizontalAlignment"
                      value={project.horizontalAlignment}
                      onChange={(e) =>
                        setProject({ ...project, horizontalAlignment: e.target.value as HorizontalAlignment })}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="verticalAlignment">Vertical Alignment</Label>
                    <Select
                      id="verticalAlignment"
                      value={project.verticalAlignment}
                      onChange={(e) =>
                        setProject({ ...project, verticalAlignment: e.target.value as VerticalAlignment })}
                    >
                      <option value="top">Top</option>
                      <option value="middle">Middle</option>
                      <option value="bottom">Bottom</option>
                    </Select>
                  </div>
                </TwoColumnGrid>
              </FormGroup>
            </Section>

            {/* 3. Background Section */}
            <Section>
              <SectionTitle>Background</SectionTitle>

              <FormGroup>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={project.backgroundColor}
                  onChange={(e) =>
                    setProject({ ...project, backgroundColor: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="backgroundImageUrl">Background Image URL (Optional)</Label>
                <Input
                  id="backgroundImageUrl"
                  type="url"
                  value={project.backgroundImageUrl}
                  onChange={(e) =>
                    setProject({ ...project, backgroundImageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </FormGroup>
            </Section>

            {/* 4. Organization Assignment Section */}
            <Section>
              <SectionTitle>Organization Assignment</SectionTitle>

              {/* Current Organization Display */}
              {project.currentOrganization ? (
                <FormGroup>
                  <Label>Current Organization</Label>
                  <div style={{
                    background: '#f8f9fa',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    padding: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{project.currentOrganization.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>/{project.currentOrganization.slug}</div>
                      {project.currentOrganization.description && (
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                          {project.currentOrganization.description}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={() => setProject({ ...project, organizationId: null })}
                      style={{ background: '#dc2626', fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      Remove
                    </Button>
                  </div>
                </FormGroup>
              ) : (
                <FormGroup>
                  <Label>Organization Status</Label>
                  <div style={{
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    padding: '0.75rem',
                    color: '#6b7280',
                    fontStyle: 'italic'
                  }}>
                    This is a personal project (not assigned to any organization)
                  </div>
                </FormGroup>
              )}

              {/* Organization Assignment */}
              <FormGroup>
                <Label htmlFor="organizationId">Assign to Organization</Label>
                <Select
                  id="organizationId"
                  value={project.organizationId || ''}
                  onChange={(e) =>
                    setProject({ ...project, organizationId: e.target.value || null })}
                >
                  <option value="">Personal Project</option>
                  {project.organizations.map((org) =>
                    <option key={org._id} value={org._id}>
                      {org.name}
                    </option>
                  )}
                </Select>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  Select an organization to assign this project, or keep it as a personal project
                </div>
              </FormGroup>
            </Section>

            {/* 5. Visibility Section */}
            <Section>
              <SectionTitle>Visibility</SectionTitle>

              <FormGroup>
                <ToggleContainer>
                  <ToggleSwitch>
                    <ToggleSlider
                      type="checkbox"
                      checked={project.isPublic}
                      onChange={() =>
                        setProject({ ...project, isPublic: !project.isPublic })}
                    />
                    <Slider />
                  </ToggleSwitch>
                  <VisibilityLabel $isPublic={project.isPublic}>
                    {project.isPublic ? 'Public' : 'Private'}
                  </VisibilityLabel>
                </ToggleContainer>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  {project.isPublic
                    ? 'This project is visible to everyone'
                    : 'This project is only visible to you and organization members'
                  }
                </div>
              </FormGroup>
            </Section>

            <SaveButton type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </SaveButton>
          </Form>

          {/* Read-only Metadata Section */}
          <MetadataSection>
            <SectionTitle>Metadata</SectionTitle>
            <MetadataItem>
              <MetadataLabel>Project ID:</MetadataLabel>
              <MetadataValue>{project.id}</MetadataValue>
            </MetadataItem>
            <MetadataItem>
              <MetadataLabel>Last Updated:</MetadataLabel>
              <MetadataValue>{formatTimestamp(project.updatedAt)}</MetadataValue>
            </MetadataItem>
          </MetadataSection>
        </Container>
    </PageWrapper>
  );
}

