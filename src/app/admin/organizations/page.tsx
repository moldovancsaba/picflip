'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { IOrganisation } from '@/models/Organisation';
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
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
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

const OrganizationsList = styled.div`
  display: grid;
  gap: 1rem;
`;

const OrganizationCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const OrganizationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const OrganizationName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const OrganizationSlug = styled.div`
  color: #666;
  font-size: 0.875rem;
  font-family: monospace;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
`;

const OrganizationDescription = styled.p`
  color: #666;
  margin: 0.5rem 0;
  line-height: 1.5;
`;

const OrganizationMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const DeleteButton = styled.button`
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #b91c1c;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
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

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
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
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
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

const ConfirmDeleteButton = styled(ConfirmButton)`
  background: #dc2626;
  
  &:hover {
    background: #b91c1c;
  }
`;

interface OrganizationFormData {
  name: string;
  description: string;
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<IOrganisation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<IOrganisation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    description: ''
  });
  
  const router = useRouter();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setError(null);
      const response = await fetch('/api/organisations?admin=true');
      
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }
      
      const data = await response.json();
      setOrganizations(data.organisations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/organisations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create organization');
      }

      const data = await response.json();
      setSuccess('Organization created successfully');
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      
      // Refresh the list
      await fetchOrganizations();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrganization = async () => {
    if (!organizationToDelete) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/organisations/${organizationToDelete._id}`, {
        method: 'DELETE',
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete organization');
      }

      setSuccess('Organization deleted successfully');
      setShowDeleteModal(false);
      setOrganizationToDelete(null);
      
      // Refresh the list
      await fetchOrganizations();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (organization: IOrganisation) => {
    setOrganizationToDelete(organization);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowDeleteModal(false);
    setOrganizationToDelete(null);
    setFormData({ name: '', description: '' });
    setError(null);
  };

  const formatTimestamp = (date: Date | string) => {
    const d = new Date(date);
    return d.toISOString();
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
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <OrganizationsList>
        {organizations.length === 0 ? (
          <div>No organizations found.</div>
        ) : (
          organizations.map((org) => (
            <OrganizationCard key={org._id}>
              <OrganizationHeader>
                <div>
                  <OrganizationName>{org.name}</OrganizationName>
                  <OrganizationSlug>/{org.slug}</OrganizationSlug>
                </div>
                <DeleteButton onClick={() => openDeleteModal(org)}>
                  Delete
                </DeleteButton>
              </OrganizationHeader>
              
              {org.description && (
                <OrganizationDescription>{org.description}</OrganizationDescription>
              )}
              
              <OrganizationMeta>
                <div><strong>Created:</strong> {formatTimestamp(org.createdAt)}</div>
                <div><strong>Updated:</strong> {formatTimestamp(org.updatedAt)}</div>
              </OrganizationMeta>
            </OrganizationCard>
          ))
        )}
      </OrganizationsList>

      {/* Create Organization Modal */}
      {showCreateModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && closeModals()}>
          <ModalContent>
            <ModalTitle>Create New Organization</ModalTitle>
            <form onSubmit={handleCreateOrganization}>
              <FormGroup>
                <Label htmlFor="name">Organization Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  minLength={2}
                  maxLength={100}
                  disabled={isSubmitting}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="description">Description</Label>
                <TextArea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={500}
                  disabled={isSubmitting}
                />
              </FormGroup>
              
              <ModalActions>
                <CancelButton type="button" onClick={closeModals} disabled={isSubmitting}>
                  Cancel
                </CancelButton>
                <ConfirmButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Organization'}
                </ConfirmButton>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && organizationToDelete && (
        <Modal onClick={(e) => e.target === e.currentTarget && closeModals()}>
          <ModalContent>
            <ModalTitle>Delete Organization</ModalTitle>
            <p>
              Are you sure you want to delete the organization <strong>"{organizationToDelete.name}"</strong>?
              This action cannot be undone and will also remove all associated memberships.
            </p>
            <ModalActions>
              <CancelButton onClick={closeModals} disabled={isSubmitting}>
                Cancel
              </CancelButton>
              <ConfirmDeleteButton onClick={handleDeleteOrganization} disabled={isSubmitting}>
                {isSubmitting ? 'Deleting...' : 'Delete Organization'}
              </ConfirmDeleteButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </OrganizationsContainer>
  );
}
