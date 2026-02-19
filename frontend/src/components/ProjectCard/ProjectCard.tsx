import type { Project } from '../../types/project'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div className={styles.projectCard} onClick={onClick}>
      <div className={styles.projectCardBody}>
        <div className={styles.projectCardHeader}>
          <h2>{project.name}</h2>
          <span className={styles.taskCount}>
            {project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}
          </span>
        </div>
        {project.description && (
          <p className={styles.projectCardDesc}>{project.description}</p>
        )}
      </div>
      <div className={styles.projectCardFooter}>
        <span className={styles.projectDate}>
          Created {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <span className="link">View →</span>
      </div>
    </div>
  )
}
