'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Board, Column, Task, ColumnWithTasks, BoardWithColumns } from '@/types/database'

export async function getBoards(): Promise<Board[]> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createBoard(name: string): Promise<Board> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('boards')
    .insert({ name, owner_id: userId })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await supabase.from('columns').insert([
    { board_id: data.id, name: 'To Do', position: 0 },
    { board_id: data.id, name: 'In Progress', position: 1 },
    { board_id: data.id, name: 'Done', position: 2 },
  ])

  await supabase.from('activity_log').insert({
    board_id: data.id,
    user_id: userId,
    action: `Created board "${name}"`,
  })

  revalidatePath('/dashboard')
  return data
}

export async function deleteBoard(boardId: string): Promise<void> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data: board } = await supabase.from('boards').select('name').eq('id', boardId).single()

  const { error } = await supabase.from('boards').delete().eq('id', boardId).eq('owner_id', userId)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
}

export async function updateBoardName(boardId: string, name: string): Promise<void> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { error } = await supabase
    .from('boards')
    .update({ name })
    .eq('id', boardId)
    .eq('owner_id', userId)

  if (error) throw new Error(error.message)
  revalidatePath(`/board/${boardId}`)
}

export async function getBoardWithColumns(boardId: string): Promise<BoardWithColumns> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('boards')
    .select(
      `
      *,
      columns (
        *,
        tasks (*)
      )
    `
    )
    .eq('id', boardId)
    .single()

  if (error) throw new Error(error.message)

  data.columns = data.columns
    .sort((a: Column, b: Column) => a.position - b.position)
    .map((col: ColumnWithTasks) => ({
      ...col,
      tasks: col.tasks.sort((a: Task, b: Task) => a.position - b.position),
    }))

  return data
}
