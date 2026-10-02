import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, ShieldCheck, User, HandHeart,
  Users, ClipboardList, CheckCircle2, UserCheck, UserX,
} from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/Loader';
import Avatar from '../../components/Avatar';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleChanging, setRoleChanging] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/users/${id}`);
      setData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const toggleActive = async () => {
    await api.patch(`/admin/users/${id}/toggle-active`);
    load();
  };

  const changeRole = async (role) => {
    setRoleChanging(true);
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      await load();
    } finally {
      setRoleChanging(false);
    }
  };

  if (loading) return <Loader />;
  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto card text-center py-12">
        <p className="text-brand-600 font-semibold mb-4">{error || 'User not found'}</p>
        <Link to="/dashboard/users" className="btn-primary text-sm">Back to Users</Link>
      </div>
    );
  }

  const { user, activity } = data;

  const rolePill = {
    requester: { cls: 'bg-amber-50 text-amber-700 border-amber-100', Icon: User },
    volunteer: { cls: 'bg-teal-50 text-teal-700 border-teal-100', Icon: HandHeart },
    admin: { cls: 'bg-brand-50 text-brand-700 border-brand-100', Icon: ShieldCheck },
  }[user.role];
  const RoleIcon = rolePill.Icon;

  const fmt = (d) =>
    new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/dashboard/users" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-5">
        <ArrowLeft size={14} /> Back to users
      </Link>

      {/* Header card */}
      <div className="card mb-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <Avatar user={user} size="xl" />
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${rolePill.cls} capitalize`}>
                <RoleIcon size={11} /> {user.role}
              </span>
              {user.isActive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-teal-50 text-teal-700 border-teal-100">
                  <UserCheck size={11} /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-600 border-gray-200">
                  <UserX size={11} /> Inactive
                </span>
              )}
            </div>

            {user.bio && (
              <p className="text-sm text-muted mt-3 italic">"{user.bio}"</p>
            )}
          </div>
        </div>

        {/* Contact grid */}
        <div className="grid sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-line text-sm">
          <div className="flex items-center gap-2 text-muted">
            <Mail size={15} className="text-brand-500 flex-shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Phone size={15} className="text-brand-500 flex-shrink-0" />
            <span>{user.phone}</span>
          </div>
          {(user.location?.city || user.location?.area) && (
            <div className="flex items-center gap-2 text-muted">
              <MapPin size={15} className="text-brand-500 flex-shrink-0" />
              <span className="truncate">
                {[user.location?.area, user.location?.city].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted">
            <Calendar size={15} className="text-brand-500 flex-shrink-0" />
            <span>Joined {fmt(user.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-5">
        <div className="card !p-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center ring-4 bg-brand-50 text-brand-700 ring-brand-100 mb-3">
            <ClipboardList size={18} />
          </div>
          <div className="text-2xl font-bold text-ink">{activity.asRequester}</div>
          <div className="text-xs text-muted mt-0.5">Requests made</div>
        </div>

        <div className="card !p-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center ring-4 bg-teal-50 text-teal-700 ring-teal-100 mb-3">
            <HandHeart size={18} />
          </div>
          <div className="text-2xl font-bold text-ink">{activity.asVolunteer}</div>
          <div className="text-xs text-muted mt-0.5">Assigned as volunteer</div>
        </div>

        <div className="card !p-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center ring-4 bg-teal-50 text-teal-700 ring-teal-100 mb-3">
            <CheckCircle2 size={18} />
          </div>
          <div className="text-2xl font-bold text-ink">{activity.completedAsVolunteer}</div>
          <div className="text-xs text-muted mt-0.5">Assistance completed</div>
        </div>
      </div>

      {/* Admin actions */}
      <div className="card">
        <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-brand-500" /> Admin Actions
        </h2>

        <div className="space-y-4">
          {/* Toggle active */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-cream/50 border border-line">
            <div>
              <div className="text-sm font-semibold text-ink">
                {user.isActive ? 'Deactivate account' : 'Activate account'}
              </div>
              <div className="text-xs text-muted">
                {user.isActive
                  ? 'Prevents the user from logging in.'
                  : 'Restores the user\'s ability to log in.'}
              </div>
            </div>
            <button
              onClick={toggleActive}
              className={`text-sm font-semibold px-5 py-2 rounded-full border-2 transition-colors self-start sm:self-auto ${
                user.isActive
                  ? 'border-amber-400 text-amber-700 hover:bg-amber-50'
                  : 'border-teal-400 text-teal-700 hover:bg-teal-50'
              }`}
            >
              {user.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>

          {/* Change role */}
          <div className="p-3 rounded-xl bg-cream/50 border border-line">
            <div className="text-sm font-semibold text-ink mb-2">Change role</div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'requester', label: 'Requester', Icon: User },
                { value: 'volunteer', label: 'Volunteer', Icon: HandHeart },
                { value: 'admin', label: 'Admin', Icon: ShieldCheck },
              ].map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => changeRole(value)}
                  disabled={roleChanging || user.role === value}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border-2 transition-colors ${
                    user.role === value
                      ? 'border-brand-500 bg-brand-50 text-brand-700 cursor-default'
                      : 'border-line text-muted hover:border-brand-300 hover:text-ink'
                  } disabled:opacity-50`}
                >
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted mt-2 italic">
              Current: <span className="capitalize font-semibold">{user.role}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}