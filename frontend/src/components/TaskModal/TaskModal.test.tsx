import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskModal from './TaskModal'
import type { Task } from '../../types/task'

vi.mock('../../services/http', () => ({
  createTask: vi.fn().mockResolvedValue({}),
  updateTask: vi.fn().mockResolvedValue({}),
}))

import { createTask, updateTask } from '../../services/http'

const baseProps = {
  isOpen: true,
  onClose: vi.fn(),
  onSaved: vi.fn(),
  projectId: 'proj-1',
  task: null,
}

const existingTask: Task = {
  id: 't1',
  title: 'Existing task',
  description: 'Some description',
  status: 'todo',
  priority: 'medium',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('TaskModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when isOpen=false', () => {
    render(<TaskModal {...baseProps} isOpen={false} />)
    expect(screen.queryByRole('heading', { name: 'Create Task' })).not.toBeInTheDocument()
  })

  it('shows "Create Task" heading when no task is provided', () => {
    render(<TaskModal {...baseProps} />)
    expect(screen.getByRole('heading', { name: 'Create Task' })).toBeInTheDocument()
  })

  it('shows "Edit Task" heading when a task is provided', () => {
    render(<TaskModal {...baseProps} task={existingTask} />)
    expect(screen.getByRole('heading', { name: 'Edit Task' })).toBeInTheDocument()
  })

  it('pre-fills title and description from the existing task', () => {
    render(<TaskModal {...baseProps} task={existingTask} />)
    expect(screen.getByDisplayValue('Existing task')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Some description')).toBeInTheDocument()
  })

  it('shows the Delete Task button only in edit mode', () => {
    const { rerender } = render(
      <TaskModal {...baseProps} task={existingTask} onDelete={() => {}} />
    )
    expect(screen.getByRole('button', { name: 'Delete Task' })).toBeInTheDocument()

    rerender(<TaskModal {...baseProps} task={null} onDelete={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Delete Task' })).not.toBeInTheDocument()
  })

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = vi.fn()
    render(<TaskModal {...baseProps} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the ✕ button is clicked', async () => {
    const onClose = vi.fn()
    render(<TaskModal {...baseProps} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: '✕' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows a validation error when submitting with an empty title', async () => {
    render(<TaskModal {...baseProps} />)
    await userEvent.click(screen.getByRole('button', { name: 'Create Task' }))
    expect(screen.getByText('Title is required.')).toBeInTheDocument()
  })

  it('calls createTask and then onSaved + onClose on successful create', async () => {
    const onClose = vi.fn()
    const onSaved = vi.fn()
    render(<TaskModal {...baseProps} onClose={onClose} onSaved={onSaved} />)

    await userEvent.type(screen.getByPlaceholderText('Task title'), 'New task')
    await userEvent.click(screen.getByRole('button', { name: 'Create Task' }))

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith(
        'proj-1',
        expect.objectContaining({ title: 'New task' }),
      )
      expect(onSaved).toHaveBeenCalledTimes(1)
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('calls updateTask and then onSaved + onClose on successful edit', async () => {
    const onClose = vi.fn()
    const onSaved = vi.fn()
    render(<TaskModal {...baseProps} task={existingTask} onClose={onClose} onSaved={onSaved} />)

    await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith(
        'proj-1',
        't1',
        expect.objectContaining({ title: 'Existing task' }),
      )
      expect(onSaved).toHaveBeenCalledTimes(1)
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('shows an error message when createTask rejects', async () => {
    vi.mocked(createTask).mockRejectedValueOnce(new Error('Server error'))
    render(<TaskModal {...baseProps} />)

    await userEvent.type(screen.getByPlaceholderText('Task title'), 'New task')
    await userEvent.click(screen.getByRole('button', { name: 'Create Task' }))

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })
  })
})
