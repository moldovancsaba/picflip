"use client";

import { useSettings } from '@/lib/settings-context';
import { IframeConfig, Organization } from '@/lib/types';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Loading from '@/components/Loading';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;
`;

const ConfigList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
`;

const ConfigItem = styled.button<{ $active: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${props => props.$active ? '#0070f3' : 'white'};
  color: ${props => props.$active ? 'white' : 'black'};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  font-size: 1rem;

  &:hover {
    background: ${props => props.$active ? '#0051cc' : '#f0f0f0'};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0051cc;
  }
`;

const SizeInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input {
    width: 100px;
  }

  span {
    font-size: 1.2rem;
  }
`;

const AlignmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  width: fit-content;
`;

const AlignmentButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem;
  border: 1px solid #ccc;
  background-color: ${props => props.$active ? '#0070f3' : 'white'};
  color: ${props => props.$active ? 'white' : 'black'};
  cursor: pointer;
  border-radius: 4px;
  min-width: 80px;

  &:hover {
    background-color: ${props => props.$active ? '#0051cc' : '#f5f5f5'};
  }
`;

const NewConfigButton = styled(Button)`
  width: 100%;
  margin-top: auto;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: #333;
`;

const ModalLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const ConfirmButton = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
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


interface ProjectFormData {
  id: string;
  name: string;
}

export default function AdminPage() {
  const { settings, configs, getConfig, updateConfig, createConfig, deleteConfig, isLoading } = useSettings();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<IframeConfig | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    id: '',
    name: ''
  });
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  
  useEffect(() => {
    fetchOrganizations();
  }, []);
  
  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organisations?admin=true');
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.organisations);
      }
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !selectedId) return;
    
    updateConfig(selectedId, formData);
    setIsDirty(false);
    router.push(`/iframe/${selectedId}`);
  };

  const handleChange = (field: keyof IframeConfig, value: string | number | null) => {
    if (!formData) return;
    setFormData(prev => ({ ...prev!, [field]: value }));
    setIsDirty(true);
  };

  const handleSelect = (id: string) => {
    const config = getConfig(id);
    if (!config) return;
    
    setSelectedId(id);
    setFormData(config);
    setIsDirty(false);
  };

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const id = projectFormData.id.toLowerCase().replace(/\s+/g, '_');
      
      const newConfig: IframeConfig = {
        id,
        name: projectFormData.name,
        contentUrl: '',
        originalWidth: 1920,
        originalHeight: 1080,
        aspectRatioX: 16,
        aspectRatioY: 9,
        backgroundColor: '#000000',
        backgroundImageUrl: '',
        horizontalAlignment: 'center',
        verticalAlignment: 'middle',
        isPublic: false // Default to private for security
      };

      createConfig(newConfig);
      setSelectedId(id);
      setFormData(newConfig);
      setIsDirty(true);
      setShowCreateModal(false);
      setProjectFormData({ id: '', name: '' });
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setProjectFormData({ id: '', name: '' });
  };

  const handleDelete = () => {
    if (!selectedId || !confirm('Are you sure you want to delete this project?')) return;
    
    deleteConfig(selectedId);
    setSelectedId(null);
    setFormData(null);
    setIsDirty(false);
  };

  return (
    <Container>
      <h1 style={{ margin: '0 0 2rem 0', color: '#333' }}>Project Management</h1>
      <Grid>
        <ConfigList>
          {Object.values(configs).map(config => (
            <ConfigItem
              key={config.id}
              onClick={() => handleSelect(config.id)}
              $active={selectedId === config.id}
            >
              {config.name}
            </ConfigItem>
          ))}
          <NewConfigButton type="button" onClick={handleCreate}>
            + Add New Project
          </NewConfigButton>
        </ConfigList>

        {formData ? (
          <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            placeholder="e.g., AS Roma Live Stream, Company Presentation"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="slug">Project Slug</Label>
          <Input
            id="slug"
            type="text"
            value={formData.slug || ''}
            onChange={(e) => handleChange('slug', e.target.value)}
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
            value={formData.contentUrl}
            onChange={(e) => handleChange('contentUrl', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Original Content Size</Label>
          <SizeInput>
            <Input
              type="number"
              value={formData.originalWidth}
              onChange={(e) => handleChange('originalWidth', parseInt(e.target.value))}
              required
              min="1"
            />
            <span>×</span>
            <Input
              type="number"
              value={formData.originalHeight}
              onChange={(e) => handleChange('originalHeight', parseInt(e.target.value))}
              required
              min="1"
            />
          </SizeInput>
        </FormGroup>

        <FormGroup>
          <Label>Aspect Ratio</Label>
          <SizeInput>
            <Input
              type="number"
              value={formData.aspectRatioX}
              onChange={(e) => handleChange('aspectRatioX', parseInt(e.target.value))}
              required
              min="1"
            />
            <span>:</span>
            <Input
              type="number"
              value={formData.aspectRatioY}
              onChange={(e) => handleChange('aspectRatioY', parseInt(e.target.value))}
              required
              min="1"
            />
          </SizeInput>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <SizeInput>
            <Input
              id="backgroundColor"
              type="color"
              value={formData.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              required
            />
            <Input
              type="text"
              value={formData.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              pattern="^#[0-9A-Fa-f]{6}$"
              required
            />
          </SizeInput>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="backgroundImageUrl">Background Image URL</Label>
          <Input
            id="backgroundImageUrl"
            type="url"
            value={formData.backgroundImageUrl}
            onChange={(e) => handleChange('backgroundImageUrl', e.target.value)}
            placeholder="Leave empty for solid background color"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="organisationId">Organization Assignment</Label>
          <select
id="organizationId"
value={formData.organizationId || ''}
onChange={(e) => handleChange('organizationId', e.target.value || null)}
            style={{
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
              width: '100%',
              background: 'white'
            }}
          >
            <option value="">Personal Project</option>
            {organizations.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </select>
          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
            Select an organization to assign this project, or keep it as a personal project
          </div>
        </FormGroup>

        <FormGroup>
          <Label>Horizontal Alignment</Label>
          <AlignmentGrid>
            <AlignmentButton
              type="button"
              onClick={() => handleChange('horizontalAlignment', 'left')}
              $active={formData.horizontalAlignment === 'left'}
            >
              Left
            </AlignmentButton>
            <AlignmentButton
              type="button"
              onClick={() => handleChange('horizontalAlignment', 'center')}
              $active={formData.horizontalAlignment === 'center'}
            >
              Center
            </AlignmentButton>
            <AlignmentButton
              type="button"
              onClick={() => handleChange('horizontalAlignment', 'right')}
              $active={formData.horizontalAlignment === 'right'}
            >
              Right
            </AlignmentButton>
          </AlignmentGrid>
        </FormGroup>

        <FormGroup>
          <Label>Vertical Alignment</Label>
          <AlignmentGrid>
            <AlignmentButton
              type="button"
              onClick={() => handleChange('verticalAlignment', 'top')}
              $active={formData.verticalAlignment === 'top'}
            >
              Top
            </AlignmentButton>
            <AlignmentButton
              type="button"
              onClick={() => handleChange('verticalAlignment', 'middle')}
              $active={formData.verticalAlignment === 'middle'}
            >
              Middle
            </AlignmentButton>
            <AlignmentButton
              type="button"
              onClick={() => handleChange('verticalAlignment', 'bottom')}
              $active={formData.verticalAlignment === 'bottom'}
            >
              Bottom
            </AlignmentButton>
          </AlignmentGrid>
        </FormGroup>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button type="submit" disabled={!isDirty}>
            Save Changes
          </Button>
          <Button type="button" onClick={handleDelete} style={{ backgroundColor: '#dc3545' }}>
            Delete Project
          </Button>
        </div>
      </Form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Select a project to edit or create a new one
          </div>
        )}
      </Grid>

      {/* Create Project Modal */}
      {showCreateModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <ModalContent>
            <ModalTitle>Create New Project</ModalTitle>
            <form onSubmit={handleCreateProject}>
              <FormGroup>
                <ModalLabel htmlFor="project-id">Project ID *</ModalLabel>
                <ModalInput
                  id="project-id"
                  type="text"
                  value={projectFormData.id}
                  onChange={(e) => setProjectFormData({ ...projectFormData, id: e.target.value })}
                  required
                  placeholder="e.g., asroma, juventus, company-demo"
                  pattern="[a-zA-Z0-9_-]+"
                  title="Only letters, numbers, underscores, and hyphens allowed"
                  disabled={isSubmitting}
                />
              </FormGroup>
              
              <FormGroup>
                <ModalLabel htmlFor="project-name">Project Name *</ModalLabel>
                <ModalInput
                  id="project-name"
                  type="text"
                  value={projectFormData.name}
                  onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
                  required
                  placeholder="e.g., AS Roma Live Stream, Company Presentation"
                  minLength={2}
                  maxLength={100}
                  disabled={isSubmitting}
                />
              </FormGroup>
              
              <ModalActions>
                <CancelButton type="button" onClick={closeModal} disabled={isSubmitting}>
                  Cancel
                </CancelButton>
                <ConfirmButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </ConfirmButton>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}
