import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="navbar-logo"
          onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}
          title="Project Manager"
        >
          <span className="navbar-logo-icon">PM</span>
          <span className="navbar-logo-text">ProjectManager</span>
        </button>

        {isLoggedIn && (
          <button
            className="btn btn-ghost"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
        )}
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/projects/create')}
            >
              + Create Project
            </button>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={() => navigate('/?tab=register')}>
            Register
          </button>
        )}
      </div>
    </nav>
  )
}
