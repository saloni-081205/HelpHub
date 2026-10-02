import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, PackageOpen } from 'lucide-react';
import api from '../../services/api';
import RequestCard from '../../components/RequestCard';
import RequestFilters from '../../components/RequestFilters';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', urgency: '', status: '' });

  const load = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ink">My Requests</h1>
          <p className="text-muted text-sm mt-1">Manage and track everything you've posted.</p>
        </div>
        <Link to="/dashboard/requests/new" className="btn-primary text-sm self-start sm:self-auto">
          <Plus size={16} /> New Request
        </Link>
      </div>

      <RequestFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <Loader />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<PackageOpen size={44} className="text-brand-400 mx-auto" />}
          title="No requests match"
          description="Try changing filters, or create your first help request."
          action={
            <Link to="/dashboard/requests/new" className="btn-primary text-sm">
              <Plus size={16} /> Create Request
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4">
          {requests.map((r) => (
            <RequestCard key={r._id} request={r} variant="mine" />
          ))}
        </div>
      )}
    </div>
  );
}