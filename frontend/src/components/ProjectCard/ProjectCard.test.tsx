import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectCard from './ProjectCard'
import type { Project } from '../../types/project'

const baseProject: Project = {
  id: '1',
  name: 'Website Redesign',
  description: 'Redesign the company website',
  createdAt: '2026-01-15T10:00:00.000Z',
  tasks: [],
}

const makeTask = (id: string) => ({
  id,
  title: 'Task',
  description: '',
  status: 'todo' as const,
  priority: 'low' as const,
  createdAt: '',
})

describe('ProjectCard', () => {
  it('renders the project name', () => {
    render(<ProjectCard project={baseProject} onClick={() => {}} />)
    expect(screen.getByRole('heading', { name: 'Website Redesign' })).toBeInTheDocument()
  })

  it('renders the project description when present', () => {
    render(<ProjectCard project={baseProject} onClick={() => {}} />)
    expect(screen.getByText('Redesign the company website')).toBeInTheDocument()
  })

  it('does not render description when empty', () => {
    render(<ProjectCard project={{ ...baseProject, description: '' }} onClick={() => {}} />)
    expect(screen.queryByText('Redesign the company website')).not.toBeInTheDocument()
  })

  it('shows "0 tasks" when there are no tasks', () => {
    render(<ProjectCard project={baseProject} onClick={() => {}} />)
    expect(screen.getByText('0 tasks')).toBeInTheDocument()
  })

  it('shows singular "1 task" for one task', () => {
    render(<ProjectCard project={{ ...baseProject, tasks: [makeTask('t1')] }} onClick={() => {}} />)
    expect(screen.getByText('1 task')).toBeInTheDocument()
  })

  it('shows plural "N tasks" for multiple tasks', () => {
    render(
      <ProjectCard
        project={{ ...baseProject, tasks: [makeTask('t1'), makeTask('t2'), makeTask('t3')] }}
        onClick={() => {}}
      />
    )
    expect(screen.getByText('3 tasks')).toBeInTheDocument()
  })

  it('calls onClick when the card is clicked', async () => {
    const onClick = vi.fn()
    render(<ProjectCard project={baseProject} onClick={onClick} />)
    await userEvent.click(screen.getByRole('heading', { name: 'Website Redesign' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders the "View →" link', () => {
    render(<ProjectCard project={baseProject} onClick={() => {}} />)
    expect(screen.getByText('View →')).toBeInTheDocument()
  })

  it('renders the created date', () => {
    render(<ProjectCard project={baseProject} onClick={() => {}} />)
    expect(screen.getByText(/Created/)).toBeInTheDocument()
  })
})
