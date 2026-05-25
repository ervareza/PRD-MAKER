'use client'

import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'

export default function ChangelogPage() {
  const { language, setLanguage } = useLanguage()

  const releases = [
    {
      version: 'v2.1.0',
      date: '2026-05-25',
      added: {
        en: [
          'Auth error page (/auth/auth-code-error) — users no longer see 404 on failed OAuth login.',
          'PRD delete functionality — trash button in document header with confirmation modal and cascade delete.',
          'Dashboard now shows all PRDs in a responsive grid with titles, descriptions, and timestamps.',
          'Sidebar auto-refreshes after PRD creation/deletion.',
          'Navigation guard warns users if they try to leave during PRD generation.',
          'Revision overlay with spinner prevents reading stale content during AI revision.',
          'Version limit: max 50 revisions per PRD to prevent storage bloat.',
          'Changelog link added to sidebar footer.',
          'Database migration: NOT NULL constraint on prds.user_id, index on prd_versions.prd_id.',
        ],
        id: [
          'Halaman error autentikasi (/auth/auth-code-error) — pengguna tidak lagi melihat 404 saat OAuth gagal.',
          'Fitur hapus PRD — tombol hapus di header dokumen dengan modal konfirmasi dan cascade delete.',
          'Dashboard sekarang menampilkan semua PRD dalam grid responsif dengan judul, deskripsi, dan timestamp.',
          'Sidebar otomatis ter-refresh setelah pembuatan/penghapusan PRD.',
          'Peringatan navigasi saat pengguna mencoba meninggalkan halaman selama pembuatan PRD.',
          'Overlay revisi dengan spinner mencegah pembacaan konten lama selama revisi AI.',
          'Batas versi: maks 50 revisi per PRD untuk mencegah penyimpanan membengkak.',
          'Link changelog ditambahkan di footer sidebar.',
          'Migrasi database: constraint NOT NULL pada prds.user_id, indeks pada prd_versions.prd_id.',
        ]
      },
      changed: {
        en: [
          'Switched AI provider from Groq (Llama 3.3) to Google Gemini API (gemini-3.1-flash-lite).',
          'Input validation on PRD generation: title (2–200 chars), idea (10–10,000 chars).',
          'API error messages no longer leak implementation details.',
          'Bumped maxDuration from 60s to 120s for complex PRD generation.',
        ],
        id: [
          'Beralih penyedia AI dari Groq (Llama 3.3) ke Google Gemini API (gemini-3.1-flash-lite).',
          'Validasi input pada pembuatan PRD: judul (2–200 karakter), ide (10–10.000 karakter).',
          'Pesan error API tidak lagi membocorkan detail implementasi.',
          'Menaikkan maxDuration dari 60 detik ke 120 detik untuk pembuatan PRD kompleks.',
        ]
      },
      fixed: {
        en: [
          'Export filename regex bug: spaces are now properly replaced with underscores.',
          'Self-referencing --font-mono CSS variable replaced with proper monospace fallback stack.',
          'Terms of service text in login page is now a clickable link.',
        ],
        id: [
          'Bug regex nama file ekspor: spasi sekarang diganti dengan garis bawah dengan benar.',
          'Variabel CSS --font-mono yang mereferensikan diri sendiri diganti dengan stack fallback monospace yang tepat.',
          'Teks syarat layanan di halaman login sekarang berupa tautan yang dapat diklik.',
        ]
      },
      removed: {
        en: [
          'Dead /auth/signout server route (logout uses client-side supabase.auth.signOut()).',
        ],
        id: [
          'Rute server /auth/signout yang tidak terpakai (logout menggunakan supabase.auth.signOut() sisi klien).',
        ]
      },
      security: {
        en: [
          'seed-test-prd route blocked in production via NODE_ENV guard.',
          'Verified .env.local never committed to git history.',
        ],
        id: [
          'Rute seed-test-prd diblokir di produksi melalui guard NODE_ENV.',
          'Memverifikasi .env.local tidak pernah di-commit ke riwayat git.',
        ]
      }
    },
    {
      version: 'v2.0.1',
      date: '2026-05-23',
      added: {
        en: [],
        id: []
      },
      fixed: {
        en: [
          'Fixed missing React elements bug on language switch in page.tsx by using index as stable key for feature grid array.',
          'Fixed cascading render warning in LanguageContext.tsx by deferring the initial state setting on hydration using setTimeout.',
          'Resolved static analysis TypeScript error in exportMd.ts by explicitly silencing @typescript-eslint/no-explicit-any.',
          'Replaced the bright native scrollbars in Chrome/Edge with cross-browser subtle themed scrollbars in globals.css.',
          'Removed the Powered by Groq indicator from the landing page layout.'
        ],
        id: [
          'Memperbaiki bug hilangnya elemen React saat beralih bahasa di page.tsx dengan menggunakan index sebagai key stabil untuk array grid fitur.',
          'Memperbaiki peringatan cascading render di LanguageContext.tsx dengan menunda pembaruan status awal saat hidrasi menggunakan setTimeout.',
          'Menyelesaikan error TypeScript analisis statik di exportMd.ts dengan menyembunyikan @typescript-eslint/no-explicit-any.',
          'Mengganti scrollbar native yang terlalu terang di Chrome/Edge dengan scrollbar halus bertema lintas-browser di globals.css.',
          'Menghilangkan indikator Powered by Groq dari tata letak halaman pendaratan.'
        ]
      }
    },
    {
      version: 'v2.0.0',
      date: '2026-05-23',
      added: {
        en: [],
        id: []
      },
      fixed: {
        en: [],
        id: []
      },
      changed: {
        en: [
          'Restructured repository layout by moving all files and folders from the prd-generator subdirectory directly to the workspace root directory (d:\\CODE\\PRD-MAKER) for direct workspace access.',
          'Relocated git history, configuration, environment variables (.env.local), and package dependencies directly to the workspace root.',
          'Upgraded project branch to v2.0.0 major version branch.'
        ],
        id: [
          'Restrukturisasi tata letak repositori dengan memindahkan semua file dan folder dari subdirektori prd-generator langsung ke direktori root workspace (d:\\CODE\\PRD-MAKER) untuk akses workspace langsung.',
          'Relokasi riwayat git, konfigurasi, variabel lingkungan (.env.local), dan dependensi paket langsung ke root workspace.',
          'Peningkatan branch proyek ke branch versi utama v2.0.0.'
        ]
      }
    },
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
          'Adjusted bullet dot alignment in the PRD view page (prd/[id]/page.tsx) by replacing items-baseline with items-start and a precision top margin for perfect horizontal centering.',
          'Removed unused imports (useCallback, useEffect) from src/components/Sidebar.tsx and src/app/login/page.tsx to eliminate code smell and clean up linter warnings.',
          'Cleaned up multiple Tailwind CSS utility warnings on src/app/page.tsx (using standard hover:-translate-y-px, fixing layout conflicts on hidden/flex classes, and migrating from h-[1px] to h-px).',
          'Avoided unused map variables (i) in src/app/page.tsx loops.'
        ],
        id: [
          'Sinkronisasi pemuatan status di dalam hook useEffect React pada prd/[id]/page.tsx menggunakan logika fetchData terenkapsulasi yang dipadukan dengan status refreshTrigger untuk sepenuhnya menyelesaikan kesalahan analisis statik cascading renders.',
          'Penyelarasan perataan titik bullet di halaman tampilan PRD (prd/[id]/page.tsx) dengan mengganti items-baseline ke items-start dan margin atas presisi untuk pemusatan horizontal yang sempurna.',
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

              {/* Changed section */}
              {rel.changed && rel.changed[language] && rel.changed[language].length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
                    {language === 'en' ? 'Changed' : 'Diubah'}
                  </h3>
                  <ul className="space-y-2">
                    {rel.changed[language].map((item, idx) => (
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

              {/* Removed section */}
              {rel.removed && rel.removed[language] && rel.removed[language].length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
                    {language === 'en' ? 'Removed' : 'Dihapus'}
                  </h3>
                  <ul className="space-y-2">
                    {rel.removed[language].map((item, idx) => (
                      <li key={idx} className="text-sm text-ink-secondary leading-relaxed flex items-baseline gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0 translate-y-[8px]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Security section */}
              {rel.security && rel.security[language] && rel.security[language].length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
                    {language === 'en' ? 'Security' : 'Keamanan'}
                  </h3>
                  <ul className="space-y-2">
                    {rel.security[language].map((item, idx) => (
                      <li key={idx} className="text-sm text-ink-secondary leading-relaxed flex items-baseline gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0 translate-y-[8px]" />
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
