import { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled component for version display - keeping it simple and flexible
const VersionText = styled.span`
  font-size: inherit;
  color: inherit;
  opacity: 0.8;
`;

// Type for the version API response
interface VersionResponse {
  version: string;
}

/**
 * VersionLabel component
 * Fetches and displays the current application version
 * Handles loading and error states gracefully
 * Can be embedded anywhere in the application
 */
const VersionLabel = () => {
  const [version, setVersion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch('/api/version', {
          cache: 'no-store', // Ensures fresh version data on each mount
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch version');
        }

        const data: VersionResponse = await response.json();
        setVersion(data.version);
        setError(false);
      } catch (err) {
        console.error('Error fetching version:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVersion();
  }, []); // Run once on mount

  if (isLoading) {
    return <VersionText>Loading...</VersionText>;
  }

  if (error || !version) {
    return <VersionText>Picito (version unavailable)</VersionText>;
  }

  return <VersionText>Picito v{version}</VersionText>;
};

export default VersionLabel;
