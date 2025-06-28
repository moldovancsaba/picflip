import { NextRequest } from 'next/server';
import { GET, PATCH } from '../route';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import OrganizationMembership from '@/models/OrganizationMembership';
import Organization from '@/models/Organization';

// Mock dependencies
jest.mock('jose', () => ({
  SignJWT: jest.fn(),
  jwtVerify: jest.fn()
}));
jest.mock('@/lib/auth');
jest.mock('@/lib/db');
jest.mock('@/models/User', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  }
}));
jest.mock('@/models/OrganizationMembership'
  __esModule: true,
  default: {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    deleteOne: jest.fn(),
  }
}));
jest.mock('@/models/Organisation', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
  }
}));

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockOrganizationMembership = OrganizationMembership as jest.Mocked<typeof OrganizationMembership>;
const mockOrganization = Organization as jest.Mocked<typeof Organization>;

describe('/api/admin/users/[id]', () => {
  const mockUserId = 'user-123';
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  describe('GET', () => {
    it('should return user data with memberships for admin user', async () => {
      // Mock admin session
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      // Mock user data
      const mockUserData = {
        _id: mockUserId,
        email: 'testuser@test.com',
        role: 'user',
        lastLoginAt: new Date('2025-01-01T10:00:00.000Z'),
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
        termsAcceptedAt: new Date('2025-01-01T00:00:00.000Z'),
        privacyAcceptedAt: new Date('2025-01-01T00:00:00.000Z')
      };

      User.findById = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUserData)
      });

      // Mock memberships
      const mockMemberships = [
        {
          _id: 'mem-1',
          organizationId: {
            _id: 'org-1',
            name: 'Organization 1',
            slug: 'org-1',
            description: 'Org 1 description'
          },
          role: 'owner',
          joinedAt: new Date('2025-01-01T00:00:00.000Z')
        },
        {
          _id: 'mem-2',
          organizationId: {
            _id: 'org-2',
            name: 'Organization 2',
            slug: 'org-2',
            description: 'Org 2 description'
          },
          role: 'member',
          joinedAt: new Date('2025-01-01T12:00:00.000Z')
        }
      ];

      OrganizationMembership.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockMemberships)
      });

      // Mock all organizations
      const mockAllOrgs = [
        { _id: 'org-1', name: 'Organization 1', slug: 'org-1', description: 'Org 1 description' },
        { _id: 'org-2', name: 'Organization 2', slug: 'org-2', description: 'Org 2 description' },
        { _id: 'org-3', name: 'Organization 3', slug: 'org-3', description: 'Org 3 description' }
      ];

      Organization.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockAllOrgs)
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users/user-123');
      const params = Promise.resolve({ id: mockUserId });

      const response = await GET(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.user).toBeDefined();
      expect(responseData.user._id).toBe(mockUserId);
      expect(responseData.user.email).toBe('testuser@test.com');
      expect(responseData.user.memberships).toHaveLength(2);
      expect(responseData.user.allOrganizations).toHaveLength(3);
    });

    it('should return 401 for non-admin user', async () => {
      mockGetSession.mockResolvedValue({
        email: 'user@test.com',
        role: 'user'
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users/user-123');
      const params = Promise.resolve({ id: mockUserId });

      const response = await GET(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.message).toBe('Unauthorized');
    });

    it('should return 404 for non-existent user', async () => {
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      User.findById = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users/non-existent');
      const params = Promise.resolve({ id: 'non-existent' });

      const response = await GET(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.message).toBe('User not found');
    });
  });

  describe('PATCH', () => {
    it('should update user successfully for admin user', async () => {
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      const mockUser = {
        _id: mockUserId,
        email: 'testuser@test.com',
        role: 'user',
        lastLoginAt: new Date('2025-01-01T10:00:00.000Z'),
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
        termsAcceptedAt: new Date('2025-01-01T00:00:00.000Z'),
        privacyAcceptedAt: new Date('2025-01-01T00:00:00.000Z')
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(undefined);

      // Mock updated user data
      User.findById = jest.fn()
        .mockResolvedValueOnce(mockUser) // First call for validation
        .mockReturnValueOnce({
          lean: jest.fn().mockResolvedValue({
            ...mockUser,
            role: 'admin'
          })
        }); // Second call for response

      // Mock memberships
      OrganizationMembership.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      });

      const updateData = {
        role: 'admin'
      };

      const request = new NextRequest('http://localhost:3000/api/admin/users/user-123', {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });
      const params = Promise.resolve({ id: mockUserId });

      const response = await PATCH(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.message).toBe('User updated successfully');
    });

    it('should prevent self-demotion from admin role', async () => {
      const mockAdminUser = {
        _id: mockUserId,
        email: 'admin@test.com',
        role: 'admin'
      };

      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      User.findById = jest.fn().mockResolvedValue(mockAdminUser);

      const updateData = {
        role: 'user'
      };

      const request = new NextRequest('http://localhost:3000/api/admin/users/user-123', {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });
      const params = Promise.resolve({ id: mockUserId });

      const response = await PATCH(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.message).toBe('Cannot demote yourself from admin role');
    });

    it('should handle membership management', async () => {
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      const mockUser = {
        _id: mockUserId,
        email: 'testuser@test.com',
        role: 'user',
        lastLoginAt: new Date('2025-01-01T10:00:00.000Z'),
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
        termsAcceptedAt: new Date('2025-01-01T00:00:00.000Z'),
        privacyAcceptedAt: new Date('2025-01-01T00:00:00.000Z')
      };

      User.findById = jest.fn()
        .mockResolvedValueOnce(mockUser) // First call for validation
        .mockReturnValueOnce({
          lean: jest.fn().mockResolvedValue(mockUser)
        }); // Second call for response

      // Mock organization exists
      Organization.findById = jest.fn().mockResolvedValue({
        _id: 'org-123',
        name: 'Test Org'
      });

      // Mock no existing membership
      OrganizationMembership.findOne = jest.fn().mockResolvedValue(null);
      OrganizationMembership.create = jest.fn().mockResolvedValue(undefined);

      // Mock memberships for response
      OrganizationMembership.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      });

      const updateData = {
        memberships: [
          {
            organizationId: 'org-123',
            role: 'member',
            action: 'add'
          }
        ]
      };

      const request = new NextRequest('http://localhost:3000/api/admin/users/user-123', {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });
      const params = Promise.resolve({ id: mockUserId });

      const response = await PATCH(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.message).toBe('User updated successfully');
      expect(OrganizationMembership.create).toHaveBeenCalledWith({
        userId: mockUserId,
        organizationId: 'org-123',
        role: 'member'
      });
    });

    it('should return 401 for non-admin user', async () => {
      mockGetSession.mockResolvedValue({
        email: 'user@test.com',
        role: 'user'
      });

      const request = new NextRequest('http://localhost:3000/api/admin/users/user-123', {
        method: 'PATCH',
        body: JSON.stringify({ role: 'admin' })
      });
      const params = Promise.resolve({ id: mockUserId });

      const response = await PATCH(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.message).toBe('Unauthorized');
    });

    it('should return 400 for invalid input data', async () => {
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      const invalidData = {
        email: 'invalid-email', // Invalid email format
        role: 'invalid-role' // Invalid role
      };

      const request = new NextRequest('http://localhost:3000/api/admin/users/user-123', {
        method: 'PATCH',
        body: JSON.stringify(invalidData)
      });
      const params = Promise.resolve({ id: mockUserId });

      const response = await PATCH(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.message).toBe('Invalid request data');
      expect(responseData.errors).toBeDefined();
    });

    it('should return 404 for non-existent user', async () => {
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      User.findById = jest.fn().mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/admin/users/non-existent', {
        method: 'PATCH',
        body: JSON.stringify({ role: 'admin' })
      });
      const params = Promise.resolve({ id: 'non-existent' });

      const response = await PATCH(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.message).toBe('User not found');
    });
  });
});
