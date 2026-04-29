'use client'

import dynamic from 'next/dynamic'
import type { BoardWithColumns } from '@/types/database'

const BoardView = dynamic(() => import('./BoardView').then(mod => mod.BoardView), { ssr: false })

interface BoardViewWrapperProps {
  board: BoardWithColumns
}

export function BoardViewWrapper({ board }: BoardViewWrapperProps) {
  return <BoardView board={board} />
}
