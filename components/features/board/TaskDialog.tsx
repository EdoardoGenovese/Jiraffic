'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
import { deleteTask, moveTask, updateTask } from '@/lib/actions/tasks'
import type { ColumnWithTasks, Task } from '@/types/database'
import { useState } from 'react'

interface TaskDialogProps {
  task: Task
  boardId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  columns?: ColumnWithTasks[]
  showColumnSelect?: boolean
}

export function TaskDialog({
  task,
  boardId,
  open,
  onOpenChange,
  columns,
  showColumnSelect,
}: TaskDialogProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [priority, setPriority] = useState<Task['priority']>(task.priority)
  const [columnId, setColumnId] = useState(task.column_id)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    try {
      await updateTask(task.id, boardId, {
        title: title.trim(),
        description: description.trim() || null,
        priority,
      })
      if (columnId !== task.column_id && columns) {
        const newPosition = columns.find(c => c.id === columnId)?.tasks.length ?? 0
        await moveTask(task.id, columnId, newPosition, boardId)
      }
      onOpenChange(false)
      window.location.reload()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              maxLength={40}
            />
          </div>
          <div className="flex flex-col gap-2 container">
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Add more details..."
              className="max-h-48 overflow-y-auto resize-none w-full min-w-0"
              style={{
                resize: 'none',
                wordBreak: 'break-all',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            />
          </div>
          <div className="flex justify-between">
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

            {showColumnSelect && columns && (
              <div className="flex flex-col gap-2">
                <Label>Move to column</Label>
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
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={deleting} className="mr-auto">
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete task?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete <strong>"{task.title}"</strong>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      setDeleting(true)
                      await deleteTask(task.id, boardId)
                      onOpenChange(false)
                      window.location.reload()
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving || !title.trim()}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
