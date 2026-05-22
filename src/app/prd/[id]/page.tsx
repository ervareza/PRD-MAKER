'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { generateMarkdownAndDownload } from '@/utils/exportMd'

interface PrdData {
  id: string
  title: string
  idea: string
  updated_at: string
}

interface PrdVersion {
  id: string
  version_number: number
  content: PrdContent
  created_at: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface PrdContent {
  executiveSummary?: string
  problemStatement?: {
    description?: string
    painPoints?: string[]
    currentAlternatives?: string
    marketGap?: string
  }
  goals?: {
    businessGoals?: string[]
    userGoals?: string[]
    nonGoals?: string[]
  }
  targetAudience?: {
    primaryAudience?: string
    secondaryAudience?: string
    marketSize?: string
  }
  userPersonas?: Array<{
    name: string
    role?: string
    age?: string
    description: string
    goals?: string[]
    frustrations?: string[]
    technicalProficiency?: string
    quote?: string
    needs?: string
  }>
  userStories?: Array<{
    persona?: string
    story: string
    acceptanceCriteria?: string[]
    priority?: string
  }>
  coreFeatures?: Array<{
    feature: string
    description: string
    userBenefit?: string
    acceptanceCriteria?: string[]
    priority: string
    complexity?: string
    estimatedEffort?: string
  }>
  userFlows?: Array<{
    name: string
    steps: string[]
    happyPath?: string
    edgeCases?: string[]
  }>
  informationArchitecture?: {
    siteMap?: string[]
    navigationModel?: string
    keyScreens?: string[]
  }
  nonFunctionalRequirements?: any
  techStackRecommendation?: any
  dataModel?: Array<{
    entity: string
    fields: string[]
    relationships?: string[]
  }>
  milestones?: Array<{
    phase: string
    duration?: string
    deliverables?: string[]
    successMetrics?: string[]
  }>
  successMetrics?: {
    northStarMetric?: string
    primaryKPIs?: Array<{ metric: string; target: string; measurement?: string }>
    secondaryKPIs?: Array<{ metric: string; target: string; measurement?: string }>
  }
  risksAndMitigations?: Array<{
    risk: string
    impact?: string
    likelihood?: string
    mitigation?: string
  }>
  openQuestions?: string[]
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Tiny reusable components ────────────────────────────────────────
function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} className="font-display text-xl font-semibold text-ink mb-4 scroll-mt-24">
      {children}
    </h2>
  )
}

function Divider() {
  return <hr className="border-border-subtle" />
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: string }) {
  const cls =
    variant === 'high' || variant === 'must'
      ? 'bg-accent-subtle text-accent'
      : variant === 'medium' || variant === 'should'
      ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      : variant === 'low' || variant === 'could'
      ? 'bg-surface-1 text-ink-tertiary'
      : variant === 'wont'
      ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
      : 'bg-surface-1 text-ink-secondary'
  return <span className={`shrink-0 text-[11px] font-mono px-2 py-0.5 rounded-sm ${cls}`}>{children}</span>
}

function priorityVariant(p?: string): string {
  const l = (p || '').toLowerCase()
  if (l.includes('must') || l === 'high') return 'must'
  if (l.includes('should') || l === 'medium') return 'should'
  if (l.includes('could') || l === 'low') return 'could'
  if (l.includes('won')) return 'wont'
  return 'default'
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-ink-secondary leading-relaxed">
      <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0 mt-[0.4em]" />
      <span>{children}</span>
    </li>
  )
}

// ── Table of Contents ───────────────────────────────────────────────
const TOC_ITEMS = [
  { id: 'executive-summary', label: 'Executive Summary' },
  { id: 'problem-statement', label: 'Problem Statement' },
  { id: 'goals', label: 'Goals & Non-Goals' },
  { id: 'target-audience', label: 'Target Audience' },
  { id: 'user-personas', label: 'User Personas' },
  { id: 'user-stories', label: 'User Stories' },
  { id: 'core-features', label: 'Core Features' },
  { id: 'user-flows', label: 'User Flows' },
  { id: 'information-architecture', label: 'Information Architecture' },
  { id: 'nfr', label: 'Non-Functional Requirements' },
  { id: 'tech-stack', label: 'Tech Stack' },
  { id: 'data-model', label: 'Data Model' },
  { id: 'milestones', label: 'Milestones & Timeline' },
  { id: 'success-metrics', label: 'Success Metrics' },
  { id: 'risks', label: 'Risks & Mitigations' },
  { id: 'open-questions', label: 'Open Questions' },
]

// ── Main Page ───────────────────────────────────────────────────────
export default function PrdViewPage() {
  const { id } = useParams()
  const supabase = createClient()
  const [prd, setPrd] = useState<PrdData | null>(null)
  const [versions, setVersions] = useState<PrdVersion[]>([])
  const [activeVersion, setActiveVersion] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)
  const [revisionPrompt, setRevisionPrompt] = useState('')
  const [isRevising, setIsRevising] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showToc, setShowToc] = useState(false)

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const { data: prdData, error: prdError } = await supabase.from('prds').select('*').eq('id', id).single()
        if (prdError) throw prdError

        const { data: versionData, error: versionError } = await supabase
          .from('prd_versions')
          .select('*')
          .eq('prd_id', id)
          .order('version_number', { ascending: true })
        
        if (versionError) throw versionError

        if (isMounted) {
          setPrd(prdData)
          if (versionData && versionData.length > 0) {
            setVersions(versionData)
            setActiveVersion(versionData[versionData.length - 1].version_number)
          }
        }
      } catch (error) {
        console.error('Error fetching PRD:', error)
        if (isMounted) {
          setPrd(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [id, supabase, refreshTrigger])

  const handleRevise = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!revisionPrompt) return
    setIsRevising(true)
    const currentContent = versions.find((v) => v.version_number === activeVersion)?.content

    try {
      const res = await fetch('/api/update-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prdId: id, revisionPrompt, previousContent: currentContent }),
      })
      if (res.ok) {
        setRevisionPrompt('')
        setIsLoading(true)
        setRefreshTrigger((prev) => prev + 1)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsRevising(false)
    }
  }

  const handleExportMd = () => {
    const c = versions.find((v) => v.version_number === activeVersion)?.content
    if (!c || !prd) return
    generateMarkdownAndDownload(prd.title, activeVersion, c)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-full">
        <svg className="w-6 h-6 animate-spin text-accent" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.2" />
          <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  if (!prd) {
    return (
      <div className="flex justify-center items-center min-h-full">
        <p className="text-danger">Document not found</p>
      </div>
    )
  }

  const c = versions.find((v) => v.version_number === activeVersion)?.content

  // Helper to safely handle NFRs that could be old format (string[]) or new format (object)
  const renderNfr = () => {
    if (!c?.nonFunctionalRequirements) return null
    const nfr = c.nonFunctionalRequirements
    if (Array.isArray(nfr)) {
      // Legacy format: simple string array
      return (
        <ul className="space-y-1.5">
          {nfr.map((r: string, i: number) => <Bullet key={i}>{r}</Bullet>)}
        </ul>
      )
    }
    // New format: categorised object
    const categories = Object.entries(nfr).filter(([, v]) => Array.isArray(v) && (v as string[]).length > 0)
    return (
      <div className="space-y-5">
        {categories.map(([cat, items]) => (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-ink capitalize mb-2">{cat}</h3>
            <ul className="space-y-1.5">
              {(items as string[]).map((item, i) => <Bullet key={i}>{item}</Bullet>)}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  // Helper for tech stack — handle both old (string) and new (object) formats
  const renderTechLayer = (label: string, entry: unknown) => {
    if (!entry) return null
    const tech = typeof entry === 'string' ? entry : (entry as { technology?: string }).technology || ''
    const reason = typeof entry === 'object' ? (entry as { reasoning?: string }).reasoning : undefined
    return (
      <div className="bg-surface-0 p-4 rounded-md border border-border-subtle">
        <p className="text-[10px] uppercase tracking-widest text-ink-ghost font-medium mb-1">{label}</p>
        <p className="text-sm font-medium text-ink">{tech}</p>
        {reason && <p className="text-xs text-ink-tertiary mt-1 leading-relaxed">{reason}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 pb-6 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 print:hidden">
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-bold text-ink truncate">{prd.title}</h1>
              <p className="text-sm text-ink-tertiary mt-0.5 italic truncate">{prd.idea}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowToc(!showToc)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-secondary bg-surface-raised border border-border rounded-md hover:bg-surface-1 transition-colors"
                title="Table of Contents"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 3h8M2 6h6M2 9h4" />
                </svg>
                ToC
              </button>
              <select
                value={activeVersion}
                onChange={(e) => setActiveVersion(Number(e.target.value))}
                className="bg-surface-raised border border-border rounded-md px-2.5 py-1.5 text-xs font-mono text-ink focus:ring-2 focus:ring-accent"
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.version_number}>
                    v{v.version_number}
                  </option>
                ))}
              </select>
              <button
                onClick={handleExportMd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-secondary bg-surface-raised border border-border rounded-md hover:bg-surface-1 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 1v8M3 6l3 3 3-3M1 10h10" />
                </svg>
                .md
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-secondary bg-surface-raised border border-border rounded-md hover:bg-surface-1 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 4V1h6v3M1 4h10v5H9v2H3V9H1z" />
                </svg>
                PDF
              </button>
            </div>
          </div>

          {/* Table of Contents Panel */}
          {showToc && (
            <nav className="bg-surface-raised border border-border rounded-lg p-5 mb-6 print:hidden">
              <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-3">Table of Contents</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {TOC_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setShowToc(false)}
                    className="text-sm text-ink-secondary hover:text-accent transition-colors py-0.5 truncate"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>
          )}

          {/* Document Body */}
          {c && (
            <article className="bg-surface-raised border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 sm:p-10 space-y-10 print:shadow-none print:border-none print:p-0">
              {/* Print header */}
              <div className="hidden print:block border-b border-border pb-6 mb-8">
                <h1 className="font-display text-3xl font-bold">{prd.title}</h1>
                <p className="text-sm text-ink-tertiary mt-1">
                  Product Requirements Document — v{activeVersion}
                </p>
              </div>

              {/* ─── 1. Executive Summary ─── */}
              {c.executiveSummary && (
                <section>
                  <SectionTitle id="executive-summary">Executive Summary</SectionTitle>
                  <div className="text-ink-secondary leading-[1.75] text-[15px] space-y-3" style={{ textWrap: 'pretty' } as React.CSSProperties}>
                    {c.executiveSummary.split('\n').filter(Boolean).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>
              )}

              <Divider />

              {/* ─── 2. Problem Statement ─── */}
              {c.problemStatement && (
                <section>
                  <SectionTitle id="problem-statement">Problem Statement</SectionTitle>
                  {c.problemStatement.description && (
                    <p className="text-ink-secondary text-[15px] leading-[1.75] mb-4" style={{ textWrap: 'pretty' } as React.CSSProperties}>
                      {c.problemStatement.description}
                    </p>
                  )}
                  <div className="grid gap-4 sm:grid-cols-3">
                    {c.problemStatement.painPoints && c.problemStatement.painPoints.length > 0 && (
                      <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                        <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">Pain Points</h3>
                        <ul className="space-y-1.5">
                          {c.problemStatement.painPoints.map((p, i) => <Bullet key={i}>{p}</Bullet>)}
                        </ul>
                      </div>
                    )}
                    {c.problemStatement.currentAlternatives && (
                      <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                        <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">Current Alternatives</h3>
                        <p className="text-sm text-ink-secondary leading-relaxed">{c.problemStatement.currentAlternatives}</p>
                      </div>
                    )}
                    {c.problemStatement.marketGap && (
                      <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                        <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">Market Gap</h3>
                        <p className="text-sm text-ink-secondary leading-relaxed">{c.problemStatement.marketGap}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <Divider />

              {/* ─── 3. Goals ─── */}
              {c.goals && (
                <section>
                  <SectionTitle id="goals">Goals &amp; Non-Goals</SectionTitle>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {c.goals.businessGoals && c.goals.businessGoals.length > 0 && (
                      <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                        <h3 className="text-xs font-mono font-bold text-accent uppercase tracking-widest mb-2">Business Goals</h3>
                        <ul className="space-y-1.5">
                          {c.goals.businessGoals.map((g, i) => <Bullet key={i}>{g}</Bullet>)}
                        </ul>
                      </div>
                    )}
                    {c.goals.userGoals && c.goals.userGoals.length > 0 && (
                      <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                        <h3 className="text-xs font-mono font-bold text-accent uppercase tracking-widest mb-2">User Goals</h3>
                        <ul className="space-y-1.5">
                          {c.goals.userGoals.map((g, i) => <Bullet key={i}>{g}</Bullet>)}
                        </ul>
                      </div>
                    )}
                    {c.goals.nonGoals && c.goals.nonGoals.length > 0 && (
                      <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                        <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">Non-Goals</h3>
                        <ul className="space-y-1.5">
                          {c.goals.nonGoals.map((g, i) => <Bullet key={i}>{g}</Bullet>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <Divider />

              {/* ─── 4. Target Audience ─── */}
              {c.targetAudience && (
                <section>
                  <SectionTitle id="target-audience">Target Audience</SectionTitle>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {c.targetAudience.primaryAudience && (
                      <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                        <h3 className="text-xs font-mono font-bold text-accent uppercase tracking-widest mb-2">Primary</h3>
                        <p className="text-sm text-ink-secondary leading-relaxed">{c.targetAudience.primaryAudience}</p>
                      </div>
                    )}
                    {c.targetAudience.secondaryAudience && (
                      <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                        <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">Secondary</h3>
                        <p className="text-sm text-ink-secondary leading-relaxed">{c.targetAudience.secondaryAudience}</p>
                      </div>
                    )}
                    {c.targetAudience.marketSize && (
                      <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                        <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">Market Size</h3>
                        <p className="text-sm text-ink-secondary leading-relaxed">{c.targetAudience.marketSize}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <Divider />

              {/* ─── 5. User Personas ─── */}
              {c.userPersonas && c.userPersonas.length > 0 && (
                <section>
                  <SectionTitle id="user-personas">User Personas</SectionTitle>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {c.userPersonas.map((p, i) => (
                      <div key={i} className="bg-surface-0 border border-border-subtle rounded-md p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-ink text-sm">{p.name}</h3>
                            {p.role && <p className="text-xs text-ink-tertiary">{p.role}{p.age ? ` · ${p.age}` : ''}</p>}
                          </div>
                          {p.technicalProficiency && <Badge>{p.technicalProficiency}</Badge>}
                        </div>
                        <p className="text-ink-secondary text-sm leading-relaxed">{p.description}</p>
                        {p.goals && p.goals.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-ink mb-1">Goals</p>
                            <ul className="space-y-0.5">
                              {p.goals.map((g, gi) => (
                                <li key={gi} className="text-xs text-ink-secondary flex items-baseline gap-1.5">
                                  <span className="text-accent">→</span> {g}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {p.frustrations && p.frustrations.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-ink mb-1">Frustrations</p>
                            <ul className="space-y-0.5">
                              {p.frustrations.map((f, fi) => (
                                <li key={fi} className="text-xs text-ink-secondary flex items-baseline gap-1.5">
                                  <span className="text-red-500">✕</span> {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {/* Legacy support */}
                        {p.needs && !p.goals && (
                          <p className="text-xs text-ink-tertiary">
                            <span className="font-medium text-ink">Needs:</span> {p.needs}
                          </p>
                        )}
                        {p.quote && (
                          <blockquote className="text-xs text-ink-tertiary italic border-l-2 border-accent pl-3 mt-2">
                            &ldquo;{p.quote}&rdquo;
                          </blockquote>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <Divider />

              {/* ─── 6. User Stories ─── */}
              {c.userStories && c.userStories.length > 0 && (
                <section>
                  <SectionTitle id="user-stories">User Stories</SectionTitle>
                  <div className="space-y-3">
                    {c.userStories.map((s, i) => (
                      <div key={i} className="bg-surface-0 border border-border-subtle rounded-md p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="text-sm text-ink leading-relaxed font-medium">{s.story}</p>
                          {s.priority && <Badge variant={priorityVariant(s.priority)}>{s.priority}</Badge>}
                        </div>
                        {s.persona && (
                          <p className="text-xs text-ink-tertiary mb-2">Persona: <span className="text-ink-secondary font-medium">{s.persona}</span></p>
                        )}
                        {s.acceptanceCriteria && s.acceptanceCriteria.length > 0 && (
                          <div className="border-t border-border-subtle pt-2 mt-2">
                            <p className="text-[10px] uppercase tracking-widest text-ink-ghost font-medium mb-1">Acceptance Criteria</p>
                            <ul className="space-y-0.5">
                              {s.acceptanceCriteria.map((ac, ai) => (
                                <li key={ai} className="text-xs text-ink-secondary flex items-baseline gap-1.5">
                                  <span className="text-accent">✓</span> {ac}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <Divider />

              {/* ─── 7. Core Features ─── */}
              {c.coreFeatures && c.coreFeatures.length > 0 && (
                <section>
                  <SectionTitle id="core-features">Core Features</SectionTitle>
                  <div className="space-y-4">
                    {c.coreFeatures.map((f, i) => (
                      <div key={i} className="bg-surface-0 border border-border-subtle rounded-md p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-semibold text-ink text-sm">{f.feature}</h3>
                          <div className="flex gap-1.5 shrink-0">
                            <Badge variant={priorityVariant(f.priority)}>{f.priority}</Badge>
                            {f.complexity && <Badge>{f.complexity}</Badge>}
                          </div>
                        </div>
                        <p className="text-sm text-ink-secondary leading-relaxed mb-3">{f.description}</p>
                        {f.userBenefit && (
                          <p className="text-xs text-ink-secondary mb-3">
                            <span className="font-semibold text-ink">User Benefit:</span> {f.userBenefit}
                          </p>
                        )}
                        {f.acceptanceCriteria && f.acceptanceCriteria.length > 0 && (
                          <div className="border-t border-border-subtle pt-3">
                            <p className="text-[10px] uppercase tracking-widest text-ink-ghost font-medium mb-1.5">Acceptance Criteria</p>
                            <ul className="space-y-0.5">
                              {f.acceptanceCriteria.map((ac, ai) => (
                                <li key={ai} className="text-xs text-ink-secondary flex items-baseline gap-1.5">
                                  <span className="text-accent">✓</span> {ac}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {f.estimatedEffort && (
                          <p className="text-[11px] text-ink-ghost mt-2 font-mono">
                            Est. Effort: {f.estimatedEffort}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <Divider />

              {/* ─── 8. User Flows ─── */}
              {c.userFlows && c.userFlows.length > 0 && (
                <section>
                  <SectionTitle id="user-flows">User Flows</SectionTitle>
                  <div className="space-y-5">
                    {c.userFlows.map((flow, fi) => (
                      <div key={fi} className="bg-surface-0 border border-border-subtle rounded-md p-5">
                        <h3 className="font-semibold text-ink text-sm mb-3">{flow.name}</h3>
                        <ol className="space-y-1 mb-3">
                          {flow.steps.map((step, si) => (
                            <li key={si} className="flex items-baseline gap-2.5 text-sm text-ink-secondary">
                              <span className="font-mono text-[11px] text-accent font-bold shrink-0">{si + 1}.</span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                        {flow.happyPath && (
                          <div className="border-t border-border-subtle pt-3">
                            <p className="text-xs text-ink-secondary">
                              <span className="font-semibold text-ink">Happy Path:</span> {flow.happyPath}
                            </p>
                          </div>
                        )}
                        {flow.edgeCases && flow.edgeCases.length > 0 && (
                          <div className={flow.happyPath ? 'mt-2' : 'border-t border-border-subtle pt-3'}>
                            <p className="text-[10px] uppercase tracking-widest text-ink-ghost font-medium mb-1">Edge Cases</p>
                            <ul className="space-y-0.5">
                              {flow.edgeCases.map((ec, ei) => (
                                <li key={ei} className="text-xs text-ink-secondary flex items-baseline gap-1.5">
                                  <span className="text-amber-500">⚠</span> {ec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <Divider />

              {/* ─── 9. Information Architecture ─── */}
              {c.informationArchitecture && (
                <section>
                  <SectionTitle id="information-architecture">Information Architecture</SectionTitle>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {c.informationArchitecture.siteMap && c.informationArchitecture.siteMap.length > 0 && (
                      <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                        <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">Site Map</h3>
                        <ul className="space-y-0.5">
                          {c.informationArchitecture.siteMap.map((route, i) => (
                            <li key={i} className="text-xs font-mono text-ink-secondary">{route}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="space-y-4">
                      {c.informationArchitecture.navigationModel && (
                        <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                          <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">Navigation</h3>
                          <p className="text-sm text-ink-secondary leading-relaxed">{c.informationArchitecture.navigationModel}</p>
                        </div>
                      )}
                      {c.informationArchitecture.keyScreens && c.informationArchitecture.keyScreens.length > 0 && (
                        <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                          <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">Key Screens</h3>
                          <ul className="space-y-1">
                            {c.informationArchitecture.keyScreens.map((s, i) => <Bullet key={i}>{s}</Bullet>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              <Divider />

              {/* ─── 10. Non-Functional Requirements ─── */}
              {c.nonFunctionalRequirements && (
                <section>
                  <SectionTitle id="nfr">Non-Functional Requirements</SectionTitle>
                  {renderNfr()}
                </section>
              )}

              <Divider />

              {/* ─── 11. Tech Stack ─── */}
              {c.techStackRecommendation && (
                <section>
                  <SectionTitle id="tech-stack">Tech Stack Recommendation</SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {renderTechLayer('Frontend', c.techStackRecommendation.frontend)}
                    {renderTechLayer('Backend', c.techStackRecommendation.backend)}
                    {renderTechLayer('Database', c.techStackRecommendation.database)}
                    {renderTechLayer('Infrastructure', c.techStackRecommendation.infrastructure)}
                  </div>
                  {c.techStackRecommendation.architecturePattern && (
                    <p className="text-sm text-ink-secondary mb-4">
                      <span className="font-semibold text-ink">Architecture:</span> {c.techStackRecommendation.architecturePattern}
                    </p>
                  )}
                  {/* Legacy: old format had .reasoning at top level */}
                  {typeof c.techStackRecommendation.reasoning === 'string' && (
                    <blockquote className="text-sm text-ink-tertiary italic pl-4 border-l-2 border-accent leading-relaxed mb-4">
                      {c.techStackRecommendation.reasoning}
                    </blockquote>
                  )}
                  {c.techStackRecommendation.thirdPartyServices && c.techStackRecommendation.thirdPartyServices.length > 0 && (
                    <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
                      <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">Third-Party Services</h3>
                      <div className="space-y-1.5">
                        {c.techStackRecommendation.thirdPartyServices.map((s: { service: string; purpose: string }, i: number) => (
                          <div key={i} className="text-sm text-ink-secondary">
                            <span className="font-medium text-ink">{s.service}</span>
                            <span className="text-ink-ghost mx-1.5">—</span>
                            {s.purpose}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              <Divider />

              {/* ─── 12. Data Model ─── */}
              {c.dataModel && c.dataModel.length > 0 && (
                <section>
                  <SectionTitle id="data-model">Data Model</SectionTitle>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {c.dataModel.map((entity, i) => (
                      <div key={i} className="bg-surface-0 border border-border-subtle rounded-md p-4 overflow-hidden">
                        <h3 className="font-semibold text-ink text-sm mb-2 font-mono">{entity.entity}</h3>
                        <div className="space-y-0.5 mb-2">
                          {entity.fields.map((field, fi) => (
                            <p key={fi} className="text-xs font-mono text-ink-secondary">{field}</p>
                          ))}
                        </div>
                        {entity.relationships && entity.relationships.length > 0 && (
                          <div className="border-t border-border-subtle pt-2 mt-2">
                            <p className="text-[10px] uppercase tracking-widest text-ink-ghost font-medium mb-1">Relationships</p>
                            {entity.relationships.map((rel, ri) => (
                              <p key={ri} className="text-xs text-ink-tertiary">{rel}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <Divider />

              {/* ─── 13. Milestones ─── */}
              {c.milestones && c.milestones.length > 0 && (
                <section>
                  <SectionTitle id="milestones">Milestones &amp; Timeline</SectionTitle>
                  <div className="space-y-4">
                    {c.milestones.map((m, i) => (
                      <div key={i} className="bg-surface-0 border border-border-subtle rounded-md p-5 relative">
                        <div className="flex items-baseline justify-between gap-3 mb-2">
                          <h3 className="font-semibold text-ink text-sm">{m.phase}</h3>
                          {m.duration && (
                            <span className="text-[11px] font-mono text-ink-ghost shrink-0">{m.duration}</span>
                          )}
                        </div>
                        {m.deliverables && m.deliverables.length > 0 && (
                          <div className="mb-2">
                            <p className="text-[10px] uppercase tracking-widest text-ink-ghost font-medium mb-1">Deliverables</p>
                            <ul className="space-y-0.5">
                              {m.deliverables.map((d, di) => (
                                <li key={di} className="text-xs text-ink-secondary flex items-baseline gap-1.5">
                                  <span className="text-accent">◆</span> {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {m.successMetrics && m.successMetrics.length > 0 && (
                          <div className="border-t border-border-subtle pt-2 mt-2">
                            <p className="text-[10px] uppercase tracking-widest text-ink-ghost font-medium mb-1">Success Metrics</p>
                            <ul className="space-y-0.5">
                              {m.successMetrics.map((sm, si) => (
                                <li key={si} className="text-xs text-ink-secondary flex items-baseline gap-1.5">
                                  <span className="text-accent">📊</span> {sm}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <Divider />

              {/* ─── 14. Success Metrics ─── */}
              {c.successMetrics && (
                <section>
                  <SectionTitle id="success-metrics">Success Metrics</SectionTitle>
                  {c.successMetrics.northStarMetric && (
                    <div className="bg-accent-subtle border border-accent/20 rounded-md p-4 mb-4">
                      <p className="text-[10px] uppercase tracking-widest text-accent font-mono font-bold mb-1">North Star Metric</p>
                      <p className="text-sm text-ink font-medium">{c.successMetrics.northStarMetric}</p>
                    </div>
                  )}
                  {c.successMetrics.primaryKPIs && c.successMetrics.primaryKPIs.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">Primary KPIs</h3>
                      <div className="bg-surface-0 border border-border-subtle rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border-subtle">
                              <th className="text-left p-3 text-xs font-mono text-ink-ghost uppercase tracking-wider">Metric</th>
                              <th className="text-left p-3 text-xs font-mono text-ink-ghost uppercase tracking-wider">Target</th>
                              <th className="text-left p-3 text-xs font-mono text-ink-ghost uppercase tracking-wider hidden sm:table-cell">Measurement</th>
                            </tr>
                          </thead>
                          <tbody>
                            {c.successMetrics.primaryKPIs.map((k, i) => (
                              <tr key={i} className="border-b border-border-subtle last:border-0">
                                <td className="p-3 text-ink font-medium text-sm">{k.metric}</td>
                                <td className="p-3 text-ink-secondary text-sm font-mono">{k.target}</td>
                                <td className="p-3 text-ink-tertiary text-sm hidden sm:table-cell">{k.measurement || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {c.successMetrics.secondaryKPIs && c.successMetrics.secondaryKPIs.length > 0 && (
                    <div>
                      <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">Secondary KPIs</h3>
                      <div className="bg-surface-0 border border-border-subtle rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border-subtle">
                              <th className="text-left p-3 text-xs font-mono text-ink-ghost uppercase tracking-wider">Metric</th>
                              <th className="text-left p-3 text-xs font-mono text-ink-ghost uppercase tracking-wider">Target</th>
                              <th className="text-left p-3 text-xs font-mono text-ink-ghost uppercase tracking-wider hidden sm:table-cell">Measurement</th>
                            </tr>
                          </thead>
                          <tbody>
                            {c.successMetrics.secondaryKPIs.map((k, i) => (
                              <tr key={i} className="border-b border-border-subtle last:border-0">
                                <td className="p-3 text-ink font-medium text-sm">{k.metric}</td>
                                <td className="p-3 text-ink-secondary text-sm font-mono">{k.target}</td>
                                <td className="p-3 text-ink-tertiary text-sm hidden sm:table-cell">{k.measurement || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </section>
              )}

              <Divider />

              {/* ─── 15. Risks ─── */}
              {c.risksAndMitigations && c.risksAndMitigations.length > 0 && (
                <section>
                  <SectionTitle id="risks">Risks &amp; Mitigations</SectionTitle>
                  <div className="space-y-3">
                    {c.risksAndMitigations.map((r, i) => (
                      <div key={i} className="bg-surface-0 border border-border-subtle rounded-md p-4">
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <p className="text-sm text-ink font-medium">{r.risk}</p>
                          <div className="flex gap-1.5 shrink-0">
                            {r.impact && (
                              <Badge variant={r.impact === 'High' ? 'high' : r.impact === 'Medium' ? 'medium' : 'low'}>
                                {r.impact}
                              </Badge>
                            )}
                            {r.likelihood && (
                              <span className="text-[10px] font-mono text-ink-ghost">P: {r.likelihood}</span>
                            )}
                          </div>
                        </div>
                        {r.mitigation && (
                          <p className="text-xs text-ink-secondary leading-relaxed mt-1">
                            <span className="font-semibold text-ink">Mitigation:</span> {r.mitigation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <Divider />

              {/* ─── 16. Open Questions ─── */}
              {c.openQuestions && c.openQuestions.length > 0 && (
                <section>
                  <SectionTitle id="open-questions">Open Questions</SectionTitle>
                  <div className="bg-amber-50/60 dark:bg-amber-900/10 border border-amber-200/40 dark:border-amber-700/30 rounded-md p-4">
                    <ul className="space-y-2">
                      {c.openQuestions.map((q, i) => (
                        <li key={i} className="flex items-baseline gap-2.5 text-sm text-ink-secondary leading-relaxed">
                          <span className="text-amber-600 dark:text-amber-400 shrink-0 font-mono text-xs font-bold">Q{i + 1}.</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </article>
          )}
        </div>
      </div>

      {/* Floating Revision Bar — always visible at bottom */}
      <div className="shrink-0 border-t border-border bg-surface-0/90 backdrop-blur-md print:hidden">
        <div className="max-w-3xl mx-auto px-8 py-4">
          <form onSubmit={handleRevise} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={revisionPrompt}
                onChange={(e) => setRevisionPrompt(e.target.value)}
                placeholder="Request revisions… e.g. Add mobile-first user stories, focus on enterprise"
                className="w-full bg-surface-raised border border-border rounded-md pl-4 pr-4 py-2.5 text-sm text-ink placeholder-ink-ghost focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              disabled={isRevising || !revisionPrompt}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-40 text-white rounded-md font-medium text-sm transition-colors shrink-0"
            >
              {isRevising ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2L7 13l-2-4-4-2 13-5z" />
                </svg>
              )}
              <span className="hidden sm:inline">Revise to v{activeVersion + 1}</span>
            </button>
          </form>
          <p className="text-[11px] text-ink-ghost mt-1.5 text-center">
            AI will generate a new version based on your instructions
          </p>
        </div>
      </div>
    </div>
  )
}
