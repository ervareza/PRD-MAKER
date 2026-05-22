import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { prdId, revisionPrompt, previousContent } = await req.json()
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: prd, error: prdError } = await supabase.from('prds').select('*').eq('id', prdId).single()
    if (prdError || prd.user_id !== user.id) return NextResponse.json({ error: 'Unauthorized or PRD not found' }, { status: 401 })

    const systemPrompt = `You are an expert Product Manager. You are revising an existing Product Requirements Document (PRD).
Format the output as a valid JSON object with the following keys:
{
  "executiveSummary": "...",
  "userPersonas": [{ "name": "...", "description": "...", "needs": "..." }],
  "coreFeatures": [{ "feature": "...", "description": "...", "priority": "High|Medium|Low" }],
  "nonFunctionalRequirements": ["...", "..."],
  "techStackRecommendation": { "frontend": "...", "backend": "...", "database": "...", "reasoning": "..." }
}
Respond with ONLY the JSON object, no markdown code blocks, no other text.`

    const userPrompt = `Previous PRD Content: ${JSON.stringify(previousContent)}\n\nRevision Request: ${revisionPrompt}\n\nPlease generate the updated PRD JSON.`

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

    if (!aiRes.ok) throw new Error('AI generation failed')

    const aiData = await aiRes.json()
    let prdContentRaw = aiData.choices[0].message.content
    if (prdContentRaw.startsWith('```json')) {
      prdContentRaw = prdContentRaw.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    }
    const prdContent = JSON.parse(prdContentRaw)

    const { data: latestVersion } = await supabase
      .from('prd_versions')
      .select('version_number')
      .eq('prd_id', prdId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single()

    const newVersionNumber = (latestVersion?.version_number || 0) + 1

    const { error: versionError } = await supabase
      .from('prd_versions')
      .insert({ prd_id: prdId, version_number: newVersionNumber, content: prdContent })

    if (versionError) throw versionError

    await supabase.from('prds').update({ updated_at: new Date().toISOString() }).eq('id', prdId)

    return NextResponse.json({ success: true, version: newVersionNumber })
  } catch (error: unknown) {
    console.error('Update PRD Error:', error)
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
