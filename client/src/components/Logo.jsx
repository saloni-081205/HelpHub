export default function Logo({ size = 'md', light = false }) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-2xl' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${s.icon} rounded-full bg-gradient-to-br from-brand-500 to-brand-700
                    flex items-center justify-center shadow-[var(--shadow-soft)]
                    ring-2 ring-white/60`}
      >
        {/* Heart + Hand icon */}
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
          <path
            d="M12 21s-7-4.35-9-9.5C1.5 7.5 4 4 7.5 4c2 0 3.5 1.2 4.5 2.5C13 5.2 14.5 4 16.5 4 20 4 22.5 7.5 21 11.5 19 16.65 12 21 12 21z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      </div>
      <span
        className={`${s.text} font-bold tracking-tight ${
          light ? 'text-white' : 'text-ink'
        }`}
        style={{ fontFamily: 'Times New Roman, serif' }}
      >
        Help<span className="text-brand-500">Hub</span>
      </span>
    </div>
  );
}