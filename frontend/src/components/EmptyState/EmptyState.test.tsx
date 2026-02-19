import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('renders icon, title, and message', () => {
    render(<EmptyState icon="✅" title="No tasks" message="Add your first task" />)
    expect(screen.getByText('✅')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No tasks' })).toBeInTheDocument()
    expect(screen.getByText('Add your first task')).toBeInTheDocument()
  })

  it('renders the action button when provided', async () => {
    const onClick = vi.fn()
    render(
      <EmptyState
        icon="📋"
        title="Empty"
        message="Nothing here"
        action={{ label: '+ Create Project', onClick }}
      />
    )
    const btn = screen.getByRole('button', { name: '+ Create Project' })
    expect(btn).toBeInTheDocument()
    await userEvent.click(btn)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not render a button when action is not provided', () => {
    render(<EmptyState icon="📋" title="Empty" message="Nothing here" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
