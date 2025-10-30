import DashboardLayout from '../../components/layout/DashboardLayout';
import AuthGuard from '../../components/auth/AuthGuard';

export default function AdminLayout({ children }) {
  return (
    <AuthGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}