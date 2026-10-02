import { Search, Filter, X, MapPin, ArrowDownUp } from 'lucide-react';
import { CATEGORY_LIST } from './CategoryIcon';

const URGENCIES = ['Low', 'Medium', 'High', 'Urgent'];
const STATUSES = ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'urgency', label: 'Highest Urgency' },
];

export default function RequestFilters({
  filters,
  onChange,
  showStatus = true,
  showSort = false,
  compact = false,
}) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  const clear = () =>
    onChange({ search: '', category: '', urgency: '', status: '', location: '', sort: 'newest' });

  const hasAny =
    filters.search ||
    filters.category ||
    filters.urgency ||
    filters.status ||
    filters.location ||
    (filters.sort && filters.sort !== 'newest');

  return (
    <div className="card !p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={16} className="text-brand-500" />
        <h3 className="text-sm font-bold text-ink">Filters</h3>
        {hasAny && (
          <button
            onClick={clear}
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Search (full width) */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search title or description…"
          value={filters.search || ''}
          onChange={(e) => update('search', e.target.value)}
          className="input-field !pl-9 !py-2.5 text-sm"
        />
      </div>

      {/* Grid of dropdowns */}
      <div className={`grid gap-3 ${compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'}`}>
        <select
          value={filters.category || ''}
          onChange={(e) => update('category', e.target.value)}
          className="input-field !py-2.5 text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORY_LIST.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filters.urgency || ''}
          onChange={(e) => update('urgency', e.target.value)}
          className="input-field !py-2.5 text-sm"
        >
          <option value="">All Urgencies</option>
          {URGENCIES.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        {showStatus && (
          <select
            value={filters.status || ''}
            onChange={(e) => update('status', e.target.value)}
            className="input-field !py-2.5 text-sm"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}

        {/* Location */}
        <div className="relative">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Location"
            value={filters.location || ''}
            onChange={(e) => update('location', e.target.value)}
            className="input-field !pl-9 !py-2.5 text-sm"
          />
        </div>

        {/* Sort (optional) */}
        {showSort && (
          <div className="relative">
            <ArrowDownUp size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <select
              value={filters.sort || 'newest'}
              onChange={(e) => update('sort', e.target.value)}
              className="input-field !pl-9 !py-2.5 text-sm appearance-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}