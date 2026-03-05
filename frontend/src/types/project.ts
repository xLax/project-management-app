import type { Task } from './task'

export interface Project {
  _id: string
  name: string
  description: string
  createdAt: string
  tasks: Task[]
}
