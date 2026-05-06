'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <Button variant="ghost" size="icon" className="w-9 h-9" />

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Theme toggle"
    >
      {resolvedTheme === 'dark' ? '☀️' : '🌙'}
    </Button>
  )
}
