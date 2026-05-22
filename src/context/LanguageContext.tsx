'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'

type Language = 'en' | 'id'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'landing.title': 'Turn ideas into structured requirements',
    'landing.subtitle': 'Generate comprehensive Product Requirements Documents from a simple description. AI-powered, version-controlled, export-ready.',
    'landing.getStarted': 'Start Writing',
    'landing.features': 'Features',
    'nav.dashboard': 'Dashboard',
    'nav.newPrd': 'New PRD',
    'nav.logout': 'Log out',
    'dashboard.title': 'Your Documents',
    'dashboard.subtitle': 'All your Product Requirements Documents in one place.',
    'dashboard.empty': 'No documents yet.',
    'dashboard.createFirst': 'Write your first PRD',
    'prd.generate.title': 'New Document',
    'prd.generate.ideaLabel': 'Describe your project',
    'prd.generate.ideaPlaceholder': 'A marketplace for freelance designers to sell UI kits, targeting agencies who need quick access to production-ready components...',
    'prd.generate.button': 'Generate PRD',
    'prd.generate.loading': 'AI is drafting your document…',
    'prd.view.exportPdf': 'Export PDF',
    'prd.view.exportMd': 'Export Markdown',
    'prd.view.version': 'Version',
    'prd.view.saveNewVersion': 'Save as New Version',
    'auth.login': 'Continue with Google',
    'auth.tagline': 'AI-powered product requirements',
  },
  id: {
    'landing.title': 'Ubah ide menjadi persyaratan terstruktur',
    'landing.subtitle': 'Buat dokumen PRD yang komprehensif dari deskripsi sederhana. Didukung AI, kontrol versi, siap ekspor.',
    'landing.getStarted': 'Mulai Menulis',
    'landing.features': 'Fitur',
    'nav.dashboard': 'Dasbor',
    'nav.newPrd': 'PRD Baru',
    'nav.logout': 'Keluar',
    'dashboard.title': 'Dokumen Anda',
    'dashboard.subtitle': 'Semua dokumen PRD Anda dalam satu tempat.',
    'dashboard.empty': 'Belum ada dokumen.',
    'dashboard.createFirst': 'Tulis PRD pertama Anda',
    'prd.generate.title': 'Dokumen Baru',
    'prd.generate.ideaLabel': 'Deskripsikan proyek Anda',
    'prd.generate.ideaPlaceholder': 'Sebuah marketplace untuk desainer freelance menjual UI kit, menargetkan agensi yang butuh akses cepat ke komponen siap produksi...',
    'prd.generate.button': 'Buat PRD',
    'prd.generate.loading': 'AI sedang menyusun dokumen Anda…',
    'prd.view.exportPdf': 'Ekspor PDF',
    'prd.view.exportMd': 'Ekspor Markdown',
    'prd.view.version': 'Versi',
    'prd.view.saveNewVersion': 'Simpan sebagai Versi Baru',
    'auth.login': 'Lanjutkan dengan Google',
    'auth.tagline': 'Persyaratan produk didukung AI',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const timeout = setTimeout(() => {
      const stored = localStorage.getItem('app_lang')
      if (stored === 'en' || stored === 'id') {
        setLanguageState(stored)
      } else if (navigator.language.startsWith('id')) {
        setLanguageState('id')
      }
    }, 0)
    return () => clearTimeout(timeout)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('app_lang', lang)
  }, [])

  const t = useCallback(
    (key: string): string => {
      return translations[language][key] ?? key
    },
    [language]
  )

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
