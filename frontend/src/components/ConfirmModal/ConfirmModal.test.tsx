import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmModal from './ConfirmModal'

const baseProps = {
  isOpen: true,
  title: 'Delete Task',
  message: 'Are you sure you want to delete this?',
  onConfirm: vi.fn(),
  onCancel: vi.fn(),
}

describe('ConfirmModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when isOpen=false', () => {
    render(<ConfirmModal {...baseProps} isOpen={false} />)
    expect(screen.queryByText('Delete Task')).not.toBeInTheDocument()
  })

  it('renders the title and message when open', () => {
    render(<ConfirmModal {...baseProps} />)
    expect(screen.getByRole('heading', { name: 'Delete Task' })).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete this?')).toBeInTheDocument()
  })

  it('renders the default "Confirm" label', () => {
    render(<ConfirmModal {...baseProps} />)
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('renders a custom confirmLabel', () => {
    render(<ConfirmModal {...baseProps} confirmLabel="Delete" />)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls onCancel when Cancel button is clicked', async () => {
    const onCancel = vi.fn()
    render(<ConfirmModal {...baseProps} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when the ✕ close button is clicked', async () => {
    const onCancel = vi.fn()
    render(<ConfirmModal {...baseProps} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: '✕' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when the confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmModal {...baseProps} onConfirm={onConfirm} />)
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('applies btn-danger-solid class when danger=true', () => {
    render(<ConfirmModal {...baseProps} confirmLabel="Delete" danger />)
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('btn-danger-solid')
  })

  it('applies btn-primary class when danger=false', () => {
    render(<ConfirmModal {...baseProps} confirmLabel="OK" danger={false} />)
    expect(screen.getByRole('button', { name: 'OK' })).toHaveClass('btn-primary')
  })
})
