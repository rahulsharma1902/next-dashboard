import DashboardLayout from '../../component/layout/DashboardLayout';
import AuthGuard from '../../component/auth/AuthDuard';

export default function AdminLayout({ children }) {
  return (
    <AuthGuard allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}