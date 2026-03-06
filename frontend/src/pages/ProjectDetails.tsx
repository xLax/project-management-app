import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getProject, deleteTask, deleteProject } from '../services/http'
import TaskModal from '../components/TaskModal/TaskModal'
import ConfirmModal from '../components/ConfirmModal/ConfirmModal'
import ProjectModal from '../components/ProjectModal/ProjectModal'
import DeleteProjectModal from '../components/DeleteProjectModal/DeleteProjectModal'
import KanbanColumn from '../components/KanbanColumn/KanbanColumn'
import EmptyState from '../components/EmptyState/EmptyState'
import type { Task } from '../types/task'
import type { Project } from '../types/project'
import styles from './ProjectDetails.module.css'

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [hideReleased, setHideReleased] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false)
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false)

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

  const deleteProjectMutation = useMutation({
    mutationFn: () => deleteProject(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate('/dashboard')
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
      deleteMutation.mutate(taskToDelete._id)
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
          <div className={styles.projectTitleRow}>
            <h1>{project.name}</h1>
            <button
              className={styles.iconBtn}
              title="Edit project"
              onClick={() => setIsEditProjectOpen(true)}
            >
              ✏️
            </button>
          </div>
          {project.description && <p className="page-subtitle">{project.description}</p>}
        </div>
        <div className="page-header-actions">
          <label className={styles.checkboxLabel}>
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
        <EmptyState
          icon="✅"
          title="No tasks yet"
          message="Add your first task to get started."
          action={{ label: '+ Create Task', onClick: openCreateModal }}
        />
      ) : hideReleased && project.tasks.every((t) => t.status === 'released') ? (
        <EmptyState
          icon="🚀"
          title="All tasks released"
          message="Every task in this project has been released."
        />
      ) : (
        <div className={`${styles.kanbanBoard} ${styles[`kanbanCols${visibleStatuses.length}`]}`}>
          {visibleStatuses.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onEdit={openEditModal}
              onDelete={handleDeleteRequest}
              deleteDisabled={deleteMutation.isPending}
            />
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

      {project && (
        <ProjectModal
          isOpen={isEditProjectOpen}
          onClose={() => setIsEditProjectOpen(false)}
          onSaved={() => { queryClient.invalidateQueries({ queryKey: ['project', id] }); queryClient.invalidateQueries({ queryKey: ['projects'] }) }}
          onDeleteRequest={() => { setIsEditProjectOpen(false); setIsDeleteProjectOpen(true) }}
          project={project}
        />
      )}

      <DeleteProjectModal
        isOpen={isDeleteProjectOpen}
        projectName={project.name}
        loading={deleteProjectMutation.isPending}
        onConfirm={() => deleteProjectMutation.mutate()}
        onCancel={() => setIsDeleteProjectOpen(false)}
      />
    </div>
  )
}
