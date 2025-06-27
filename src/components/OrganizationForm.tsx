'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { OrganizationFormData } from '@/lib/types';

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
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
`;

const Input = styled.input`
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
  
  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
  
  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const CancelButton = styled(Button)`
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  
  &:hover:not(:disabled) {
    background: #e5e7eb;
  }
`;

const SubmitButton = styled(Button)`
  background: #0070f3;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background: #0051cc;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const CharacterCount = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
  text-align: right;
  margin-top: 0.25rem;
`;

interface OrganizationFormProps {
  initialData?: OrganizationFormData;
  onSubmit: (data: OrganizationFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  title?: string;
}

export default function OrganizationForm({
  initialData = { name: '', description: '' },
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = 'Create Organization',
  title = 'Create New Organization'
}: OrganizationFormProps) {
  const [formData, setFormData] = useState<OrganizationFormData>(initialData);
  const [errors, setErrors] = useState<Partial<OrganizationFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<OrganizationFormData> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Organization name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Organization name cannot exceed 100 characters';
    }

    // Validate description (optional but has constraints if provided)
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim()
      });
    } catch (error) {
      // Error handling is managed by parent component
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="org-name">Organization Name *</Label>
        <Input
          id="org-name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          disabled={isSubmitting}
          placeholder="Enter organization name"
          maxLength={100}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'org-name-error' : undefined}
        />
        {errors.name && (
          <ErrorMessage id="org-name-error" role="alert">
            {errors.name}
          </ErrorMessage>
        )}
        <CharacterCount>
          {formData.name.length}/100 characters
        </CharacterCount>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="org-description">Description</Label>
        <TextArea
          id="org-description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          disabled={isSubmitting}
          placeholder="Enter organization description (optional)"
          maxLength={500}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'org-description-error' : undefined}
        />
        {errors.description && (
          <ErrorMessage id="org-description-error" role="alert">
            {errors.description}
          </ErrorMessage>
        )}
        <CharacterCount>
          {formData.description.length}/500 characters
        </CharacterCount>
      </FormGroup>

      <ButtonGroup>
        <CancelButton 
          type="button" 
          onClick={onCancel} 
          disabled={isSubmitting}
        >
          Cancel
        </CancelButton>
        <SubmitButton 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? `${submitButtonText.includes('Create') ? 'Creating' : 'Saving'}...` : submitButtonText}
        </SubmitButton>
      </ButtonGroup>
    </Form>
  );
}
