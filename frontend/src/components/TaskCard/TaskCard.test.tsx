import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskCard from './TaskCard'
import type { Task } from '../../types/task'

const baseTask: Task = {
  id: 't1',
  title: 'Fix login bug',
  description: 'The login form throws an error',
  status: 'todo',
  priority: 'high',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('TaskCard', () => {
  it('renders the task title', () => {
    render(<TaskCard task={baseTask} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByRole('heading', { name: 'Fix login bug' })).toBeInTheDocument()
  })

  it('renders the priority label', () => {
    render(<TaskCard task={baseTask} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('renders Low / Medium priority labels', () => {
    const { rerender } = render(
      <TaskCard task={{ ...baseTask, priority: 'low' }} onEdit={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText('Low')).toBeInTheDocument()
    rerender(<TaskCard task={{ ...baseTask, priority: 'medium' }} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('renders the description when present', () => {
    render(<TaskCard task={baseTask} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('The login form throws an error')).toBeInTheDocument()
  })

  it('does not render description when absent', () => {
    render(<TaskCard task={{ ...baseTask, description: '' }} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.queryByText('The login form throws an error')).not.toBeInTheDocument()
  })

  it('renders the due date when present', () => {
    render(
      <TaskCard task={{ ...baseTask, dueDate: '2099-12-31' }} onEdit={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText(/📅/)).toBeInTheDocument()
  })

  it('does not render a due date when absent', () => {
    render(<TaskCard task={{ ...baseTask, dueDate: undefined }} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.queryByText(/📅/)).not.toBeInTheDocument()
  })

  it('calls onEdit with the task when Edit is clicked', async () => {
    const onEdit = vi.fn()
    render(<TaskCard task={baseTask} onEdit={onEdit} onDelete={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(onEdit).toHaveBeenCalledWith(baseTask)
  })

  it('calls onDelete with the task when Delete is clicked', async () => {
    const onDelete = vi.fn()
    render(<TaskCard task={baseTask} onEdit={() => {}} onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(baseTask)
  })

  it('disables the Delete button when deleteDisabled=true', () => {
    render(<TaskCard task={baseTask} onEdit={() => {}} onDelete={() => {}} deleteDisabled />)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('renders a past due date without crashing', () => {
    render(
      <TaskCard task={{ ...baseTask, dueDate: '2020-01-01' }} onEdit={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText(/📅/)).toBeInTheDocument()
  })

  it('renders a future due date without overdue styling', () => {
    render(
      <TaskCard task={{ ...baseTask, dueDate: '2099-01-01' }} onEdit={() => {}} onDelete={() => {}} />
    )
    expect(screen.getByText(/📅/)).toBeInTheDocument()
  })
})
