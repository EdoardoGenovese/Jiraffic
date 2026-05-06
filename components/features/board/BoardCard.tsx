'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { Board } from '@/types/database'

interface BoardCardProps {
  board: Board & { lastActivity?: string }
}

function useLocalDate(dateString?: string) {
  const [formatted, setFormatted] = useState<string | null>(null)

  useEffect(() => {
    if (!dateString) return
    setFormatted(
      new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    )
  }, [dateString])

  return formatted
}

export function BoardCard({ board }: BoardCardProps) {
  const createdAt = useLocalDate(board.created_at)
  const lastActivity = useLocalDate(board.lastActivity)

  return (
    <Link href={`/board/${board.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-32">
        <CardHeader>
          <CardTitle className="text-base">{board.name}</CardTitle>
          <CardDescription className="text-xs flex flex-col gap-0.5">
            {createdAt && <span>Created {createdAt}</span>}
            {lastActivity && <span>Updated {lastActivity}</span>}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}