import { Link } from 'react-router-dom';
import { MapPin, Calendar, User, ChevronRight } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import UrgencyBadge from './UrgencyBadge';
import StatusBadge from './StatusBadge';

export default function RequestCard({ request, variant = 'available' }) {
  const {
    _id, title, description, category, urgency, location,
    requiredDate, status, requesterId, volunteerId, image,
  } = request;

  const shortDesc =
    description?.length > 140 ? description.slice(0, 140).trim() + '…' : description;

  const dateStr = requiredDate
    ? new Date(requiredDate).toLocaleDateString(undefined, {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : '—';

  return (
    <Link
      to={`/dashboard/requests/${_id}`}
      className="card group block hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex gap-4">
        {/* Icon/Image column */}
        <div className="flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-cream border border-line flex items-center justify-center">
              <CategoryIcon category={category} size={26} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="font-bold text-ink text-base sm:text-lg leading-tight truncate group-hover:text-brand-600 transition-colors">
              {title}
            </h3>
            <ChevronRight
              size={18}
              className="text-muted group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <StatusBadge status={status} />
            <UrgencyBadge urgency={urgency} />
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
              <CategoryIcon category={category} size={12} />
              {category}
            </span>
          </div>

          <p className="text-sm text-muted line-clamp-2 mb-3">{shortDesc}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} />
              <span className="truncate max-w-[140px]">{location}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} />
              {dateStr}
            </span>
            {variant === 'mine' && volunteerId && (
              <span className="inline-flex items-center gap-1.5 text-teal-700 font-semibold">
                <User size={13} />
                {volunteerId.firstName} {volunteerId.lastName}
              </span>
            )}
            {variant === 'assigned' && requesterId && (
              <span className="inline-flex items-center gap-1.5 text-brand-600 font-semibold">
                <User size={13} />
                {requesterId.firstName} {requesterId.lastName}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}