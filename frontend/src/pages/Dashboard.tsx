import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '../services/http'

interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  tasks: unknown[]
}

export default function Dashboard() {
  const navigate = useNavigate()

  const { data: projects = [], isLoading, isError } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  if (isLoading) {
    return (
      <div className="page">
        <div className="loading">Loading projects...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="page">
        <div className="error-msg">Failed to load projects. Please try again.</div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">
            {projects.length === 0
              ? 'No projects yet — create your first one!'
              : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/projects/create')}>
          + Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h2>No projects yet</h2>
          <p>Create your first project to get started.</p>
          <button className="btn btn-primary" onClick={() => navigate('/projects/create')}>
            + Create Project
          </button>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="project-card-header">
                <h2>{project.name}</h2>
                <span className="task-count">{project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}</span>
              </div>
              {project.description && (
                <p className="project-card-desc">{project.description}</p>
              )}
              <div className="project-card-footer">
                <span className="project-date">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span className="link">View →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
