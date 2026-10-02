export default function EmptyState({ icon = {icon}, title, description, action }) {
  return (
    <div className="card text-center py-12">
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-muted mb-5 max-w-sm mx-auto">{description}</p>}
      {action}
    </div>
  );
}