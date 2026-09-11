'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import Navbar from '@/components/Navbar'
import ParticleBackground from '@/components/ParticleBackground'
import { stadiums } from '@/data/stadiums'
import { useTranslations } from 'next-intl'

const cities = ['all', ...Array.from(new Set(stadiums.map(s => s.location.split(',')[0].trim())))]
const ownerTypes = ['all', 'MLS', 'NFL', 'Otro']

export default function StadiumsPage() {
  const t = useTranslations('stadiumSection')
  const common = useTranslations('common')
  const [cityFilter, setCityFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('all')

  const filtered = useMemo(() => {
    return stadiums.filter(s => {
      if (cityFilter !== 'all' && !s.location.includes(cityFilter)) return false
      if (ownerFilter !== 'all' && s.ownerType !== ownerFilter) return false
      return true
    })
  }, [cityFilter, ownerFilter])

  const formatCapacity = (cap: number) => {
    return cap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  return (
    <div className="relative min-h-screen bg-dark overflow-x-hidden">
      <ParticleBackground />
      <Navbar />
      <div className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-gray-modern/50 hover:text-gold transition-colors text-sm mb-6">
              <span>←</span> {common('backToHome')}
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3">
              {t('title')}
            </h1>
            <p className="text-gray-modern/60 text-lg">
              {t('subtitle')}
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="bg-dark-card text-gray-modern/70 border border-foreground/10 rounded-xl px-5 py-3 text-sm outline-none focus:border-gold/50"
            >
              <option value="all">{t('all')}</option>
              {cities.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex flex-wrap justify-center gap-2">
              {ownerTypes.map(o => (
                <button
                  key={o}
                  onClick={() => setOwnerFilter(o)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    ownerFilter === o
                      ? 'bg-gold text-dark font-bold'
                      : 'bg-dark-card text-gray-modern/70 hover:text-foreground hover:bg-dark-hover border border-foreground/5'
                  }`}
                >
                  {o === 'all' ? common('all') : o === 'Otro' ? t('other') : o}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((stadium, i) => (
              <motion.div
                key={stadium.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="gradient-card rounded-3xl overflow-hidden border border-foreground/5 hover:border-gold/30 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={stadium.image}
                    alt={stadium.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 gradient-overlay" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-foreground">{stadium.name}</h3>
                    <p className="text-sm text-gray-modern/60">{stadium.location}</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <span className="text-xs text-gray-modern/40">Capacidad</span>
                      <p className="text-lg font-bold text-gold">{formatCapacity(stadium.capacity)}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: stadium.ownerType === 'NFL' ? 'rgba(0,87,184,0.2)' : stadium.ownerType === 'MLS' ? 'rgba(0,104,71,0.2)' : 'rgba(212,175,55,0.2)',
                        color: stadium.ownerType === 'NFL' ? '#60a5fa' : stadium.ownerType === 'MLS' ? '#4ade80' : '#facc15'
                      }}
                    >
                      {stadium.ownerType}
                    </div>
                  </div>

                  <div className="text-xs text-gray-modern/60 leading-relaxed">
                    {stadium.history}
                  </div>

                  <div>
                    <span className="text-xs text-gray-modern/40 block mb-2">Eventos destacados</span>
                    <div className="flex flex-wrap gap-2">
                      {stadium.events.map((ev, j) => (
                        <span key={j} className="px-2.5 py-1 rounded-full bg-foreground/5 text-gray-modern/60 text-[10px] font-medium">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-modern/40 pt-2 border-t border-foreground/5">
                    <span>📍</span>
                    <span>{stadium.lat.toFixed(3)}, {stadium.lng.toFixed(3)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-modern/50">
              <p className="text-lg">{t('noStadiums')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
