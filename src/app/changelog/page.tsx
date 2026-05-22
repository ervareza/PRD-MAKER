'use client'

import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'

export default function ChangelogPage() {
  const { language, setLanguage } = useLanguage()

  const releases = [
    {
      version: 'v1.1.1',
      date: '2026-05-22',
      added: {
        en: [],
        id: []
      },
      fixed: {
        en: [
          'Synced state loading inside React useEffect in prd/[id]/page.tsx using a self-contained fetchData logic combined with a refreshTrigger state to resolve the cascading renders static analysis error completely.',
          'Removed unused imports (useCallback, useEffect) from src/components/Sidebar.tsx and src/app/login/page.tsx to eliminate code smell and clean up linter warnings.',
          'Cleaned up multiple Tailwind CSS utility warnings on src/app/page.tsx (using standard hover:-translate-y-px, fixing layout conflicts on hidden/flex classes, and migrating from h-[1px] to h-px).',
          'Avoided unused map variables (i) in src/app/page.tsx loops.'
        ],
        id: [
          'Sinkronisasi pemuatan status di dalam hook useEffect React pada prd/[id]/page.tsx menggunakan logika fetchData terenkapsulasi yang dipadukan dengan status refreshTrigger untuk sepenuhnya menyelesaikan kesalahan analisis statik cascading renders.',
          'Penghapusan impor yang tidak digunakan (useCallback, useEffect) dari src/components/Sidebar.tsx dan src/app/login/page.tsx untuk menghilangkan bau kode dan merapikan peringatan linter.',
          'Pembersihan beberapa peringatan utilitas Tailwind CSS pada src/app/page.tsx (menggunakan hover:-translate-y-px standar, memperbaiki konflik tata letak kelas hidden/flex, dan memigrasikan h-[1px] ke h-px).',
          'Penghindaran variabel pemetaan yang tidak digunakan (i) di dalam perulangan src/app/page.tsx.'
        ]
      }
    },
    {
      version: 'v1.1.0',
      date: '2026-05-22',
      added: {
        en: [
          'Fully redesigned high-fidelity, highly aesthetic bilingual landing page following the Warm Restraint design system (Source Serif 4 display headings, DM Sans body text, oklch terracotta/rust signature accent).',
          'Interactive workspace mockups in the landing page showing actual Product Requirements Documents (PRDs) with real-world descriptions, user personas, prioritised features, and tech stacks (bilingual: English & Indonesian).',
          'Animated auto-typing revision demonstration showing how user prompt inputs automatically generate new PRD document versions (v1 -> v2) inside the landing page mockup.',
          'Bilingual support context (LanguageContext) for effortless switching between English and Indonesian.',
          'ChatGPT-style dark sidebar with search, date-grouped PRD lists, and collapsible panels.',
          'Confirmation modal before signing out (LogoutModal).',
          'Local account history in Login Page so users can sign back in instantly using previously used accounts.'
        ],
        id: [
          'Redesain total halaman pendaratan (landing page) beresolusi tinggi, bernilai estetika tinggi, dan dwibahasa mengikuti sistem desain Warm Restraint (tajuk Source Serif 4, teks tubuh DM Sans, aksen terracotta/rust oklch).',
          'Mockup ruang kerja interaktif di halaman pendaratan menampilkan PRD nyata dengan deskripsi dunia nyata, persona pengguna, fitur terprioritasi, dan tech stack (dwibahasa: Inggris & Indonesia).',
          'Demonstrasi revisi pengetikan otomatis yang menunjukkan bagaimana input petunjuk pengguna secara otomatis menghasilkan versi dokumen PRD baru (v1 -> v2) di dalam mockup.',
          'Konteks dukungan dwibahasa (LanguageContext) untuk peralihan mudah antara bahasa Inggris dan Indonesia.',
          'Sidebar gelap ala ChatGPT dengan pencarian, daftar PRD dikelompokkan tanggal, dan panel yang dapat dilipat.',
          'Modal konfirmasi sebelum keluar akun (LogoutModal).',
          'Riwayat akun lokal di Halaman Masuk sehingga pengguna dapat langsung masuk kembali menggunakan akun yang pernah digunakan sebelumnya.'
        ]
      },
      fixed: {
        en: [
          'Synced state loading inside React useEffect hooks in both login/page.tsx and prd/[id]/page.tsx using lazy state initialization and conditional fetching parameter (showLoading) to completely resolve the cascading renders console errors.',
          'Fixed React state updates in the sidebar component using inline mount tracking isMounted inside useEffect to safely handle unmounting and prevent warnings.',
          'Upgraded CSS opacity syntax in Sidebar.tsx from arbitrary bracket fractions (white/[0.06]) to standard native Tailwind CSS v4 percentages (white/6 and white/8).'
        ],
        id: [
          'Sinkronisasi pemuatan status di dalam hook useEffect React pada login/page.tsx dan prd/[id]/page.tsx menggunakan inisialisasi status malas dan parameter pengambilan kondisional (showLoading) untuk menyelesaikan kesalahan konsol cascading renders sepenuhnya.',
          'Perbaikan pembaruan status React pada komponen sidebar menggunakan pelacakan pemasangan sebaris (isMounted) di dalam useEffect untuk menangani pelepasan komponen secara aman dan mencegah peringatan.',
          'Peningkatan sintaks opasitas CSS pada Sidebar.tsx dari pecahan tanda kurung arbitrer (white/[0.06]) menjadi persentase asli Tailwind CSS v4 standar (white/6 dan white/8).'
        ]
      }
    }
  ]

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col selection:bg-accent-subtle selection:text-ink">
      {/* Header */}
      <header className="w-full border-b border-border-subtle bg-surface-0/80 backdrop-blur-md sticky top-0 z-50">
        <div className="px-6 py-4 flex justify-between items-center max-w-3xl mx-auto">
          <Link href="/" className="font-display text-lg font-bold tracking-tight text-ink flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-white text-xs font-mono">P</span>
            PRD Generator
          </Link>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              className="text-ink-tertiary hover:text-ink text-xs font-mono font-medium tracking-wide uppercase transition-colors"
            >
              {language === 'en' ? '🇮🇩 ID' : '🇬🇧 EN'}
            </button>
            <Link
              href="/"
              className="text-sm font-medium text-ink-secondary hover:text-ink transition-colors"
            >
              {language === 'en' ? 'Back' : 'Kembali'}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="space-y-2 border-b border-border-subtle pb-8 mb-10">
          <h1 className="font-display text-4xl font-bold text-ink">Changelog</h1>
          <p className="text-ink-secondary text-base leading-relaxed">
            {language === 'en' 
              ? 'Stay updated with the latest updates, enhancements, and stability improvements.' 
              : 'Pantau pembaruan terkini, peningkatan fitur, dan stabilitas sistem.'}
          </p>
        </div>

        <div className="space-y-12">
          {releases.map((rel) => (
            <div key={rel.version} className="space-y-6 relative pl-6 border-l border-border">
              {/* Timeline dot */}
              <div className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent" />
              
              {/* Release Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                <span className="font-mono text-lg font-bold text-accent">{rel.version}</span>
                <span className="text-xs font-mono text-ink-tertiary">{rel.date}</span>
              </div>

              {/* Added section */}
              {rel.added[language].length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
                    {language === 'en' ? 'Added' : 'Ditambahkan'}
                  </h3>
                  <ul className="space-y-2">
                    {rel.added[language].map((item, idx) => (
                      <li key={idx} className="text-sm text-ink-secondary leading-relaxed flex items-baseline gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 translate-y-[8px]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fixed section */}
              {rel.fixed[language].length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
                    {language === 'en' ? 'Fixed' : 'Diperbaiki'}
                  </h3>
                  <ul className="space-y-2">
                    {rel.fixed[language].map((item, idx) => (
                      <li key={idx} className="text-sm text-ink-secondary leading-relaxed flex items-baseline gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-ink-tertiary shrink-0 translate-y-[8px]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border bg-surface-0 mt-auto">
        <div className="max-w-3xl mx-auto flex justify-between items-center text-xs text-ink-tertiary">
          <span>
            {language === 'en' ? 'PRD Generator Changelog' : 'Changelog PRD Generator'}
          </span>
          <Link href="/" className="hover:text-ink transition-colors font-medium">
            {language === 'en' ? 'Home' : 'Beranda'}
          </Link>
        </div>
      </footer>
    </div>
  )
}
