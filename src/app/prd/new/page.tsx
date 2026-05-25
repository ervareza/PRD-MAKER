'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewPrdPage() {
  const [idea, setIdea] = useState('')
  const [title, setTitle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // ISSUE-009: Warn user if they navigate away during generation
  useEffect(() => {
    if (!isGenerating) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isGenerating])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idea || !title) return

    setIsGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/generate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, title }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to generate PRD')
      }

      const data = await res.json()
      // INT-001: Notify sidebar to auto-refresh
      window.dispatchEvent(new CustomEvent('prd-created'))
      router.push(`/prd/${data.prdId}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="font-display text-4xl font-bold text-ink tracking-tight">
            New Document
          </h1>
          <p className="text-[15px] text-ink-tertiary mt-3 leading-relaxed max-w-sm mx-auto">
            Tell us about your project. The more detail you provide, the better your PRD will be.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="space-y-5">
          {error && (
            <div
              className="p-4 rounded-lg text-sm border animate-fade-in"
              style={{
                background: 'var(--accent-subtle)',
                borderColor: 'oklch(0.55 0.15 25 / 0.2)',
                color: 'var(--danger)',
              }}
            >
              {error}
            </div>
          )}

          {/* Project Name */}
          <div className="space-y-2 animate-fade-in-up animation-delay-100">
            <label htmlFor="title" className="block text-sm font-semibold text-ink">
              Project Name
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Acme Marketplace"
              className="w-full rounded-lg px-4 py-3.5 text-sm text-ink placeholder-ink-ghost focus:outline-none transition-all duration-200"
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xs), inset 0 1px 2px rgba(0,0,0,0.03)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = 'var(--shadow-sm), 0 0 0 3px oklch(0.55 0.14 28 / 0.08)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)'
                e.target.style.boxShadow = 'var(--shadow-xs), inset 0 1px 2px rgba(0,0,0,0.03)'
              }}
            />
          </div>

          {/* Project Description */}
          <div className="space-y-2 animate-fade-in-up animation-delay-200">
            <label htmlFor="idea" className="block text-sm font-semibold text-ink">
              Project Description
            </label>
            <textarea
              id="idea"
              required
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={"Describe what you want to build in detail.\n\nWho are the target users? What problem does it solve? What are the key features you envision? Any specific technology preferences?"}
              rows={7}
              className="w-full rounded-lg px-4 py-3.5 text-sm text-ink placeholder-ink-ghost focus:outline-none transition-all duration-200 resize-y leading-relaxed"
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xs), inset 0 1px 2px rgba(0,0,0,0.03)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent)'
                e.target.style.boxShadow = 'var(--shadow-sm), 0 0 0 3px oklch(0.55 0.14 28 / 0.08)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)'
                e.target.style.boxShadow = 'var(--shadow-xs), inset 0 1px 2px rgba(0,0,0,0.03)'
              }}
            />
            <p className="text-xs text-ink-ghost">
              Tip: Include target audience, core features, and any technical constraints.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isGenerating || !idea || !title}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-4 text-white rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none animate-fade-in-up animation-delay-300"
            style={{
              background: 'var(--accent)',
              boxShadow: 'var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
            onMouseEnter={(e) => {
              if (!isGenerating) {
                e.currentTarget.style.background = 'var(--accent-hover)'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.1)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            {isGenerating ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Generating your PRD…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 3L7 13l-2-4-4-2 10-4z" />
                </svg>
                Generate PRD
              </>
            )}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-center text-[11px] text-ink-ghost mt-6 font-mono animate-fade-in animation-delay-300">
          Powered by Gemini AI · typically takes 30–60 seconds
        </p>
      </div>
    </div>
  )
}
