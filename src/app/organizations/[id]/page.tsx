import { type Metadata } from 'next';
import { type NextPage } from 'next';
import DashboardLayout from '@/components/organizations/DashboardLayout';
import DashboardContent from '@/components/organizations/DashboardContent';
import { getOrganization } from '@/lib/data/organizations';
import { getUserSession } from '@/lib/auth/session';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: 'Organization Dashboard',
};

const OrganizationDashboard = async ({ params }: PageProps) => {
  const session = await getUserSession();
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

const resolvedParams = await params;
const organization = await getOrganization(resolvedParams.id);
  if (!organization) {
    return {
      notFound: true,
    };
  }

  return (
    <DashboardLayout>
      <DashboardContent
        organizationId={resolvedParams.id}
        userId={session.userId}
        userRole={session.userRole}
      />
    </DashboardLayout>
  );
}

export default OrganizationDashboard;
