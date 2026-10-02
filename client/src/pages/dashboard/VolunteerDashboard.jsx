import { useEffect, useState } from 'react';
import {
  Search, HandHeart, Hourglass, CheckCircle2, Star, TrendingUp,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Tabs from '../../components/Tabs';
import EmptyState from '../../components/EmptyState';
import RequestCard from '../../components/RequestCard';
import RequestFilters from '../../components/RequestFilters';
import Loader from '../../components/Loader';
import StatCard from '../../components/StatCard';
import CategoryChart from '../../components/charts/CategoryChart';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('available');
  const [stats, setStats] = useState(null);
  const [byCategory, setByCategory] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '', category: '', urgency: '', location: '', sort: 'newest',
  });

  const loadStats = async () => {
    const { data } = await api.get('/requests/stats/volunteer');
    setStats(data.stats);
    setByCategory(data.byCategory.map((c) => ({ name: c._id, value: c.count })));
  };

  const loadList = async (which) => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v && v !== 'newest')
      );
      if (which === 'available') params.available = 'true';
      else if (which === 'assigned') params.assigned = 'true';
      else if (which === 'inProgress') {
        params.assigned = 'true';
        params.status = 'In Progress';
      } else if (which === 'completed') {
        params.assigned = 'true';
        params.status = 'Completed';
      }
      const { data } = await api.get('/requests', { params });
      setList(data.requests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => {
    const t = setTimeout(() => loadList(tab), 300);
    return () => clearTimeout(t);
  }, [tab, filters]);

  if (!stats) return <Loader />;

  const statCards = [
    { label: 'Available', value: stats.available, Icon: Search, accent: 'brand' },
    { label: 'Assigned', value: stats.assigned, Icon: HandHeart, accent: 'amber' },
    { label: 'In Progress', value: stats.inProgress, Icon: Hourglass, accent: 'teal' },
    { label: 'Completed', value: stats.completed, Icon: CheckCircle2, accent: 'teal' },
  ];

  const tabs = [
    { key: 'available', label: 'Available', count: stats.available },
    { key: 'assigned', label: 'Assigned', count: stats.assigned },
    { key: 'inProgress', label: 'In Progress', count: stats.inProgress },
    { key: 'completed', label: 'Completed', count: stats.completed },
  ];

  const variant = tab === 'available' ? 'available' : 'assigned';

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-700 via-teal-600 to-brand-500 px-6 sm:px-8 py-8 sm:py-10 text-white shadow-[var(--shadow-card)] mb-6">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-white/70 font-semibold mb-2">
            Volunteer Dashboard
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">
            Ready to help, {user?.firstName}?
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-xl">
            Discover people near you who need a hand. Every act matters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {stats.assigned > 0 && (
        <div className="card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-brand-500" />
            <h2 className="text-lg font-bold text-ink">Your Assistance by Category</h2>
          </div>
          <CategoryChart data={byCategory} />
        </div>
      )}

      <div className="card">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />

        {tab === 'available' && (
          <RequestFilters
            filters={filters}
            onChange={setFilters}
            showStatus={false}
            showSort
          />
        )}

        {loading ? (
          <Loader />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<Star size={44} className="text-brand-400 mx-auto" />}
            title={
              tab === 'available'
                ? 'No open requests right now'
                : tab === 'assigned'
                ? 'Nothing assigned yet'
                : tab === 'inProgress'
                ? 'Nothing in progress'
                : 'No completed assistance yet'
            }
            description={
              tab === 'available'
                ? 'New requests in your area will appear here.'
                : 'Accept a request from the Available tab to see it here.'
            }
          />
        ) : (
          <div className="grid gap-3">
            {list.map((r) => (
              <RequestCard key={r._id} request={r} variant={variant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}