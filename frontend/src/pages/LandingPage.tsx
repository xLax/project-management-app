import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { login, register } from '../services/http'
import styles from './LandingPage.module.css'
import FormGroup from '../components/FormGroup'

type Tab = 'login' | 'register'

export default function LandingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<Tab>('login')

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (searchParams.get('tab') === 'register') setTab('register')
  }, [searchParams])

  // Already logged in → go to dashboard
  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/dashboard')
  }, [navigate])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await login(loginForm.email, loginForm.password)
      if (res.success && res.token) {
        localStorage.setItem('token', res.token)
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setError('Please fill in all fields.')
      return
    }
    if (registerForm.password !== registerForm.confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await register(registerForm.name, registerForm.email, registerForm.password)
      if (res.success && res.token) {
        localStorage.setItem('token', res.token)
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  function switchTab(t: Tab) {
    setTab(t)
    setError('')
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <span className="navbar-logo-icon">PM</span>
          <h1>Project Manager</h1>
          <p>Manage your projects and tasks efficiently</p>
        </div>

        <div className={styles.authTabs}>
          <button
            className={`${styles.authTab} ${tab === 'login' ? styles.active : ''}`}
            onClick={() => switchTab('login')}
          >
            Login
          </button>
          <button
            className={`${styles.authTab} ${tab === 'register' ? styles.active : ''}`}
            onClick={() => switchTab('register')}
          >
            Register
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className={styles.authForm}>
            <FormGroup label="Email" htmlFor="login-email">
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Password" htmlFor="login-password">
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </FormGroup>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className={styles.authSwitch}>
              Don't have an account?{' '}
              <span className="link" onClick={() => switchTab('register')}>Register</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.authForm}>
            <FormGroup label="Full Name" htmlFor="reg-name">
              <input
                id="reg-name"
                type="text"
                placeholder="John Doe"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Email" htmlFor="reg-email">
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Password" htmlFor="reg-password">
              <input
                id="reg-password"
                type="password"
                placeholder="••••••••"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Confirm Password" htmlFor="reg-confirm">
              <input
                id="reg-confirm"
                type="password"
                placeholder="••••••••"
                value={registerForm.confirm}
                onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
              />
            </FormGroup>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <p className={styles.authSwitch}>
              Already have an account?{' '}
              <span className="link" onClick={() => switchTab('login')}>Sign in</span>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
