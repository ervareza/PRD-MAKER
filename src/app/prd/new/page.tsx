'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewPrdPage() {
  const [idea, setIdea] = useState('')
  const [title, setTitle] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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
      router.push(`/prd/${data.prdId}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-ink">
            New Document
          </h1>
          <p className="text-sm text-ink-tertiary mt-2">
            Tell us about your project. The more detail you provide, the better
            your PRD will be.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          {error && (
            <div className="p-3 bg-accent-subtle text-danger rounded-md text-sm border border-danger/20">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-sm font-medium text-ink">
              Project Name
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Acme Marketplace"
              className="w-full bg-surface-raised border border-border rounded-md px-4 py-3 text-ink placeholder-ink-ghost text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="idea" className="block text-sm font-medium text-ink">
              Project Description
            </label>
            <textarea
              id="idea"
              required
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={"Describe what you want to build in detail.\n\nWho are the target users? What problem does it solve? What are the key features you envision? Any specific technology preferences?"}
              rows={8}
              className="w-full bg-surface-raised border border-border rounded-md px-4 py-3 text-ink placeholder-ink-ghost text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow resize-y leading-relaxed"
            />
            <p className="text-xs text-ink-ghost mt-1">
              Tip: Include target audience, core features, and any technical constraints.
            </p>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !idea || !title}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md font-semibold text-sm transition-colors"
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
      </div>
    </div>
  )
}
