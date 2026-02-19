import type { Task } from './task'

export interface Project {
  id: string
  name: string
  description: string
  createdAt: string
  tasks: Task[]
}
