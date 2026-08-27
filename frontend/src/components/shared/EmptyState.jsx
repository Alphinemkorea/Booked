<<<<<<< HEAD
import { BookOpen } from 'lucide-react';

export function EmptyState({ icon, title, description, action, secondary }) {
  return (
    <div className="empty-state card">
      <div className="empty-icon">{icon || <BookOpen size={28} />}</div>
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      {action}
      {secondary && <div style={{ marginTop: 10 }}>{secondary}</div>}
=======
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon}
      {title && <h2 className="serif">{title}</h2>}
      {description && <p className="u-muted">{description}</p>}
      {action && <div className="u-flex u-justify-center u-gap-10">{action}</div>}
>>>>>>> fd34775763874bd90ed505782f080973551b04de
    </div>
  );
}
