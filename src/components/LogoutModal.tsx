'use client'

import { useEffect, useRef } from 'react'

interface LogoutModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export default function LogoutModal({ onConfirm, onCancel }: LogoutModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onCancel}
      />
      {/* Modal */}
      <div
        className="relative w-full max-w-sm mx-4 p-6 rounded-xl animate-scale-in"
        style={{
          background: 'var(--surface-raised)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        <h3 className="font-display text-lg font-bold text-ink mb-2">
          Log out?
        </h3>
        <p className="text-sm text-ink-secondary mb-6 leading-relaxed">
          You will need to sign in again to access your documents.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium text-ink-secondary rounded-lg transition-all duration-200"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface-1)'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200"
            style={{
              background: 'var(--danger)',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
