import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getProject, deleteTask } from '../services/http'
import TaskModal from '../components/TaskModal'
import type { Task } from '../components/TaskModal'
import ConfirmModal from '../components/ConfirmModal'

interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  tasks: Task[]
}

const STATUS_LABELS: Record<Task['status'], string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done',
  'released': 'Released',
}

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

function isOverdue(dueDate?: string) {
  if (!dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dueDate) < today
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [hideReleased, setHideReleased] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  const { data: project, isLoading, isError } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: () => getProject(id!),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(id!, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
    },
  })

  function openCreateModal() {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  function openEditModal(task: Task) {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  function handleModalSaved() {
    queryClient.invalidateQueries({ queryKey: ['project', id] })
  }

  function handleDeleteRequest(task: Task) {
    setTaskToDelete(task)
  }

  function confirmDelete() {
    if (taskToDelete) {
      deleteMutation.mutate(taskToDelete.id)
      setTaskToDelete(null)
    }
  }

  if (isLoading) {
    return <div className="page"><div className="loading">Loading project...</div></div>
  }

  if (isError || !project) {
    return (
      <div className="page">
        <div className="error-msg">Project not found.</div>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
      </div>
    )
  }

  const visibleStatuses: Task['status'][] = hideReleased
    ? ['todo', 'in-progress', 'done']
    : ['todo', 'in-progress', 'done', 'released']

  const tasksByStatus = Object.fromEntries(
    visibleStatuses.map((s) => [s, project.tasks.filter((t) => t.status === s)])
  ) as Record<Task['status'], Task[]>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <button className="back-link" onClick={() => navigate('/dashboard')}>← Dashboard</button>
          <h1>{project.name}</h1>
          {project.description && <p className="page-subtitle">{project.description}</p>}
        </div>
        <div className="page-header-actions">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={hideReleased}
              onChange={(e) => setHideReleased(e.target.checked)}
            />
            Hide released tasks
          </label>
          <button className="btn btn-primary" onClick={openCreateModal}>
            + Create Task
          </button>
        </div>
      </div>

      {project.tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <h2>No tasks yet</h2>
          <p>Add your first task to get started.</p>
          <button className="btn btn-primary" onClick={openCreateModal}>+ Create Task</button>
        </div>
      ) : (
        <div className={`kanban-board kanban-cols-${visibleStatuses.length}`}>
          {visibleStatuses.map((status) => (
            <div key={status} className="kanban-column">
              <div className="kanban-column-header">
                <span className={`status-badge status-${status}`}>{STATUS_LABELS[status]}</span>
                <span className="kanban-count">{tasksByStatus[status].length}</span>
              </div>

              <div className="kanban-tasks">
                {tasksByStatus[status].length === 0 ? (
                  <div className="kanban-empty">No tasks</div>
                ) : (
                  tasksByStatus[status].map((task) => {
                    const overdue = isOverdue(task.dueDate)
                    return (
                      <div key={task.id} className={`task-card${overdue ? ' task-card-overdue' : ''}`}>
                        <div className="task-card-header">
                          <h3>{task.title}</h3>
                          <span className={`priority-badge priority-${task.priority}`}>
                            {PRIORITY_LABELS[task.priority]}
                          </span>
                        </div>
                        {task.description && (
                          <p className="task-card-desc">{task.description}</p>
                        )}
                        <div className="task-card-footer">
                          {task.dueDate ? (
                            <span className={`task-due-date${overdue ? ' task-due-date-overdue' : ''}`}>
                              📅 {new Date(task.dueDate + 'T00:00:00').toLocaleDateString()}
                            </span>
                          ) : (
                            <span />
                          )}
                          <div className="task-card-actions">
                            <button
                              className="btn btn-sm btn-ghost"
                              onClick={() => openEditModal(task)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteRequest(task)}
                              disabled={deleteMutation.isPending}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleModalSaved}
        onDelete={handleDeleteRequest}
        projectId={id!}
        task={editingTask}
      />

      <ConfirmModal
        isOpen={!!taskToDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  )
}
