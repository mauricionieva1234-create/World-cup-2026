'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

const locales = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Français' },
  { code: 'pt', label: 'PT', name: 'Português' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [langOpen, setLangOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('nav')
  const links = [
    { href: '#inicio', label: t('home') },
    { href: '#fixture', label: t('fixture') },
    { href: '#posiciones', label: t('standings') },
    { href: '#eliminacion', label: t('bracket') },
    { href: '#selecciones', label: t('teams') },
    { href: '#estadios', label: t('stadiums') },
    { href: '#estadisticas', label: t('stats') },
    { href: '#historia', label: t('history') },
    { href: '#ia', label: t('ai') },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = links.map(l => l.href.slice(1))
    const observers: IntersectionObserver[] = []
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.3 }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const switchLocale = (locale: string) => {
    router.replace(pathname, { locale })
    setLangOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-card/80 backdrop-blur-xl shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="#inicio" className="flex items-center gap-3 group">
            <img
              src="/images/logomundial.webp"
              alt="Mundial 2026"
              className="h-9 w-auto lg:h-11 drop-shadow-lg"
            />
            <span className="text-2xl lg:text-3xl font-bold text-gradient tracking-tight">
              Mundial 2026
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === link.href.slice(1)
                    ? 'text-gold bg-gold/10'
                    : 'text-gray-modern/70 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors text-sm font-bold text-gray-modern/70 hover:text-foreground"
                aria-label="Cambiar idioma"
              >
                <span className="text-base">🌐</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-36 bg-dark-card border border-foreground/10 rounded-xl overflow-hidden shadow-xl backdrop-blur-xl"
                  >
                    {locales.map(locale => (
                      <button
                        key={locale.code}
                        onClick={() => switchLocale(locale.code)}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-modern/80 hover:text-foreground hover:bg-foreground/5 transition-colors flex items-center gap-2"
                      >
                        {locale.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
              aria-label="Menú"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-full bg-current rounded-full"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block h-0.5 w-full bg-current rounded-full"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className="block h-0.5 w-full bg-current rounded-full"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-card/95 backdrop-blur-xl border-t border-foreground/5 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeSection === link.href.slice(1)
                      ? 'text-gold bg-gold/10'
                      : 'text-gray-modern/70 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
