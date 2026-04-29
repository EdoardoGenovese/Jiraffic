'use client'

import { moveTask } from '@/lib/actions/tasks'
import type { BoardWithColumns, ColumnWithTasks, Task } from '@/types/database'
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AISuggestButton } from '../ai/AISuggestButton'
import { AddTaskButton } from './AddTaskButton'
import { BoardFilters } from './BoardFilters'
import { SortableTaskCard } from './SortableTaskCard'
import { TaskCard } from './TaskCard'

type Priority = Task['priority'] | 'all'

interface DroppableColumnProps {
  column: ColumnWithTasks
  boardId: string
  filteredTasks: Task[]
}

function DroppableColumn({ column, boardId, filteredTasks }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <div className="flex flex-col w-72 shrink-0 bg-muted/40 rounded-lg p-3 gap-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium">{column.name}</h3>
        <span className="text-xs text-muted-foreground">{filteredTasks.length}</span>
      </div>
      <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-col gap-2 flex-1 min-h-[40px]">
          {filteredTasks.map(task => (
            <SortableTaskCard key={task.id} task={task} boardId={boardId} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

interface BoardViewProps {
  board: BoardWithColumns
}

export function BoardView({ board }: BoardViewProps) {
  const [columns, setColumns] = useState(board.columns)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority>('all')

  const router = useRouter()

  function filterTasks(tasks: Task[]) {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      return matchesSearch && matchesPriority
    })
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  function findColumnOfTask(taskId: string) {
    return columns.find(col => col.tasks.some(t => t.id === taskId))
  }

  function findTarget(id: string) {
    const col = columns.find(c => c.id === id)
    if (col) return col

    return columns.find(c => c.tasks.some(t => t.id === id))
  }

  function handleDragStart({ active }: DragStartEvent) {
    const task = columns.flatMap(col => col.tasks).find(t => t.id === active.id)
    setActiveTask(task ?? null)
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over || active.id === over.id) return

    const activeCol = findTarget(active.id as string)
    const overCol = findTarget(over.id as string)

    if (!activeCol || !overCol) return

    setActiveColumnId(overCol.id)

    if (activeCol.id !== overCol.id) {
      setColumns(prev =>
        prev.map(col => {
          const task = activeCol.tasks.find(t => t.id === active.id)!
          if (col.id === activeCol.id)
            return { ...col, tasks: col.tasks.filter(t => t.id !== active.id) }
          if (col.id === overCol.id) return { ...col, tasks: [...col.tasks, task] }
          return col
        })
      )
      return
    }

    const oldIndex = activeCol.tasks.findIndex(t => t.id === active.id)
    const newIndex = activeCol.tasks.findIndex(t => t.id === over.id)

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

    setColumns(prev =>
      prev.map(col => {
        if (col.id !== activeCol.id) return col
        return { ...col, tasks: arrayMove(col.tasks, oldIndex, newIndex) }
      })
    )
  }

  async function handleDragEnd({ active }: DragEndEvent) {
    setActiveTask(null)

    const targetColumnId = activeColumnId
    setActiveColumnId(null)
    if (!targetColumnId) return

    const targetColumn = columns.find(col => col.id === targetColumnId)
    if (!targetColumn) return

    const newPosition = targetColumn.tasks.findIndex(t => t.id === active.id)

    await moveTask(active.id as string, targetColumn.id, newPosition, board.id)
    router.refresh()
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between gap-3">
          <BoardFilters
            search={search}
            priority={priorityFilter}
            onSearchChange={setSearch}
            onPriorityChange={setPriorityFilter}
          />
          <div className='flex gap-3'>
            <AddTaskButton columns={columns} boardId={board.id} />
            <AISuggestButton tasks={columns.flatMap(col => col.tasks)} boardId={board.id} />
          </div>
        </div>

        <div className="flex gap-4 flex-1">
          {columns.map(column => (
            <DroppableColumn
              key={column.id}
              column={column}
              boardId={board.id}
              filteredTasks={filterTasks(column.tasks)}
            />
          ))}
        </div>
      </div>

      <DragOverlay>{activeTask && <TaskCard task={activeTask} boardId={board.id} />}</DragOverlay>
    </DndContext>
  )
}
