import { NextRequest } from 'next/server';
import { GET, PATCH } from '../route';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import Organisation from '@/models/Organisation';

// Mock dependencies
jest.mock('jose', () => ({
  SignJWT: jest.fn(),
  jwtVerify: jest.fn()
}));
jest.mock('@/lib/auth');
jest.mock('@/lib/db');
jest.mock('@/models/Settings', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    create: jest.fn(),
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

describe('/api/admin/projects/[id]', () => {
  const mockProjectId = 'project-123';
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockDbConnect.mockResolvedValue(undefined);
  });

  describe('GET', () => {
    it('should return project data for admin user', async () => {
      // Mock admin session
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      // Mock project data
      const mockConfig = {
        name: 'Test Project',
        contentUrl: 'https://example.com',
        originalWidth: 1920,
        originalHeight: 1080,
        aspectRatioX: 16,
        aspectRatioY: 9,
        backgroundColor: '#ffffff',
        backgroundImageUrl: '',
        horizontalAlignment: 'center',
        verticalAlignment: 'middle',
        isPublic: false,
        organisationId: 'org-123'
      };

      const mockSettings = {
        configs: new Map([[mockProjectId, mockConfig]])
      };

      Settings.findOne = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSettings)
      });

      const mockOrganisations = [
        { _id: 'org-1', name: 'Org 1', slug: 'org-1', description: 'Description 1' },
        { _id: 'org-2', name: 'Org 2', slug: 'org-2', description: 'Description 2' }
      ];

      Organisation.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockOrganisations)
      });

      const mockCurrentOrg = { _id: 'org-123', name: 'Current Org', slug: 'current-org', description: 'Current Description' };
      Organisation.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockCurrentOrg)
      });

      const request = new NextRequest('http://localhost:3000/api/admin/projects/project-123');
      const params = Promise.resolve({ id: mockProjectId });

      const response = await GET(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.project).toBeDefined();
      expect(responseData.project.id).toBe(mockProjectId);
      expect(responseData.project.name).toBe('Test Project');
      expect(responseData.project.organisations).toEqual(mockOrganisations);
      expect(responseData.project.currentOrganisation).toEqual(mockCurrentOrg);
    });

    it('should return 401 for non-admin user', async () => {
      mockGetSession.mockResolvedValue({
        email: 'user@test.com',
        role: 'user'
      });

      const request = new NextRequest('http://localhost:3000/api/admin/projects/project-123');
      const params = Promise.resolve({ id: mockProjectId });

      const response = await GET(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.message).toBe('Unauthorized');
    });

    it('should return 401 for unauthenticated user', async () => {
      mockGetSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/admin/projects/project-123');
      const params = Promise.resolve({ id: mockProjectId });

      const response = await GET(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.message).toBe('Unauthorized');
    });

    it('should return 404 for non-existent project', async () => {
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      Settings.findOne = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue({
          configs: new Map()
        })
      });

      const request = new NextRequest('http://localhost:3000/api/admin/projects/non-existent');
      const params = Promise.resolve({ id: 'non-existent' });

      const response = await GET(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.message).toBe('Project not found');
    });
  });

  describe('PATCH', () => {
    it('should update project successfully for admin user', async () => {
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      const mockConfig = {
        name: 'Test Project',
        contentUrl: 'https://example.com',
        originalWidth: 1920,
        originalHeight: 1080,
        aspectRatioX: 16,
        aspectRatioY: 9,
        backgroundColor: '#ffffff',
        backgroundImageUrl: '',
        horizontalAlignment: 'center',
        verticalAlignment: 'middle',
        isPublic: false,
        organisationId: null
      };

      const mockSettings = {
        configs: new Map([[mockProjectId, mockConfig]]),
        markModified: jest.fn(),
        save: jest.fn().mockResolvedValue(undefined)
      };

      Settings.findOne = jest.fn().mockResolvedValue(mockSettings);

      const updateData = {
        name: 'Updated Project Name',
        isPublic: true
      };

      const request = new NextRequest('http://localhost:3000/api/admin/projects/project-123', {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });
      const params = Promise.resolve({ id: mockProjectId });

      const response = await PATCH(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.message).toBe('Project updated successfully');
      expect(responseData.project.name).toBe('Updated Project Name');
      expect(responseData.project.isPublic).toBe(true);
    });

    it('should return 401 for non-admin user', async () => {
      mockGetSession.mockResolvedValue({
        email: 'user@test.com',
        role: 'user'
      });

      const request = new NextRequest('http://localhost:3000/api/admin/projects/project-123', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'New Name' })
      });
      const params = Promise.resolve({ id: mockProjectId });

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
        name: '', // Empty name should be invalid
        originalWidth: -100 // Negative width should be invalid
      };

      const request = new NextRequest('http://localhost:3000/api/admin/projects/project-123', {
        method: 'PATCH',
        body: JSON.stringify(invalidData)
      });
      const params = Promise.resolve({ id: mockProjectId });

      const response = await PATCH(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.message).toBe('Invalid request data');
      expect(responseData.errors).toBeDefined();
    });

    it('should return 404 for non-existent project', async () => {
      mockGetSession.mockResolvedValue({
        email: 'admin@test.com',
        role: 'admin'
      });

      Settings.findOne = jest.fn().mockResolvedValue({
        configs: new Map()
      });

      const request = new NextRequest('http://localhost:3000/api/admin/projects/non-existent', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'New Name' })
      });
      const params = Promise.resolve({ id: 'non-existent' });

      const response = await PATCH(request, { params });
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.message).toBe('Project not found');
    });
  });
});
