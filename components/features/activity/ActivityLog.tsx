'use client'

import { useState, useEffect } from 'react'
import type { ActivityLog as ActivityLogType } from '@/types/database'

interface ActivityLogProps {
  activity: ActivityLogType[]
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(dateString))
}

export function ActivityLog({ activity }: ActivityLogProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  if (activity.length === 0) {
    return <p className="text-muted-foreground text-xs">No activity yet.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {activity.map(item => (
        <div key={item.id} className="flex flex-col gap-1">
          <p className="text-sm">{item.action}</p>
          <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
        </div>
      ))}
    </div>
  )
}
