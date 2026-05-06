import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { Board } from '@/types/database'

interface BoardCardProps {
  board: Board & { lastActivity?: string }
}

export function BoardCard({ board }: BoardCardProps) {
  return (
    <Link href={`/board/${board.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-32">
        <CardHeader>
          <CardTitle className="text-base">{board.name}</CardTitle>
          <CardDescription className="text-xs flex flex-col gap-0.5">
            <span>
              Created{' '}
              {new Date(board.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {board.lastActivity && (
              <span>
                Updated{' '}
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }).format(new Date(board.lastActivity))}
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
