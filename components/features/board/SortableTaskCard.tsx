'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskCard } from './TaskCard'
import type { Task } from '@/types/database'

interface SortableTaskCardProps {
  task: Task
  boardId: string
  onDialogOpenChange: (open: boolean) => void
}

export function SortableTaskCard({ task, boardId, onDialogOpenChange }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} boardId={boardId} onDialogOpenChange={onDialogOpenChange} />
    </div>
  )
}
