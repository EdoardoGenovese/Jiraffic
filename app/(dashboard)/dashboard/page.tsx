import { getBoards } from '@/lib/actions/boards'
import { BoardCard } from '@/components/features/board/BoardCard'
import { CreateBoardButton } from '@/components/features/board/CreateBoardButton'
import { UserButton } from '@clerk/nextjs'

export default async function DashboardPage() {
  const boards = await getBoards()

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Boards</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {boards.length} board{boards.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CreateBoardButton />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-4xl mb-4">🦒</p>
          <h2 className="text-lg font-medium mb-2">No boards yet</h2>
          <p className="text-muted-foreground text-sm">Create your first board to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map(board => (
            <BoardCard key={board.id} board={board} />
          ))}
        </div>
      )}
    </div>
  )
}
