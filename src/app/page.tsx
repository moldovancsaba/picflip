"use client";

import { useSettings } from '@/lib/settings-context';
import styled from 'styled-components';
import Link from 'next/link';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const Card = styled(Link)`
  display: block;
  padding: 1.5rem;
  background: white;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0070f3;
    transform: translateY(-2px);
  }

  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }
`;

export default function Home() {
  const { settings, configs } = useSettings();

  return (
    <Container>
      <h1>Picito - Responsive iFrame Viewer</h1>
      <p>
        Welcome to Picito! Select an iframe configuration below or visit the{' '}
        <Link href="/admin" style={{ color: '#0070f3' }}>admin page</Link> to manage configurations
        or check out our{' '}
        <Link href="/docs/guide" style={{ color: '#0070f3' }}>technical guide</Link>
      </p>
      <Grid>
        {Object.values(configs).map(config => (
          <Card key={config.id} href={`/iframe/${config.id.replace(/\s+/g, '_')}`}>
            <h2>{config.name}</h2>
            <p>{config.originalWidth}×{config.originalHeight}</p>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}
