'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [recentAccounts, setRecentAccounts] = useState<string[]>([])
  const supabase = useMemo(() => createClient(), [])
  const { t } = useLanguage()

  // Load recent accounts from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('prd_recent_accounts')
      if (stored) {
        const accounts = JSON.parse(stored)
        if (Array.isArray(accounts)) setRecentAccounts(accounts)
      }
    } catch {
      // ignore
    }
  }, [])

  const handleGoogleLogin = async (loginHint?: string) => {
    setIsLoading(true)
    const options: Record<string, unknown> = {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
    }
    if (loginHint) {
      options.queryParams = { login_hint: loginHint }
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: options as { redirectTo: string; queryParams?: Record<string, string> },
    })

    if (error) {
      console.error('Error logging in with Google', error.message)
      setIsLoading(false)
    }
  }

  const removeAccount = (email: string) => {
    const updated = recentAccounts.filter((a) => a !== email)
    setRecentAccounts(updated)
    localStorage.setItem('prd_recent_accounts', JSON.stringify(updated))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6" style={{ background: 'var(--surface-0)' }}>
      <div className="w-full max-w-sm space-y-8 animate-fade-in-up">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div
            className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center"
            style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-md)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
              PRD Generator
            </h1>
            <p className="text-sm text-ink-tertiary mt-1">{t('auth.tagline')}</p>
          </div>
        </div>

        {/* Login Card */}
        <div
          className="rounded-xl p-6 space-y-4"
          style={{
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* Recent accounts */}
          {recentAccounts.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-ink-tertiary font-medium uppercase tracking-wider">
                Recent accounts
              </p>
              {recentAccounts.map((email) => (
                <div key={email} className="flex items-center gap-2">
                  <button
                    onClick={() => handleGoogleLogin(email)}
                    disabled={isLoading}
                    className="flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-ink transition-all duration-200 text-left"
                    style={{
                      background: 'var(--surface-1)',
                      border: '1px solid var(--border-subtle)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold uppercase shrink-0"
                      style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
                    >
                      {email.charAt(0)}
                    </div>
                    <span className="truncate">{email}</span>
                  </button>
                  <button
                    onClick={() => removeAccount(email)}
                    className="p-1.5 rounded-md text-ink-ghost hover:text-danger hover:bg-danger/5 transition-colors shrink-0"
                    title="Remove"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" style={{ borderTop: '1px solid var(--border-subtle)' }} />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 text-[11px] text-ink-ghost" style={{ background: 'var(--surface-raised)' }}>or</span>
                </div>
              </div>
            </div>
          )}

          {/* Google auth button */}
          <button
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-lg text-ink font-semibold text-sm disabled:opacity-50 transition-all duration-200"
            style={{
              background: 'var(--surface-0)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-xs)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              e.currentTarget.style.borderColor = 'var(--ink-ghost)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-xs)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            {isLoading ? (
              <span className="text-ink-secondary">Redirecting…</span>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {recentAccounts.length > 0 ? 'Use another account' : t('auth.login')}
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[11px] text-ink-ghost">
          By continuing, you agree to our terms of service.
        </p>
      </div>
    </div>
  )
}
