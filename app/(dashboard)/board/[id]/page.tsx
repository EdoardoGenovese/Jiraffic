import { ActivityLog } from '@/components/features/activity/ActivityLog'
import { ActivityLogDrawer } from '@/components/features/activity/ActivityLogDrawer'
import { BoardViewWrapper } from '@/components/features/board/BoardViewWrapper'
import { MobileBoardView } from '@/components/features/board/MobileBoardView'
import { HeaderActions } from '@/components/layout/HeaderActions'
import { getActivityLog } from '@/lib/actions/activity'
import { getBoardWithColumns } from '@/lib/actions/boards'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
            <ArrowLeft className="inline" />
          </Link>
          <h1 className="font-semibold max-w-[30vw] break-all leading-tight">{board.name}</h1>
        </div>
        <HeaderActions boardId={board.id} boardName={board.name} />
      </header>

      <div className="flex flex-1 overflow-hidden items-start p-6 gap-6">
        <main className="flex-1 overflow-x-auto hidden lg:block">
          <BoardViewWrapper board={board} />
        </main>

        <aside className="w-84 shrink-0 border rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-57px)] sticky top-6 hidden lg:block">
          <h2 className="font-medium text-sm mb-4">Activity</h2>
          <ActivityLog activity={activity} />
        </aside>

        <main className="flex-1 lg:hidden">
          <MobileBoardView board={board} boardName={board.name} />
        </main>
        <ActivityLogDrawer activity={activity} />
      </div>
    </div>
  )
}
