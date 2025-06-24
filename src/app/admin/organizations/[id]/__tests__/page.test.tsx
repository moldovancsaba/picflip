import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useParams } from 'next/navigation';
import OrganizationDetailPage from '../page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock styled-components
jest.mock('styled-components', () => ({
  __esModule: true,
  default: (component: any) => component,
  css: () => '',
}));

// Mock components
jest.mock('@/components/admin/tokens', () => ({
  tokens: {
    spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
    colors: {
      primary: '#0070f3',
      secondary: '#374151',
      text: '#333333',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      background: '#ffffff',
      error: '#dc2626',
      success: '#10b981',
      focus: 'rgba(0, 112, 243, 0.2)',
    },
    typography: {
      fontSizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', '2xl': '1.5rem' },
      fontWeights: { medium: '500', semibold: '600', bold: '700' },
    },
    borderRadius: { base: '4px', lg: '8px' },
    transitions: { base: '0.2s ease' },
  },
}));

jest.mock('@/components/admin/DetailHeader', () => {
  return function MockDetailHeader({ title, metadata, actions }: any) {
    return (
      <div data-testid="detail-header">
        <h1>{title}</h1>
        <div data-testid="metadata">
          {metadata?.map((item: any, index: number) => (
            <div key={index}>{item.label}: {item.value}</div>
          ))}
        </div>
        <div data-testid="actions">
          {actions?.map((action: any, index: number) => (
            <button key={index} onClick={action.onClick}>{action.label}</button>
          ))}
        </div>
      </div>
    );
  };
});

jest.mock('@/components/admin/Breadcrumbs', () => {
  return function MockBreadcrumbs({ items }: any) {
    return (
      <nav data-testid="breadcrumbs">
        {items?.map((item: any, index: number) => (
          <span key={index}>{item.label}</span>
        ))}
      </nav>
    );
  };
});

jest.mock('@/components/admin/FormField', () => {
  return function MockFormField({ label, name, value, onChange, type, disabled, required }: any) {
    return (
      <div data-testid={`form-field-${name}`}>
        <label>{label}{required && ' *'}</label>
        {type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
          />
        ) : (
          <input
            name={name}
            type={type || 'text'}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
          />
        )}
      </div>
    );
  };
});

jest.mock('@/components/admin/Select', () => {
  return function MockSelect({ label, name, value, onChange, options, disabled }: any) {
    return (
      <div data-testid={`select-${name}`}>
        <label>{label}</label>
        <select
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
        >
          {options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

jest.mock('@/components/Loading', () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

// Mock global fetch
global.fetch = jest.fn();

const mockPush = jest.fn();
const mockParams = { id: 'org123' };

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  (useParams as jest.Mock).mockReturnValue(mockParams);
  (fetch as jest.Mock).mockClear();
  mockPush.mockClear();
});

const mockOrganizationData = {
  organization: {
    _id: 'org123',
    name: 'Test Organization',
    slug: 'test-org',
    description: 'A test organization',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    members: [
      {
        _id: 'member1',
        userId: 'user1',
        email: 'owner@test.com',
        userRole: 'user',
        membershipRole: 'owner',
        joinedAt: '2024-01-01T00:00:00.000Z',
        lastLoginAt: '2024-01-01T12:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        _id: 'member2',
        userId: 'user2',
        email: 'admin@test.com',
        userRole: 'user',
        membershipRole: 'admin',
        joinedAt: '2024-01-01T06:00:00.000Z',
        lastLoginAt: null,
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    ],
    projects: [
      {
        id: 'project1',
        name: 'Test Project',
        isPublic: true,
        contentUrl: 'https://example.com/project1',
      },
    ],
  },
};

describe('OrganizationDetailPage', () => {
  it('renders loading state initially', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<OrganizationDetailPage />);
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders organization details after loading', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockOrganizationData,
    });

    render(<OrganizationDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Organization')).toBeInTheDocument();
    });

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Members (2)')).toBeInTheDocument();
    expect(screen.getByText('Projects (1)')).toBeInTheDocument();
  });

  it('handles organization name update successfully', async () => {
    // Initial fetch
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockOrganizationData,
    });

    render(<OrganizationDetailPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Organization')).toBeInTheDocument();
    });

    // Update the name field
    const nameInput = screen.getByDisplayValue('Test Organization');
    fireEvent.change(nameInput, { target: { value: 'Updated Organization Name' } });

    // Mock successful update response
    const updatedOrgData = {
      ...mockOrganizationData,
      organization: {
        ...mockOrganizationData.organization,
        name: 'Updated Organization Name',
        updatedAt: '2024-01-03T00:00:00.000Z',
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => updatedOrgData,
    });

    // Click save button
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/admin/organizations/org123', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Updated Organization Name',
          description: 'A test organization',
        }),
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Organization updated successfully')).toBeInTheDocument();
    });
  });

  it('handles member role change successfully', async () => {
    // Initial fetch
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockOrganizationData,
    });

    render(<OrganizationDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Members (2)')).toBeInTheDocument();
    });

    // Switch to Members tab
    fireEvent.click(screen.getByText('Members (2)'));

    await waitFor(() => {
      expect(screen.getByText('admin@test.com')).toBeInTheDocument();
    });

    // Mock successful role change response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ message: 'User updated successfully' }),
    });

    // Mock refetch after role change
    const updatedMemberData = {
      ...mockOrganizationData,
      organization: {
        ...mockOrganizationData.organization,
        members: [
          mockOrganizationData.organization.members[0],
          {
            ...mockOrganizationData.organization.members[1],
            membershipRole: 'member',
          },
        ],
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => updatedMemberData,
    });

    // Find the role select for the admin member and change it
    const roleSelects = screen.getAllByRole('combobox');
    const adminRoleSelect = roleSelects.find(select => 
      (select as HTMLSelectElement).value === 'admin'
    );

    if (adminRoleSelect) {
      fireEvent.change(adminRoleSelect, { target: { value: 'member' } });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/admin/users/user2', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberships: [{
              organisationId: 'org123',
              role: 'member',
              action: 'add',
            }],
          }),
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Member role updated successfully')).toBeInTheDocument();
      });
    }
  });

  it('displays error when organization is not found', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    render(<OrganizationDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch organization details')).toBeInTheDocument();
    });
  });

  it('redirects to login on unauthorized access', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    render(<OrganizationDetailPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('displays all three tabs with correct content', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockOrganizationData,
    });

    render(<OrganizationDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Members (2)')).toBeInTheDocument();
      expect(screen.getByText('Projects (1)')).toBeInTheDocument();
    });

    // Test Overview tab (default)
    expect(screen.getByText('Total Members')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Member count
    expect(screen.getByText('1')).toBeInTheDocument(); // Project count

    // Switch to Members tab
    fireEvent.click(screen.getByText('Members (2)'));
    await waitFor(() => {
      expect(screen.getByText('Organization Members')).toBeInTheDocument();
      expect(screen.getByText('owner@test.com')).toBeInTheDocument();
      expect(screen.getByText('admin@test.com')).toBeInTheDocument();
    });

    // Switch to Projects tab
    fireEvent.click(screen.getByText('Projects (1)'));
    await waitFor(() => {
      expect(screen.getByText('Associated Projects')).toBeInTheDocument();
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('Public')).toBeInTheDocument();
    });
  });

  it('handles form validation errors', async () => {
    // Initial fetch
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockOrganizationData,
    });

    render(<OrganizationDetailPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Organization')).toBeInTheDocument();
    });

    // Clear the name field (make it invalid)
    const nameInput = screen.getByDisplayValue('Test Organization');
    fireEvent.change(nameInput, { target: { value: '' } });

    // Mock validation error response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        message: 'Validation error',
        errors: [{ field: 'name', message: 'Name is required' }],
      }),
    });

    // Click save button
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Validation error')).toBeInTheDocument();
    });
  });

  it('prevents removal of last owner', async () => {
    const singleOwnerData = {
      organization: {
        ...mockOrganizationData.organization,
        members: [
          {
            _id: 'member1',
            userId: 'user1',
            email: 'owner@test.com',
            userRole: 'user',
            membershipRole: 'owner',
            joinedAt: '2024-01-01T00:00:00.000Z',
            lastLoginAt: '2024-01-01T12:00:00.000Z',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => singleOwnerData,
    });

    render(<OrganizationDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Members (1)')).toBeInTheDocument();
    });

    // Switch to Members tab
    fireEvent.click(screen.getByText('Members (1)'));

    await waitFor(() => {
      expect(screen.getByText('owner@test.com')).toBeInTheDocument();
    });

    // Mock error response for trying to remove last owner
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        message: 'Cannot remove the last owner from an organisation',
      }),
    });

    // Try to remove the owner
    const removeButton = screen.getByText('Remove');
    
    // Mock window.confirm to return true
    window.confirm = jest.fn(() => true);
    
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText('Cannot remove the last owner from an organisation')).toBeInTheDocument();
    });
  });
});
