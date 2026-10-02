export default function FeatureCard({ icon, title, description, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-50 text-brand-600 ring-brand-100',
    teal:  'bg-teal-50 text-teal-700 ring-teal-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  };

  return (
    <div className="card hover:-translate-y-1 transition-transform duration-300">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ring-4 ${accents[accent]}`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-ink mb-2">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}