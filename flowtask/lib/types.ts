export type Priority = "low" | "medium" | "high"
export type Filter =
  | "all"
  | "active"
  | "completed"
  | "today"
  | "upcoming"
  | "overdue"
  | "high"
  | "medium"
  | "low"
  | string
export type View = "list" | "board"
export type Theme = "light" | "dark" | "system"
export type SortOption =
  | "default"
  | "dateCreated"
  | "dateCreatedReverse"
  | "dueDate"
  | "dueDateReverse"
  | "alphabetical"
  | "alphabeticalReverse"

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: string
  completedAt?: string
  priority: Priority
  tags?: string[]
  dueDate?: string
  subtasks?: Task[]
}

