import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, X, ShieldCheck, User, HandHeart, ChevronRight,
  UserCheck, UserX, Users as UsersIcon,
} from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Avatar from '../../components/Avatar';

const ROLES = [
  { value: '', label: 'All Roles', Icon: UsersIcon, color: 'text-muted' },
  { value: 'requester', label: 'Requesters', Icon: User, color: 'text-amber-600' },
  { value: 'volunteer', label: 'Volunteers', Icon: HandHeart, color: 'text-teal-700' },
  { value: 'admin', label: 'Admins', Icon: ShieldCheck, color: 'text-brand-600' },
];

function RolePill({ role }) {
  const map = {
    requester: { cls: 'bg-amber-50 text-amber-700 border-amber-100', Icon: User },
    volunteer: { cls: 'bg-teal-50 text-teal-700 border-teal-100', Icon: HandHeart },
    admin: { cls: 'bg-brand-50 text-brand-700 border-brand-100', Icon: ShieldCheck },
  };
  const { cls, Icon } = map[role] || map.requester;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls} capitalize`}>
      <Icon size={11} /> {role}
    </span>
  );
}

function ActivePill({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-teal-50 text-teal-700 border-teal-100">
      <UserCheck size={11} /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-600 border-gray-200">
      <UserX size={11} /> Inactive
    </span>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', role: '', isActive: '' });
  const [actionId, setActionId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [filters]);

  const toggleActive = async (user) => {
    setActionId(user._id);
    try {
      const { data } = await api.patch(`/admin/users/${user._id}/toggle-active`);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isActive: data.user.isActive } : u))
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink flex items-center gap-3">
          <UsersIcon size={28} className="text-brand-500" /> Manage Users
        </h1>
        <p className="text-muted text-sm mt-1">
          View, search, filter, and control platform members.
        </p>
      </div>

      {/* Filters */}
      <div className="card !p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-brand-500" />
          <h3 className="text-sm font-bold text-ink">Filters</h3>
          {(filters.search || filters.role || filters.isActive) && (
            <button
              onClick={() => setFilters({ search: '', role: '', isActive: '' })}
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-600"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search name, email, phone…"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field !pl-9 !py-2.5 text-sm"
            />
          </div>

          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="input-field !py-2.5 text-sm"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>

          <select
            value={filters.isActive}
            onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
            className="input-field !py-2.5 text-sm"
          >
            <option value="">All Status</option>
            <option value="true">Active only</option>
            <option value="false">Inactive only</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <EmptyState
          icon={<UsersIcon size={44} className="text-brand-400 mx-auto" />}
          title="No users match"
          description="Try changing filters or clearing the search."
        />
      ) : (
        <div className="card !p-0 overflow-hidden">
          {/* Desktop table header (hidden on mobile) */}
          <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-line bg-cream/50 text-xs font-bold text-muted uppercase tracking-widest">
            <div>User</div>
            <div>Contact</div>
            <div>Role</div>
            <div>Status</div>
            <div></div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-line">
            {users.map((u) => (
              <div
                key={u._id}
                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto_auto] gap-3 md:gap-4 px-4 md:px-5 py-4 items-center hover:bg-cream/30 transition-colors"
              >
                {/* User info */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar user={u} size="md" ring={false} />
                  <div className="min-w-0">
                    <div className="font-semibold text-ink truncate">
                      {u.firstName} {u.lastName}
                    </div>
                    <div className="text-xs text-muted truncate md:hidden">{u.email}</div>
                  </div>
                </div>

                {/* Contact (desktop) */}
                <div className="hidden md:block min-w-0">
                  <div className="text-sm text-ink truncate">{u.email}</div>
                  <div className="text-xs text-muted truncate">{u.phone}</div>
                </div>

                {/* Role */}
                <div className="md:flex md:justify-start">
                  <RolePill role={u.role} />
                </div>

                {/* Status */}
                <div className="md:flex md:justify-start">
                  <ActivePill active={u.isActive} />
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end md:justify-start">
                  <button
                    onClick={() => toggleActive(u)}
                    disabled={actionId === u._id}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-colors ${
                      u.isActive
                        ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                        : 'border-teal-300 text-teal-700 hover:bg-teal-50'
                    } disabled:opacity-50`}
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <Link
                    to={`/dashboard/users/${u._id}`}
                    className="p-1.5 rounded-lg text-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    title="View details"
                  >
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}