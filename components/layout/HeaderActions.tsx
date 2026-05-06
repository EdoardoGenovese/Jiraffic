'use client'

import { DeleteBoardButton } from '@/components/features/board/DeleteBoardButton'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth, UserButton } from '@clerk/nextjs'
import { ThemeToggle } from '../ui/theme-toggle'
import { CreateBoardButton } from '../features/board/CreateBoardButton'

interface HeaderActionsProps {
  boardId?: string
  boardName?: string
  isDashboard?: boolean
}

export function HeaderActions({ boardId, boardName, isDashboard }: HeaderActionsProps) {
  const { isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {isDashboard ? (
        <CreateBoardButton />
      ) : boardId && boardName ? (
        <DeleteBoardButton boardId={boardId} boardName={boardName} />
      ) : null}
      <UserButton appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />
      <ThemeToggle />
    </div>
  )
}
