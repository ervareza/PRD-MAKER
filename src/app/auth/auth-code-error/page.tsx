'use client'

import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6" style={{ background: 'var(--surface-0)' }}>
      <div className="w-full max-w-sm space-y-6 text-center animate-fade-in-up">
        <div
          className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
          style={{ background: 'oklch(0.55 0.15 25 / 0.1)' }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-danger"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-ink">
            Authentication Failed
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed">
            We couldn&apos;t complete your sign-in. This can happen if the
            login session expired or was cancelled.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full px-4 py-3.5 text-white rounded-lg font-semibold text-sm transition-all duration-200 text-center"
            style={{
              background: 'var(--accent)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="block text-sm text-ink-tertiary hover:text-ink transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
