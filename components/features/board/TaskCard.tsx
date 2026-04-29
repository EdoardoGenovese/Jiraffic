'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TaskDialog } from './TaskDialog'
import type { Task } from '@/types/database'

const priorityColors = {
  low: 'secondary',
  medium: 'outline',
  high: 'destructive',
} as const

interface TaskCardProps {
  task: Task
  boardId: string
  onDialogOpenChange?: (open: boolean) => void
}

export function TaskCard({ task, boardId, onDialogOpenChange }: TaskCardProps) {
  const [open, setOpen] = useState(false)

  function handleOpenChange(value: boolean) {
    setOpen(value)
    onDialogOpenChange?.(value)
  }

  return (
    <>
      <Card
        className="cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => handleOpenChange(true)}
      >
        <CardContent className="p-3 flex flex-col gap-2">
          <p className="text-sm">{task.title}</p>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          )}
          <Badge variant={priorityColors[task.priority]} className="w-fit text-xs">
            {task.priority}
          </Badge>
        </CardContent>
      </Card>

      <TaskDialog task={task} boardId={boardId} open={open} onOpenChange={handleOpenChange} />
    </>
  )
}
