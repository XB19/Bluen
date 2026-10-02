import { AlertTriangle, RotateCw } from 'lucide-react';

export function SkeletonGrid({ count = 4, className = 'product-grid', height = 360 }) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="empty-state">
      <AlertTriangle size={44} />
      <p style={{ marginBottom: 18 }}>{error?.message || 'Impossible de charger les données.'}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          <RotateCw size={16} /> Réessayer
        </button>
      )}
    </div>
  );
}

export function Empty({ icon: Icon, text }) {
  return (
    <div className="empty-state">
      <Icon size={44} />
      <p>{text}</p>
    </div>
  );
}
