'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [recentAccounts, setRecentAccounts] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem('prd_recent_accounts')
      if (stored) {
        const accounts = JSON.parse(stored)
        if (Array.isArray(accounts)) return accounts
      }
    } catch {
      // ignore
    }
    return []
  })
  const supabase = createClient()
  const { t } = useLanguage()

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
    <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-surface-0">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            PRD Generator
          </h1>
          <p className="text-sm text-ink-tertiary">{t('auth.tagline')}</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-raised border border-border rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          {/* Recent accounts */}
          {recentAccounts.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-ink-tertiary font-medium uppercase tracking-wider">
                Recent accounts
              </p>
              {recentAccounts.map((email) => (
                <div key={email} className="flex items-center gap-3">
                  <button
                    onClick={() => handleGoogleLogin(email)}
                    disabled={isLoading}
                    className="flex-1 flex items-center gap-3 py-2.5 px-3 border border-border rounded-md bg-surface-0 hover:bg-surface-1 transition-colors text-left disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-semibold text-accent uppercase shrink-0">
                      {email.charAt(0)}
                    </div>
                    <span className="text-sm text-ink truncate">{email}</span>
                  </button>
                  <button
                    onClick={() => removeAccount(email)}
                    className="w-8 h-8 flex items-center justify-center text-ink-ghost hover:text-danger rounded-md hover:bg-surface-1 transition-colors shrink-0"
                    title="Remove"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M3 3l8 8M11 3l-8 8" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="border-t border-border-subtle my-3" />
            </div>
          )}

          {/* Google auth button */}
          <button
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-md bg-surface-0 hover:bg-surface-1 transition-colors text-ink font-medium text-sm disabled:opacity-50"
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

        <p className="text-center text-xs text-ink-ghost">
          By continuing, you agree to our terms of service.
        </p>
      </div>
    </div>
  )
}
