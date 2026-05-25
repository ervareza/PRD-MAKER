'use client'

import { useEffect, useRef, useState } from 'react'

interface MermaidRendererProps {
  chart: string
  title?: string
}

// Singleton: initialize mermaid exactly once
let mermaidInitialized = false
async function getMermaid() {
  const mermaid = (await import('mermaid')).default
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#2a2521',
        primaryTextColor: '#ede8e3',
        primaryBorderColor: '#332e2a',
        lineColor: '#7a726b',
        secondaryColor: '#1e1a17',
        tertiaryColor: '#151210',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        fontSize: '13px',
      },
      flowchart: { htmlLabels: true, curve: 'basis' },
      sequence: { actorMargin: 80, mirrorActors: false },
      er: { layoutDirection: 'TB', fontSize: 12 },
    })
    mermaidInitialized = true
  }
  return mermaid
}

export default function MermaidRenderer({ chart, title }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    let cancelled = false

    const renderChart = async () => {
      try {
        const mermaid = await getMermaid()

        const id = `mermaid-${crypto.randomUUID().substring(0, 8)}`
        const { svg: rendered } = await mermaid.render(id, chart)

        if (!cancelled) {
          setSvg(rendered)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Mermaid render error:', err)
          setError('Failed to render diagram')
        }
      }
    }

    if (chart?.trim()) {
      renderChart()
    }

    return () => {
      cancelled = true
    }
  }, [chart])

  if (error) {
    return (
      <div className="bg-surface-0 border border-border-subtle rounded-md p-4">
        {title && (
          <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest mb-2">
            {title}
          </h3>
        )}
        <div className="bg-danger/10 border border-danger/20 rounded p-3 text-xs text-ink-secondary font-mono">
          <p className="font-semibold text-danger mb-1">Diagram Error</p>
          <pre className="whitespace-pre-wrap text-ink-tertiary text-[11px]">{chart}</pre>
        </div>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="bg-surface-0 border border-border-subtle rounded-md p-6 flex items-center justify-center">
        <svg className="w-5 h-5 animate-spin text-accent" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.2" />
          <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  return (
    <>
      <div className="bg-surface-0 border border-border-subtle rounded-md overflow-hidden">
        {title && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle">
            <h3 className="text-xs font-mono font-bold text-ink-ghost uppercase tracking-widest">
              {title}
            </h3>
            <button
              onClick={() => setIsFullscreen(true)}
              className="text-xs text-ink-tertiary hover:text-ink transition-colors font-mono"
              title="View fullscreen"
            >
              ⛶ Expand
            </button>
          </div>
        )}
        {/* SECURITY: SVG is output from mermaid.render() which uses DOMPurify internally.
           This is safe as long as mermaid's sanitization is not bypassed. */}
        <div
          ref={containerRef}
          className="p-4 overflow-x-auto flex justify-center [&_svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[999] bg-surface-0/95 backdrop-blur-md flex flex-col items-center justify-center p-8"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            className="absolute top-6 right-6 text-ink-secondary hover:text-ink text-sm font-mono transition-colors"
            onClick={() => setIsFullscreen(false)}
          >
            ✕ Close
          </button>
          {title && (
            <h3 className="text-sm font-mono font-bold text-ink-ghost uppercase tracking-widest mb-4">
              {title}
            </h3>
          )}
          <div
            className="overflow-auto max-w-full max-h-[85vh] [&_svg]:max-w-none"
            dangerouslySetInnerHTML={{ __html: svg }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
