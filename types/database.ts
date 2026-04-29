export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Board = {
  id: string
  name: string
  owner_id: string
  created_at: string
}

export type BoardMember = {
  id: string
  board_id: string
  user_id: string
  role: 'owner' | 'member'
  created_at: string
}

export type Column = {
  id: string
  board_id: string
  name: string
  position: number
  created_at: string
}

export type Task = {
  id: string
  column_id: string
  title: string
  description: string | null
  position: number
  priority: 'low' | 'medium' | 'high'
  created_at: string
}

export type ActivityLog = {
  id: string
  board_id: string
  user_id: string
  action: string
  created_at: string
}

export type ColumnWithTasks = Column & {
  tasks: Task[]
}

export type BoardWithColumns = Board & {
  columns: ColumnWithTasks[]
}
