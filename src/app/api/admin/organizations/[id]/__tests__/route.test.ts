import { NextRequest } from 'next/server';
import { GET, PATCH } from '../route';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Organisation from '@/models/Organisation';
import OrganisationMembership from '@/models/OrganisationMembership';
import Settings from '@/models/Settings';

// Mock dependencies
jest.mock('jose', () => ({
  SignJWT: jest.fn(),
  jwtVerify: jest.fn()
}));
jest.mock('@/lib/auth');
jest.mock('@/lib/db');
jest.mock('@/models/Organisation');
jest.mock('@/models/OrganisationMembership');
jest.mock('@/models/Settings');

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>;
const mockDbConnect = dbConnect as jest.MockedFunction<typeof dbConnect>;
const mockOrganisation = Organisation as jest.Mocked<typeof Organisation>;
const mockOrganisationMembership = OrganisationMembership as jest.Mocked<typeof OrganisationMembership>;
const mockSettings = Settings as jest.Mocked<typeof Settings>;

describe('/api/admin/organizations/[id]', () => {
  const mockOrgId = 'org-123';
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  describe('GET', () => {
    it('should return organization data with members and projects for admin user', async () => {
      // Mock admin session
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      // Mock organization data
      const mockOrg = {
        _id: mockOrgId,
        name: 'Test Organization',
        slug: 'test-organization',
        description: 'Test description',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z')
      };

      Organisation.findById = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockOrg)
      });

      // Mock memberships
      const mockMemberships = [
        {
          _id: 'mem-1',
          userId: {
            _id: 'user-1',
            email: 'owner@test.com',
            role: 'user',
            lastLoginAt: new Date('2025-01-01T10:00:00.000Z'),
            createdAt: new Date('2025-01-01T00:00:00.000Z')
          },
          role: 'owner',
          joinedAt: new Date('2025-01-01T00:00:00.000Z')
        },
        {
          _id: 'mem-2',
          userId: {
            _id: 'user-2',
            email: 'member@test.com',
            role: 'user',
            lastLoginAt: null,
            createdAt: new Date('2025-01-01T00:00:00.000Z')
          },
          role: 'member',
          joinedAt: new Date('2025-01-01T12:00:00.000Z')
        }
      ];

      OrganisationMembership.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockMemberships)
      });

      // Mock projects
      const mockSettings = {
        configs: new Map([
          ['project-1', { name: 'Project 1', isPublic: true, contentUrl: 'https://example.com/1', organisationId: mockOrgId }],
          ['project-2', { name: 'Project 2', isPublic: false, contentUrl: 'https://example.com/2', organisationId: mockOrgId }],
          ['project-3', { name: 'Project 3', isPublic: true, contentUrl: 'https://example.com/3', organisationId: 'other-org' }]
        ])
      };

      Settings.findOne = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSettings)
      });

      const request = new NextRequest('http://localhost:3000/api/admin/organizations/org-123');
      const params = Promise.resolve({ id: mockOrgId });

      const response = await GET(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.organization).toBeDefined();
      expect(responseData.organization._id).toBe(mockOrgId);
      expect(responseData.organization.name).toBe('Test Organization');
      expect(responseData.organization.members).toHaveLength(2);
      expect(responseData.organization.projects).toHaveLength(2);
      expect(responseData.organization.projects[0].name).toBe('Project 1');
      expect(responseData.organization.projects[1].name).toBe('Project 2');
    });

    it('should return 401 for non-admin user', async () => {
      mockGetSession.mockResolvedValue({
        email: 'user@test.com',
        role: 'user'
      });

      const request = new NextRequest('http://localhost:3000/api/admin/organizations/org-123');
      const params = Promise.resolve({ id: mockOrgId });

      const response = await GET(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.message).toBe('Unauthorized');
    });

    it('should return 404 for non-existent organization', async () => {
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      Organisation.findById = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      const request = new NextRequest('http://localhost:3000/api/admin/organizations/non-existent');
      const params = Promise.resolve({ id: 'non-existent' });

      const response = await GET(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.message).toBe('Organisation not found');
    });
  });

  describe('PATCH', () => {
    it('should update organization successfully for admin user', async () => {
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      const mockUpdatedOrg = {
        _id: mockOrgId,
        name: 'Updated Organization',
        slug: 'updated-organization',
        description: 'Updated description',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z')
      };

      Organisation.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedOrg);

      // Mock memberships for response
      OrganisationMembership.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      });

      // Mock settings for projects
      Settings.findOne = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({ configs: new Map() })
      });

      const updateData = {
        name: 'Updated Organization',
        description: 'Updated description'
      };

      const request = new NextRequest('http://localhost:3000/api/admin/organizations/org-123', {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });
      const params = Promise.resolve({ id: mockOrgId });

      const response = await PATCH(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.message).toBe('Organisation updated successfully');
      expect(responseData.organization.name).toBe('Updated Organization');
      expect(responseData.organization.description).toBe('Updated description');
    });

    it('should return 401 for non-admin user', async () => {
      mockGetSession.mockResolvedValue({
        email: 'user@test.com',
        role: 'user'
      });

      const request = new NextRequest('http://localhost:3000/api/admin/organizations/org-123', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'New Name' })
      });
      const params = Promise.resolve({ id: mockOrgId });

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
        name: 'A', // Too short
        description: 'A'.repeat(501) // Too long
      };

      const request = new NextRequest('http://localhost:3000/api/admin/organizations/org-123', {
        method: 'PATCH',
        body: JSON.stringify(invalidData)
      });
      const params = Promise.resolve({ id: mockOrgId });

      const response = await PATCH(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.message).toBe('Invalid request data');
      expect(responseData.errors).toBeDefined();
    });

    it('should return 404 for non-existent organization', async () => {
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      Organisation.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/admin/organizations/non-existent', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'New Name' })
      });
      const params = Promise.resolve({ id: 'non-existent' });

      const response = await PATCH(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.message).toBe('Organisation not found');
    });
  });
});
