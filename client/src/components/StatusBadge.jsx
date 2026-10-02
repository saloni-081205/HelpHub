import { Clock, CheckCircle2, Loader2, XCircle, UserCheck } from 'lucide-react';

const map = {
  Pending:     { cls: 'bg-amber-50 text-amber-700 border-amber-100', Icon: Clock },
  Accepted:    { cls: 'bg-teal-50 text-teal-700 border-teal-100',   Icon: UserCheck },
  'In Progress': { cls: 'bg-brand-50 text-brand-700 border-brand-100', Icon: Loader2 },
  Completed:   { cls: 'bg-teal-100 text-teal-800 border-teal-200',  Icon: CheckCircle2 },
  Cancelled:   { cls: 'bg-gray-100 text-gray-700 border-gray-200',  Icon: XCircle },
};

export default function StatusBadge({ status }) {
  const { cls, Icon } = map[status] || map.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <Icon size={12} strokeWidth={2.5} />
      {status}
    </span>
  );
}