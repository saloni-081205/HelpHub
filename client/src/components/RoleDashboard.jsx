import { useAuth } from '../context/AuthContext';
import RequesterDashboard from '../pages/dashboard/RequesterDashboard';
import VolunteerDashboard from '../pages/dashboard/VolunteerDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';

export default function RoleDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case 'volunteer':
      return <VolunteerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'requester':
    default:
      return <RequesterDashboard />;
  }
}