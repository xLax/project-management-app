import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getProject, deleteTask } from '../services/http'
import TaskModal from '../components/TaskModal'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

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
}

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

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

  function handleDeleteTask(task: Task) {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      deleteMutation.mutate(task.id)
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

  const tasksByStatus = {
    'todo': project.tasks.filter((t) => t.status === 'todo'),
    'in-progress': project.tasks.filter((t) => t.status === 'in-progress'),
    'done': project.tasks.filter((t) => t.status === 'done'),
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <button className="back-link" onClick={() => navigate('/dashboard')}>← Dashboard</button>
          <h1>{project.name}</h1>
          {project.description && <p className="page-subtitle">{project.description}</p>}
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Create Task
        </button>
      </div>

      {project.tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <h2>No tasks yet</h2>
          <p>Add your first task to get started.</p>
          <button className="btn btn-primary" onClick={openCreateModal}>+ Create Task</button>
        </div>
      ) : (
        <div className="kanban-board">
          {(['todo', 'in-progress', 'done'] as Task['status'][]).map((status) => (
            <div key={status} className="kanban-column">
              <div className="kanban-column-header">
                <span className={`status-badge status-${status}`}>{STATUS_LABELS[status]}</span>
                <span className="kanban-count">{tasksByStatus[status].length}</span>
              </div>

              <div className="kanban-tasks">
                {tasksByStatus[status].length === 0 ? (
                  <div className="kanban-empty">No tasks</div>
                ) : (
                  tasksByStatus[status].map((task) => (
                    <div key={task.id} className="task-card">
                      <div className="task-card-header">
                        <h3>{task.title}</h3>
                        <span className={`priority-badge priority-${task.priority}`}>
                          {PRIORITY_LABELS[task.priority]}
                        </span>
                      </div>
                      {task.description && (
                        <p className="task-card-desc">{task.description}</p>
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
                          onClick={() => handleDeleteTask(task)}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
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
        projectId={id!}
        task={editingTask}
      />
    </div>
  )
}
