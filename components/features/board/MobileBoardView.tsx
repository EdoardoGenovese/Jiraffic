'use client'

import type { BoardWithColumns, ColumnWithTasks, Task } from '@/types/database'
import { ChevronDown, Filter } from 'lucide-react'
import { useState } from 'react'
import { AISuggestButton } from '../ai/AISuggestButton'
import { AddTaskButton } from './AddTaskButton'
import { BoardFilters } from './BoardFilters'
import { TaskCard } from './TaskCard'

type Priority = Task['priority'] | 'all'

function MobileAccordion({
  column,
  boardId,
  allColumns,
  filteredTasks,
}: {
  column: ColumnWithTasks
  boardId: string
  allColumns: ColumnWithTasks[]
  filteredTasks: Task[]
}) {
  const [isOpen, setIsOpen] = useState(true)

  const isFiltered = filteredTasks.length !== column.tasks.length

  return (
    <div className="bg-muted/40 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{column.name}</h3>
          <span className="text-xs text-muted-foreground">
            {isFiltered ? `${filteredTasks.length}/${column.tasks.length}` : column.tasks.length}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-3 pb-3 flex flex-col gap-2">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                boardId={boardId}
                columns={allColumns}
                showColumnSelect
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">No tasks</p>
          )}
        </div>
      )}
    </div>
  )
}

interface MobileBoardViewProps {
  board: BoardWithColumns
  boardName: string
}

export function MobileBoardView({ board, boardName }: MobileBoardViewProps) {
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority>('all')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const hasActiveFilter = search || priorityFilter !== 'all'

  function filterTasks(tasks: Task[]) {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      return matchesSearch && matchesPriority
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setFiltersOpen(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
            hasActiveFilter
              ? 'border-primary/50 text-primary bg-primary/10'
              : 'border-input text-muted-foreground'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          {hasActiveFilter ? 'Filtered' : 'Filter'}
        </button>
        <AddTaskButton columns={board.columns} boardId={board.id} />
        <AISuggestButton tasks={board.columns.flatMap(col => col.tasks)} boardId={board.id} />
      </div>

      {filtersOpen && (
        <BoardFilters
          search={search}
          priority={priorityFilter}
          onSearchChange={setSearch}
          onPriorityChange={setPriorityFilter}
        />
      )}

      <div className="flex flex-col gap-3">
        {board.columns.map(column => (
          <MobileAccordion
            key={column.id}
            column={column}
            boardId={board.id}
            allColumns={board.columns}
            filteredTasks={filterTasks(column.tasks)}
          />
        ))}
      </div>
    </div>
  )
}
