import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, CheckCircle2, Search, HandHeart, History,
  Users, UserCog, Activity, User, Shield,
} from 'lucide-react';
import Avatar from './Avatar';

const linksByRole = {
  requester: [
    { to: '/dashboard', label: 'Overview', Icon: LayoutDashboard, end: true },
    { to: '/dashboard/requests', label: 'My Requests', Icon: ClipboardList },
    { to: '/dashboard/history', label: 'Completed', Icon: CheckCircle2 },
  ],
  volunteer: [
    { to: '/dashboard', label: 'Overview', Icon: LayoutDashboard, end: true },
    { to: '/dashboard/available', label: 'Available', Icon: Search },
    { to: '/dashboard/assigned', label: 'Assigned', Icon: HandHeart },
    { to: '/dashboard/history', label: 'History', Icon: History },
  ],
  admin: [
    { to: '/dashboard', label: 'Overview', Icon: LayoutDashboard, end: true },
    { to: '/dashboard/users', label: 'Users', Icon: Users },
    { to: '/dashboard/requests/all', label: 'All Requests', Icon: ClipboardList },
    { to: '/dashboard/activity', label: 'Activity', Icon: Activity },
  ],
};

const commonLinks = [
  { to: '/profile', label: 'My Profile', Icon: User },
  { to: '/change-password', label: 'Security', Icon: Shield },
];

export default function Sidebar({ user }) {
  const roleLinks = linksByRole[user?.role] || [];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? 'bg-brand-50 text-brand-700 border border-brand-100'
        : 'text-ink/75 hover:bg-cream hover:text-ink'
    }`;

  return (
    <aside className="lg:w-64 lg:flex-shrink-0">
      <div className="card p-4 lg:sticky lg:top-24">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-line">
          <Avatar user={user} size="md" />
          <div className="min-w-0">
            <div className="font-bold text-ink truncate">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-muted capitalize">{user?.role}</div>
          </div>
        </div>

        <nav className="space-y-1">
          {roleLinks.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 pt-4 border-t border-line">
          <nav className="space-y-1">
            {commonLinks.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} className={linkClass}>
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}