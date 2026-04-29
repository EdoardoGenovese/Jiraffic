'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import type { ActivityLog } from '@/types/database'

export async function getActivityLog(boardId: string): Promise<ActivityLog[]> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('board_id', boardId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw new Error(error.message)
  return data
}
