import { Circle } from 'lucide-react';

export default function StatCard({
  Icon,          // preferred (matches call sites)
  icon,          // legacy fallback
  label,
  value,
  accent = 'brand',
  hint,
}) {
  const RenderIcon = Icon || icon || Circle; // never undefined

  const accents = {
    brand: 'bg-brand-50 text-brand-700 ring-brand-100',
    teal:  'bg-teal-50 text-teal-700 ring-teal-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    muted: 'bg-gray-50 text-gray-600 ring-gray-100',
    red:   'bg-red-50 text-red-700 ring-red-100',
  };

  return (
    <div className="card !p-4 sm:!p-5 hover:-translate-y-0.5 transition-transform">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ring-4 mb-3 ${
          accents[accent] || accents.brand
        }`}
      >
        <RenderIcon size={18} />
      </div>
      <div className="text-2xl font-bold text-ink">{value}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
      {hint && <div className="text-[10px] text-muted/80 mt-1 italic">{hint}</div>}
    </div>
  );
}