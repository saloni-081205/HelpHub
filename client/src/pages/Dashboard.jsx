import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import RoleDashboard from '../components/RoleDashboard';
import MyRequests from './requests/MyRequests';
import CreateRequest from './requests/CreateRequest';
import EditRequest from './requests/EditRequest';
import RequestDetails from './requests/RequestDetails';
import AdminUsers from './admin/AdminUsers';
import AdminUserDetail from './admin/AdminUserDetail';
import AdminRequests from './admin/AdminRequests';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 py-6 lg:py-10">
      <div className="lg:hidden mb-5">
        <h1 className="text-3xl font-bold text-ink">Hi, {user?.firstName}</h1>
        <p className="text-sm text-muted capitalize">{user?.role} dashboard</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0">
          <Routes>
            <Route index element={<RoleDashboard />} />

            {/* Requester routes */}
            <Route path="requests" element={<MyRequests />} />
            <Route path="requests/new" element={<CreateRequest />} />
            <Route path="requests/:id" element={<RequestDetails />} />
            <Route path="requests/:id/edit" element={<EditRequest />} />

            {/* Admin */}
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUserDetail />} />

            {/* Volunteer aliases → same pages */}
            <Route path="available" element={<RoleDashboard />} />
            <Route path="assigned" element={<RoleDashboard />} />
            <Route path="history" element={<RoleDashboard />} />
            <Route path="activity" element={<RoleDashboard />} />

            {/* Admin all requests */}
            <Route path="requests/all" element={<AdminRequests />} />

            {/* Admin placeholders
            <Route path="users" element={<RoleDashboard />} />
            <Route path="activity" element={<RoleDashboard />} /> */}

            <Route path="*" element={<RoleDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}