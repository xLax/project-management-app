import { useState, useEffect } from 'react'
import { updateProject } from '../../services/http'
import type { Project } from '../../types/project'
import styles from '../Modal.module.css'
import FormGroup from '../FormGroup/FormGroup'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: (updated: Project) => void
  onDeleteRequest: () => void
  project: Project
}

export default function ProjectModal({ isOpen, onClose, onSaved, onDeleteRequest, project }: ProjectModalProps) {
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setForm({ name: project.name, description: project.description ?? '' })
      setError('')
    }
  }, [isOpen, project])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Project name is required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const updated = await updateProject(project._id, form)
      onSaved(updated)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to update project.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Edit Project</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <FormGroup label="Project Name *" htmlFor="edit-project-name">
            <input
              id="edit-project-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </FormGroup>

          <FormGroup label="Description" htmlFor="edit-project-desc">
            <textarea
              id="edit-project-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="What is this project about?"
            />
          </FormGroup>

          {error && <p className="form-error">{error}</p>}

          <div className={styles.actionsSplit}>
            <button
              type="button"
              className="btn btn-danger-solid btn-sm"
              onClick={() => { onClose(); onDeleteRequest() }}
              disabled={loading}
            >
              Delete Project
            </button>
            <div className={styles.actionsRight}>
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
