'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createTask } from '@/lib/actions/tasks'
import type { ColumnWithTasks, Task } from '@/types/database'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface AddTaskButtonProps {
  columns: ColumnWithTasks[]
  boardId: string
}

export function AddTaskButton({ columns, boardId }: AddTaskButtonProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [columnId, setColumnId] = useState(columns[0]?.id ?? '')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!title.trim() || !columnId) return
    setLoading(true)
    try {
      await createTask(columnId, boardId, title.trim(), description, priority)
      setOpen(false)
      setTitle('')
      setDescription('')
      setPriority('medium')
      setColumnId(columns[0]?.id ?? '')
      window.location.reload()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 text-xs">
          <Plus className="inline" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new task</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label>Column</Label>
            <Select value={columnId} onValueChange={setColumnId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {columns.map(col => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="e.g. Fix login bug"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus
              maxLength={40}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-desc">Description (optional)</Label>
            <Textarea
              id="task-desc"
              placeholder="Add more details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="max-h-48 overflow-y-auto resize-none w-full min-w-0"
              style={{
                resize: 'none',
                wordBreak: 'break-all',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={v => setPriority(v as Task['priority'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreate} disabled={loading || !title.trim()}>
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
