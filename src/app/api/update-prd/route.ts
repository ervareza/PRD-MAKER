import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 60

const PRD_SCHEMA = `{
  "executiveSummary": "...",
  "problemStatement": { "description": "...", "painPoints": [...], "currentAlternatives": "...", "marketGap": "..." },
  "goals": { "businessGoals": [...], "userGoals": [...], "nonGoals": [...] },
  "targetAudience": { "primaryAudience": "...", "secondaryAudience": "...", "marketSize": "..." },
  "userPersonas": [{ "name": "...", "role": "...", "age": "...", "description": "...", "goals": [...], "frustrations": [...], "technicalProficiency": "Low|Medium|High", "quote": "..." }],
  "userStories": [{ "persona": "...", "story": "As a [role], I want [action] so that [benefit].", "acceptanceCriteria": [...], "priority": "Must Have|Should Have|Could Have|Won't Have" }],
  "coreFeatures": [{ "feature": "...", "description": "...", "userBenefit": "...", "acceptanceCriteria": [...], "priority": "Must Have|Should Have|Could Have", "complexity": "Low|Medium|High", "estimatedEffort": "..." }],
  "userFlows": [{ "name": "...", "steps": [...], "happyPath": "...", "edgeCases": [...] }],
  "informationArchitecture": { "siteMap": [...], "navigationModel": "...", "keyScreens": [...] },
  "nonFunctionalRequirements": { "performance": [...], "security": [...], "scalability": [...], "accessibility": [...], "reliability": [...], "compliance": [...] },
  "techStackRecommendation": { "frontend": { "technology": "...", "reasoning": "..." }, "backend": { "technology": "...", "reasoning": "..." }, "database": { "technology": "...", "reasoning": "..." }, "infrastructure": { "technology": "...", "reasoning": "..." }, "thirdPartyServices": [{ "service": "...", "purpose": "..." }], "architecturePattern": "..." },
  "dataModel": [{ "entity": "...", "fields": [...], "relationships": [...] }],
  "milestones": [{ "phase": "...", "duration": "...", "deliverables": [...], "successMetrics": [...] }],
  "successMetrics": { "northStarMetric": "...", "primaryKPIs": [{ "metric": "...", "target": "...", "measurement": "..." }], "secondaryKPIs": [{ "metric": "...", "target": "...", "measurement": "..." }] },
  "risksAndMitigations": [{ "risk": "...", "impact": "High|Medium|Low", "likelihood": "High|Medium|Low", "mitigation": "..." }],
  "openQuestions": [...]
}`

export async function POST(req: Request) {
  try {
    const { prdId, revisionPrompt, previousContent } = await req.json()
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: prd, error: prdError } = await supabase.from('prds').select('*').eq('id', prdId).single()
    if (prdError || prd.user_id !== user.id) return NextResponse.json({ error: 'Unauthorized or PRD not found' }, { status: 401 })

    const systemPrompt = `You are an elite Principal Product Manager revising an existing Product Requirements Document (PRD).

Apply the user's revision request to the existing PRD content. Maintain the same comprehensive structure and level of detail. Preserve all sections — only modify what the revision request asks for. Keep unchanged sections intact. If the revision request implies adding new features, personas, or details, integrate them naturally.

Format the output as a valid JSON object matching this exact schema:
${PRD_SCHEMA}

RULES:
- Preserve all existing content that is NOT affected by the revision.
- When adding or modifying, maintain the same level of depth and detail.
- Respond with ONLY the JSON object, no markdown code blocks, no other text.`

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
        max_completion_tokens: 8192,
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
