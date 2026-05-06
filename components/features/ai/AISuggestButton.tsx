'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { updateTask } from '@/lib/actions/tasks'
import type { Task } from '@/types/database'
import { ArrowRight, Astroid } from 'lucide-react'

interface Suggestion {
  id: number
  title: string
  suggestedPriority: Task['priority']
  reason: string
}

interface AISuggestButtonProps {
  tasks: Task[]
  boardId: string
}

const priorityColors = {
  low: 'secondary',
  medium: 'outline',
  high: 'destructive',
} as const

export function AISuggestButton({ tasks, boardId }: AISuggestButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze() {
    setLoading(true)
    setSuggestions([])
    setError(null)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429) {
          setError(
            'Whoops! Looks like the developer ran out of daily AI tokens. Try again tomorrow! 🪫'
          )
        } else {
          setError(data.error ?? 'Something went wrong.')
        }
        return
      }

      setSuggestions(data.suggestions ?? [])
    } catch (e) {
      setError('Network error. Please try again.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleApplyAll() {
    setApplying(true)
    try {
      await Promise.all(
        suggestions.map((suggestion, index) =>
          updateTask(tasks[index].id, boardId, {
            priority: suggestion.suggestedPriority,
          })
        )
      )
      setOpen(false)
      window.location.reload()
    } catch (e) {
      console.error(e)
    } finally {
      setApplying(false)
    }
  }

  const allTasks = tasks

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-2"
          disabled={allTasks.length === 0}
        >
          ✦ AI Suggest
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>AI Priority Suggestions</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Analyze {allTasks.length} task{allTasks.length !== 1 ? 's' : ''} and get AI-powered
            priority suggestions.
          </p>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </p>
          )}
          {suggestions.length === 0 && !error ? (
            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block">⟳</span>
                  Analyzing...
                </span>
              ) : (
                '✦ Analyze Tasks'
              )}
            </Button>
          ) : !error ? (
            <>
              <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <div key={i} className="flex flex-col gap-1 p-3 rounded-md border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{s.title}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={priorityColors[tasks[i]?.priority ?? 'medium']}
                          className="text-xs"
                        >
                          {tasks[i]?.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          <ArrowRight className="inline" />
                        </span>
                        <Badge variant={priorityColors[s.suggestedPriority]} className="text-xs">
                          {s.suggestedPriority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.reason}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex-1"
                >
                  Re-analyze
                </Button>
                <Button size="sm" onClick={handleApplyAll} disabled={applying} className="flex-1">
                  {applying ? 'Applying...' : 'Apply All'}
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={handleAnalyze} disabled={loading}>
              Try again
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
