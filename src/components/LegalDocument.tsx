'use client';

import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

export const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
`;

export const Section = styled.section`
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  color: #444;
  margin-bottom: 1rem;
`;

export const Paragraph = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #666;
`;

export const List = styled.ul`
  margin-bottom: 1rem;
  padding-left: 2rem;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
    color: #666;
  }
`;

export const LastUpdated = styled.p`
  color: #888;
  font-style: italic;
  margin-top: 3rem;
  text-align: center;
`;
