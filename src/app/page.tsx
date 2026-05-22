'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

export default function Home() {
  const { t, language, setLanguage } = useLanguage()
  const [activeVersion, setActiveVersion] = useState<1 | 2>(1)
  const [isRevising, setIsRevising] = useState(false)
  const [typedPrompt, setTypedPrompt] = useState('')
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Demo content definitions (Bilingual)
  const demoData = {
    title: 'Alora — Creator UI Marketplace',
    idea: {
      en: 'A platform for freelance designers to sell premium Tailwind & Figma UI kits to agencies.',
      id: 'Platform bagi desainer freelance untuk menjual UI kit premium Tailwind & Figma ke agensi.'
    },
    summary: {
      v1: {
        en: 'Alora is a curated digital marketplace designed for freelance UI/UX designers to monetize their premium designs, providing agencies with instant access to production-ready, beautiful components.',
        id: 'Alora adalah marketplace digital terkurasi yang dirancang bagi desainer UI/UX freelance untuk memonetisasi desain premium mereka, memberi agensi akses instan ke komponen cantik siap produksi.'
      },
      v2: {
        en: 'Alora is an enterprise-ready digital marketplace for freelance UI/UX designers to monetize premium work. Featuring Stripe Connect for global payouts, automated compliance, and real-time creator analytics.',
        id: 'Alora adalah marketplace digital siap enterprise bagi desainer UI/UX freelance untuk memonetisasi karya premium. Menghadirkan Stripe Connect untuk pembayaran global, kepatuhan otomatis, dan analitik kreator real-time.'
      }
    },
    personas: {
      v1: [
        {
          name: 'Sarah (Freelance Designer)',
          description: {
            en: 'Needs a secure, low-friction platform to list, license, and price her custom Tailwind templates.',
            id: 'Butuh platform aman dan mudah untuk mendaftarkan, melisensikan, dan menghargai templat Tailwind kustomnya.'
          },
          needs: {
            en: 'Automated file delivery, fair revenue split, custom shop page.',
            id: 'Pengiriman file otomatis, bagi hasil yang adil, halaman toko kustom.'
          }
        },
        {
          name: 'David (Agency Founder)',
          description: {
            en: 'Needs fast, high-quality, production-ready React components to speed up client project delivery.',
            id: 'Butuh komponen React siap produksi yang cepat, berkualitas tinggi untuk mempercepat pengerjaan proyek klien.'
          },
          needs: {
            en: 'Standard commercial licenses, bulk downloads, clean code.',
            id: 'Lisensi komersial standar, unduhan massal, kode yang bersih.'
          }
        }
      ],
      v2: [
        {
          name: 'Sarah (Freelance Designer)',
          description: {
            en: 'Needs a secure, low-friction platform to list premium kits. Now tracks global earnings easily with automatic local tax reporting.',
            id: 'Butuh platform mudah untuk melacak karya premium. Kini memantau pendapatan global dengan laporan pajak otomatis.'
          },
          needs: {
            en: 'Automated file delivery, instant Stripe multi-currency payouts, tax compliance.',
            id: 'Pengiriman file otomatis, penarikan dana Stripe instan berbagai mata uang, kepatuhan pajak.'
          },
          isNew: true
        },
        {
          name: 'David (Agency Founder)',
          description: {
            en: 'Needs premium React components. Requires transparent developer seat licenses and invoice management for accounting.',
            id: 'Butuh komponen React premium. Memerlukan lisensi tim pengembang yang transparan dan manajemen faktur untuk akuntansi.'
          },
          needs: {
            en: 'Bulk downloads, seat license manager, automated corporate invoicing.',
            id: 'Unduhan massal, pengatur lisensi tim, pembuatan faktur korporat otomatis.'
          }
        }
      ]
    },
    features: {
      v1: [
        {
          name: { en: 'Curated Creator Portals', id: 'Portal Kreator Terkurasi' },
          desc: {
            en: 'Let designers set up personalized storefronts, list items, and customize profile pages.',
            id: 'Memungkinkan desainer mengatur etalase pribadi, mendaftarkan produk, dan kustomisasi profil.'
          },
          priority: 'High'
        },
        {
          name: { en: 'One-Click React Export', id: 'Ekspor React Sekali Klik' },
          desc: {
            en: 'Instant copy-paste clean JSX/Tailwind code directly from the browser preview.',
            id: 'Salin-tempel instan kode JSX/Tailwind bersih langsung dari pratonton browser.'
          },
          priority: 'High'
        },
        {
          name: { en: 'Figma Shared Link Delivery', id: 'Pengiriman Link Figma' },
          desc: {
            en: 'Automated delivery of shared Figma source file links upon verified checkout.',
            id: 'Pengiriman otomatis link file Figma sumber yang dibagikan setelah pembayaran terverifikasi.'
          },
          priority: 'Medium'
        }
      ],
      v2: [
        {
          name: { en: 'Curated Creator Portals', id: 'Portal Kreator Terkurasi' },
          desc: {
            en: 'Let designers set up personalized storefronts, list items, and customize profile pages.',
            id: 'Memungkinkan desainer mengatur etalase pribadi, mendaftarkan produk, dan kustomisasi profil.'
          },
          priority: 'High'
        },
        {
          name: { en: 'One-Click React Export', id: 'Ekspor React Sekali Klik' },
          desc: {
            en: 'Instant copy-paste clean JSX/Tailwind code directly from the browser preview.',
            id: 'Salin-tempel instan kode JSX/Tailwind bersih langsung dari pratonton browser.'
          },
          priority: 'High'
        },
        {
          name: { en: 'Stripe Connect Integration', id: 'Integrasi Stripe Connect' },
          desc: {
            en: 'Direct multi-currency merchant splits, automated designer onboarding, and local tax handling.',
            id: 'Bagi hasil pedagang multi-mata uang langsung, registrasi desainer otomatis, dan perpajakan lokal.',
          },
          priority: 'High',
          isNew: true
        },
        {
          name: { en: 'Real-Time Sales Dashboard', id: 'Dasbor Penjualan Real-Time' },
          desc: {
            en: 'Interactive charts for creators showing revenue, store traffic, item views, and average conversion rate.',
            id: 'Grafik interaktif untuk kreator yang menampilkan pendapatan, lalu lintas toko, dan rasio konversi.'
          },
          priority: 'Medium',
          isNew: true
        }
      ]
    },
    tech: {
      v1: {
        frontend: 'Next.js 15 (App Router)',
        backend: 'Supabase Edge Functions',
        db: 'PostgreSQL',
        reasoning: {
          en: 'Next.js delivers fast static generation and rich SSR capabilities for SEO-friendly creator portals. Supabase provides effortless Auth and file storage.',
          id: 'Next.js menyajikan performa statis cepat dan kapabilitas SSR kaya untuk portal kreator yang ramah SEO. Supabase memudahkan Autentikasi dan penyimpanan.'
        }
      },
      v2: {
        frontend: 'Next.js 15 (App Router)',
        backend: 'Supabase + Node.js (Stripe Webhooks)',
        db: 'PostgreSQL (Supabase Row-Level Security)',
        reasoning: {
          en: 'Next.js handles frontend static components and interactive charts seamlessly. Stripe webhooks are processed securely via Supabase Edge Functions with full transactional logging.',
          id: 'Next.js mengelola komponen statis frontend dan grafik interaktif secara mulus. Webhook Stripe diproses aman via Supabase Edge Functions.'
        }
      }
    }
  }

  // Auto-play loop logic
  useEffect(() => {
    if (!isAutoPlaying) return

    const runAutoPlay = () => {
      // Step 1: Wait on v1 for a few seconds
      autoPlayTimerRef.current = setTimeout(() => {
        // Step 2: Start typing prompt
        const promptText = language === 'en' 
          ? 'Add Stripe Connect integration for global payouts and a real-time sales dashboard.'
          : 'Tambahkan integrasi Stripe Connect untuk penarikan global dan dasbor penjualan real-time.'
        
        let currentCharIndex = 0
        setTypedPrompt('')
        
        typingIntervalRef.current = setInterval(() => {
          if (currentCharIndex < promptText.length) {
            setTypedPrompt((prev) => prev + promptText.charAt(currentCharIndex))
            currentCharIndex++
          } else {
            // Typing finished
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
            
            // Step 3: Trigger loading / revision spinner
            autoPlayTimerRef.current = setTimeout(() => {
              setIsRevising(true)
              
              // Step 4: Complete revision, show v2
              autoPlayTimerRef.current = setTimeout(() => {
                setIsRevising(false)
                setActiveVersion(2)
                
                // Step 5: Keep v2 visible for a while, then reset to v1
                autoPlayTimerRef.current = setTimeout(() => {
                  setActiveVersion(1)
                  setTypedPrompt('')
                  runAutoPlay() // Loop
                }, 7000)
              }, 1500)
            }, 1000)
          }
        }, 35) // Typing speed
      }, 3500)
    }

    runAutoPlay()

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current)
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    }
  }, [isAutoPlaying, language])

  // Handle manual clicks
  const handleVersionSelect = (ver: 1 | 2) => {
    setIsAutoPlaying(false)
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current)
    setIsRevising(false)
    setTypedPrompt('')
    setActiveVersion(ver)
  }

  const features = [
    {
      title: language === 'en' ? 'AI-Powered Structuring' : 'Penstrukturan Didukung AI',
      description:
        language === 'en'
          ? 'Describe your product in simple words. AI formats it into professional PRDs with rich personas, technical scopes, and priorities.'
          : 'Jelaskan produk Anda dengan kata-kata sederhana. AI memformatnya menjadi PRD profesional lengkap dengan persona, cakupan teknis, dan prioritas.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      title: language === 'en' ? 'Continuous Version Control' : 'Kontrol Versi Berkelanjutan',
      description:
        language === 'en'
          ? 'Iterate naturally. Request revisions through chat, and AI compiles a new version. Instantly compare and restore previous versions.'
          : 'Perbaiki secara natural. Minta revisi melalui chat, dan AI menyusun versi baru. Bandingkan dan pulihkan versi sebelumnya kapan saja.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V10M18 20V4M6 20v-4" />
        </svg>
      ),
    },
    {
      title: language === 'en' ? 'Production & Export Ready' : 'Siap Produksi & Ekspor',
      description:
        language === 'en'
          ? 'Download clean Markdown documents to drop directly into GitHub/Notion, or print standard corporate PDFs for stakeholders.'
          : 'Unduh dokumen Markdown bersih untuk dimasukkan ke GitHub/Notion, atau cetak PDF korporat standar untuk pemangku kepentingan.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12M5 12l7 7 7-7" />
          <path d="M5 21h14" />
        </svg>
      ),
    },
  ]

  const steps = [
    {
      step: '01',
      title: language === 'en' ? 'Provide Your Vision' : 'Tulis Visi Anda',
      description:
        language === 'en'
          ? 'Describe what you want to build in plain English or Indonesian — the target users, core features, or technical requirements.'
          : 'Jelaskan apa yang ingin Anda bangun dalam bahasa biasa — target pengguna, fitur utama, atau kebutuhan teknis.',
    },
    {
      step: '02',
      title: language === 'en' ? 'AI Generates Structure' : 'AI Menyusun Struktur',
      description:
        language === 'en'
          ? 'Our engine instantly structures your thoughts into a professional document complete with user personas, system stacks, and high-fidelity features.'
          : 'Mesin kami langsung menstrukturkan pikiran Anda menjadi dokumen profesional lengkap dengan persona pengguna, tech stack, dan fitur detail.',
    },
    {
      step: '03',
      title: language === 'en' ? 'Iterate & Refine' : 'Revisi & Sempurnakan',
      description:
        language === 'en'
          ? 'Use the sticky revision bar to fine-tune your PRD. Tell the AI to focus on mobile, shift backend tech, or add features. Every iteration creates a new version.'
          : 'Gunakan bilah revisi melayang untuk memperhalus PRD. Minta AI fokus pada mobile, ganti tech backend, atau tambah fitur. Setiap iterasi melahirkan versi baru.',
    },
  ]

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col selection:bg-accent-subtle selection:text-ink">
      {/* Navbar */}
      <header className="w-full border-b border-border-subtle bg-surface-0/80 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="px-6 py-4 flex justify-between items-center max-w-5xl mx-auto">
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
              href="/login"
              className="text-sm font-medium text-ink-secondary hover:text-ink transition-colors"
            >
              {language === 'en' ? 'Log in' : 'Masuk'}
            </Link>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-md transition-colors shadow-sm"
            >
              {t('landing.getStarted')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-12 max-w-5xl mx-auto w-full text-center sm:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-1 border border-border rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-ink-secondary uppercase">
                Powered by Groq · Llama 3.3 70B
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink leading-[1.08]">
              {t('landing.title')}
            </h1>

            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-xl mx-auto sm:mx-0" style={{ textWrap: 'pretty' }}>
              {t('landing.subtitle')}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent-hover text-white rounded-md font-semibold text-sm transition-all shadow-sm hover:-translate-y-px"
              >
                {t('landing.getStarted')}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="translate-y-[0.5px]">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-1 hover:bg-surface-2 border border-border text-ink-secondary hover:text-ink rounded-md font-medium text-sm transition-colors"
              >
                {language === 'en' ? 'See How it Works' : 'Lihat Cara Kerja'}
              </a>
            </div>
          </div>

          {/* Signature Detail: The Interactive High-Fidelity Workspace Preview */}
          <div className="lg:col-span-6 w-full max-w-2xl mx-auto">
            <div className="text-left bg-surface-raised border border-border rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col h-[530px] relative transition-all">
              {/* Browser Window Bar */}
              <div className="bg-surface-1 border-b border-border/80 px-4 py-3 flex items-center justify-between shrink-0 select-none">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/20 border border-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-500/20" />
                </div>
                <div className="bg-surface-raised border border-border-subtle rounded-md px-4 py-1 text-[11px] font-mono text-ink-tertiary flex items-center gap-1.5 w-1/2 max-w-[240px] justify-center">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="opacity-40">
                    <rect x="2" y="4" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4 4V3a2 2 0 114 0v1" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  generator.prd/project/alora
                </div>
                <div className="flex gap-1 items-center">
                  {isAutoPlaying && (
                    <span className="text-[10px] text-accent font-mono animate-pulse mr-1">● DEMO LOOP</span>
                  )}
                  <button 
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="p-1 text-ink-tertiary hover:text-ink hover:bg-surface-2 rounded-sm transition-all"
                    title={isAutoPlaying ? "Pause Auto Play" : "Play Demo Auto Loop"}
                  >
                    {isAutoPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M3 2h3v12H3zm7 0h3v12h-3z"/></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2v12l10-6z"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Workspace Frame */}
              <div className="flex-1 flex overflow-hidden bg-surface-0 min-h-0">
                {/* Mock Minimal Sidebar */}
                <div className="w-[180px] bg-surface-1 border-r border-border/80 p-3 flex-col justify-between shrink-0 hidden sm:flex select-none">
                  <div className="space-y-4">
                    <div className="bg-surface-raised border border-border-subtle rounded-md px-2 py-1.5 text-xs text-ink-secondary flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="5" cy="5" r="3"/><path d="M10 10L7 7"/>
                      </svg>
                      {language === 'en' ? 'Search docs...' : 'Cari dokumen...'}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-wider font-semibold font-mono text-ink-ghost px-1">{language === 'en' ? 'Today' : 'Hari Ini'}</p>
                      <div className="p-1.5 rounded bg-surface-raised border border-border-subtle flex items-center justify-between text-[11px] font-semibold text-ink">
                        <span className="truncate">Alora Marketplace</span>
                        <span className="text-[8px] font-mono bg-accent-subtle text-accent px-1 rounded">v{activeVersion}</span>
                      </div>
                      <div className="p-1.5 rounded hover:bg-surface-raised/40 text-[11px] text-ink-secondary flex items-center justify-between">
                        <span className="truncate">AI Travel Assistant</span>
                        <span className="text-[8px] font-mono bg-surface-2 text-ink-tertiary px-1 rounded">v1</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-wider font-semibold font-mono text-ink-ghost px-1">{language === 'en' ? 'Yesterday' : 'Kemarin'}</p>
                      <div className="p-1.5 rounded hover:bg-surface-raised/40 text-[11px] text-ink-secondary flex items-center">
                        <span className="truncate">Saas CRM Portal</span>
                      </div>
                      <div className="p-1.5 rounded hover:bg-surface-raised/40 text-[11px] text-ink-secondary flex items-center">
                        <span className="truncate">Fintech Ledger DB</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border-subtle pt-2 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent text-white font-semibold text-[10px] flex items-center justify-center font-mono">JD</div>
                    <span className="text-[10px] text-ink-secondary font-medium">Jane Doe</span>
                  </div>
                </div>

                {/* Simulated Document view */}
                <div className="flex-1 flex flex-col min-w-0 bg-surface-0 overflow-y-auto">
                  {/* Editor Header inside Mockup */}
                  <div className="p-4 border-b border-border-subtle bg-surface-raised shrink-0 flex items-center justify-between select-none">
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold text-ink truncate">{demoData.title}</h3>
                      <p className="text-[10px] text-ink-tertiary truncate italic">
                        {language === 'en' ? demoData.idea.en : demoData.idea.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="flex rounded border border-border bg-surface-0 overflow-hidden">
                        <button 
                          onClick={() => handleVersionSelect(1)}
                          className={`px-2 py-1 text-[10px] font-mono border-r border-border transition-colors ${activeVersion === 1 ? 'bg-accent text-white font-bold' : 'text-ink-secondary hover:bg-surface-1'}`}
                        >
                          v1
                        </button>
                        <button 
                          onClick={() => handleVersionSelect(2)}
                          className={`px-2 py-1 text-[10px] font-mono transition-colors ${activeVersion === 2 ? 'bg-accent text-white font-bold' : 'text-ink-secondary hover:bg-surface-1'}`}
                        >
                          v2
                        </button>
                      </div>
                      <div className="h-5 border-l border-border-subtle mx-1" />
                      <div className="flex gap-1">
                        <span className="px-1.5 py-1 text-[9px] font-medium text-ink-tertiary bg-surface-1 border border-border rounded flex items-center gap-0.5">
                          .md
                        </span>
                        <span className="px-1.5 py-1 text-[9px] font-medium text-ink-tertiary bg-surface-1 border border-border rounded flex items-center gap-0.5">
                          PDF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Document Content inside Mockup */}
                  <div className="p-4 sm:p-5 space-y-5 flex-1 min-h-0 text-left relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeVersion}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5"
                      >
                        {/* Executive Summary */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h4 className="font-display text-xs font-bold text-ink uppercase tracking-wider">Executive Summary</h4>
                            {activeVersion === 2 && (
                              <span className="text-[9px] font-mono font-medium text-accent bg-accent-subtle px-1.5 py-0.5 rounded">
                                {language === 'en' ? 'Revised Summary' : 'Ringkasan Direvisi'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-ink-secondary leading-[1.6]">
                            {activeVersion === 1 
                              ? (language === 'en' ? demoData.summary.v1.en : demoData.summary.v1.id)
                              : (language === 'en' ? demoData.summary.v2.en : demoData.summary.v2.id)
                            }
                          </p>
                        </div>

                        <hr className="border-border-subtle" />

                        {/* Personas */}
                        <div className="space-y-2">
                          <h4 className="font-display text-xs font-bold text-ink uppercase tracking-wider">{language === 'en' ? 'User Personas' : 'Persona Pengguna'}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(activeVersion === 1 ? demoData.personas.v1 : demoData.personas.v2).map((p, i) => (
                              <div 
                                key={i} 
                                className={`p-2.5 rounded border text-[10px] transition-all duration-300 ${'isNew' in p && activeVersion === 2 ? 'bg-accent-subtle/50 border-accent/20 shadow-sm' : 'bg-surface-raised border-border-subtle'}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-ink">{p.name}</span>
                                  {'isNew' in p && activeVersion === 2 && (
                                    <span className="text-[7px] font-mono bg-accent text-white px-1 rounded">{language === 'en' ? 'UPDATED' : 'DIPERBARUI'}</span>
                                  )}
                                </div>
                                <p className="text-ink-secondary mt-0.5 leading-relaxed">
                                  {language === 'en' ? p.description.en : p.description.id}
                                </p>
                                <p className="text-ink-tertiary mt-1 text-[9px] leading-tight">
                                  <span className="font-semibold text-ink-secondary">{language === 'en' ? 'Needs:' : 'Kebutuhan:'}</span> {language === 'en' ? p.needs.en : p.needs.id}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <hr className="border-border-subtle" />

                        {/* Core Features */}
                        <div className="space-y-2">
                          <h4 className="font-display text-xs font-bold text-ink uppercase tracking-wider">{language === 'en' ? 'Core Features' : 'Fitur Utama'}</h4>
                          <div className="divide-y divide-border-subtle">
                            {(activeVersion === 1 ? demoData.features.v1 : demoData.features.v2).map((f, i) => (
                              <div 
                                key={i} 
                                className={`py-2 flex items-start justify-between gap-4 transition-all duration-300 ${'isNew' in f && activeVersion === 2 ? 'bg-accent-subtle/30 px-1.5 rounded-sm' : ''}`}
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-ink text-[11px]">
                                      {language === 'en' ? f.name.en : f.name.id}
                                    </span>
                                    {'isNew' in f && activeVersion === 2 && (
                                      <span className="text-[7px] font-mono bg-accent text-white px-1 rounded animate-pulse">
                                        + {language === 'en' ? 'NEW IN v2' : 'BARU DI v2'}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-ink-secondary text-[10px] leading-relaxed">
                                    {language === 'en' ? f.desc.en : f.desc.id}
                                  </p>
                                </div>
                                <span className={`text-[8px] font-mono px-1 py-0.5 rounded-sm shrink-0 ${f.priority === 'High' ? 'bg-accent-subtle text-accent' : 'bg-surface-1 text-ink-secondary'}`}>
                                  {f.priority}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <hr className="border-border-subtle" />

                        {/* Tech Stack */}
                        <div className="space-y-2 pb-6">
                          <h4 className="font-display text-xs font-bold text-ink uppercase tracking-wider">{language === 'en' ? 'Tech Stack Recommendation' : 'Rekomendasi Tech Stack'}</h4>
                          <div className="grid grid-cols-3 gap-px bg-border-subtle rounded overflow-hidden">
                            <div className="bg-surface-raised p-2">
                              <p className="text-[8px] font-mono text-ink-ghost uppercase tracking-wide">Frontend</p>
                              <p className="text-[10px] font-semibold text-ink leading-tight">{(activeVersion === 1 ? demoData.tech.v1 : demoData.tech.v2).frontend}</p>
                            </div>
                            <div className="bg-surface-raised p-2">
                              <p className="text-[8px] font-mono text-ink-ghost uppercase tracking-wide">Backend</p>
                              <p className="text-[10px] font-semibold text-ink leading-tight">{(activeVersion === 1 ? demoData.tech.v1 : demoData.tech.v2).backend}</p>
                            </div>
                            <div className="bg-surface-raised p-2">
                              <p className="text-[8px] font-mono text-ink-ghost uppercase tracking-wide">Database</p>
                              <p className="text-[10px] font-semibold text-ink leading-tight">{(activeVersion === 1 ? demoData.tech.v1 : demoData.tech.v2).db}</p>
                            </div>
                          </div>
                          <p className="text-[9.5px] italic text-ink-tertiary leading-relaxed pl-2 border-l border-accent">
                            {language === 'en' 
                              ? (activeVersion === 1 ? demoData.tech.v1.reasoning.en : demoData.tech.v2.reasoning.en)
                              : (activeVersion === 1 ? demoData.tech.v1.reasoning.id : demoData.tech.v2.reasoning.id)
                            }
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Sticky Prompt / Revision Bar inside Mockup */}
              <div className="shrink-0 border-t border-border bg-surface-raised p-3 relative z-10">
                <div className="flex gap-2">
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="text"
                      readOnly
                      value={typedPrompt}
                      placeholder={language === 'en' ? "Request revisions... e.g. Focus on offline capabilities" : "Minta revisi... misal: Fokus pada kapabilitas luring"}
                      className="w-full bg-surface-0 border border-border rounded pl-3 pr-8 py-1.5 text-xs text-ink placeholder-ink-ghost focus:outline-none"
                    />
                    {typedPrompt && !isRevising && (
                      <span className="absolute right-2 text-ink-ghost font-mono text-[9px] animate-pulse">⏎</span>
                    )}
                  </div>
                  <button 
                    disabled
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded font-medium text-xs shrink-0"
                  >
                    {isRevising ? (
                      <svg className="w-3.5 h-3.5 animate-spin text-white" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2L7 13l-2-4-4-2 13-5z" />
                      </svg>
                    )}
                    <span className="hidden xs:inline">
                      {isRevising 
                        ? (language === 'en' ? 'Generating...' : 'Membuat...') 
                        : (language === 'en' ? `v${activeVersion + 1}` : `v${activeVersion + 1}`)
                      }
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 border-t border-border-subtle bg-surface-1">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="bg-surface-raised border border-border rounded-lg p-6 space-y-4 hover:shadow-md hover:border-border transition-all duration-300"
              >
                <div className="w-9 h-9 bg-accent-subtle rounded-md flex items-center justify-center text-accent">
                  {f.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-lg font-bold text-ink leading-snug">{f.title}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="px-6 py-20 bg-surface-0 border-t border-border-subtle scroll-mt-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-display text-3xl font-bold text-ink leading-tight">
              {language === 'en' ? 'Structured Flow, Zero Friction' : 'Aliran Terstruktur, Tanpa Hambatan'}
            </h2>
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
              {language === 'en'
                ? 'From a fuzzy thought to a high-fidelity blueprint. How our platform guides you from draft to handoff.'
                : 'Dari pikiran acak menjadi cetak biru beresolusi tinggi. Bagaimana platform kami menuntun Anda dari draf hingga serah terima.'}
            </p>
          </div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((s) => (
              <motion.div key={s.step} variants={fadeUp} transition={{ duration: 0.5 }} className="space-y-4 relative">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-accent bg-accent-subtle px-2 py-0.5 rounded">
                    {s.step}
                  </span>
                  <div className="h-px bg-border flex-1 hidden md:block" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-ink">{s.title}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-surface-1 border-t border-border-subtle text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-3">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
              {language === 'en' ? 'Build with Clear Intent' : 'Bangun dengan Niat yang Jelas'}
            </h2>
            <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-lg mx-auto">
              {language === 'en'
                ? 'Stop writing requirements from blank slates. Let AI construct the scaffold while you govern the vision.'
                : 'Berhenti menulis persyaratan dari lembar kosong. Biarkan AI menyusun kerangka dasar selagi Anda mengelola visi.'}
            </p>
          </div>
          <div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-md font-semibold text-sm transition-all shadow hover:-translate-y-px"
            >
              {t('landing.getStarted')}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border bg-surface-0 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ink-tertiary">
            {language === 'en' ? 'Open source framework · Developed using Next.js & Supabase' : 'Kerangka kerja sumber terbuka · Dikembangkan dengan Next.js & Supabase'}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
              className="text-xs text-ink-secondary hover:text-ink transition-colors font-medium"
            >
              {language === 'en' ? '🇮🇩 Bahasa Indonesia' : '🇬🇧 English'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
