import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject } from '../services/http'
import FormGroup from '../components/FormGroup'

export default function CreateProject() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: () => createProject(form),
    onSuccess: (newProject: { id: string }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate(`/projects/${newProject.id}`)
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create project.')
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Project name is required.')
      return
    }
    setError('')
    mutation.mutate()
  }

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <div>
          <h1>Create Project</h1>
          <p className="page-subtitle">Set up a new project to start tracking tasks.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <FormGroup label="Project Name *" htmlFor="project-name">
            <input
              id="project-name"
              type="text"
              placeholder="e.g. Website Redesign"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormGroup>

          <FormGroup label="Created On" htmlFor="project-date">
            <input
              id="project-date"
              type="text"
              value={today}
              disabled
              className="input-disabled"
            />
          </FormGroup>

          <FormGroup label="Description" htmlFor="project-desc">
            <textarea
              id="project-desc"
              placeholder="What is this project about?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
            />
          </FormGroup>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/dashboard')}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
