import { Check } from 'lucide-react';

const ORDER = ['Pending', 'Accepted', 'In Progress', 'Completed'];
const LABELS = ['Posted', 'Assigned', 'In Progress', 'Completed'];

export default function ProgressBar({ status }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Cancelled
      </div>
    );
  }

  const currentIdx = ORDER.indexOf(status);

  return (
    <div className="w-full">
      <div className="flex items-center">
        {ORDER.map((s, i) => {
          const reached = i <= currentIdx;
          const isCurrent = i === currentIdx && currentIdx < ORDER.length - 1;
          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              {/* Dot */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  reached
                    ? 'bg-teal-600 border-teal-600 text-white'
                    : isCurrent
                    ? 'bg-brand-500 border-brand-500 text-white animate-pulse'
                    : 'bg-white border-line text-muted'
                }`}
              >
                {reached ? <Check size={12} strokeWidth={3} /> : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </div>

              {/* Line */}
              {i < ORDER.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 ${
                    i < currentIdx ? 'bg-teal-500' : 'bg-line'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        {LABELS.map((l, i) => (
          <span
            key={l}
            className={`text-[10px] sm:text-xs font-semibold ${
              i <= currentIdx ? 'text-ink' : 'text-muted'
            } ${i === 0 ? 'text-left' : i === LABELS.length - 1 ? 'text-right' : 'text-center'} flex-1`}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}