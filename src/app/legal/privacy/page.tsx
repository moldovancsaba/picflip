'use client';

import { Container, Title, Section, SectionTitle, Paragraph, List, LastUpdated } from '@/components/LegalDocument';

export default function PrivacyPage() {
  return (
    <Container>
      <Title>Privacy Policy</Title>

      <Section>
        <SectionTitle>1. Information We Collect</SectionTitle>
        <Paragraph>
          We collect the following information:
        </Paragraph>
        <List>
          <li>Email address (used for authentication)</li>
          <li>Usage data (login times, feature usage)</li>
          <li>iFrame configurations and settings</li>
          <li>Organization membership data</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>2. How We Use Your Information</SectionTitle>
        <Paragraph>
          We use the collected information for:
        </Paragraph>
        <List>
          <li>Providing and maintaining the service</li>
          <li>Authenticating users and managing access</li>
          <li>Improving and optimizing the service</li>
          <li>Communicating important updates</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>3. Information Security</SectionTitle>
        <Paragraph>
          We implement appropriate security measures:
        </Paragraph>
        <List>
          <li>Secure authentication using JWT tokens</li>
          <li>HTTPS encryption for all data transfers</li>
          <li>Regular security audits and updates</li>
          <li>Secure database storage with MongoDB</li>
        </List>
      </Section>

      <Section>
        <SectionTitle>4. Data Retention</SectionTitle>
        <Paragraph>
          We retain your information as long as your account is active or as needed to provide services.
          You can request deletion of your account and associated data at any time.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>5. Third-Party Content</SectionTitle>
        <Paragraph>
          Picito allows users to display third-party content through iFrames. We are not responsible for
          the privacy practices or content of these third-party websites. Please review their respective
          privacy policies.
        </Paragraph>
      </Section>

      <LastUpdated>Last updated: 2025-06-23T22:39:37.000Z</LastUpdated>
    </Container>
  );
}
