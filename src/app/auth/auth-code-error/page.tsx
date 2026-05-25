'use client'

import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-surface-0">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-danger/10 flex items-center justify-center">
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
            className="block w-full px-4 py-3 bg-accent hover:bg-accent-hover text-white rounded-md font-semibold text-sm transition-colors text-center"
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
