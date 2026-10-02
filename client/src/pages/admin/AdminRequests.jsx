import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, X, MapPin, Calendar, Trash2, ChevronRight, User,
  ClipboardList,
} from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import CategoryIcon, { CATEGORY_LIST } from '../../components/CategoryIcon';
import StatusBadge from '../../components/StatusBadge';
import UrgencyBadge from '../../components/UrgencyBadge';

const STATUSES = ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'];
const URGENCIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '', category: '', urgency: '', status: '', location: '', sort: 'newest',
  });
  const [confirm, setConfirm] = useState({ open: false, request: null });
  const [working, setWorking] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v && v !== 'newest')
      );
      const { data } = await api.get('/requests', { params });
      setRequests(data.requests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [filters]);

  const removeRequest = async () => {
    if (!confirm.request) return;
    setWorking(true);
    try {
      await api.delete(`/requests/${confirm.request._id}/admin`);
      setRequests((prev) => prev.filter((r) => r._id !== confirm.request._id));
      setConfirm({ open: false, request: null });
    } finally {
      setWorking(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink flex items-center gap-3">
          <ClipboardList size={28} className="text-brand-500" /> All Requests
        </h1>
        <p className="text-muted text-sm mt-1">
          Monitor, filter, and remove inappropriate requests.
        </p>
      </div>

      {/* Filters */}
      <div className="card !p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-brand-500" />
          <h3 className="text-sm font-bold text-ink">Filters</h3>
          {Object.values(filters).some((v) => v && v !== 'newest') && (
            <button
              onClick={() =>
                setFilters({ search: '', category: '', urgency: '', status: '', location: '', sort: 'newest' })
              }
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-600"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        <div className="relative mb-3">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search title or description…"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="input-field !pl-9 !py-2.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="input-field !py-2.5 text-sm"
          >
            <option value="">All Categories</option>
            {CATEGORY_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filters.urgency}
            onChange={(e) => setFilters({ ...filters, urgency: e.target.value })}
            className="input-field !py-2.5 text-sm"
          >
            <option value="">All Urgencies</option>
            {URGENCIES.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field !py-2.5 text-sm"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="input-field !pl-9 !py-2.5 text-sm"
            />
          </div>

          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="input-field !py-2.5 text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="urgency">Highest urgency</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <Loader />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={44} className="text-brand-400 mx-auto" />}
          title="No requests match"
          description="Try changing filters or clearing the search."
        />
      ) : (
        <div className="grid gap-3">
          {requests.map((r) => (
            <div
              key={r._id}
              className="card !p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              {/* Left icon */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-cream border border-line flex items-center justify-center flex-shrink-0">
                  <CategoryIcon category={r.category} size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-ink truncate">{r.title}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <StatusBadge status={r.status} />
                    <UrgencyBadge urgency={r.urgency} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted mt-2">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} /> <span className="truncate max-w-[160px]">{r.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(r.requiredDate).toLocaleDateString()}
                    </span>
                    {r.requesterId && (
                      <span className="inline-flex items-center gap-1 text-brand-600 font-semibold">
                        <User size={11} />
                        {r.requesterId.firstName} {r.requesterId.lastName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:pl-3 sm:border-l sm:border-line">
                <Link
                  to={`/dashboard/requests/${r._id}`}
                  className="p-2 rounded-lg text-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  title="View details"
                >
                  <ChevronRight size={18} />
                </Link>
                <button
                  onClick={() => setConfirm({ open: true, request: r })}
                  className="p-2 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove request"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm modal */}
      <Modal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, request: null })}
        title="Remove this request?"
        size="sm"
        footer={
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button
              onClick={() => setConfirm({ open: false, request: null })}
              className="btn-ghost text-sm justify-center order-2 sm:order-1"
            >
              Keep it
            </button>
            <button
              onClick={removeRequest}
              disabled={working}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 justify-center order-1 sm:order-2"
            >
              {working ? 'Removing…' : 'Yes, Remove'}
            </button>
          </div>
        }
      >
        <p className="text-sm text-ink/80">
          This permanently deletes <strong>"{confirm.request?.title}"</strong>. This action
          cannot be undone, and the requester will lose access to it.
        </p>
      </Modal>
    </div>
  );
}