'use server'

import { createClient } from '@/lib/supabase/server'
import type { Task } from '@/types/database'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function createTask(
  columnId: string,
  boardId: string,
  title: string,
  description?: string,
  priority: Task['priority'] = 'medium'
): Promise<Task> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data: existingTasks } = await supabase
    .from('tasks')
    .select('position')
    .eq('column_id', columnId)
    .order('position', { ascending: false })
    .limit(1)

  const position = existingTasks?.[0]?.position ?? -1

  const { data, error } = await supabase
    .from('tasks')
    .insert({ column_id: columnId, title, description, priority, position: position + 1 })
    .select()
    .single()

  if (error) throw new Error(error.message)

  await supabase.from('activity_log').insert({
    board_id: boardId,
    user_id: userId,
    action: `Created task "${title}"`,
  })

  revalidatePath(`/board/${boardId}`)
  return data
}

export async function updateTask(
  taskId: string,
  boardId: string,
  updates: Partial<Pick<Task, 'title' | 'description' | 'priority'>>
): Promise<void> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data: original } = await supabase
    .from('tasks')
    .select('title, description, priority')
    .eq('id', taskId)
    .single()

  const { error } = await supabase.from('tasks').update(updates).eq('id', taskId)

  if (error) throw new Error(error.message)

  const changes: string[] = []

  if (updates.title && updates.title !== original?.title) {
    changes.push(`title to "${updates.title}"`)
  }
  if (updates.priority && updates.priority !== original?.priority) {
    changes.push(`priority from ${original?.priority} to ${updates.priority}`)
  }
  if ('description' in updates && updates.description !== original?.description) {
    changes.push('description updated')
  }

  if (changes.length > 0) {
    await supabase.from('activity_log').insert({
      board_id: boardId,
      user_id: userId,
      action: `Edited "${original?.title ?? 'task'}": ${changes.join(', ')}`,
    })
  }

  revalidatePath(`/board/${boardId}`)
}

export async function deleteTask(taskId: string, boardId: string): Promise<void> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data: task } = await supabase.from('tasks').select('title').eq('id', taskId).single()

  const { error } = await supabase.from('tasks').delete().eq('id', taskId)

  if (error) throw new Error(error.message)

  await supabase.from('activity_log').insert({
    board_id: boardId,
    user_id: userId,
    action: `Deleted task "${task?.title}"`,
  })

  revalidatePath(`/board/${boardId}`)
}

export async function moveTask(
  taskId: string,
  newColumnId: string,
  newPosition: number,
  boardId: string
): Promise<void> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data: task } = await supabase
    .from('tasks')
    .select('title, column_id')
    .eq('id', taskId)
    .single()

  const { data: columns } = await supabase
    .from('columns')
    .select('id, name')
    .in('id', [task?.column_id, newColumnId])

  const fromColumn = columns?.find(c => c.id === task?.column_id)?.name ?? 'Unknown'
  const toColumn = columns?.find(c => c.id === newColumnId)?.name ?? 'Unknown'

  const { error } = await supabase
    .from('tasks')
    .update({ column_id: newColumnId, position: newPosition })
    .eq('id', taskId)

  if (error) throw new Error(error.message)

  await supabase.from('activity_log').insert({
    board_id: boardId,
    user_id: userId,
    action:
      fromColumn === toColumn
        ? `Reordered "${task?.title}" in "${toColumn}"`
        : `Moved "${task?.title}" from "${fromColumn}" to "${toColumn}"`,
  })

  revalidatePath(`/board/${boardId}`)
}
