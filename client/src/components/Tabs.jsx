export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="border-b border-line mb-6 overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`relative px-4 py-3 text-sm font-semibold whitespace-nowrap
                          transition-colors ${
                            isActive
                              ? 'text-brand-600'
                              : 'text-muted hover:text-ink'
                          }`}
            >
              <span className="flex items-center gap-2">
                {t.icon && <span>{t.icon}</span>}
                {t.label}
                {t.count !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-line text-muted'
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}