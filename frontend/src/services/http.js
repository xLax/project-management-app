// ─── Base URL ────────────────────────────────────────────────────────────────
const BASE_URL = '/api'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) {
    const message = data.errors?.[0]?.msg || data.message || 'Something went wrong.'
    throw new Error(message)
  }
  return data
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 */
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse(res)
}

/**
 * POST /api/auth/register
 */
export async function register(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  return handleResponse(res)
}

/**
 * POST /api/auth/logout
 */
export async function logout() {
  const token = localStorage.getItem('token')
  if (token) {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: authHeaders(),
    }).catch(() => {})
  }
  localStorage.removeItem('token')
}

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * GET /api/projects
 */
export async function getProjects() {
  const res = await fetch(`${BASE_URL}/projects`, { headers: authHeaders() })
  return handleResponse(res)
}

/**
 * GET /api/projects/:id  (returns project with tasks embedded)
 */
export async function getProject(id) {
  const res = await fetch(`${BASE_URL}/projects/${id}`, { headers: authHeaders() })
  return handleResponse(res)
}

/**
 * POST /api/projects
 */
export async function createProject(data) {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

/**
 * POST /api/projects/:projectId/tasks
 */
export async function createTask(projectId, data) {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

/**
 * PUT /api/projects/:projectId/tasks/:taskId
 */
export async function updateTask(projectId, taskId, data) {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

/**
 * DELETE /api/projects/:projectId/tasks/:taskId
 */
export async function deleteTask(projectId, taskId) {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handleResponse(res)
}
