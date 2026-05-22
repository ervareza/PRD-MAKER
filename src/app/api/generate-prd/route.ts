import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 60

const PRD_SCHEMA = `{
  "executiveSummary": "A comprehensive overview (3-5 paragraphs) covering the product vision, the problem being solved, the target market, key value propositions, and expected business impact.",
  "problemStatement": {
    "description": "Detailed description of the core problem or opportunity.",
    "painPoints": ["Specific pain point 1", "Specific pain point 2"],
    "currentAlternatives": "How users currently solve this problem without this product.",
    "marketGap": "What gap in the market this product fills."
  },
  "goals": {
    "businessGoals": ["Measurable business goal 1", "Measurable business goal 2"],
    "userGoals": ["What users will achieve 1", "What users will achieve 2"],
    "nonGoals": ["What this product explicitly will NOT do 1"]
  },
  "targetAudience": {
    "primaryAudience": "Description of primary target users.",
    "secondaryAudience": "Description of secondary target users.",
    "marketSize": "Estimated TAM/SAM/SOM or qualitative market size."
  },
  "userPersonas": [
    {
      "name": "Persona Name",
      "role": "Job Title / Role",
      "age": "Age range",
      "description": "Background and context about this persona.",
      "goals": ["Goal 1", "Goal 2"],
      "frustrations": ["Frustration 1", "Frustration 2"],
      "technicalProficiency": "Low | Medium | High",
      "quote": "A representative quote from this persona type."
    }
  ],
  "userStories": [
    {
      "persona": "Persona Name",
      "story": "As a [role], I want [action] so that [benefit].",
      "acceptanceCriteria": ["Criterion 1", "Criterion 2"],
      "priority": "Must Have | Should Have | Could Have | Won't Have"
    }
  ],
  "coreFeatures": [
    {
      "feature": "Feature Name",
      "description": "Detailed description of the feature and its purpose.",
      "userBenefit": "How this feature directly benefits the user.",
      "acceptanceCriteria": ["AC 1", "AC 2"],
      "priority": "Must Have | Should Have | Could Have",
      "complexity": "Low | Medium | High",
      "estimatedEffort": "e.g. 2-3 sprints"
    }
  ],
  "userFlows": [
    {
      "name": "Flow Name (e.g. User Onboarding)",
      "steps": ["Step 1: User arrives at landing page", "Step 2: User clicks Sign Up", "Step 3: ..."],
      "happyPath": "Description of the ideal flow outcome.",
      "edgeCases": ["Edge case 1", "Edge case 2"]
    }
  ],
  "informationArchitecture": {
    "siteMap": ["/ (Home)", "/dashboard", "/settings", "/profile"],
    "navigationModel": "Description of the navigation pattern (e.g. sidebar + top bar, tab-based).",
    "keyScreens": ["Screen 1 description", "Screen 2 description"]
  },
  "nonFunctionalRequirements": {
    "performance": ["Page load < 2s on 3G", "API response < 500ms p95"],
    "security": ["OAuth 2.0 / OIDC authentication", "Data encryption at rest and in transit", "OWASP Top 10 compliance"],
    "scalability": ["Support 10k concurrent users at launch", "Horizontal scaling strategy"],
    "accessibility": ["WCAG 2.1 AA compliance", "Screen reader support", "Keyboard navigation"],
    "reliability": ["99.9% uptime SLA", "Automated failover"],
    "compliance": ["GDPR compliance", "Data retention policies"]
  },
  "techStackRecommendation": {
    "frontend": { "technology": "Framework name", "reasoning": "Why this choice" },
    "backend": { "technology": "Framework name", "reasoning": "Why this choice" },
    "database": { "technology": "Database name", "reasoning": "Why this choice" },
    "infrastructure": { "technology": "Cloud provider / hosting", "reasoning": "Why this choice" },
    "thirdPartyServices": [{ "service": "Service name", "purpose": "What it's used for" }],
    "architecturePattern": "e.g. Monolith, Microservices, Serverless, Modular Monolith"
  },
  "dataModel": [
    {
      "entity": "Entity Name (e.g. User)",
      "fields": ["id: UUID (PK)", "email: string (unique)", "name: string", "created_at: timestamp"],
      "relationships": ["Has many Orders", "Belongs to Organization"]
    }
  ],
  "milestones": [
    {
      "phase": "Phase 1: MVP",
      "duration": "6-8 weeks",
      "deliverables": ["Core auth flow", "Basic dashboard", "Primary feature X"],
      "successMetrics": ["100 beta sign-ups", "< 5% error rate"]
    }
  ],
  "successMetrics": {
    "northStarMetric": "The single most important metric (e.g. Weekly Active Users).",
    "primaryKPIs": [
      { "metric": "KPI Name", "target": "Target value", "measurement": "How it's measured" }
    ],
    "secondaryKPIs": [
      { "metric": "KPI Name", "target": "Target value", "measurement": "How it's measured" }
    ]
  },
  "risksAndMitigations": [
    {
      "risk": "Description of the risk.",
      "impact": "High | Medium | Low",
      "likelihood": "High | Medium | Low",
      "mitigation": "How to prevent or handle this risk."
    }
  ],
  "openQuestions": ["Question that needs stakeholder input 1", "Technical decision pending 2"]
}`

export async function POST(req: Request) {
  try {
    const { idea, title } = await req.json()
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const systemPrompt = `You are an elite Principal Product Manager with 15+ years of experience at top-tier technology companies. You write world-class Product Requirements Documents that engineering teams love.

Generate an extremely comprehensive, detailed, and actionable PRD. Every section should be deeply thought through — not generic filler. Use specific, concrete language. Include real numbers for metrics, genuine edge cases, and realistic technical recommendations.

Format the output as a valid JSON object matching this exact schema:
${PRD_SCHEMA}

RULES:
- Generate AT LEAST 3 user personas with rich detail.
- Generate AT LEAST 6 user stories across different personas, properly prioritized using MoSCoW.
- Generate AT LEAST 8 core features with full acceptance criteria.
- Generate AT LEAST 2 user flows with detailed steps.
- Generate AT LEAST 3 data model entities with realistic fields.
- Generate AT LEAST 3 milestones/phases with concrete deliverables.
- Generate AT LEAST 4 risks with mitigations.
- All metrics must be specific and measurable, not vague.
- The executive summary should be 3-5 substantial paragraphs.
- Respond with ONLY the JSON object, no markdown code blocks, no other text.`

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
        max_completion_tokens: 8192,
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

    if (versionError) {
      await supabase.from('prds').delete().eq('id', prd.id)
      throw versionError
    }

    return NextResponse.json({ success: true, prdId: prd.id })
  } catch (error: unknown) {
    console.error('Generate PRD Error:', error)
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
