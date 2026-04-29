import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border/40">
        <span className="font-mono text-sm font-bold tracking-wider">🦒 Jiraffic</span>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Get started</Button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center text-center px-6 py-32 flex-1">
        <Badge variant="outline" className="mb-6 font-mono text-xs tracking-widest"></Badge>
        <h1 className="text-5xl sm:text-6xl font-light tracking-tight mb-6 max-w-3xl">
          Boards that don't <span className="font-bold text-primary">require a manual</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mb-10 leading-relaxed">
          Jiraffic is a fast, minimal project board with AI-powered priority suggestions. Built for
          developers who'd rather ship than manage tickets.
        </p>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link href="/sign-up">
            <Button size="lg" className="font-mono tracking-wide">
              Start for free →
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="font-mono tracking-wide">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      <section className="px-8 py-24 border-t border-border/40">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-mono text-muted-foreground tracking-widest mb-16 uppercase"></p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border/40 border border-border/40 rounded-lg overflow-hidden">
            <div className="bg-background p-8 flex flex-col gap-3">
              <span className="text-2xl">⚡</span>
              <h3 className="font-semibold">Drag & Drop</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Move tasks between columns instantly. Reorder, prioritize, reorganize — no friction.
              </p>
            </div>

            <div className="bg-background p-8 flex flex-col gap-3">
              <span className="text-2xl">✦</span>
              <h3 className="font-semibold">AI Priorities</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Let AI analyze your tasks and suggest what to tackle first. One click, instant
                insight.
              </p>
            </div>

            <div className="bg-background p-8 flex flex-col gap-3">
              <span className="text-2xl">📋</span>
              <h3 className="font-semibold">Activity Log</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every move tracked. Know exactly what happened on your board and when.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-24 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl font-light tracking-tight">
            Ready to stop drowning <span className="font-bold">in Jira tickets?</span>
          </h2>
          <p className="text-muted-foreground">
            Free to use. No credit card. No 47-step onboarding.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="font-mono tracking-wide">
              Create your first board →
            </Button>
          </Link>
        </div>
      </section>

      <footer className="px-8 py-6 border-t border-border/40 flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">
          🦒 jiraffic — {new Date().getFullYear()}
        </span>
        <span className="font-mono text-xs text-muted-foreground">built with Next.js + AI</span>
      </footer>
    </div>
  )
}
