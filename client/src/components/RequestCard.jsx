import { Link } from 'react-router-dom';
import { MapPin, Calendar, User, ChevronRight, Clock } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import UrgencyBadge from './UrgencyBadge';
import StatusBadge from './StatusBadge';

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/api\/?$/, '');

function resolveImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `${API_ORIGIN}${path}`;
  return path;
}

export default function RequestCard({ request, variant = 'available' }) {
  const {
    _id, title, description, category, urgency, location,
    requiredDate, status, requesterId, volunteerId, image,
  } = request;

  const shortDesc =
    description?.length > 120 ? description.slice(0, 120).trim() + '…' : description;

  const dateStr = requiredDate
    ? new Date(requiredDate).toLocaleDateString(undefined, {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—';

  const imgSrc = resolveImageUrl(image);

  return (
    <Link
      to={`/dashboard/requests/${_id}`}
      className="card group block w-full max-w-full overflow-hidden
                 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      {/* ⚠️ min-w-0 on the flex parent lets children shrink */}
      <div className="flex gap-3 sm:gap-4 min-w-0">
        {/* ---- Icon / Image column ---- */}
        <div className="flex-shrink-0">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={title}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover bg-cream"
            />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-cream border border-line
                            flex items-center justify-center">
              <CategoryIcon category={category} size={22} className="sm:hidden" />
              <CategoryIcon category={category} size={26} className="hidden sm:block" />
            </div>
          )}
        </div>

        {/* ---- Content column ---- */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-ink text-sm sm:text-base leading-snug
                           line-clamp-2 break-words min-w-0
                           group-hover:text-brand-600 transition-colors">
              {title}
            </h3>
            <ChevronRight
              size={16}
              className="text-muted group-hover:text-brand-500 group-hover:translate-x-0.5
                         transition-all flex-shrink-0 mt-0.5"
            />
          </div>

          {/* Badges row — wraps nicely on small screens */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
            <StatusBadge status={status} />
            <UrgencyBadge urgency={urgency} />
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs
                             font-medium text-muted">
              <CategoryIcon category={category} size={12} />
              <span className="truncate max-w-[100px] sm:max-w-none">{category}</span>
            </span>
          </div>

          {/* Description */}
          {shortDesc && (
            <p className="text-xs sm:text-sm text-muted line-clamp-2 mb-2.5
                          break-words">
              {shortDesc}
            </p>
          )}

          {/* Meta row — stacks vertically on very small, wraps otherwise */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-muted">
            <span className="inline-flex items-center gap-1 min-w-0 max-w-full">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="truncate">{location}</span>
            </span>
            <span className="inline-flex items-center gap-1 flex-shrink-0">
              <Calendar size={12} className="flex-shrink-0" />
              {dateStr}
            </span>

            {variant === 'mine' && volunteerId && (
              <span className="inline-flex items-center gap-1 text-teal-700 font-semibold
                               min-w-0 max-w-full">
                <User size={12} className="flex-shrink-0" />
                <span className="truncate">
                  {volunteerId.firstName} {volunteerId.lastName}
                </span>
              </span>
            )}

            {variant === 'assigned' && requesterId && (
              <span className="inline-flex items-center gap-1 text-brand-600 font-semibold
                               min-w-0 max-w-full">
                <User size={12} className="flex-shrink-0" />
                <span className="truncate">
                  {requesterId.firstName} {requesterId.lastName}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
