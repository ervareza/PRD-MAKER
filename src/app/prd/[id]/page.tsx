'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

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

interface PrdContent {
  executiveSummary: string
  userPersonas: Array<{ name: string; description: string; needs: string }>
  coreFeatures: Array<{ feature: string; description: string; priority: string }>
  nonFunctionalRequirements: string[]
  techStackRecommendation: {
    frontend: string
    backend: string
    database: string
    reasoning: string
  }
}

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

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      const { data: prdData } = await supabase.from('prds').select('*').eq('id', id).single()
      const { data: versionData } = await supabase
        .from('prd_versions')
        .select('*')
        .eq('prd_id', id)
        .order('version_number', { ascending: true })

      if (isMounted) {
        setPrd(prdData)
        if (versionData && versionData.length > 0) {
          setVersions(versionData)
          setActiveVersion(versionData[versionData.length - 1].version_number)
        }
        setIsLoading(false)
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
    const activeContent = versions.find((v) => v.version_number === activeVersion)?.content
    if (!activeContent || !prd) return

    let md = `# ${prd.title} — v${activeVersion}\n\n`
    md += `## Executive Summary\n\n${activeContent.executiveSummary}\n\n`
    md += `## User Personas\n\n`
    activeContent.userPersonas?.forEach((p) => {
      md += `### ${p.name}\n\n${p.description}\n\n**Needs:** ${p.needs}\n\n`
    })
    md += `## Core Features\n\n`
    activeContent.coreFeatures?.forEach((f) => {
      md += `### ${f.feature} [${f.priority}]\n\n${f.description}\n\n`
    })
    md += `## Non-Functional Requirements\n\n`
    activeContent.nonFunctionalRequirements?.forEach((r) => {
      md += `- ${r}\n`
    })
    md += `\n## Tech Stack Recommendation\n\n`
    md += `| Layer | Technology |\n|---|---|\n`
    md += `| Frontend | ${activeContent.techStackRecommendation?.frontend} |\n`
    md += `| Backend | ${activeContent.techStackRecommendation?.backend} |\n`
    md += `| Database | ${activeContent.techStackRecommendation?.database} |\n\n`
    md += `> ${activeContent.techStackRecommendation?.reasoning}\n`

    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${prd.title.replace(/\s+/g, '_')}_v${activeVersion}.md`
    a.click()
    URL.revokeObjectURL(url)
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

  const activeContent = versions.find((v) => v.version_number === activeVersion)?.content

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

          {/* Document Body */}
          {activeContent && (
            <article className="bg-surface-raised border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 sm:p-10 space-y-10 print:shadow-none print:border-none print:p-0">
              {/* Print header */}
              <div className="hidden print:block border-b border-border pb-6 mb-8">
                <h1 className="font-display text-3xl font-bold">{prd.title}</h1>
                <p className="text-sm text-ink-tertiary mt-1">
                  Product Requirements Document — v{activeVersion}
                </p>
              </div>

              {/* Executive Summary */}
              <section>
                <h2 className="font-display text-xl font-semibold text-ink mb-3">Executive Summary</h2>
                <p className="text-ink-secondary leading-[1.75] text-[15px]" style={{ textWrap: 'pretty' } as React.CSSProperties}>
                  {activeContent.executiveSummary}
                </p>
              </section>

              <hr className="border-border-subtle" />

              {/* User Personas */}
              <section>
                <h2 className="font-display text-xl font-semibold text-ink mb-4">User Personas</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeContent.userPersonas?.map((p, i) => (
                    <div key={i} className="p-4 bg-surface-0 border border-border-subtle rounded-md">
                      <h3 className="font-semibold text-ink text-sm">{p.name}</h3>
                      <p className="text-ink-secondary text-sm mt-1 leading-relaxed">{p.description}</p>
                      <p className="text-xs text-ink-tertiary mt-2">
                        <span className="font-medium text-ink">Needs:</span> {p.needs}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <hr className="border-border-subtle" />

              {/* Core Features */}
              <section>
                <h2 className="font-display text-xl font-semibold text-ink mb-4">Core Features</h2>
                <div className="space-y-3">
                  {activeContent.coreFeatures?.map((f, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-border-subtle last:border-0">
                      <div>
                        <h3 className="font-medium text-ink text-sm">{f.feature}</h3>
                        <p className="text-ink-secondary text-sm mt-0.5 leading-relaxed">{f.description}</p>
                      </div>
                      <span
                        className={
                          'shrink-0 text-xs font-mono px-2 py-0.5 rounded-sm ' +
                          (f.priority === 'High'
                            ? 'bg-accent-subtle text-accent'
                            : f.priority === 'Medium'
                            ? 'bg-surface-1 text-ink-secondary'
                            : 'bg-surface-1 text-ink-tertiary')
                        }
                      >
                        {f.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <hr className="border-border-subtle" />

              {/* Non-Functional Requirements */}
              <section>
                <h2 className="font-display text-xl font-semibold text-ink mb-3">Non-Functional Requirements</h2>
                <ul className="space-y-1.5">
                  {activeContent.nonFunctionalRequirements?.map((r, i) => (
                    <li key={i} className="flex items-baseline gap-2 text-sm text-ink-secondary leading-relaxed">
                      <span className="w-1 h-1 bg-accent rounded-full shrink-0 translate-y-2" />
                      {r}
                    </li>
                  ))}
                </ul>
              </section>

              <hr className="border-border-subtle" />

              {/* Tech Stack */}
              <section>
                <h2 className="font-display text-xl font-semibold text-ink mb-4">Tech Stack Recommendation</h2>
                <div className="grid grid-cols-3 gap-px bg-border-subtle rounded-md overflow-hidden mb-4">
                  {[
                    { label: 'Frontend', value: activeContent.techStackRecommendation?.frontend },
                    { label: 'Backend', value: activeContent.techStackRecommendation?.backend },
                    { label: 'Database', value: activeContent.techStackRecommendation?.database },
                  ].map((item) => (
                    <div key={item.label} className="bg-surface-raised p-4">
                      <p className="text-[10px] uppercase tracking-widest text-ink-ghost font-medium mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-ink">{item.value}</p>
                    </div>
                  ))}
                </div>
                {activeContent.techStackRecommendation?.reasoning && (
                  <blockquote className="text-sm text-ink-tertiary italic pl-4 border-l-2 border-accent leading-relaxed">
                    {activeContent.techStackRecommendation.reasoning}
                  </blockquote>
                )}
              </section>
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
                placeholder="Request revisions… e.g. Focus on enterprise customers"
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
