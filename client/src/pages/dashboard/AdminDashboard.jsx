import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, HandHeart, ClipboardList, Hourglass, CheckCircle2, XCircle,
  UserCheck, User, ShieldCheck, BarChart3, TrendingUp, PieChart as PieIcon,
  ArrowRight,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import StatCard from '../../components/StatCard';
import CategoryChart from '../../components/charts/CategoryChart';
import StatusChart from '../../components/charts/StatusChart';
import MonthChart from '../../components/charts/MonthChart';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/requests/stats/admin');
        setData(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !data) return <Loader />;

  const { stats, charts } = data;

  const userCards = [
    { label: 'Total Users', value: stats.users.total, Icon: Users, accent: 'brand' },
    { label: 'Volunteers', value: stats.users.volunteers, Icon: HandHeart, accent: 'teal' },
    { label: 'Requesters', value: stats.users.requesters, Icon: User, accent: 'amber' },
    { label: 'Admins', value: stats.users.admins, Icon: ShieldCheck, accent: 'muted' },
  ];

  const requestCards = [
    { label: 'Total Requests', value: stats.requests.total, Icon: ClipboardList, accent: 'brand' },
    { label: 'Pending', value: stats.requests.pending, Icon: Hourglass, accent: 'amber' },
    { label: 'Active', value: stats.requests.active, Icon: UserCheck, accent: 'teal' },
    { label: 'Completed', value: stats.requests.completed, Icon: CheckCircle2, accent: 'teal' },
    { label: 'Cancelled', value: stats.requests.cancelled, Icon: XCircle, accent: 'muted' },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-ink to-teal-800 px-6 sm:px-8 py-8 sm:py-10 text-white shadow-[var(--shadow-card)] mb-6">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/20 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-white/60 font-semibold mb-2">
            Admin Console
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">
            Platform Overview
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl">
            Monitor users, requests, and activity across HelpHub.
          </p>

          {/* Quick links */}
          <div className="flex flex-wrap gap-2 mt-5">
            <Link
              to="/dashboard/users"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20 transition-colors"
            >
              <Users size={13} /> Manage Users
            </Link>
            <Link
              to="/dashboard/requests"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20 transition-colors"
            >
              <ClipboardList size={13} /> All Requests
            </Link>
          </div>
        </div>
      </div>

      {/* User stats */}
      <h2 className="text-sm font-bold text-muted uppercase tracking-widest mb-3">
        Users
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {userCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Request stats */}
      <h2 className="text-sm font-bold text-muted uppercase tracking-widest mb-3">
        Requests
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {requestCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts */}
      <h2 className="text-sm font-bold text-muted uppercase tracking-widest mb-3">
        Analytics
      </h2>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={16} className="text-brand-500" />
            <h3 className="text-base font-bold text-ink">Requests by Category</h3>
          </div>
          <CategoryChart data={charts.byCategory} />
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon size={16} className="text-brand-500" />
            <h3 className="text-base font-bold text-ink">Requests by Status</h3>
          </div>
          <StatusChart data={charts.byStatus} />
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-brand-500" />
          <h3 className="text-base font-bold text-ink">Requests by Month (last 6 months)</h3>
        </div>
        <MonthChart data={charts.byMonth} />
      </div>
    </div>
  );
}