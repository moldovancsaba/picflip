import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import Link from 'next/link';

const containerStyles = {
  maxWidth: '900px',
  margin: '2rem auto',
  padding: '0 1rem',
};

const contentStyles = {
  pre: {
    background: '#f6f8fa',
    padding: '1rem',
    borderRadius: '6px',
    overflowX: 'auto',
  },
  code: {
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '0.9em',
  },
  h1: {
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  h2: {
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  h3: {
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  p: {
    lineHeight: 1.6,
    marginBottom: '1rem',
  },
  ul: {
    marginBottom: '1rem',
    paddingLeft: '2rem',
  },
  ol: {
    marginBottom: '1rem',
    paddingLeft: '2rem',
  },
  li: {
    marginBottom: '0.5rem',
  },
};

export default function DocsPage() {
  try {
    // Read the markdown file
    const filePath = path.join(process.cwd(), 'public', 'docs', 'RESPONSIVE_IFRAME.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const htmlContent = marked(fileContent);

    return (
      <div style={containerStyles}>
        <Link href="/" style={{ color: '#0070f3', display: 'inline-block', marginBottom: '2rem' }}>
          ← Back to Home
        </Link>
        <div style={contentStyles} dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    );
  } catch (error) {
    console.error('Error reading documentation:', error);
    return (
      <div style={containerStyles}>
        <h1>Documentation Error</h1>
        <p>Sorry, we couldn't load the documentation. Please try again later.</p>
        <Link href="/" style={{ color: '#0070f3' }}>← Back to Home</Link>
      </div>
    );
  }
}
