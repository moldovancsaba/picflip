# Organizations Page Component Specifications

## Component Implementation Details

### 1. OrganizationsPage Component
**File**: `src/app/admin/organizations/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IOrganisation } from '@/models/Organisation';
import { OrganizationTable } from '@/components/OrganizationTable';
import { CreateOrganizationModal } from '@/components/CreateOrganizationModal';
import Loading from '@/components/Loading';

const OrganizationsContainer = styled.div`
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

const CreateButton = styled.button`
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

const ErrorMessage = styled.div`
  color: #dc2626;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

interface OrganizationWithMembers extends IOrganisation {
  memberCount: number;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationWithMembers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/organizations');
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      const data = await response.json();
      setOrganizations(data.organizations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrganization = async (organizationData: { name: string; slug?: string; description?: string }) => {
    try {
      const response = await fetch('/api/admin/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create organization');
      }

      const data = await response.json();
      setOrganizations(prev => [data.organization, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      throw err; // Let modal handle the error
    }
  };

  const handleDeleteOrganization = async (id: string) => {
    if (!confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/organizations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete organization');
      }

      setOrganizations(prev => prev.filter(org => org._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete organization');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <OrganizationsContainer>
      <Header>
        <Title>Organization Management</Title>
        <CreateButton onClick={() => setShowCreateModal(true)}>
          Create Organization
        </CreateButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <OrganizationTable
        organizations={organizations}
        onDeleteOrganization={handleDeleteOrganization}
      />

      {showCreateModal && (
        <CreateOrganizationModal
          onClose={() => setShowCreateModal(false)}
          onCreateOrganization={handleCreateOrganization}
        />
      )}
    </OrganizationsContainer>
  );
}
```

### 2. OrganizationTable Component
**File**: `src/components/OrganizationTable.tsx`

```typescript
'use client';

import styled from 'styled-components';
import { IOrganisation } from '@/models/Organisation';
import { OrganizationRow } from './OrganizationRow';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #6b7280;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

interface OrganizationWithMembers extends IOrganisation {
  memberCount: number;
}

interface OrganizationTableProps {
  organizations: OrganizationWithMembers[];
  onDeleteOrganization: (id: string) => Promise<void>;
}

export function OrganizationTable({ organizations, onDeleteOrganization }: OrganizationTableProps) {
  if (organizations.length === 0) {
    return (
      <EmptyState>
        <h3>No organizations found</h3>
        <p>Create your first organization to get started.</p>
      </EmptyState>
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Slug</Th>
          <Th>Members</Th>
          <Th>Created At</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {organizations.map((organization) => (
          <OrganizationRow
            key={organization._id}
            organization={organization}
            onDelete={onDeleteOrganization}
          />
        ))}
      </tbody>
    </Table>
  );
}
```

### 3. OrganizationRow Component
**File**: `src/components/OrganizationRow.tsx`

```typescript
'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { IOrganisation } from '@/models/Organisation';

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
`;

const ActionCell = styled(Td)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  &.danger {
    color: #dc2626;
    border-color: #fca5a5;
    
    &:hover {
      background: #fef2f2;
      border-color: #f87171;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionLink = styled(Link)`
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const DateCell = styled(Td)`
  white-space: nowrap;
`;

interface OrganizationWithMembers extends IOrganisation {
  memberCount: number;
}

interface OrganizationRowProps {
  organization: OrganizationWithMembers;
  onDelete: (id: string) => Promise<void>;
}

export function OrganizationRow({ organization, onDelete }: OrganizationRowProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(organization._id!);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toISOString().slice(0, -1) + '.000Z';
  };

  return (
    <tr>
      <Td>
        <strong>{organization.name}</strong>
        {organization.description && (
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
            {organization.description}
          </div>
        )}
      </Td>
      <Td>
        <code style={{ background: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>
          {organization.slug}
        </code>
      </Td>
      <Td>{organization.memberCount}</Td>
      <DateCell>{formatDate(organization.createdAt)}</DateCell>
      <ActionCell>
        <ActionLink href={`/admin/organizations/${organization._id}`}>
          Open Members
        </ActionLink>
        <ActionButton
          className="danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </ActionButton>
      </ActionCell>
    </tr>
  );
}
```

### 4. CreateOrganizationModal Component
**File**: `src/components/CreateOrganizationModal.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { generateSlug } from '@/models/Organisation';

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
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #374151;
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
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
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

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
  }
`;

const HelpText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ErrorText = styled.div`
  font-size: 0.875rem;
  color: #dc2626;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background-color: #0070f3;
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background-color: #0051cc;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background-color: white;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background-color: #f9fafb;
    }
  }
`;

interface CreateOrganizationModalProps {
  onClose: () => void;
  onCreateOrganization: (data: { name: string; slug?: string; description?: string }) => Promise<void>;
}

export function CreateOrganizationModal({ onClose, onCreateOrganization }: CreateOrganizationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManuallyEdited && formData.name) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.name)
      }));
    }
  }, [formData.name, slugManuallyEdited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const submitData: { name: string; slug?: string; description?: string } = {
        name: formData.name.trim(),
      };

      if (formData.slug.trim()) {
        submitData.slug = formData.slug.trim();
      }

      if (formData.description.trim()) {
        submitData.description = formData.description.trim();
      }

      await onCreateOrganization(submitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'slug') {
      setSlugManuallyEdited(true);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Modal onClick={handleBackdropClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create Organization</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        {error && <ErrorText>{error}</ErrorText>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Organization Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              maxLength={100}
              placeholder="e.g., Acme Corporation"
            />
            <HelpText>2-100 characters</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              maxLength={50}
              pattern="^[a-z0-9-]+$"
              placeholder="auto-generated from name"
            />
            <HelpText>
              URL-friendly identifier (lowercase letters, numbers, hyphens only). 
              Leave empty to auto-generate from name.
            </HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              maxLength={500}
              placeholder="Optional description of the organization"
            />
            <HelpText>Up to 500 characters</HelpText>
          </FormGroup>

          <ButtonGroup>
            <Button type="button" className="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="primary" 
              disabled={!formData.name.trim() || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Organization'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </Modal>
  );
}
```

## Loading States Integration

The shared `Loading` component is used for:
- Initial page load
- The modal shows inline loading during creation
- Row actions show loading state in buttons

## Data Flow Summary

1. **Page Load**: `OrganizationsPage` fetches data from `/api/admin/organizations`
2. **Display**: `OrganizationTable` renders the data using `OrganizationRow` components
3. **Create**: Modal form submits to API and updates local state
4. **Delete**: Row action calls API and removes from local state
5. **Navigation**: "Open Members" links to future detail page

## Error Handling

- API errors are displayed as error banners
- Form validation prevents invalid submissions
- Network errors include retry functionality
- User feedback for all actions (loading states, success messages)

This component hierarchy maintains consistency with existing admin patterns while providing a complete organization management interface.
