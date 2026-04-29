import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { Board } from '@/types/database'

interface BoardCardProps {
  board: Board
}

export function BoardCard({ board }: BoardCardProps) {
  return (
    <Link href={`/board/${board.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-32">
        <CardHeader>
          <CardTitle className="text-base">{board.name}</CardTitle>
          <CardDescription className="text-xs">
            {new Date(board.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
