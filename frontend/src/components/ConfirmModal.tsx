interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-actions modal-actions-padded">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`btn ${danger ? 'btn-danger-solid' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
