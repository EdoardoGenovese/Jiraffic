import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { auth } from '@clerk/nextjs/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { tasks } = await req.json()

  if (!tasks?.length) {
    return NextResponse.json({ error: 'No tasks provided' }, { status: 400 })
  }

  const taskList = tasks
    .map(
      (t: { title: string; description?: string; priority: string }, i: number) =>
        `${i + 1}. "${t.title}"${t.description ? ` — ${t.description}` : ''} (current priority: ${t.priority})`
    )
    .join('\n')

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    })

    const prompt = `You are a project management assistant. Analyze these tasks and suggest priorities.
Return ONLY a valid JSON array, no markdown, no code blocks, no explanation.
Format: [{ "id": number, "title": string, "suggestedPriority": "low" | "medium" | "high", "reason": string }]

Tasks to analyze:
${taskList}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array')
    }

    const validated = parsed.map((item, i) => ({
      id: item.id ?? i + 1,
      title: item.title ?? tasks[i]?.title ?? '',
      suggestedPriority: ['low', 'medium', 'high'].includes(item.suggestedPriority)
        ? item.suggestedPriority
        : 'medium',
      reason: item.reason ?? 'No reason provided',
    }))

    return NextResponse.json({ suggestions: validated })
  } catch (error: any) {
    console.error('Gemini error:', error)

    if (
      error?.status === 429 ||
      error?.statusText === 'Too Many Requests' ||
      error?.message?.includes('429')
    ) {
      return NextResponse.json({ error: 'quota_exceeded' }, { status: 429 })
    }

    return NextResponse.json({ error: 'AI analysis failed. Please try again.' }, { status: 500 })
  }
}
