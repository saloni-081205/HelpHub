import { Circle, ArrowUp, AlertCircle, Flame } from 'lucide-react';

const map = {
  Low:    { cls: 'bg-teal-50 text-teal-700 border-teal-100', Icon: Circle },
  Medium: { cls: 'bg-amber-50 text-amber-700 border-amber-100', Icon: ArrowUp },
  High:   { cls: 'bg-brand-50 text-brand-700 border-brand-100', Icon: AlertCircle },
  Urgent: { cls: 'bg-red-50 text-red-700 border-red-100', Icon: Flame },
};

export default function UrgencyBadge({ urgency }) {
  const { cls, Icon } = map[urgency] || map.Medium;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <Icon size={12} strokeWidth={2.5} />
      {urgency}
    </span>
  );
}