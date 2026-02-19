import { useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <button
          className={styles.navbarLogo}
          onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}
          title="Project Manager"
        >
          <span className="navbar-logo-icon">PM</span>
          <span className="navbar-logo-text">Project Manager</span>
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

      <div className={styles.navbarRight}>
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
