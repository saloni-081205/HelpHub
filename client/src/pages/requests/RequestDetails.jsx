import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Calendar, Phone, User, Edit3, Trash2, XCircle,
  CheckCircle2, Loader2, HandHeart, Clock, AlertTriangle, MessageCircle,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import CategoryIcon from '../../components/CategoryIcon';
import UrgencyBadge from '../../components/UrgencyBadge';
import StatusBadge from '../../components/StatusBadge';
import Avatar from '../../components/Avatar';
import StatusTimeline from '../../components/StatusTimeline';
import ProgressBar from '../../components/ProgressBar';

export default function RequestDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState({ open: false, type: '' });
  const [filters, setFilters] = useState({
  search: '',
  category: '',
  urgency: '',
  status: '',
  location: '',
  sort: 'newest',
});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/requests/${id}`);
      setRequest(data.request);

      const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v && v !== 'newest')
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const doAction = async (fn, successMsg) => {
    setActionLoading(true);
    setError('');
    try {
      await fn();
      setConfirm({ open: false, type: '' });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!request) {
    return (
      <div className="max-w-2xl mx-auto card text-center py-12">
        <AlertTriangle size={40} className="mx-auto text-brand-500 mb-3" />
        <p className="text-brand-600 font-semibold mb-4">{error || 'Request not found'}</p>
        <Link to="/dashboard" className="btn-primary text-sm">Back to Dashboard</Link>
      </div>
    );
  }

  const isRequester = String(request.requesterId?._id) === String(user._id);
  const isVolunteer = String(request.volunteerId?._id) === String(user._id);
  const canEdit = isRequester && request.status === 'Pending';
  const canCancel = isRequester && !['Completed', 'Cancelled'].includes(request.status);
  const canDelete = isRequester && ['Pending', 'Cancelled'].includes(request.status);
  const canAccept = user.role === 'volunteer' && request.status === 'Pending' && !request.volunteerId && !isRequester;
  const canProgress =
    isVolunteer && ['Accepted', 'In Progress'].includes(request.status);

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-5">
        <ArrowLeft size={14} /> Back
      </Link>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Header card */}
      <div className="card mb-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          {request.image ? (
            <img src={request.image} alt={request.title} className="w-full sm:w-32 h-40 sm:h-32 rounded-xl object-cover" />
          ) : (
            <div className="w-full sm:w-32 h-32 rounded-xl bg-cream border border-line flex items-center justify-center">
              <CategoryIcon category={request.category} size={40} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-3">{request.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <StatusBadge status={request.status} />
              <UrgencyBadge urgency={request.urgency} />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-cream border-line text-ink">
                <CategoryIcon category={request.category} size={12} />
                {request.category}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <div className="flex items-center gap-2 text-muted">
                <MapPin size={15} className="text-brand-500 flex-shrink-0" />
                <span className="truncate">{request.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Calendar size={15} className="text-brand-500 flex-shrink-0" />
                Required by {fmt(request.requiredDate)}
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Clock size={15} className="text-brand-500 flex-shrink-0" />
                Posted {fmt(request.createdAt)}
              </div>
              {request.acceptedAt && (
                <div className="flex items-center gap-2 text-teal-700">
                  <CheckCircle2 size={15} className="flex-shrink-0" />
                  Accepted {fmt(request.acceptedAt)}
                </div>
              )}
              {request.completedAt && (
                <div className="flex items-center gap-2 text-teal-800">
                  <CheckCircle2 size={15} className="flex-shrink-0" />
                  Completed {fmt(request.completedAt)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress overview */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink">Progress</h2>
          <StatusBadge status={request.status} />
        </div>
        <ProgressBar status={request.status} />
      </div>


      {/* Description */}
      <div className="card mb-5">
        <h2 className="text-lg font-bold text-ink mb-3">Description</h2>
        <p className="text-ink/80 whitespace-pre-wrap leading-relaxed text-sm">{request.description}</p>
      </div>

      {/* Contact + Parties */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div className="card">
          <h2 className="text-lg font-bold text-ink mb-4">Contact</h2>
          <div className="flex items-center gap-3 mb-3">
            <Avatar user={{ firstName: request.contactName }} size="md" ring={false} />
            <div>
              <div className="font-semibold text-ink">{request.contactName}</div>
              <div className="text-xs text-muted">Requester contact</div>
            </div>
          </div>
          <a
            href={`tel:${request.contactPhone}`}
            className="flex items-center gap-2 text-sm text-teal-700 hover:text-teal-800 font-semibold"
          >
            <Phone size={15} /> {request.contactPhone}
          </a>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-ink mb-4">People</h2>

          <div className="flex items-center gap-3 mb-4">
            <Avatar user={request.requesterId} size="md" ring={false} />
            <div className="min-w-0">
              <div className="font-semibold text-ink truncate">
                {request.requesterId?.firstName} {request.requesterId?.lastName}
              </div>
              <div className="text-xs text-muted">Requester</div>
            </div>
          </div>

          {request.volunteerId ? (
            <div className="flex items-center gap-3 pt-4 border-t border-line">
              <Avatar user={request.volunteerId} size="md" ring={false} />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-ink truncate">
                  {request.volunteerId.firstName} {request.volunteerId.lastName}
                </div>
                <div className="text-xs text-teal-700 font-semibold flex items-center gap-1">
                  <HandHeart size={12} /> Assigned Volunteer
                </div>
              </div>
              {(isRequester || isVolunteer) && request.volunteerId?.phone && (
                <a
                  href={`tel:${request.volunteerId.phone}`}
                  className="p-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
                  title="Call volunteer"
                >
                  <Phone size={15} />
                </a>
              )}
            </div>
          ) : (
            <div className="pt-4 border-t border-line text-sm text-muted italic flex items-center gap-2">
              <Clock size={14} /> Waiting for a volunteer
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="card mb-5">
        <h2 className="text-lg font-bold text-ink mb-6">Activity Timeline</h2>
        <StatusTimeline request={request} />
      </div>

      {/* Actions */}
      <div className="card">
        <h2 className="text-lg font-bold text-ink mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          {canAccept && (
            <button
              onClick={() => doAction(() => api.patch(`/requests/${id}/accept`), 'Accepted')}
              disabled={actionLoading}
              className="btn-primary text-sm"
            >
              <HandHeart size={16} />
              {actionLoading ? 'Accepting…' : 'Accept Request'}
            </button>
          )}

          {canProgress && request.status === 'Accepted' && (
            <button
              onClick={() => doAction(() => api.patch(`/requests/${id}/status`, { status: 'In Progress' }), 'Started')}
              disabled={actionLoading}
              className="btn-secondary text-sm"
            >
              <Loader2 size={16} /> Mark In Progress
            </button>
          )}

          {canProgress && request.status === 'In Progress' && (
            <button
              onClick={() => doAction(() => api.patch(`/requests/${id}/status`, { status: 'Completed' }), 'Completed')}
              disabled={actionLoading}
              className="btn-secondary text-sm"
            >
              <CheckCircle2 size={16} /> Mark Completed
            </button>
          )}

          {canEdit && (
            <Link to={`/dashboard/requests/${id}/edit`} className="btn-ghost text-sm">
              <Edit3 size={16} /> Edit
            </Link>
          )}

          {canCancel && (
            <button
              onClick={() => setConfirm({ open: true, type: 'cancel' })}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-amber-500 text-amber-700 font-semibold text-sm hover:bg-amber-50 transition-colors disabled:opacity-50"
            >
              <XCircle size={16} /> Cancel Request
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => setConfirm({ open: true, type: 'delete' })}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-red-500 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} /> Delete
            </button>
          )}

          {!canAccept && !canProgress && !canEdit && !canCancel && !canDelete && (
            <p className="text-sm text-muted italic flex items-center gap-2">
              <MessageCircle size={15} /> No actions available for you on this request.
            </p>
          )}
        </div>
      </div>

      {/* Confirmation modal */}
      <Modal
        open={confirm.open}
        onClose={() => setConfirm({ open: false, type: '' })}
        title={confirm.type === 'delete' ? 'Delete this request?' : 'Cancel this request?'}
        size="sm"
        footer={
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button onClick={() => setConfirm({ open: false, type: '' })} className="btn-ghost text-sm justify-center order-2 sm:order-1">
              Keep it
            </button>
            <button
              onClick={() => {
                if (confirm.type === 'delete') {
                  doAction(() => api.delete(`/requests/${id}`)).then(() => navigate('/dashboard'));
                } else {
                  doAction(() => api.patch(`/requests/${id}/cancel`));
                }
              }}
              disabled={actionLoading}
              className={`text-sm justify-center order-1 sm:order-2 ${
                confirm.type === 'delete'
                  ? 'inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700'
                  : 'inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-white font-semibold hover:bg-amber-600'
              }`}
            >
              {actionLoading ? 'Working…' : confirm.type === 'delete' ? 'Yes, Delete' : 'Yes, Cancel'}
            </button>
          </div>
        }
      >
        <p className="text-sm text-ink/80">
          {confirm.type === 'delete'
            ? 'This will permanently remove the request. This cannot be undone.'
            : 'Cancelling means no volunteer will be able to accept this request anymore.'}
        </p>
      </Modal>
    </div>
  );
}