import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList, Hourglass, CheckCircle2, XCircle, Plus, HandHeart,
  Layers, TrendingUp,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Tabs from '../../components/Tabs';
import EmptyState from '../../components/EmptyState';
import RequestCard from '../../components/RequestCard';
import Loader from '../../components/Loader';
import StatCard from '../../components/StatCard';
import CategoryChart from '../../components/charts/CategoryChart';

export default function RequesterDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [byCategory, setByCategory] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, r] = await Promise.all([
          api.get('/requests/stats/me'),
          api.get('/requests', { params: { limit: 6 } }),
        ]);
        setStats(s.data.stats);
        setByCategory(s.data.byCategory.map((c) => ({ name: c._id, value: c.count })));
        setRecent(r.data.requests);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !stats) return <Loader />;

  const statCards = [
    { label: 'Total Requests', value: stats.total, Icon: Layers, accent: 'brand' },
    { label: 'Pending', value: stats.pending, Icon: ClipboardList, accent: 'amber' },
    { label: 'Active', value: stats.active, Icon: Hourglass, accent: 'teal' },
    { label: 'Completed', value: stats.completed, Icon: CheckCircle2, accent: 'teal' },
    { label: 'Cancelled', value: stats.cancelled, Icon: XCircle, accent: 'muted' },
  ];

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'open', label: 'Open', count: stats.pending },
    { key: 'progress', label: 'In Progress', count: stats.active },
    { key: 'completed', label: 'Completed', count: stats.completed },
    { key: 'cancelled', label: 'Cancelled', count: stats.cancelled },
  ];

  const filtered =
    tab === 'overview'
      ? recent
      : tab === 'open'
      ? recent.filter((r) => r.status === 'Pending')
      : tab === 'progress'
      ? recent.filter((r) => ['Accepted', 'In Progress'].includes(r.status))
      : tab === 'completed'
      ? recent.filter((r) => r.status === 'Completed')
      : recent.filter((r) => r.status === 'Cancelled');

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-teal-700 px-6 sm:px-8 py-8 sm:py-10 text-white shadow-[var(--shadow-card)] mb-6">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-white/70 font-semibold mb-2">
            Requester Dashboard
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">
            Need a hand today, {user?.firstName}?
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-xl mb-5">
            Post a request and a nearby volunteer will be notified right away.
          </p>
          <Link
            to="/dashboard/requests/new"
            className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-5 py-2.5 rounded-full hover:bg-cream transition-colors text-sm"
          >
            <Plus size={16} /> New Help Request
          </Link>
        </div>
      </div>

      {/* Stats — 5 cards responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Chart */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-brand-500" />
          <h2 className="text-lg font-bold text-ink">Requests by Category</h2>
        </div>
        <CategoryChart data={byCategory} />
      </div>

      {/* Tabs + List */}
      <div className="card">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        {filtered.length === 0 ? (
          <EmptyState
            icon={<HandHeart size={44} className="text-brand-400 mx-auto" />}
            title="Nothing here yet"
            description="Create your first help request to get started."
            action={
              <Link to="/dashboard/requests/new" className="btn-primary text-sm">
                <Plus size={16} /> Create Request
              </Link>
            }
          />
        ) : (
          <div className="grid gap-3">
            {filtered.map((r) => (
              <RequestCard key={r._id} request={r} variant="mine" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}