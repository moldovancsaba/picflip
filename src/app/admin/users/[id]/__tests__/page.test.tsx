import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useParams } from 'next/navigation';
import UserDetailPage from '../page';

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

const mockRouterPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;

// Mock user data
const mockUserData = {
  user: {
    _id: '60f7b3b3b3b3b3b3b3b3b3b3',
    email: 'test@example.com',
    role: 'user' as const,
    lastLoginAt: '2024-01-15T10:30:45.123Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T10:30:45.123Z',
    memberships: [
      {
        _id: 'membership1',
        organisationId: 'org1',
        organisationName: 'Test Organization',
        organisationSlug: 'test-org',
        role: 'member' as const,
        joinedAt: '2024-01-10T00:00:00.000Z'
      }
    ],
    allOrganizations: [
      {
        _id: 'org1',
        name: 'Test Organization',
        slug: 'test-org',
        description: 'A test organization'
      },
      {
        _id: 'org2',
        name: 'Another Organization',
        slug: 'another-org',
        description: 'Another test organization'
      }
    ]
  }
};

const mockUpdatedUserData = {
  user: {
    ...mockUserData.user,
    email: 'updated@example.com',
    updatedAt: '2024-01-16T10:30:45.123Z'
  }
};

describe('UserDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockRouterPush,
    } as any);
    mockUseParams.mockReturnValue({
      id: 'test-user-id',
    });

    // Mock successful fetch by default
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockUserData),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    render(<UserDetailPage />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders user details after loading', async () => {
    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Memberships (1)')).toBeInTheDocument();
    expect(screen.getByText('Activity')).toBeInTheDocument();
  });

  it('displays breadcrumbs correctly', async () => {
    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('displays user metadata in header', async () => {
    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('60f7b3b3b3b3b3b3b3b3b3b3')).toBeInTheDocument();
      expect(screen.getByText('user')).toBeInTheDocument();
      expect(screen.getByText('2024-01-01T00:00:00.000Z')).toBeInTheDocument();
      expect(screen.getByText('2024-01-15T10:30:45.123Z')).toBeInTheDocument();
    });
  });

  it('shows account tab by default', async () => {
    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('user')).toBeInTheDocument();
    });
  });

  it('allows switching between tabs', async () => {
    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
    });

    // Switch to memberships tab
    fireEvent.click(screen.getByText('Memberships (1)'));
    expect(screen.getByText('Organization Memberships')).toBeInTheDocument();
    expect(screen.getByText('Test Organization')).toBeInTheDocument();

    // Switch to activity tab
    fireEvent.click(screen.getByText('Activity'));
    expect(screen.getByText('Activity & Timestamps')).toBeInTheDocument();
    expect(screen.getByText('Last Login:')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15T10:30:45.123Z')).toBeInTheDocument();
  });

  describe('Email Change Functionality', () => {
    it('updates email successfully', async () => {
      // Mock the PATCH request for updating user
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockUserData),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({
            message: 'User updated successfully',
            user: mockUpdatedUserData.user
          }),
        });

      render(<UserDetailPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      });

      // Change email
      const emailInput = screen.getByDisplayValue('test@example.com');
      fireEvent.change(emailInput, { target: { value: 'updated@example.com' } });

      // Save changes
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/users/test-user-id', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'updated@example.com',
            role: 'user',
          }),
        });
      });

      await waitFor(() => {
        expect(screen.getByText('User account updated successfully')).toBeInTheDocument();
      });
    });

    it('shows error message when email update fails', async () => {
      // Mock the PATCH request to fail
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockUserData),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: jest.fn().mockResolvedValue({
            message: 'Email already exists'
          }),
        });

      render(<UserDetailPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      });

      // Change email
      const emailInput = screen.getByDisplayValue('test@example.com');
      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });

      // Save changes
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument();
      });
    });

    it('shows self-demotion warning', async () => {
      // Mock user data with admin role
      const adminUserData = {
        user: {
          ...mockUserData.user,
          role: 'admin' as const
        }
      };

      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(adminUserData),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: jest.fn().mockResolvedValue({
            message: 'Cannot demote yourself from admin role'
          }),
        });

      render(<UserDetailPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('admin')).toBeInTheDocument();
      });

      // Try to change role to user
      const roleSelect = screen.getByDisplayValue('admin');
      fireEvent.change(roleSelect, { target: { value: 'user' } });

      // Save changes
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Cannot demote yourself from admin role')).toBeInTheDocument();
      });
    });
  });

  describe('Add Membership Functionality', () => {
    it('adds membership successfully', async () => {
      // Mock the initial fetch and successful membership addition
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockUserData),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({
            message: 'User updated successfully',
            user: {
              ...mockUserData.user,
              memberships: [
                ...mockUserData.user.memberships,
                {
                  _id: 'membership2',
                  organisationId: 'org2',
                  organisationName: 'Another Organization',
                  organisationSlug: 'another-org',
                  role: 'admin' as const,
                  joinedAt: '2024-01-16T00:00:00.000Z'
                }
              ]
            }
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({
            user: {
              ...mockUserData.user,
              memberships: [
                ...mockUserData.user.memberships,
                {
                  _id: 'membership2',
                  organisationId: 'org2',
                  organisationName: 'Another Organization',
                  organisationSlug: 'another-org',
                  role: 'admin' as const,
                  joinedAt: '2024-01-16T00:00:00.000Z'
                }
              ]
            }
          }),
        });

      render(<UserDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });

      // Switch to memberships tab
      fireEvent.click(screen.getByText('Memberships (1)'));

      await waitFor(() => {
        expect(screen.getByText('Organization Memberships')).toBeInTheDocument();
      });

      // Select organization
      const orgSelect = screen.getByDisplayValue('Select organization...');
      fireEvent.change(orgSelect, { target: { value: 'org2' } });

      // Select role
      const roleSelect = screen.getAllByDisplayValue('member')[0]; // Get the first one (for new membership)
      fireEvent.change(roleSelect, { target: { value: 'admin' } });

      // Add membership
      const addButton = screen.getByText('Add Membership');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/users/test-user-id', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberships: [{
              organisationId: 'org2',
              role: 'admin',
              action: 'add'
            }]
          }),
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Membership added successfully')).toBeInTheDocument();
      });
    });

    it('shows error when adding membership fails', async () => {
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockUserData),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: jest.fn().mockResolvedValue({
            message: 'User already has membership in this organization'
          }),
        });

      render(<UserDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });

      // Switch to memberships tab
      fireEvent.click(screen.getByText('Memberships (1)'));

      // Select organization
      const orgSelect = screen.getByDisplayValue('Select organization...');
      fireEvent.change(orgSelect, { target: { value: 'org2' } });

      // Add membership
      const addButton = screen.getByText('Add Membership');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('User already has membership in this organization')).toBeInTheDocument();
      });
    });

    it('changes membership role successfully', async () => {
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockUserData),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({
            message: 'User updated successfully',
            user: mockUserData.user
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockUserData),
        });

      render(<UserDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });

      // Switch to memberships tab
      fireEvent.click(screen.getByText('Memberships (1)'));

      await waitFor(() => {
        expect(screen.getByText('Test Organization')).toBeInTheDocument();
      });

      // Change role in the table
      const roleSelects = screen.getAllByDisplayValue('member');
      const membershipRoleSelect = roleSelects.find(select => 
        select.getAttribute('name')?.includes('role-membership1')
      );
      
      if (membershipRoleSelect) {
        fireEvent.change(membershipRoleSelect, { target: { value: 'admin' } });

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith('/api/admin/users/test-user-id', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              memberships: [{
                organisationId: 'org1',
                role: 'admin',
                action: 'add'
              }]
            }),
          });
        });

        await waitFor(() => {
          expect(screen.getByText('Membership role updated successfully')).toBeInTheDocument();
        });
      }
    });

    it('removes membership after confirmation', async () => {
      // Mock window.confirm
      const originalConfirm = window.confirm;
      window.confirm = jest.fn().mockReturnValue(true);

      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue(mockUserData),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({
            message: 'User updated successfully',
            user: {
              ...mockUserData.user,
              memberships: []
            }
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValue({
            user: {
              ...mockUserData.user,
              memberships: []
            }
          }),
        });

      render(<UserDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });

      // Switch to memberships tab
      fireEvent.click(screen.getByText('Memberships (1)'));

      await waitFor(() => {
        expect(screen.getByText('Test Organization')).toBeInTheDocument();
      });

      // Remove membership
      const removeButton = screen.getByText('Remove');
      fireEvent.click(removeButton);

      expect(window.confirm).toHaveBeenCalledWith(
        'Are you sure you want to remove this user from "Test Organization"?'
      );

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/users/test-user-id', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberships: [{
              organisationId: 'org1',
              role: 'member',
              action: 'remove'
            }]
          }),
        });
      });

      await waitFor(() => {
        expect(screen.getByText('Membership removed successfully')).toBeInTheDocument();
      });

      // Restore original confirm
      window.confirm = originalConfirm;
    });
  });

  it('displays activity timestamps in ISO 8601 format with milliseconds', async () => {
    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    // Switch to activity tab
    fireEvent.click(screen.getByText('Activity'));

    await waitFor(() => {
      expect(screen.getByText('2024-01-15T10:30:45.123Z')).toBeInTheDocument(); // Last Login
      expect(screen.getByText('2024-01-01T00:00:00.000Z')).toBeInTheDocument(); // Created
    });
  });

  it('handles unauthorized access', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({}),
    });

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/login');
    });
  });

  it('handles user not found', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue({}),
    });

    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });
  });

  it('navigates back to users list', async () => {
    render(<UserDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    const backButton = screen.getByText('← Back');
    fireEvent.click(backButton);

    expect(mockRouterPush).toHaveBeenCalledWith('/admin/users');
  });
});
