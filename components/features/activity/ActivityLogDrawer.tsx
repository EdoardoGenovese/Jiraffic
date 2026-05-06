'use client'

import { Button } from '@/components/ui/button'
import type { ActivityLog as ActivityLogType } from '@/types/database'
import { useEffect, useState } from 'react'

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(dateString))
}

interface ActivityLogDrawerProps {
  activity: ActivityLogType[]
}

export function ActivityLogDrawer({ activity }: ActivityLogDrawerProps) {
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button size="sm" variant="outline" onClick={() => setOpen(!open)} className="shadow-lg">
          {open ? 'Hide Activity' : `Activity`}
        </Button>
      </div>

      {open && (
        <div className="lg:hidden fixed bottom-16 right-4 w-84 max-h-96 overflow-y-auto bg-background border rounded-lg p-4 shadow-xl z-50">
          <h2 className="font-medium text-sm mb-4">Activity</h2>
          {activity.length === 0 ? (
            <p className="text-muted-foreground text-xs">No activity yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {activity.map(item => (
                <div key={item.id} className="flex flex-col gap-1">
                  <p className="text-sm">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
