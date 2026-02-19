import { useState, useEffect } from 'react'
import { createTask, updateTask } from '../services/http'
import type { Task, TaskModalProps, TaskFormState } from '../types/task'
import styles from './Modal.module.css'
import FormGroup from './FormGroup'

const EMPTY_FORM: TaskFormState = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
}

export default function TaskModal({ isOpen, onClose, onSaved, onDelete, projectId, task }: TaskModalProps) {
  const [form, setForm] = useState<TaskFormState>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!task

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ?? '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setError('')
  }, [task, isOpen])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, dueDate: form.dueDate || undefined }
      if (isEditing && task) {
        await updateTask(projectId, task.id, payload)
      } else {
        await createTask(projectId, payload)
      }
      onSaved()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isEditing ? 'Edit Task' : 'Create Task'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <FormGroup label="Title *" htmlFor="task-title">
            <input
              id="task-title"
              type="text"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Description" htmlFor="task-description">
            <textarea
              id="task-description"
              placeholder="Describe the task..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </FormGroup>

          <div className="form-row">
            <FormGroup label="Status" htmlFor="task-status">
              <select
                id="task-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Task['status'] })}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="released">Released</option>
              </select>
            </FormGroup>

            <FormGroup label="Priority" htmlFor="task-priority">
              <select
                id="task-priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </FormGroup>
          </div>

          <FormGroup label="Due Date" htmlFor="task-due-date" optional>
            <input
              id="task-due-date"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </FormGroup>

          {error && <p className="form-error">{error}</p>}

          <div className={styles.actionsSplit}>
            {isEditing && onDelete && task ? (
              <button
                type="button"
                className="btn btn-danger-solid btn-sm"
                onClick={() => { onClose(); onDelete(task) }}
                disabled={loading}
              >
                Delete Task
              </button>
            ) : (
              <span />
            )}
            <div className={styles.actionsRight}>
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
