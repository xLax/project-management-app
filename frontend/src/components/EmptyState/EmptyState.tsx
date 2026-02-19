interface EmptyStateProps {
  icon: string
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{message}</p>
      {action && (
        <button className="btn btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
