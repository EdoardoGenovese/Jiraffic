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

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `You are a project management assistant. Analyze these tasks and suggest priorities.
Return ONLY a valid JSON array, no markdown, no code blocks, no explanation.
Format: [{ "id": number, "title": string, "suggestedPriority": "low" | "medium" | "high", "reason": string }]

Tasks to analyze:
${taskList}`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const suggestions = JSON.parse(clean)
    return NextResponse.json({ suggestions })
  } catch {
    console.error('Failed to parse Gemini response:', text)
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
  }
}
