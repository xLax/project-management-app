# Project Management App

A full-stack project management application built with **React** (frontend) and **Node.js / Express** (backend), backed by **MongoDB** via Mongoose.

Live Demo: https://project-management-app-eta-pink.vercel.app/

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)

---

## Features

### Authentication
- Register a new account (name, email, password)
- Login with email and password
- Logout (clears JWT and TanStack Query cache)
- Passwords hashed with **bcryptjs**
- Protected routes via **JWT** — users only see their own data

### Projects
- Create, edit, and delete projects
- Each project is owned by the authenticated user — no cross-user data leakage
- Delete confirmation requires typing the project name exactly as a safety measure

### Tasks
- Kanban board with four status columns: **To Do**, **In Progress**, **Done**, **Released**
- Create, edit, and delete tasks per project
- Task fields: title, description, status, priority (low / medium / high), optional due date
- Each column paginates at **5 tasks per page**
- Toggle to hide all "Released" tasks from the board

### UX
- TanStack Query cache cleared on logout — no stale data visible between sessions
- Form validation on both client (inline) and server (express-validator)
- Responsive layout

---

## Tech Stack

### Frontend
| Library | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| React Router v7 | Client-side routing |
| TanStack Query v5 | Server state, caching, mutations |
| CSS Modules | Scoped component styles |
| Vitest + jsdom | Unit testing |

### Backend
| Library | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | HTTP server & routing |
| Mongoose | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT auth |
| express-validator | Request validation |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable loading |
| nodemon | Dev auto-restart |

---

## Project Structure

```
project-management-app/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── models/
│   │   ├── User.js              # Mongoose User schema
│   │   ├── Project.js           # Mongoose Project schema
│   │   └── Task.js              # Mongoose Task schema
│   ├── routes/
│   │   ├── auth.js              # POST /api/auth/register|login|logout
│   │   └── projects.js          # CRUD for projects & tasks
│   ├── app.js                   # Express app entry point
│   ├── .env                     # Local environment variables (gitignored)
│   ├── .env.example             # Template for environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ConfirmModal/    # Generic confirmation dialog
    │   │   ├── DeleteProjectModal/ # Project delete with name confirmation
    │   │   ├── EmptyState/      # Empty list placeholder
    │   │   ├── FormGroup/       # Labelled form field wrapper
    │   │   ├── KanbanColumn/    # Paginated kanban column
    │   │   ├── Layout/          # Page shell with Navbar
    │   │   ├── Navbar/          # Top navigation bar
    │   │   ├── ProjectCard/     # Dashboard project card
    │   │   ├── ProjectModal/    # Edit project name/description
    │   │   ├── ProtectedRoute/  # Auth route guard
    │   │   ├── TaskCard/        # Kanban task card
    │   │   └── TaskModal/       # Create / edit task
    │   ├── pages/
    │   │   ├── LandingPage.tsx  # Login / Register page
    │   │   ├── Dashboard.tsx    # Projects list
    │   │   ├── ProjectDetails.tsx # Kanban board for a project
    │   │   └── CreateProject.tsx  # New project form
    │   ├── services/
    │   │   └── http.js          # All fetch calls to the backend API
    │   ├── types/               # TypeScript interfaces
    │   ├── queryClient.ts       # Shared TanStack QueryClient instance
    │   └── router.tsx           # Route definitions
    ├── .env                     # Local environment variables (gitignored)
    ├── .env.example             # Template for environment variables
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your values
npm run dev            # starts on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # update VITE_API_TARGET if your backend runs on a different port
npm run dev            # starts on http://localhost:5173
```

The Vite dev server proxies all `/api/*` requests to the backend, so no CORS issues during development.

---

## Environment Variables

### `backend/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWTs | `a_long_random_string` |
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:5173` |

### `frontend/.env`

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Root domain of the backend baked into the production bundle — **no `/api` suffix** | *(unset — uses proxy in dev)* |
| `VITE_API_TARGET` | Backend URL for the Vite dev-server proxy (dev only) | `http://localhost:5000` |

---

## API Reference

All routes except register and login require the header:
```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |
| POST | `/api/auth/logout` | Logout (requires auth) |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | Get all projects for the logged-in user (with tasks) |
| POST | `/api/projects` | Create a new project |
| GET | `/api/projects/:id` | Get a single project with its tasks |
| PUT | `/api/projects/:id` | Update project name / description |
| DELETE | `/api/projects/:id` | Delete a project and all its tasks |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects/:projectId/tasks` | Get all tasks for a project |
| POST | `/api/projects/:projectId/tasks` | Create a task |
| PUT | `/api/projects/:projectId/tasks/:taskId` | Update a task |
| DELETE | `/api/projects/:projectId/tasks/:taskId` | Delete a task |

---

© 2026 Liron Levi. All rights reserved.
