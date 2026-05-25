import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

/**
 * ⚠️  DEV-ONLY: Seeds a comprehensive test PRD with all advanced fields.
 * Navigate to /api/seed-test-prd to create the test data.
 * 
 * WARNING: This file MUST be deleted or excluded before deploying to production.
 * It is guarded by NODE_ENV but should not exist in production bundles.
 */
export async function GET() {
  // DEV-ONLY: Block this route in production
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized — login first' }, { status: 401 })
    }

    const title = 'TaskFlow Pro — AI-Powered Project Management'
    const idea = 'An AI-powered project management platform for distributed engineering teams with smart sprint planning, risk detection, and automated standups.'

    const content = {
      executiveSummary: 'TaskFlow Pro is an AI-powered project management platform designed for distributed engineering teams. It combines intelligent sprint planning with real-time risk detection and automated standups to reduce meeting overhead by 60% while improving delivery predictability.\n\nThe platform leverages machine learning models trained on historical project data to predict sprint velocity, identify at-risk tasks before they become blockers, and generate comprehensive standup summaries from commit activity and ticket updates.\n\nTargeting mid-size to enterprise engineering organizations (50-500 engineers), TaskFlow Pro addresses the growing pain of coordination overhead in remote-first teams. The estimated addressable market is $4.2B globally.',
      problemStatement: {
        description: 'Distributed engineering teams waste 15-20% of productive hours on coordination overhead — standups that could be async, sprint planning based on gut feel rather than data, and risks discovered too late to mitigate.',
        painPoints: [
          'Daily standups consume 30+ minutes for teams across timezones',
          'Sprint velocity estimation is inaccurate, leading to consistent overcommitment',
          'Blocked tasks are discovered days late, causing cascade delays',
          'Context switching between 5+ tools fragments team awareness'
        ],
        currentAlternatives: 'Teams currently use combinations of Jira, Linear, or Asana with Slack and manual standup bots. None provide predictive analytics or automated risk detection.',
        marketGap: 'No existing tool combines AI-driven sprint planning, predictive risk analysis, and automated async standups in a single integrated platform.'
      },
      goals: {
        businessGoals: [
          'Achieve 10,000 paid team subscriptions within 18 months of launch',
          'Reach $5M ARR by end of Year 1',
          'Maintain net revenue retention above 120%'
        ],
        userGoals: [
          'Reduce time spent in synchronous meetings by 60%',
          'Improve sprint completion rate from industry average 70% to 90%+',
          'Identify blocked tasks within 4 hours instead of 2+ days'
        ],
        nonGoals: [
          'Building a full IDE or code review tool',
          'Replacing Slack/Teams as a communication platform',
          'Supporting non-engineering project management workflows in v1'
        ]
      },
      targetAudience: {
        primaryAudience: 'Engineering managers and tech leads at companies with 50-500 engineers, managing distributed teams across 2+ timezones.',
        secondaryAudience: 'Individual contributors (senior engineers) who want better visibility into sprint health and fewer interruptions.',
        marketSize: 'TAM: $4.2B (global project management software). SAM: $890M (engineering-specific tools). SOM: $45M (AI-enhanced PM for distributed teams).'
      },
      userPersonas: [
        {
          name: 'Maria Chen',
          role: 'Engineering Manager',
          age: '34',
          description: 'Manages 3 squads (18 engineers) across US and EU timezones. Spends 40% of her week in meetings and struggles to maintain visibility across all teams.',
          goals: ['Reduce meeting load to under 20% of work week', 'Get real-time health dashboards per squad', 'Automate sprint retrospective data collection'],
          frustrations: ['Standup meetings are mostly status reads', 'Sprint planning takes a full day per squad', 'Risk escalation happens too late'],
          technicalProficiency: 'High',
          quote: 'I need to manage three teams without tripling my meeting calendar.'
        },
        {
          name: 'James Okafor',
          role: 'Senior Backend Engineer',
          age: '29',
          description: 'Works remotely from Lagos. Highly productive when in flow state but frequently interrupted by standup scheduling and manual status updates.',
          goals: ['Async-first workflow with minimal interruptions', 'Clear visibility into what blocks his PRs', 'Automated daily status from his commits'],
          frustrations: ['8am standups in his timezone', 'Manually writing standup updates in Slack', 'No automated PR→ticket status sync'],
          technicalProficiency: 'High',
          quote: 'My git log IS my standup. Why do I have to type it again?'
        },
        {
          name: 'Sarah Kim',
          role: 'VP of Engineering',
          age: '42',
          description: 'Oversees 120 engineers across 8 squads. Needs portfolio-level visibility without micromanaging. Reports delivery metrics to the board quarterly.',
          goals: ['Portfolio-level sprint health at a glance', 'Predictive delivery dates for executive reporting', 'Data-driven resource allocation'],
          frustrations: ['No single dashboard for cross-team health', 'Delivery predictions are manual spreadsheets', 'Cannot compare velocity across teams fairly'],
          technicalProficiency: 'Medium',
          quote: 'I should not need to ask 8 managers how their sprints are going.'
        }
      ],
      userStories: [
        { persona: 'Maria Chen', story: 'As an engineering manager, I want AI-generated sprint plans based on historical velocity so that I can plan more accurately and reduce planning meeting time.', acceptanceCriteria: ['System suggests story point allocation based on last 6 sprints', 'Confidence interval shown for each sprint plan', 'Manager can override any suggestion'], priority: 'Must Have' },
        { persona: 'James Okafor', story: 'As a senior engineer, I want my daily standup auto-generated from my git commits and ticket updates so that I can skip synchronous standup meetings.', acceptanceCriteria: ['Standup summary generated by 9am in engineer local time', 'Includes commits, PR status, and ticket transitions', 'Engineer can edit before publishing'], priority: 'Must Have' },
        { persona: 'Maria Chen', story: 'As an engineering manager, I want real-time alerts when a task is likely blocked so that I can intervene before it impacts the sprint.', acceptanceCriteria: ['Alert fires within 4 hours of detected blocker pattern', 'Includes suggested resolution actions', 'Configurable sensitivity threshold'], priority: 'Must Have' },
        { persona: 'Sarah Kim', story: 'As a VP of Engineering, I want a portfolio dashboard showing all squad sprint health so that I can identify at-risk teams without asking managers.', acceptanceCriteria: ['Single page shows all 8 squads', 'Color-coded health indicators', 'Drill-down to individual sprint details'], priority: 'Must Have' },
        { persona: 'James Okafor', story: 'As a senior engineer, I want to see my team sprint progress without attending meetings so that I maintain focus on deep work.', acceptanceCriteria: ['Read-only sprint board accessible from sidebar', 'Shows blocker status and dependencies', 'Updates in real-time'], priority: 'Should Have' },
        { persona: 'Maria Chen', story: 'As an engineering manager, I want automated sprint retrospective summaries so that retro meetings focus on actions rather than data gathering.', acceptanceCriteria: ['Auto-generates what went well / what did not from sprint data', 'Includes velocity trends and blocker frequency', 'Exportable to Confluence/Notion'], priority: 'Should Have' },
        { persona: 'Sarah Kim', story: 'As a VP, I want predictive delivery dates for major initiatives so that I can give the board accurate timelines.', acceptanceCriteria: ['Monte Carlo simulation based on team velocity', 'Shows P50, P80, P95 delivery dates', 'Updates weekly as new data comes in'], priority: 'Should Have' },
        { persona: 'James Okafor', story: 'As an engineer, I want Slack notifications for items that need my action so that I do not miss blockers.', acceptanceCriteria: ['Configurable notification channels', 'Includes direct link to the blocked item', 'Respects Do Not Disturb hours'], priority: 'Could Have' }
      ],
      coreFeatures: [
        { feature: 'AI Sprint Planner', description: 'Uses historical velocity data and team capacity to generate optimal sprint plans with story point recommendations.', userBenefit: 'Reduces sprint planning from 4 hours to 30 minutes with higher accuracy.', acceptanceCriteria: ['Analyzes last 6 sprints of data', 'Accounts for team PTO and holidays', 'Provides confidence scores per item'], priority: 'Must Have', complexity: 'High', estimatedEffort: '3-4 sprints' },
        { feature: 'Automated Async Standups', description: 'Generates daily standup summaries from git activity, PR status, and ticket transitions. Publishes to configured channels.', userBenefit: 'Eliminates 30+ minutes of daily synchronous meetings.', acceptanceCriteria: ['Integrates with GitHub, GitLab, Bitbucket', 'Configurable summary format', 'Edit-before-publish flow'], priority: 'Must Have', complexity: 'Medium', estimatedEffort: '2-3 sprints' },
        { feature: 'Predictive Risk Engine', description: 'ML model that identifies tasks at risk of becoming blockers based on patterns like stale PRs, missing dependencies, and unusual commit patterns.', userBenefit: 'Catches blockers 2 days earlier than manual detection.', acceptanceCriteria: ['< 4 hour detection latency', 'False positive rate under 15%', 'Actionable recommendations per alert'], priority: 'Must Have', complexity: 'High', estimatedEffort: '4-5 sprints' },
        { feature: 'Portfolio Health Dashboard', description: 'Executive-level view showing sprint health, velocity trends, and delivery predictions across all squads.', userBenefit: 'VP-level visibility without manager interruption.', acceptanceCriteria: ['Real-time data refresh', 'Configurable health thresholds', 'Export to PDF for board reports'], priority: 'Must Have', complexity: 'Medium', estimatedEffort: '2-3 sprints' },
        { feature: 'Smart Sprint Board', description: 'Enhanced kanban board with AI-powered swimlanes that auto-organize by priority, risk level, and dependency chains.', userBenefit: 'Engineers see what matters most without manual board grooming.', acceptanceCriteria: ['Drag-and-drop reordering', 'Dependency visualization', 'Filter by assignee, risk, status'], priority: 'Should Have', complexity: 'Medium', estimatedEffort: '2 sprints' },
        { feature: 'Automated Retrospectives', description: 'AI-generated retro summaries with sentiment analysis from sprint data, PR comments, and optional team surveys.', userBenefit: 'Retro meetings focus on action items, not data presentation.', acceptanceCriteria: ['Auto-categorizes into went well / improve / action items', 'Tracks action item completion across sprints', 'Anonymized sentiment scoring'], priority: 'Should Have', complexity: 'Medium', estimatedEffort: '2 sprints' },
        { feature: 'Integrations Hub', description: 'Connect with GitHub, GitLab, Jira, Linear, Slack, and Teams via OAuth and webhooks.', userBenefit: 'Single source of truth without switching tools.', acceptanceCriteria: ['OAuth-based secure auth', 'Webhook event processing < 5s', 'Graceful degradation if integration is down'], priority: 'Must Have', complexity: 'High', estimatedEffort: '3 sprints' },
        { feature: 'Delivery Predictor', description: 'Monte Carlo simulation engine that generates probabilistic delivery dates for epics and initiatives.', userBenefit: 'Data-driven delivery commitments for stakeholder communication.', acceptanceCriteria: ['Shows P50/P80/P95 dates', 'Updates weekly with new velocity data', 'Visual timeline with confidence bands'], priority: 'Should Have', complexity: 'High', estimatedEffort: '3 sprints' }
      ],
      userFlows: [
        {
          name: 'New Sprint Planning',
          steps: ['Manager navigates to Sprint Planner', 'System loads backlog and historical velocity data', 'AI generates recommended sprint scope with confidence scores', 'Manager reviews and adjusts story point estimates', 'Manager approves sprint plan', 'System creates sprint board and notifies team via Slack'],
          happyPath: 'Manager accepts AI suggestion with minor tweaks, sprint is created in under 30 minutes.',
          edgeCases: ['Insufficient historical data (< 3 sprints) — show manual planning fallback', 'Team capacity changes mid-sprint — trigger re-planning suggestion', 'Backlog items have no story points — prompt for estimation']
        },
        {
          name: 'Daily Async Standup',
          steps: ['System collects git commits, PR updates, and ticket transitions overnight', 'AI generates personalized standup summary per engineer', 'Engineer receives draft via email/Slack at 9am local time', 'Engineer optionally edits the summary', 'Summary is published to team standup channel', 'Manager reviews aggregated team standup dashboard'],
          happyPath: 'Engineer glances at accurate summary, confirms with one click, total time < 2 minutes.',
          edgeCases: ['No activity detected — prompt engineer for manual update', 'Multiple repos — aggregate across all connected repos', 'Engineer on PTO — auto-skip with OOO notice']
        }
      ],
      architectureDiagram: 'graph TD\\n    Client[React SPA]-->|HTTPS|API[API Gateway]\\n    API-->|Auth|Auth[Auth Service]\\n    API-->|REST|Core[Core API]\\n    Core-->|Read/Write|DB[(PostgreSQL)]\\n    Core-->|Pub/Sub|Queue[Redis Queue]\\n    Queue-->|Process|Workers[Worker Pool]\\n    Workers-->|ML Inference|ML[Risk ML Service]\\n    Workers-->|Fetch|Git[Git Provider APIs]\\n    Workers-->|Notify|Notify[Notification Service]\\n    Notify-->|Webhook|Slack[Slack/Teams]\\n    ML-->|Read|DB\\n    Core-->|Cache|Cache[(Redis Cache)]',
      userJourneyDiagram: 'sequenceDiagram\\n    actor M as Manager\\n    participant UI as TaskFlow UI\\n    participant API as API Server\\n    participant AI as AI Engine\\n    participant DB as Database\\n    M->>UI: Open Sprint Planner\\n    UI->>API: GET /api/v1/sprint/suggest\\n    API->>DB: Fetch velocity history\\n    DB-->>API: Last 6 sprints data\\n    API->>AI: Generate sprint plan\\n    AI-->>API: Recommended scope + scores\\n    API-->>UI: Sprint suggestion\\n    UI-->>M: Display plan with confidence\\n    M->>UI: Approve with adjustments\\n    UI->>API: POST /api/v1/sprint/create\\n    API->>DB: Save sprint\\n    API-->>UI: Sprint created\\n    UI-->>M: Redirect to sprint board',
      informationArchitecture: {
        siteMap: ['/login', '/dashboard', '/sprint/plan', '/sprint/:id/board', '/sprint/:id/retro', '/team/standups', '/portfolio', '/settings', '/integrations'],
        navigationModel: 'Left sidebar with primary navigation (Dashboard, Sprints, Standups, Portfolio). Top bar with team selector and notifications. Breadcrumb navigation within sprint detail views.',
        keyScreens: ['Dashboard — Sprint health overview with action items', 'Sprint Board — Kanban with risk indicators', 'Standup Feed — Chronological team updates', 'Portfolio — Multi-team health grid', 'Sprint Planner — AI suggestion interface']
      },
      nonFunctionalRequirements: {
        performance: ['API response time < 200ms for p95', 'Dashboard load time < 2s on 3G', 'Real-time updates via WebSocket with < 500ms latency'],
        security: ['SOC 2 Type II compliance', 'All data encrypted at rest (AES-256) and in transit (TLS 1.3)', 'Role-based access control with team/org scoping', 'OAuth tokens stored with hardware-level encryption'],
        scalability: ['Support 10,000 concurrent users per region', 'Horizontal scaling via Kubernetes pods', 'Database read replicas for analytics queries'],
        accessibility: ['WCAG 2.1 AA compliance', 'Full keyboard navigation', 'Screen reader compatible dashboards'],
        reliability: ['99.9% uptime SLA', 'Automated failover for all critical services', 'Daily backups with 30-day retention'],
        compliance: ['GDPR compliant with data residency options (EU/US)', 'SOC 2 Type II certification by end of Year 1']
      },
      techStackRecommendation: {
        frontend: { technology: 'Next.js 15 + React 19 + TypeScript', reasoning: 'SSR for SEO, React Server Components for performance, TypeScript for type safety at scale.' },
        backend: { technology: 'Node.js + Fastify + TypeScript', reasoning: 'High throughput HTTP server, shared language with frontend, excellent async handling for I/O-bound work.' },
        database: { technology: 'PostgreSQL 16 + Redis 7', reasoning: 'PostgreSQL for relational data with JSONB for flexible sprint configs. Redis for caching, queues, and real-time pub/sub.' },
        infrastructure: { technology: 'AWS EKS + Terraform + GitHub Actions', reasoning: 'Kubernetes for auto-scaling workers, Terraform for IaC reproducibility, GitHub Actions for CI/CD.' },
        thirdPartyServices: [
          { service: 'Auth0', purpose: 'Enterprise SSO and OAuth provider management' },
          { service: 'Stripe', purpose: 'Subscription billing and usage-based pricing' },
          { service: 'Datadog', purpose: 'Observability, APM, and alerting' },
          { service: 'Resend', purpose: 'Transactional email for standup summaries' }
        ],
        architecturePattern: 'Modular monolith with event-driven extraction path. Core API as monolith, ML inference as separate microservice, background workers processing async jobs via Redis queues.'
      },
      dataModel: {
        erdDiagram: 'erDiagram\\n    ORGANIZATION ||--o{ TEAM : has\\n    TEAM ||--o{ MEMBER : contains\\n    TEAM ||--o{ SPRINT : runs\\n    SPRINT ||--o{ SPRINT_ITEM : includes\\n    MEMBER ||--o{ SPRINT_ITEM : assigned\\n    MEMBER ||--o{ STANDUP_ENTRY : writes\\n    SPRINT ||--o{ STANDUP_ENTRY : during\\n    ORGANIZATION {\\n        uuid id PK\\n        string name\\n        string plan\\n        timestamp created_at\\n    }\\n    TEAM {\\n        uuid id PK\\n        uuid org_id FK\\n        string name\\n        jsonb settings\\n    }\\n    MEMBER {\\n        uuid id PK\\n        uuid team_id FK\\n        uuid user_id FK\\n        string role\\n    }\\n    SPRINT {\\n        uuid id PK\\n        uuid team_id FK\\n        string name\\n        date start_date\\n        date end_date\\n        string status\\n    }\\n    SPRINT_ITEM {\\n        uuid id PK\\n        uuid sprint_id FK\\n        uuid assignee_id FK\\n        string title\\n        integer points\\n        string status\\n        string risk_level\\n    }\\n    STANDUP_ENTRY {\\n        uuid id PK\\n        uuid member_id FK\\n        uuid sprint_id FK\\n        text summary\\n        jsonb commits\\n        timestamp created_at\\n    }',
        tables: [
          {
            tableName: 'organizations',
            description: 'Top-level tenant for multi-org support',
            columns: [
              { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()' },
              { name: 'name', type: 'VARCHAR(255)', constraints: 'NOT NULL' },
              { name: 'plan', type: 'VARCHAR(50)', constraints: "NOT NULL DEFAULT 'free'" },
              { name: 'settings', type: 'JSONB', constraints: "DEFAULT '{}'" },
              { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'NOT NULL DEFAULT NOW()' }
            ],
            indexes: ['idx_organizations_plan ON organizations(plan)'],
            relationships: ['One organization has many teams']
          },
          {
            tableName: 'teams',
            description: 'Engineering squads within an organization',
            columns: [
              { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()' },
              { name: 'org_id', type: 'UUID', constraints: 'NOT NULL REFERENCES organizations(id) ON DELETE CASCADE' },
              { name: 'name', type: 'VARCHAR(255)', constraints: 'NOT NULL' },
              { name: 'slug', type: 'VARCHAR(100)', constraints: 'NOT NULL UNIQUE' },
              { name: 'settings', type: 'JSONB', constraints: "DEFAULT '{}'" },
              { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'NOT NULL DEFAULT NOW()' }
            ],
            indexes: ['idx_teams_org_id ON teams(org_id)', 'idx_teams_slug ON teams(slug)'],
            relationships: ['Belongs to one organization', 'Has many members', 'Has many sprints']
          },
          {
            tableName: 'members',
            description: 'Team membership linking users to teams with roles',
            columns: [
              { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()' },
              { name: 'team_id', type: 'UUID', constraints: 'NOT NULL REFERENCES teams(id) ON DELETE CASCADE' },
              { name: 'user_id', type: 'UUID', constraints: 'NOT NULL REFERENCES auth.users(id)' },
              { name: 'role', type: 'VARCHAR(50)', constraints: "NOT NULL DEFAULT 'member'" },
              { name: 'joined_at', type: 'TIMESTAMPTZ', constraints: 'NOT NULL DEFAULT NOW()' }
            ],
            indexes: ['UNIQUE idx_members_team_user ON members(team_id, user_id)'],
            relationships: ['Belongs to one team', 'References auth.users', 'Has many sprint items assigned', 'Has many standup entries']
          },
          {
            tableName: 'sprints',
            description: 'Sprint iterations with AI-generated planning data',
            columns: [
              { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()' },
              { name: 'team_id', type: 'UUID', constraints: 'NOT NULL REFERENCES teams(id) ON DELETE CASCADE' },
              { name: 'name', type: 'VARCHAR(255)', constraints: 'NOT NULL' },
              { name: 'start_date', type: 'DATE', constraints: 'NOT NULL' },
              { name: 'end_date', type: 'DATE', constraints: 'NOT NULL' },
              { name: 'status', type: 'VARCHAR(20)', constraints: "NOT NULL DEFAULT 'planning'" },
              { name: 'ai_plan', type: 'JSONB', constraints: 'AI-generated sprint plan data' },
              { name: 'velocity', type: 'INTEGER', constraints: 'Actual completed story points' },
              { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'NOT NULL DEFAULT NOW()' }
            ],
            indexes: ['idx_sprints_team_id ON sprints(team_id)', 'idx_sprints_status ON sprints(status)'],
            relationships: ['Belongs to one team', 'Has many sprint items', 'Has many standup entries']
          },
          {
            tableName: 'sprint_items',
            description: 'Individual work items (tickets/tasks) within a sprint',
            columns: [
              { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()' },
              { name: 'sprint_id', type: 'UUID', constraints: 'NOT NULL REFERENCES sprints(id) ON DELETE CASCADE' },
              { name: 'assignee_id', type: 'UUID', constraints: 'REFERENCES members(id)' },
              { name: 'title', type: 'VARCHAR(500)', constraints: 'NOT NULL' },
              { name: 'description', type: 'TEXT' },
              { name: 'points', type: 'INTEGER', constraints: 'DEFAULT 0' },
              { name: 'status', type: 'VARCHAR(30)', constraints: "NOT NULL DEFAULT 'todo'" },
              { name: 'risk_level', type: 'VARCHAR(20)', constraints: "DEFAULT 'none'" },
              { name: 'external_id', type: 'VARCHAR(255)', constraints: 'Jira/Linear/GitHub issue ID' },
              { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'NOT NULL DEFAULT NOW()' },
              { name: 'updated_at', type: 'TIMESTAMPTZ', constraints: 'NOT NULL DEFAULT NOW()' }
            ],
            indexes: ['idx_sprint_items_sprint_id ON sprint_items(sprint_id)', 'idx_sprint_items_assignee ON sprint_items(assignee_id)', 'idx_sprint_items_status ON sprint_items(status)'],
            relationships: ['Belongs to one sprint', 'Optionally assigned to one member']
          }
        ]
      },
      apiEndpoints: [
        { method: 'GET', path: '/api/v1/sprints', description: 'List all sprints for the current team with pagination and filters.', authentication: 'Bearer token (team member)', requestParams: ['team_id (required)', 'status (optional)', 'page (optional)', 'limit (optional)'], requestBody: [], responseBody: '{ sprints: Sprint[], total: number, page: number }', responseCodes: ['200 OK', '401 Unauthorized', '403 Forbidden'] },
        { method: 'POST', path: '/api/v1/sprints', description: 'Create a new sprint, optionally using AI-generated plan.', authentication: 'Bearer token (manager role)', requestParams: [], requestBody: ['team_id: string', 'name: string', 'start_date: string', 'end_date: string', 'use_ai_plan: boolean'], responseBody: '{ sprint: Sprint, ai_confidence: number }', responseCodes: ['201 Created', '400 Bad Request', '401 Unauthorized'] },
        { method: 'GET', path: '/api/v1/sprints/:id/suggest', description: 'Get AI-generated sprint plan suggestion based on historical velocity.', authentication: 'Bearer token (manager role)', requestParams: ['id (sprint UUID)'], requestBody: [], responseBody: '{ suggestions: SprintItem[], confidence: number, velocity_basis: number[] }', responseCodes: ['200 OK', '404 Not Found'] },
        { method: 'PATCH', path: '/api/v1/sprint-items/:id', description: 'Update a sprint item (status, assignee, points, risk level).', authentication: 'Bearer token (team member)', requestParams: ['id (item UUID)'], requestBody: ['status?: string', 'assignee_id?: string', 'points?: number', 'risk_level?: string'], responseBody: '{ item: SprintItem }', responseCodes: ['200 OK', '400 Bad Request', '404 Not Found'] },
        { method: 'GET', path: '/api/v1/standups', description: 'Get standup entries for a team, optionally filtered by date and member.', authentication: 'Bearer token (team member)', requestParams: ['team_id (required)', 'date (optional)', 'member_id (optional)'], requestBody: [], responseBody: '{ entries: StandupEntry[] }', responseCodes: ['200 OK', '401 Unauthorized'] },
        { method: 'POST', path: '/api/v1/standups/generate', description: 'Trigger AI generation of standup summary for the authenticated user.', authentication: 'Bearer token', requestParams: [], requestBody: ['team_id: string', 'date?: string'], responseBody: '{ entry: StandupEntry, sources: { commits: number, prs: number, tickets: number } }', responseCodes: ['200 OK', '429 Too Many Requests'] },
        { method: 'GET', path: '/api/v1/portfolio/health', description: 'Get portfolio-level health metrics across all teams in the organization.', authentication: 'Bearer token (org admin/VP)', requestParams: ['org_id (required)'], requestBody: [], responseBody: '{ teams: TeamHealth[], overall_score: number }', responseCodes: ['200 OK', '403 Forbidden'] },
        { method: 'DELETE', path: '/api/v1/sprints/:id', description: 'Delete a sprint (only if in planning status). Moves items back to backlog.', authentication: 'Bearer token (manager role)', requestParams: ['id (sprint UUID)'], requestBody: [], responseBody: '{ success: true, items_moved: number }', responseCodes: ['200 OK', '400 Bad Request (sprint already active)', '404 Not Found'] }
      ],
      milestones: [
        {
          phase: 'Phase 1 — Foundation',
          duration: '8 weeks',
          deliverables: ['Core data model and API scaffolding', 'GitHub/GitLab OAuth integration', 'Basic sprint board with drag-and-drop', 'User authentication and team management'],
          successMetrics: ['API responds < 200ms p95', 'Board supports 500+ items without lag', '100% test coverage on auth flows']
        },
        {
          phase: 'Phase 2 — AI Core',
          duration: '10 weeks',
          deliverables: ['AI Sprint Planner with velocity analysis', 'Automated standup generation from git data', 'Predictive Risk Engine v1', 'Slack/Teams notification integration'],
          successMetrics: ['Sprint suggestion accuracy > 75%', 'Standup generation < 30s', 'Risk detection within 4 hours', 'False positive rate < 15%']
        },
        {
          phase: 'Phase 3 — Enterprise & Scale',
          duration: '8 weeks',
          deliverables: ['Portfolio health dashboard', 'Delivery predictor (Monte Carlo)', 'SOC 2 compliance prep', 'Multi-org support and RBAC', 'Automated retrospective summaries'],
          successMetrics: ['Dashboard loads < 2s with 50 teams', 'Prediction accuracy within 15% of actual', 'Pass SOC 2 Type II readiness assessment']
        }
      ],
      successMetrics: {
        northStarMetric: 'Weekly active engineering teams with AI-assisted sprint completion rate > 85%',
        primaryKPIs: [
          { metric: 'Sprint Completion Rate', target: '> 85% (up from 70% baseline)', measurement: 'Completed points / planned points per sprint' },
          { metric: 'Meeting Time Reduction', target: '60% decrease in sync meeting hours', measurement: 'Calendar analysis before/after adoption' },
          { metric: 'Blocker Detection Speed', target: '< 4 hours from blocker onset', measurement: 'Time between first signal and alert fired' },
          { metric: 'Monthly Active Teams', target: '500 teams at month 6, 2000 at month 12', measurement: 'Teams with > 3 active members using the platform weekly' }
        ],
        secondaryKPIs: [
          { metric: 'NPS Score', target: '> 50', measurement: 'Quarterly NPS survey to team admins' },
          { metric: 'Standup Adoption Rate', target: '> 80% of team members using async standups', measurement: 'Auto-generated standups confirmed vs total team members' },
          { metric: 'AI Plan Acceptance Rate', target: '> 60% of suggestions accepted with minor edits', measurement: 'Accepted plans / total suggestions generated' }
        ]
      },
      risksAndMitigations: [
        { risk: 'AI sprint suggestions are inaccurate with limited historical data', impact: 'High', likelihood: 'High', mitigation: 'Implement graceful degradation — show manual planning for teams with < 3 sprints of history. Use industry benchmarks as initial priors.' },
        { risk: 'Git provider API rate limits throttle standup generation', impact: 'Medium', likelihood: 'Medium', mitigation: 'Implement aggressive caching, webhook-based event collection, and batch processing during off-peak hours.' },
        { risk: 'Enterprise customers require on-premise deployment', impact: 'High', likelihood: 'Medium', mitigation: 'Design for containerized deployment from day 1. Offer hybrid cloud option with data plane on-prem and control plane in cloud.' },
        { risk: 'Slack/Teams integration breaks with API changes', impact: 'Medium', likelihood: 'Low', mitigation: 'Abstract notification layer behind interface. Monitor Slack/Teams changelog and maintain integration test suite.' },
        { risk: 'SOC 2 certification timeline delays product launch', impact: 'High', likelihood: 'Medium', mitigation: 'Begin compliance preparation in Phase 1. Use automated compliance tools (Vanta/Drata) to accelerate audit readiness.' }
      ],
      openQuestions: [
        'Should we support Jira import for existing sprint history, or start fresh?',
        'What is the pricing model — per-seat, per-team, or usage-based?',
        'Do we need real-time collaboration on the sprint board (multiplayer cursors) or is eventual consistency sufficient?',
        'Should the risk engine use a pre-trained model or train per-organization?',
        'How do we handle teams that use both Jira AND Linear simultaneously?'
      ]
    }

    // Insert PRD
    const { data: prd, error: prdError } = await supabase
      .from('prds')
      .insert({ user_id: user.id, title, idea })
      .select()
      .single()

    if (prdError) throw prdError

    // Insert version
    const { error: versionError } = await supabase
      .from('prd_versions')
      .insert({ prd_id: prd.id, version_number: 1, content })

    if (versionError) {
      await supabase.from('prds').delete().eq('id', prd.id)
      throw versionError
    }

    return NextResponse.json({
      success: true,
      message: 'Test PRD created successfully!',
      prdId: prd.id,
      viewUrl: `/prd/${prd.id}`,
    })
  } catch (error: unknown) {
    console.error('Seed error:', error)
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
