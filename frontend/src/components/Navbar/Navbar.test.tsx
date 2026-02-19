import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

function renderNavbar() {
  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the PM logo icon and name', () => {
    renderNavbar()
    expect(screen.getByText('PM')).toBeInTheDocument()
    expect(screen.getByText('Project Manager')).toBeInTheDocument()
  })

  it('shows Register button when logged out', () => {
    renderNavbar()
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
  })

  it('does not show Dashboard or Logout when logged out', () => {
    renderNavbar()
    expect(screen.queryByRole('button', { name: 'Dashboard' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument()
  })

  it('shows Dashboard, Create Project, and Logout when logged in', () => {
    localStorage.setItem('token', 'fake-token')
    renderNavbar()
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ Create Project' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()
  })

  it('does not show Register button when logged in', () => {
    localStorage.setItem('token', 'fake-token')
    renderNavbar()
    expect(screen.queryByRole('button', { name: 'Register' })).not.toBeInTheDocument()
  })

  it('removes the token from localStorage when Logout is clicked', async () => {
    localStorage.setItem('token', 'fake-token')
    renderNavbar()
    await userEvent.click(screen.getByRole('button', { name: 'Logout' }))
    expect(localStorage.getItem('token')).toBeNull()
  })
})
