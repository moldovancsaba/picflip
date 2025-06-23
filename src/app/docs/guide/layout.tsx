import { ReactNode } from 'react';

const styles = `
  .markdown-content {
  pre {
    background: #f6f8fa;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1rem 0;
  }
  
  code {
    font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.9em;
  }
  
  h1, h2, h3 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  ul, ol {
    margin-bottom: 1rem;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  a {
    color: #0070f3;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  }
`;

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{styles}</style>
      {children}
    </>
  );
}
