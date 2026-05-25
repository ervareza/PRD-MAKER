'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import LogoutModal from './LogoutModal'

interface PrdItem {
  id: string
  title: string
  updated_at: string
}

interface DateGroup {
  label: string
  items: PrdItem[]
}

function groupByDate(items: PrdItem[]): DateGroup[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)
  const weekAgo = new Date(today.getTime() - 7 * 86400000)
  const monthAgo = new Date(today.getTime() - 30 * 86400000)

  const groups: Record<string, PrdItem[]> = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    'Previous 30 Days': [],
    Older: [],
  }

  items.forEach((item) => {
    const d = new Date(item.updated_at)
    if (d >= today) groups['Today'].push(item)
    else if (d >= yesterday) groups['Yesterday'].push(item)
    else if (d >= weekAgo) groups['Previous 7 Days'].push(item)
    else if (d >= monthAgo) groups['Previous 30 Days'].push(item)
    else groups['Older'].push(item)
  })

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }))
}

interface SidebarProps {
  userEmail: string
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const searchRef = useRef<HTMLInputElement>(null)

  const [prds, setPrds] = useState<PrdItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [showLogout, setShowLogout] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoadingPrds, setIsLoadingPrds] = useState(true)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Handle click outside user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Save the logged in email to recent accounts on load
  useEffect(() => {
    if (!userEmail) return
    try {
      const stored = localStorage.getItem('prd_recent_accounts')
      const accounts: string[] = stored ? JSON.parse(stored) : []
      if (!accounts.includes(userEmail)) {
        accounts.unshift(userEmail)
        localStorage.setItem(
          'prd_recent_accounts',
          JSON.stringify(accounts.slice(0, 5))
        )
      }
    } catch {
      // ignore localStorage errors
    }
  }, [userEmail])

  useEffect(() => {
    let isMounted = true
    const fetchPrds = async () => {
      setIsLoadingPrds(true)
      const { data } = await supabase
        .from('prds')
        .select('id, title, updated_at')
        .order('updated_at', { ascending: false })
      if (isMounted && data) {
        setPrds(data)
        setIsLoadingPrds(false)
      }
    }

    // Debounce pathname-triggered fetches to avoid redundant requests
    const timer = setTimeout(fetchPrds, 100)

    // INT-001: Listen for custom event to auto-refresh after PRD creation
    const handlePrdCreated = () => { fetchPrds() }
    window.addEventListener('prd-created', handlePrdCreated)

    return () => {
      isMounted = false
      clearTimeout(timer)
      window.removeEventListener('prd-created', handlePrdCreated)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const filteredPrds = prds.filter((p) =>
    p.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  )
  const grouped = groupByDate(filteredPrds)

  const currentPrdId =
    pathname.startsWith('/prd/') && !pathname.endsWith('/new')
      ? pathname.split('/')[2]
      : null

  const handleLogout = async () => {
    // Store email in recent accounts before logging out
    try {
      const stored = localStorage.getItem('prd_recent_accounts')
      const accounts: string[] = stored ? JSON.parse(stored) : []
      if (!accounts.includes(userEmail)) {
        accounts.unshift(userEmail)
        localStorage.setItem(
          'prd_recent_accounts',
          JSON.stringify(accounts.slice(0, 5))
        )
      }
    } catch {
      // ignore localStorage errors
    }
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isCollapsed) {
    return (
      <aside className="w-14 bg-[#1a1714] flex flex-col items-center py-3 gap-2 shrink-0">
      <button
          onClick={() => setIsCollapsed(false)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[#a89f97] hover:text-[#ede8e3] hover:bg-white/8 transition-all duration-200"
          title="Expand sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h12M3 9h12M3 15h12" />
          </svg>
        </button>
        <Link
          href="/prd/new"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-[#a89f97] hover:text-[#ede8e3] hover:bg-white/8 transition-all duration-200"
          title="New PRD"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 3v12M3 9h12" />
          </svg>
        </Link>
      </aside>
    )
  }

  return (
    <>
      <aside className="w-64 bg-[#171411] flex flex-col shrink-0 select-none" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <button
            onClick={() => setIsCollapsed(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#a89f97] hover:text-[#ede8e3] hover:bg-white/8 transition-all duration-200"
            title="Collapse sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h12M3 9h12M3 15h12" />
            </svg>
          </button>
          <Link
            href="/prd/new"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#a89f97] hover:text-[#ede8e3] hover:bg-white/8 transition-all duration-200"
            title="New PRD"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M9 3v12M3 9h12" />
            </svg>
          </Link>
        </div>

        {/* Dashboard link */}
        <div className="px-3 pb-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#a89f97] hover:text-[#ede8e3] hover:bg-white/8 transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="1" width="5" height="5" rx="1" />
              <rect x="8" y="1" width="5" height="5" rx="1" />
              <rect x="1" y="8" width="5" height="5" rx="1" />
              <rect x="8" y="8" width="5" height="5" rx="1" />
            </svg>
            All Documents
          </Link>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="#7a726b"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <circle cx="6" cy="6" r="4.5" />
              <path d="M9.5 9.5L13 13" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search…"
              className="w-full bg-white/6 border-0 rounded-lg pl-8 pr-3 py-2 text-xs text-[#ede8e3] placeholder-[#5a524b] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200"
            />
            {!searchQuery && (
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#4a433d] font-mono pointer-events-none">
                {typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl+K'}
              </kbd>
            )}
          </div>
        </div>

        {/* PRD List */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin">
          {isLoadingPrds ? (
            <div className="px-3 py-4 space-y-4">
              <div className="space-y-2">
                <div className="w-16 h-3 bg-white/5 rounded-full animate-pulse" />
                <div className="w-full h-7 bg-white/5 rounded-md animate-pulse" />
                <div className="w-5/6 h-7 bg-white/5 rounded-md animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="w-20 h-3 bg-white/5 rounded-full animate-pulse" />
                <div className="w-4/5 h-7 bg-white/5 rounded-md animate-pulse" />
              </div>
            </div>
          ) : grouped.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-xs text-[#7a726b]">
                {searchQuery ? 'No results found' : 'No documents yet'}
              </p>
            </div>
          ) : (
            grouped.map((group) => (
            <div key={group.label} className="mb-3">
              <p className="px-3 py-1.5 text-[10px] font-medium text-[#7a726b] uppercase tracking-wider">
                {group.label}
              </p>
              {group.items.map((prd) => {
                const isActive = prd.id === currentPrdId
                return (
                  <Link
                    key={prd.id}
                    href={`/prd/${prd.id}`}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm truncate transition-all duration-200 ${
                      isActive
                        ? 'bg-white/10 text-[#ede8e3]'
                        : 'text-[#a89f97] hover:bg-white/6 hover:text-[#ede8e3]'
                    }`}
                  >
                    <span className="truncate">{prd.title}</span>
                  </Link>
                )
              })}
            </div>
          ))
          )}
        </nav>

        {/* User section */}
        <div className="p-2 relative mt-auto border-t border-white/8" ref={userMenuRef}>
          {isUserMenuOpen && (
            <div className="absolute bottom-[calc(100%+4px)] left-2 right-2 bg-[#1a1714] border border-white/8 rounded-xl shadow-xl overflow-hidden py-1.5 z-50">
              <Link href="/changelog" onClick={() => setIsUserMenuOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#a89f97] hover:text-[#ede8e3] hover:bg-white/6 transition-colors text-left font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Changelog
              </Link>
              <button onClick={() => { setIsUserMenuOpen(false); setShowLogout(true); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#a89f97] hover:text-red-400 hover:bg-white/6 transition-colors text-left font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Log out
              </button>
            </div>
          )}

          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/6 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[13px] font-semibold text-accent-ink shrink-0 uppercase">
              {userEmail ? userEmail.charAt(0) : 'U'}
            </div>
            <div className="flex flex-col items-start overflow-hidden text-left leading-tight flex-1">
              <span className="text-[13px] font-medium text-[#ede8e3] w-full truncate">
                {userEmail ? userEmail.split('@')[0] : 'User'}
              </span>
              <span className="text-[11px] text-[#7a726b] w-full truncate mt-0.5">
                {userEmail}
              </span>
            </div>
          </button>
        </div>
      </aside>

      {showLogout && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </>
  )
}
