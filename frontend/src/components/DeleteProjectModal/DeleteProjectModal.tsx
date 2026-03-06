import { useState, useEffect } from 'react'
import styles from '../Modal.module.css'
import deleteStyles from './DeleteProjectModal.module.css'

interface DeleteProjectModalProps {
  isOpen: boolean
  projectName: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function DeleteProjectModal({
  isOpen,
  projectName,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteProjectModalProps) {
  const [input, setInput] = useState('')

  useEffect(() => {
    if (isOpen) setInput('')
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={`${styles.modal} ${styles.confirm}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Delete Project</h2>
          <button className={styles.closeBtn} onClick={onCancel}>✕</button>
        </div>

        <div className={styles.body}>
          <p>
            This will permanently delete <strong>{projectName}</strong> and all its tasks. This
            action cannot be undone.
          </p>
          <p className={deleteStyles.prompt}>
            Type <strong>{projectName}</strong> to confirm:
          </p>
          <input
            className={deleteStyles.confirmInput}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={projectName}
            autoFocus
          />
        </div>

        <div className={styles.actionsPadded}>
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn btn-danger-solid"
            onClick={onConfirm}
            disabled={input !== projectName || loading}
          >
            {loading ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
      </div>
    </div>
  )
}
