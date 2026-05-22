import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { idea, title } = await req.json()
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const systemPrompt = `You are an expert Product Manager. Generate a comprehensive Product Requirements Document (PRD) based on the user's idea.
Format the output as a valid JSON object with the following keys:
{
  "executiveSummary": "...",
  "userPersonas": [{ "name": "...", "description": "...", "needs": "..." }],
  "coreFeatures": [{ "feature": "...", "description": "...", "priority": "High|Medium|Low" }],
  "nonFunctionalRequirements": ["...", "..."],
  "techStackRecommendation": { "frontend": "...", "backend": "...", "database": "...", "reasoning": "..." }
}
Respond with ONLY the JSON object, no markdown code blocks, no other text.`

    const userPrompt = `Project Title: ${title}\nProject Idea: ${idea}`

    const apiKey = process.env.GROQ_API_KEY
    const baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'
    const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'

    const aiRes = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_completion_tokens: 4096,
        response_format: { type: 'json_object' },
      }),
    })

    if (!aiRes.ok) {
      const errorText = await aiRes.text()
      console.error('Groq API Error:', errorText)
      throw new Error(`AI generation failed: ${aiRes.statusText}`)
    }

    const aiData = await aiRes.json()
    let prdContentRaw = aiData.choices[0].message.content

    if (prdContentRaw.startsWith('```json')) {
      prdContentRaw = prdContentRaw.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    }

    const prdContent = JSON.parse(prdContentRaw)

    const { data: prd, error: prdError } = await supabase
      .from('prds')
      .insert({ user_id: user.id, title, idea })
      .select()
      .single()

    if (prdError) throw prdError

    const { error: versionError } = await supabase
      .from('prd_versions')
      .insert({ prd_id: prd.id, version_number: 1, content: prdContent })

    if (versionError) throw versionError

    return NextResponse.json({ success: true, prdId: prd.id })
  } catch (error: unknown) {
    console.error('Generate PRD Error:', error)
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
