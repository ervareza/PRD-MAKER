'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

interface PrdItem {
  id: string
  title: string
  idea: string | null
  updated_at: string
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const d = new Date(dateStr)
  const diffMs = now.getTime() - d.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), [])
  const [prds, setPrds] = useState<PrdItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchPrds = async () => {
      const { data, error } = await supabase
        .from('prds')
        .select('id, title, idea, updated_at')
        .order('updated_at', { ascending: false })

      if (!error && isMounted) {
        setPrds(data || [])
      }
      if (isMounted) setIsLoading(false)
    }
    fetchPrds()
    return () => { isMounted = false }
  }, [supabase])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Your Documents
          </h1>
          <p className="text-sm text-ink-tertiary mt-1">
            All your Product Requirements Documents in one place.
          </p>
        </div>
        <Link
          href="/prd/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-md font-semibold text-sm transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M8 2v12M2 8h12" />
          </svg>
          New PRD
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <svg className="w-6 h-6 animate-spin text-accent" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.2" />
            <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && prds.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-surface-raised border border-border flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-ghost">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
          </div>
          <div>
            <p className="text-ink-secondary font-medium">No documents yet</p>
            <p className="text-sm text-ink-ghost mt-1">
              Create your first PRD to get started.
            </p>
          </div>
          <Link
            href="/prd/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-md font-semibold text-sm transition-colors"
          >
            Write your first PRD
          </Link>
        </div>
      )}

      {/* PRD Grid */}
      {!isLoading && prds.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {prds.map((prd) => (
            <Link
              key={prd.id}
              href={`/prd/${prd.id}`}
              className="group bg-surface-raised border border-border rounded-lg p-5 hover:border-accent/40 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200"
            >
              <h3 className="font-display font-semibold text-ink text-sm truncate group-hover:text-accent transition-colors">
                {prd.title}
              </h3>
              {prd.idea && (
                <p className="text-xs text-ink-tertiary mt-1.5 line-clamp-2 leading-relaxed">
                  {prd.idea}
                </p>
              )}
              <p className="text-[11px] text-ink-ghost mt-3 font-mono">
                {timeAgo(prd.updated_at)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
