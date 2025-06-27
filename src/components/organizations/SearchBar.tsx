'use client';

import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import debounce from 'lodash/debounce';

interface SearchResult {
  type: 'member' | 'project';
  _id: string;
  name?: string;
  email?: string;
  description?: string;
}

interface SearchBarProps {
  organizationId: string;
  onResultClick: (result: SearchResult) => void;
}

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1e293b;
  background: white;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ResultsContainer = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 10;
`;

const ResultItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }
`;

const ResultTitle = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const ResultDescription = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const ResultType = styled.span<{ type: SearchResult['type'] }>`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
  background: ${({ type }) => type === 'member' ? '#dbeafe' : '#dcfce7'};
  color: ${({ type }) => type === 'member' ? '#1e40af' : '#166534'};
`;

const NoResults = styled.div`
  padding: 1rem;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
`;

export default function SearchBar({ organizationId, onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/organizations/${organizationId}/search?q=${encodeURIComponent(searchQuery)}`
        );
        
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [organizationId]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  useEffect(() => {
    // Handle click outside to close results
    function handleClickOutside(event: MouseEvent) {
      if (
        event.target instanceof Element &&
        !event.target.closest('[data-search-container]')
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function handleResultClick(result: SearchResult) {
    onResultClick(result);
    setShowResults(false);
    setQuery('');
  }

  return (
    <SearchContainer data-search-container>
      <SearchIcon>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 14L11 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </SearchIcon>

      <SearchInput
        type="text"
        placeholder="Search members and projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowResults(true)}
      />

      {showResults && (query || isLoading) && (
        <ResultsContainer>
          {isLoading ? (
            <NoResults>Searching...</NoResults>
          ) : results.length > 0 ? (
            results.map((result) => (
              <ResultItem
                key={`${result.type}-${result._id}`}
                onClick={() => handleResultClick(result)}
              >
                <ResultTitle>
                  {result.type === 'member' ? result.email : result.name}
                  <ResultType type={result.type}>
                    {result.type}
                  </ResultType>
                </ResultTitle>
                {result.description && (
                  <ResultDescription>{result.description}</ResultDescription>
                )}
              </ResultItem>
            ))
          ) : (
            <NoResults>No results found</NoResults>
          )}
        </ResultsContainer>
      )}
    </SearchContainer>
  );
}
