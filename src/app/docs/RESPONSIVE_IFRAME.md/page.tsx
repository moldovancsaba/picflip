import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import styled from 'styled-components';
import Link from 'next/link';

const Container = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  
  pre {
    background: #f6f8fa;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
  }
  
  code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 0.9em;
  }
  
  h1, h2, h3 {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  ul, ol {
    margin-bottom: 1rem;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
`;

export default function DocsPage() {
  try {
    // Read the markdown file
    const filePath = path.join(process.cwd(), 'docs', 'RESPONSIVE_IFRAME.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const htmlContent = marked(fileContent);

    return (
      <Container>
        <Link href="/" style={{ color: '#0070f3', display: 'inline-block', marginBottom: '2rem' }}>
          ← Back to Home
        </Link>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </Container>
    );
  } catch (error) {
    console.error('Error reading documentation:', error);
    return (
      <Container>
        <h1>Documentation Error</h1>
        <p>Sorry, we couldn't load the documentation. Please try again later.</p>
        <Link href="/" style={{ color: '#0070f3' }}>← Back to Home</Link>
      </Container>
    );
  }
}
