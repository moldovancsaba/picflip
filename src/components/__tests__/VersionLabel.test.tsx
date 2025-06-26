import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import VersionLabel from '../VersionLabel';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.Mock;

describe('VersionLabel', () => {
  beforeEach(() => {
    // Clear mock before each test
    mockFetch.mockClear();
  });

  it('should show loading state initially', () => {
    render(<VersionLabel />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display version when fetch succeeds', async () => {
    // Mock successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ version: '1.2.3' })
    });

    await act(async () => {
      render(<VersionLabel />);
    });

    // Wait for version to be displayed
    await waitFor(() => {
      expect(screen.getByText('Picito v1.2.3')).toBeInTheDocument();
    });

    // Verify fetch was called correctly
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/api/version', {
      cache: 'no-store'
    });
  });

  it('should show error message when fetch fails', async () => {
    // Mock failed response with 500 status
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    await act(async () => {
      render(<VersionLabel />);
    });

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Picito (version unavailable)')).toBeInTheDocument();
    });

    // Verify fetch was called
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('/api/version', {
      cache: 'no-store'
    });
  });
});
