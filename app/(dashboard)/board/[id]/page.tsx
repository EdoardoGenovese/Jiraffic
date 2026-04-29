import { getBoardWithColumns } from '@/lib/actions/boards'
import { ActivityLog } from '@/components/features/activity/ActivityLog'
import { getActivityLog } from '@/lib/actions/activity'
import { BoardViewWrapper } from '@/components/features/board/BoardViewWrapper'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { DeleteBoardButton } from '@/components/features/board/DeleteBoardButton'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface BoardPageProps {
  params: Promise<{ id: string }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params
  const board = await getBoardWithColumns(id)
  const activity = await getActivityLog(id)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-3 border-b">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            ← Boards
          </Link>
          <h1 className="font-semibold">{board.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <DeleteBoardButton boardId={board.id} boardName={board.name} />
          <UserButton />
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden items-start p-6 gap-6">
        <main className="flex-1 overflow-x-auto">
          <BoardViewWrapper board={board} />
        </main>
        <aside className="w-72 shrink-0 border rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-57px)] sticky top-6">
          <h2 className="font-medium text-sm mb-4">Activity</h2>
          <ActivityLog activity={activity} />
        </aside>
      </div>
    </div>
  )
}
