import { BookOpen } from 'lucide-react';

export function EmptyState({ icon, title, description, action, secondary }) {
  return (
    <div className="empty-state card">
      <div className="empty-icon">{icon || <BookOpen size={28} />}</div>
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      {action}
      {secondary && <div style={{ marginTop: 10 }}>{secondary}</div>}
    </div>
  );
}
