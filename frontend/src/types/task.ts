export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done' | 'released'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
}

export interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
  onDelete?: (task: Task) => void
  projectId: string
  task?: Task | null
}

export type TaskFormState = {
  title: string
  description: string
  status: Task['status']
  priority: Task['priority']
  dueDate: string
}
