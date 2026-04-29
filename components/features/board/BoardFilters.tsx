'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Task } from '@/types/database'

type Priority = Task['priority'] | 'all'

interface BoardFiltersProps {
  search: string
  priority: Priority
  onSearchChange: (value: string) => void
  onPriorityChange: (value: Priority) => void
}

const priorities: { label: string; value: Priority }[] = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

export function BoardFilters({
  search,
  priority,
  onSearchChange,
  onPriorityChange,
}: BoardFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="w-48 h-8 text-sm"
      />
      <div className="flex items-center gap-1">
        {priorities.map(p => (
          <Button
            key={p.value}
            variant={priority === p.value ? 'default' : 'ghost'}
            size="sm"
            className="h-8 text-xs"
            onClick={() => onPriorityChange(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
