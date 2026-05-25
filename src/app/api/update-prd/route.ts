import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 120

const PRD_SCHEMA = `{
  "executiveSummary": "...",
  "problemStatement": { "description": "...", "painPoints": [...], "currentAlternatives": "...", "marketGap": "..." },
  "goals": { "businessGoals": [...], "userGoals": [...], "nonGoals": [...] },
  "targetAudience": { "primaryAudience": "...", "secondaryAudience": "...", "marketSize": "..." },
  "userPersonas": [{ "name": "...", "role": "...", "age": "...", "description": "...", "goals": [...], "frustrations": [...], "technicalProficiency": "Low|Medium|High", "quote": "..." }],
  "userStories": [{ "persona": "...", "story": "As a [role], I want [action] so that [benefit].", "acceptanceCriteria": [...], "priority": "Must Have|Should Have|Could Have|Won't Have" }],
  "coreFeatures": [{ "feature": "...", "description": "...", "userBenefit": "...", "acceptanceCriteria": [...], "priority": "Must Have|Should Have|Could Have", "complexity": "Low|Medium|High", "estimatedEffort": "..." }],
  "userFlows": [{ "name": "...", "steps": [...], "happyPath": "...", "edgeCases": [...] }],
  "architectureDiagram": "Valid Mermaid graph TD syntax string with \\n newlines",
  "userJourneyDiagram": "Valid Mermaid sequenceDiagram syntax string with \\n newlines",
  "informationArchitecture": { "siteMap": [...], "navigationModel": "...", "keyScreens": [...] },
  "nonFunctionalRequirements": { "performance": [...], "security": [...], "scalability": [...], "accessibility": [...], "reliability": [...], "compliance": [...] },
  "techStackRecommendation": { "frontend": { "technology": "...", "reasoning": "..." }, "backend": { "technology": "...", "reasoning": "..." }, "database": { "technology": "...", "reasoning": "..." }, "infrastructure": { "technology": "...", "reasoning": "..." }, "thirdPartyServices": [{ "service": "...", "purpose": "..." }], "architecturePattern": "..." },
  "dataModel": { "erdDiagram": "Valid Mermaid erDiagram syntax string with \\n newlines", "tables": [{ "tableName": "...", "description": "...", "columns": [{ "name": "...", "type": "...", "constraints": "..." }], "indexes": [...], "relationships": [...] }] },
  "apiEndpoints": [{ "method": "GET|POST|PUT|PATCH|DELETE", "path": "/api/v1/...", "description": "...", "authentication": "...", "requestParams": [...], "requestBody": [...], "responseBody": "...", "responseCodes": [...] }],
  "milestones": [{ "phase": "...", "duration": "...", "deliverables": [...], "successMetrics": [...] }],
  "successMetrics": { "northStarMetric": "...", "primaryKPIs": [{ "metric": "...", "target": "...", "measurement": "..." }], "secondaryKPIs": [{ "metric": "...", "target": "...", "measurement": "..." }] },
  "risksAndMitigations": [{ "risk": "...", "impact": "High|Medium|Low", "likelihood": "High|Medium|Low", "mitigation": "..." }],
  "openQuestions": [...]
}`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prdId = typeof body.prdId === 'string' ? body.prdId.trim() : ''
    const revisionPrompt = typeof body.revisionPrompt === 'string' ? body.revisionPrompt.trim() : ''
    const previousContent = body.previousContent

    if (!prdId) {
      return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 })
    }
    if (!revisionPrompt || revisionPrompt.length < 3) {
      return NextResponse.json(
        { error: 'Revision prompt is required (minimum 3 characters).' },
        { status: 400 }
      )
    }
    if (revisionPrompt.length > 5000) {
      return NextResponse.json(
        { error: 'Revision prompt must be under 5,000 characters.' },
        { status: 400 }
      )
    }
    if (!previousContent || typeof previousContent !== 'object') {
      return NextResponse.json(
        { error: 'Previous document content is required.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: prd, error: prdError } = await supabase.from('prds').select('*').eq('id', prdId).single()
    if (prdError || !prd) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    if (prd.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // ISSUE-028: Enforce max version limit
    const { count: versionCount } = await supabase
      .from('prd_versions')
      .select('*', { count: 'exact', head: true })
      .eq('prd_id', prdId)
    if (versionCount && versionCount >= 50) {
      return NextResponse.json(
        { error: 'This document has reached the maximum of 50 versions. Please create a new document.' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are an elite Principal Product Manager and Solutions Architect revising an existing Product Requirements Document (PRD).

Apply the user's revision request to the existing PRD content. Maintain the same comprehensive structure and level of detail. Preserve all sections — only modify what the revision request asks for. Keep unchanged sections intact. If the revision request implies adding new features, personas, or details, integrate them naturally.

Format the output as a valid JSON object matching this exact schema:
${PRD_SCHEMA}

RULES:
- Preserve all existing content that is NOT affected by the revision.
- When adding or modifying, maintain the same level of depth and detail.
- Mermaid diagram strings (architectureDiagram, userJourneyDiagram, dataModel.erdDiagram) must use \\n for newlines and must NOT be wrapped in markdown code fences. They must be valid Mermaid syntax.
- Respond with ONLY the JSON object, no markdown code blocks, no other text.`

    const userPrompt = `Previous PRD Content: ${JSON.stringify(previousContent)}\n\nRevision Request: ${revisionPrompt}\n\nPlease generate the updated PRD JSON.`

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY environment variable is not set.')
      return NextResponse.json(
        { error: 'AI service is not configured. Please contact the administrator.' },
        { status: 500 }
      )
    }
    const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 65536,
            responseMimeType: 'application/json',
          },
        }),
      }
    )

    if (!aiRes.ok) {
      const errorText = await aiRes.text()
      console.error('AI API Error (update):', aiRes.status, errorText)
      throw new Error('AI revision failed. Please try again.')
    }

    const aiData = await aiRes.json()
    let prdContentRaw = aiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!prdContentRaw) {
      console.error('AI returned empty response during revision.')
      throw new Error('AI returned an empty response. Please try again.')
    }

    if (prdContentRaw.startsWith('```json')) {
      prdContentRaw = prdContentRaw.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    }
    let prdContent
    try {
      prdContent = JSON.parse(prdContentRaw)
    } catch {
      console.error('AI returned malformed JSON during revision.')
      return NextResponse.json(
        { error: 'The AI produced an invalid response. Please try revising again.' },
        { status: 502 }
      )
    }

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
