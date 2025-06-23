'use client';

import { Container, Title, Section, SectionTitle, Paragraph, List, LastUpdated } from '@/components/LegalDocument';

export default function TermsPage() {
  return (
    <Container>
      <Title>Terms and Conditions</Title>

      <Section>
        <SectionTitle>1. Acceptance of Terms</SectionTitle>
        <Paragraph>
          By accessing and using Picito, you accept and agree to be bound by the terms and provisions of this agreement.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>2. Description of Service</SectionTitle>
        <Paragraph>
          Picito is a responsive iFrame viewer service that allows users to:
        </Paragraph>
        <List>
          <li>Create and manage iFrame configurations</li>
          <li>Control content display and presentation</li>
          <li>Manage user access and permissions</li>
          <li>Organize iFrames within organizations</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>3. User Responsibilities</SectionTitle>
        <Paragraph>
          Users are responsible for:
        </Paragraph>
        <List>
          <li>Maintaining the confidentiality of their account</li>
          <li>All activities that occur under their account</li>
          <li>Ensuring their use of the service complies with applicable laws</li>
          <li>The content they display through iFrames</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>4. Content Guidelines</SectionTitle>
        <Paragraph>
          Users must not use Picito to display:
        </Paragraph>
        <List>
          <li>Content that violates any intellectual property rights</li>
          <li>Malicious code or harmful content</li>
          <li>Content that violates any applicable laws or regulations</li>
          <li>Content that is discriminatory or inappropriate</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>5. Service Modifications</SectionTitle>
        <Paragraph>
          We reserve the right to modify or discontinue the service at any time, with or without notice.
          We shall not be liable to any user or third party for any modification, suspension, or discontinuance
          of the service.
        </Paragraph>
      </Section>

      <LastUpdated>Last updated: 2025-06-23T22:39:37.000Z</LastUpdated>
    </Container>
  );
}
