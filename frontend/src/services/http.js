// ─── Base URL ────────────────────────────────────────────────────────────────
// Switch this to your real backend URL when the backend is ready.
const BASE_URL = '/api'

// ─── Demo helpers (localStorage) ─────────────────────────────────────────────
function getStoredProjects() {
  return JSON.parse(localStorage.getItem('projects') || '[]')
}

function storeProjects(projects) {
  localStorage.setItem('projects', JSON.stringify(projects))
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Demo: always succeeds and returns a fake token.
 */
export async function login(email, password) {
  await delay(500)
  // TODO: replace with -> fetch(`${BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) })
  const token = 'demo-token-' + Date.now()
  return { token, success: true }
}

/**
 * POST /api/auth/register
 * Demo: always succeeds and returns a fake token.
 */
export async function register(name, email, password) {
  await delay(500)
  // TODO: replace with -> fetch(`${BASE_URL}/auth/register`, { method: 'POST', body: JSON.stringify({ name, email, password }) })
  const token = 'demo-token-' + Date.now()
  return { token, success: true }
}

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * GET /api/projects
 */
export async function getProjects() {
  await delay(300)
  // TODO: replace with -> fetch(`${BASE_URL}/projects`, { headers: authHeaders() })
  return getStoredProjects()
}

/**
 * GET /api/projects/:id
 */
export async function getProject(id) {
  await delay(300)
  // TODO: replace with -> fetch(`${BASE_URL}/projects/${id}`, { headers: authHeaders() })
  const projects = getStoredProjects()
  const project = projects.find((p) => p.id === id)
  if (!project) throw new Error('Project not found')
  return project
}

/**
 * POST /api/projects
 */
export async function createProject(data) {
  await delay(400)
  // TODO: replace with -> fetch(`${BASE_URL}/projects`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) })
  const projects = getStoredProjects()
  const newProject = {
    id: crypto.randomUUID(),
    ...data,
    tasks: [],
    createdAt: new Date().toISOString(),
  }
  projects.push(newProject)
  storeProjects(projects)
  return newProject
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

/**
 * POST /api/projects/:projectId/tasks
 */
export async function createTask(projectId, data) {
  await delay(400)
  // TODO: replace with -> fetch(`${BASE_URL}/projects/${projectId}/tasks`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) })
  const projects = getStoredProjects()
  const project = projects.find((p) => p.id === projectId)
  if (!project) throw new Error('Project not found')
  const newTask = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  }
  project.tasks.push(newTask)
  storeProjects(projects)
  return newTask
}

/**
 * PUT /api/projects/:projectId/tasks/:taskId
 */
export async function updateTask(projectId, taskId, data) {
  await delay(400)
  // TODO: replace with -> fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) })
  const projects = getStoredProjects()
  const project = projects.find((p) => p.id === projectId)
  if (!project) throw new Error('Project not found')
  const taskIndex = project.tasks.findIndex((t) => t.id === taskId)
  if (taskIndex === -1) throw new Error('Task not found')
  project.tasks[taskIndex] = { ...project.tasks[taskIndex], ...data }
  storeProjects(projects)
  return project.tasks[taskIndex]
}

/**
 * DELETE /api/projects/:projectId/tasks/:taskId
 */
export async function deleteTask(projectId, taskId) {
  await delay(300)
  // TODO: replace with -> fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, { method: 'DELETE', headers: authHeaders() })
  const projects = getStoredProjects()
  const project = projects.find((p) => p.id === projectId)
  if (!project) throw new Error('Project not found')
  project.tasks = project.tasks.filter((t) => t.id !== taskId)
  storeProjects(projects)
  return { success: true }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function authHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}
