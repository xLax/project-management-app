import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '../services/http'
import type { Project } from '../types/project'
import ProjectCard from '../components/ProjectCard/ProjectCard'
import EmptyState from '../components/EmptyState/EmptyState'
import styles from './Dashboard.module.css'

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
        <EmptyState
          icon="📋"
          title="No projects yet"
          message="Create your first project to get started."
          action={{ label: '+ Create Project', onClick: () => navigate('/projects/create') }}
        />
      ) : (
        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => navigate(`/projects/${project.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
