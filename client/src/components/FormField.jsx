import { AlertCircle } from 'lucide-react';

export default function FormField({ label, name, error, children, hint }) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="label-text">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle size={12} /> {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}