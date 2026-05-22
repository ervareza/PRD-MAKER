import Link from 'next/link'

export default async function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6">
      <div className="max-w-lg text-center space-y-4">
        <h1 className="font-display text-3xl font-bold text-ink">
          What are you building?
        </h1>
        <p className="text-ink-secondary text-base leading-relaxed">
          Describe your project idea and let AI generate a comprehensive
          Product Requirements Document for you.
        </p>
        <div className="pt-4">
          <Link
            href="/prd/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-md font-semibold text-sm transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 2v12M2 8h12" />
            </svg>
            New PRD
          </Link>
        </div>
      </div>
    </div>
  )
}
