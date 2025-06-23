"use client";

import { useSettings } from '@/lib/settings-context';
import { IframeConfig } from '@/lib/types';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

export default function AdminPage() {
  const { settings, configs, getConfig, updateConfig, createConfig, deleteConfig, isLoading } = useSettings();

  if (isLoading) {
    return <Loading />;
  }
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<IframeConfig | null>(null);
  const [isDirty, setIsDirty] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !selectedId) return;
    
    updateConfig(selectedId, formData);
    setIsDirty(false);
    router.push(`/iframe/${selectedId}`);
  };

  const handleChange = (field: keyof IframeConfig, value: string | number) => {
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
    const rawId = prompt('Enter a unique ID for the new configuration (e.g., "asroma", "juventus"):');
    if (!rawId) return;
    
    const configName = prompt('Enter a display name for the configuration (e.g., "AS Roma", "Juventus"):');
    if (!configName) return;
    
    const id = rawId.toLowerCase().replace(/\s+/g, '_');
    
    const newConfig: IframeConfig = {
      id,
      name: configName,
      contentUrl: '',
      originalWidth: 1920,
      originalHeight: 1080,
      aspectRatioX: 16,
      aspectRatioY: 9,
      backgroundColor: '#FFFFFF',
      backgroundImageUrl: '',
      horizontalAlignment: 'center',
      verticalAlignment: 'middle',
    };

    createConfig(newConfig);
    setSelectedId(id);
    setFormData(newConfig);
    setIsDirty(true);
  };

  const handleDelete = () => {
    if (!selectedId || !confirm('Are you sure you want to delete this configuration?')) return;
    
    deleteConfig(selectedId);
    setSelectedId(null);
    setFormData(null);
    setIsDirty(false);
  };

  return (
    <Container>
      <h1>Picito Admin Settings</h1>
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
            + Add New Configuration
          </NewConfigButton>
        </ConfigList>

        {formData ? (
          <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Configuration Name</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
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
            Delete Configuration
          </Button>
        </div>
      </Form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Select a configuration to edit or create a new one
          </div>
        )}
      </Grid>
    </Container>
  );
}
