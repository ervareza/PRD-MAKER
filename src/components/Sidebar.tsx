'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  const supabase = createClient()
  const searchRef = useRef<HTMLInputElement>(null)

  const [prds, setPrds] = useState<PrdItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showLogout, setShowLogout] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    let isMounted = true
    const fetchPrds = async () => {
      const { data } = await supabase
        .from('prds')
        .select('id, title, updated_at')
        .order('updated_at', { ascending: false })
      if (isMounted && data) {
        setPrds(data)
      }
    }
    fetchPrds()
    return () => {
      isMounted = false
    }
  }, [pathname, supabase])

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
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
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
          className="w-9 h-9 flex items-center justify-center rounded-md text-[#a89f97] hover:text-[#ede8e3] hover:bg-white/6 transition-colors"
          title="Expand sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h12M3 9h12M3 15h12" />
          </svg>
        </button>
        <Link
          href="/prd/new"
          className="w-9 h-9 flex items-center justify-center rounded-md text-[#a89f97] hover:text-[#ede8e3] hover:bg-white/6 transition-colors"
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
      <aside className="w-64 bg-[#1a1714] flex flex-col shrink-0 select-none">
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <button
            onClick={() => setIsCollapsed(true)}
            className="w-9 h-9 flex items-center justify-center rounded-md text-[#a89f97] hover:text-[#ede8e3] hover:bg-white/6 transition-colors"
            title="Collapse sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h12M3 9h12M3 15h12" />
            </svg>
          </button>
          <Link
            href="/prd/new"
            className="w-9 h-9 flex items-center justify-center rounded-md text-[#a89f97] hover:text-[#ede8e3] hover:bg-white/6 transition-colors"
            title="New PRD"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M9 3v12M3 9h12" />
            </svg>
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
              className="w-full bg-white/6 border-0 rounded-md pl-8 pr-3 py-1.5 text-xs text-[#ede8e3] placeholder-[#7a726b] focus:outline-none focus:ring-1 focus:ring-white/20"
            />
            {!searchQuery && (
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#4a433d] font-mono pointer-events-none">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* PRD List */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin">
          {grouped.length === 0 && (
            <div className="px-3 py-8 text-center">
              <p className="text-xs text-[#7a726b]">
                {searchQuery ? 'No results found' : 'No documents yet'}
              </p>
            </div>
          )}
          {grouped.map((group) => (
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm truncate transition-colors ${
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
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-white/8 p-2">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-white/6 transition-colors cursor-default">
            <div className="w-7 h-7 rounded-full bg-accent/30 flex items-center justify-center text-xs font-semibold text-accent-ink uppercase shrink-0">
              {userEmail.charAt(0)}
            </div>
            <span className="text-xs text-[#a89f97] truncate flex-1">
              {userEmail}
            </span>
          </div>
          <button
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#7a726b] hover:text-red-400 hover:bg-white/6 rounded-md transition-colors font-medium"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M6 8h8" />
            </svg>
            Log out
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
