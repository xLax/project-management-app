import { useState, useEffect } from 'react'
import TaskCard from '../TaskCard/TaskCard'
import type { Task } from '../../types/task'
import styles from './KanbanColumn.module.css'

const PAGE_SIZE = 5

const STATUS_LABELS: Record<Task['status'], string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
  'released': 'Released',
}

const STATUS_BADGE_CLASSES: Record<Task['status'], string> = {
  'todo': 'statusTodo',
  'in-progress': 'statusInProgress',
  'done': 'statusDone',
  'released': 'statusReleased',
}

interface KanbanColumnProps {
  status: Task['status']
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  deleteDisabled: boolean
}

export default function KanbanColumn({
  status,
  tasks,
  onEdit,
  onDelete,
  deleteDisabled,
}: KanbanColumnProps) {
  const [page, setPage] = useState(1)

  // Reset to page 1 whenever the task list changes (e.g. after create/delete)
  useEffect(() => {
    setPage(1)
  }, [tasks.length])

  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const paginated = tasks.slice(start, start + PAGE_SIZE)
  const isPaginated = tasks.length > PAGE_SIZE

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <span className={`${styles.badge} ${styles[STATUS_BADGE_CLASSES[status]]}`}>
          {STATUS_LABELS[status]}
        </span>
        <span className={styles.count}>{tasks.length}</span>
      </div>

      <div className={styles.tasks}>
        {tasks.length === 0 ? (
          <div className={styles.empty}>No tasks</div>
        ) : (
          paginated.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              deleteDisabled={deleteDisabled}
            />
          ))
        )}
      </div>

      {isPaginated && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          <span className={styles.pageInfo}>
            {safePage} / {totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
