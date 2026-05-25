import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 120

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
  "architectureDiagram": "graph TD\\n  Client[Web App] --> API[API Gateway]\\n  API --> Auth[Auth Service]\\n  API --> Core[Core Service]\\n  Core --> DB[(Database)]\\n  Core --> Cache[(Redis Cache)]",
  "userJourneyDiagram": "sequenceDiagram\\n  actor User\\n  participant App\\n  participant API\\n  participant DB\\n  User->>App: Opens application\\n  App->>API: Request data\\n  API->>DB: Query\\n  DB-->>API: Results\\n  API-->>App: Response\\n  App-->>User: Display content",
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
  "dataModel": {
    "erdDiagram": "erDiagram\\n  USER ||--o{ ORDER : places\\n  ORDER ||--|{ LINE_ITEM : contains\\n  PRODUCT ||--o{ LINE_ITEM : includes",
    "tables": [
      {
        "tableName": "users",
        "description": "Core user accounts table for authentication and profile data.",
        "columns": [
          { "name": "id", "type": "UUID", "constraints": "PRIMARY KEY, DEFAULT gen_random_uuid()" },
          { "name": "email", "type": "VARCHAR(255)", "constraints": "UNIQUE, NOT NULL" },
          { "name": "name", "type": "VARCHAR(100)", "constraints": "NOT NULL" },
          { "name": "role", "type": "ENUM('admin','user','viewer')", "constraints": "DEFAULT 'user'" },
          { "name": "created_at", "type": "TIMESTAMPTZ", "constraints": "DEFAULT now()" }
        ],
        "indexes": ["idx_users_email ON users(email)"],
        "relationships": ["Has many orders", "Belongs to organization"]
      }
    ]
  },
  "apiEndpoints": [
    {
      "method": "GET",
      "path": "/api/v1/resource",
      "description": "Retrieve a list of resources with pagination.",
      "authentication": "Bearer Token (JWT)",
      "requestParams": ["page: number (default: 1)", "limit: number (default: 20)", "search: string (optional)"],
      "responseBody": "{ data: Resource[], meta: { total: number, page: number } }",
      "responseCodes": ["200 OK", "401 Unauthorized", "500 Internal Server Error"]
    },
    {
      "method": "POST",
      "path": "/api/v1/resource",
      "description": "Create a new resource.",
      "authentication": "Bearer Token (JWT)",
      "requestBody": ["name: string (required)", "description: string (optional)", "category_id: UUID (required)"],
      "responseBody": "{ data: Resource, message: 'Created' }",
      "responseCodes": ["201 Created", "400 Bad Request", "401 Unauthorized", "422 Unprocessable Entity"]
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
    const body = await req.json()
    const supabase = await createClient()

    // ── Input Validation ───────────────────────────────────────
    const idea = typeof body.idea === 'string' ? body.idea.trim() : ''
    const title = typeof body.title === 'string' ? body.title.trim() : ''

    if (!title || title.length < 2) {
      return NextResponse.json(
        { error: 'Project title is required (minimum 2 characters).' },
        { status: 400 }
      )
    }
    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Project title must be under 200 characters.' },
        { status: 400 }
      )
    }
    if (!idea || idea.length < 10) {
      return NextResponse.json(
        { error: 'Project description is required (minimum 10 characters).' },
        { status: 400 }
      )
    }
    if (idea.length > 10000) {
      return NextResponse.json(
        { error: 'Project description must be under 10,000 characters.' },
        { status: 400 }
      )
    }

    // ── Auth Check ─────────────────────────────────────────────
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const systemPrompt = `You are an elite Principal Product Manager and Solutions Architect with 15+ years of experience at top-tier technology companies. You write world-class Product Requirements Documents that engineering teams love.

Generate an extremely comprehensive, detailed, and actionable PRD. Every section should be deeply thought through — not generic filler. Use specific, concrete language. Include real numbers for metrics, genuine edge cases, and realistic technical recommendations.

Format the output as a valid JSON object matching this exact schema:
${PRD_SCHEMA}

CRITICAL RULES:
- Generate AT LEAST 3 user personas with rich detail.
- Generate AT LEAST 6 user stories across different personas, properly prioritized using MoSCoW.
- Generate AT LEAST 8 core features with full acceptance criteria.
- Generate AT LEAST 2 user flows with detailed steps.
- Generate AT LEAST 5 data model tables with realistic columns, constraints, indexes, and relationships.
- Generate AT LEAST 6 API endpoints covering CRUD and key business operations. Use RESTful conventions.
- Generate AT LEAST 3 milestones/phases with concrete deliverables.
- Generate AT LEAST 4 risks with mitigations.
- All metrics must be specific and measurable, not vague.
- The executive summary should be 3-5 substantial paragraphs.

MERMAID DIAGRAM RULES:
- "architectureDiagram" MUST be a valid Mermaid flowchart string using "graph TD" or "graph LR" syntax. Show the system components, services, databases, and external integrations. Use descriptive node labels. Do NOT wrap in markdown code fences.
- "userJourneyDiagram" MUST be a valid Mermaid sequenceDiagram string. Show the primary user interaction flow through the system with actors, participants, and message arrows. Do NOT wrap in markdown code fences.
- "dataModel.erdDiagram" MUST be a valid Mermaid erDiagram string. Show all table entities and their relationships using proper erDiagram relationship notation (||--o{, }|--|{, etc). Do NOT wrap in markdown code fences.
- Use \\n for newlines inside Mermaid strings. Do NOT use actual line breaks within the JSON string value.
- Do NOT use any special characters that could break Mermaid parsing (no semicolons in labels, no parentheses in node IDs).

- Respond with ONLY the JSON object, no markdown code blocks, no other text.`

    const userPrompt = `Project Title: ${title}\nProject Idea: ${idea}`

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
      console.error('AI API Error:', aiRes.status, errorText)
      throw new Error('AI generation failed. Please try again.')
    }

    const aiData = await aiRes.json()
    let prdContentRaw = aiData.candidates?.[0]?.content?.parts?.[0]?.text

    if (!prdContentRaw) {
      console.error('AI returned empty response:', JSON.stringify(aiData).substring(0, 500))
      throw new Error('AI returned an empty response. Please try again.')
    }

    if (prdContentRaw.startsWith('```json')) {
      prdContentRaw = prdContentRaw.replace(/^```json\n?/, '').replace(/\n?```$/, '')
    }

    // Attempt to parse AI-generated JSON with fallback for malformed output
    let prdContent
    try {
      prdContent = JSON.parse(prdContentRaw)
    } catch {
      console.error('AI returned malformed JSON. Raw output (first 500 chars):', prdContentRaw?.substring(0, 500))
      return NextResponse.json(
        { error: 'The AI produced an invalid response. Please try generating again — this is usually resolved on retry.' },
        { status: 502 }
      )
    }

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
    const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
