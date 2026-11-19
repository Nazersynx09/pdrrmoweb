import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from './AdminShell';
import { getAuthenticatedUserFromToken, isAdminEmail } from '../api/admin/_auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = (await cookies()).get('admin_access_token')?.value;
  if (!accessToken) redirect('/login');

  const user = await getAuthenticatedUserFromToken(accessToken);
  if (!user || !isAdminEmail(user.email)) redirect('/login');

  return <AdminShell>{children}</AdminShell>;
}
