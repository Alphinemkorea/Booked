export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon}
      {title && <h2 className="serif">{title}</h2>}
      {description && <p className="u-muted">{description}</p>}
      {action && <div className="u-flex u-justify-center u-gap-10">{action}</div>}
    </div>
  );
}
