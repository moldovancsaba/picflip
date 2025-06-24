import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import Link from 'next/link';

// This is a server component - no 'use client' directive

const containerStyle = {
  maxWidth: '900px',
  margin: '2rem auto',
  padding: '0 1rem',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  color: '#333',
};

export default function DocsPage() {
  try {
    // Read the markdown file
    const filePath = path.join(process.cwd(), 'public', 'docs', 'RESPONSIVE_IFRAME.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const htmlContent = marked(fileContent);

    return (
      <div style={containerStyle}>
        <Link href="/" style={{ color: '#0070f3', display: 'inline-block', marginBottom: '2rem' }}>
          ← Back to Home
        </Link>
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    );
  } catch (error) {
    console.error('Error reading documentation:', error);
    return (
      <div style={containerStyle}>
        <h1>Documentation Error</h1>
        <p>Sorry, we couldn't load the documentation. Please try again later.</p>
        <Link href="/" style={{ color: '#0070f3' }}>← Back to Home</Link>
      </div>
    );
  }
}
