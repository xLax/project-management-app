import type { Task } from '../../types/task'
import styles from './TaskCard.module.css'

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const PRIORITY_BADGE_CLASSES: Record<Task['priority'], string> = {
  low: 'priorityLow',
  medium: 'priorityMedium',
  high: 'priorityHigh',
}

function isOverdue(dueDate?: string) {
  if (!dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dueDate) < today
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  deleteDisabled?: boolean
}

export default function TaskCard({ task, onEdit, onDelete, deleteDisabled }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate)

  return (
    <div className={`${styles.taskCard}${overdue ? ` ${styles.taskCardOverdue}` : ''}`}>
      <div className={styles.taskCardHeader}>
        <h3>{task.title}</h3>
        <span className={`${styles.priorityBadge} ${styles[PRIORITY_BADGE_CLASSES[task.priority]]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {task.description && (
        <p className={styles.taskCardDesc}>{task.description}</p>
      )}

      <div className={styles.taskCardFooter}>
        {task.dueDate ? (
          <span className={`${styles.taskDueDate}${overdue ? ` ${styles.taskDueDateOverdue}` : ''}`}>
            📅 {new Date(task.dueDate + 'T00:00:00').toLocaleDateString()}
          </span>
        ) : (
          <span />
        )}
        <div className={styles.taskCardActions}>
          <button className="btn btn-sm btn-ghost" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(task)}
            disabled={deleteDisabled}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
