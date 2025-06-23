"use client";

import { useSettings } from '@/lib/settings-context';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
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

export default function AdminPage() {
  const { settings, updateSettings } = useSettings();
  const router = useRouter();
  const [formData, setFormData] = useState(settings);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsDirty(false);
    router.push('/');
  };

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  return (
    <Container>
      <h1>PicFlip Admin Settings</h1>
      <Form onSubmit={handleSubmit}>
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

        <Button type="submit" disabled={!isDirty}>
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}
