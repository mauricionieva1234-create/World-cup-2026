'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { stadiums } from '@/data/stadiums'

export default function StadiumSection() {
  const t = useTranslations('stadiumSection')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filterCity, setFilterCity] = useState('all')

  const cities = ['all', ...new Set(stadiums.map(s => s.location.split(',')[0].trim()))]

  const filtered = stadiums.filter(s => {
    const cityMatch = filterCity === 'all' || s.location.startsWith(filterCity)
    const searchMatch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase())
    return cityMatch && searchMatch
  })

  const ownerBadgeColor = (type: string) => {
    switch (type) {
      case 'NFL': return 'bg-red-500/20 text-red-400'
      case 'MLS': return 'bg-blue-500/20 text-blue-400'
      default: return 'bg-gold/20 text-gold'
    }
  }

  return (
    <section id="estadios" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t('title').split(' ')[0]} <span className="text-gradient">{t('title').split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-gray-modern/60 text-lg">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSearch('')}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all bg-dark-card text-gray-modern/70 hover:text-foreground border border-foreground/5"
          >
            {t('clearFilters')}
          </button>
        </div>

        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-dark-card border border-foreground/10 text-foreground placeholder:text-gray-modern/40 focus:outline-none focus:border-gold/50 transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setFilterCity(city)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                filterCity === city
                  ? 'bg-gold text-dark'
                  : 'bg-dark-card text-gray-modern/60 hover:text-foreground border border-foreground/5'
              }`}
            >
              {city === 'all' ? t('all') : city}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              layout
            >
              <div className="glass-card rounded-2xl overflow-hidden group">
                <div
                  className="h-48 bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url(${s.image})`,
                    backgroundColor: '#1a1f35',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${ownerBadgeColor(s.ownerType)}`}>
                      {s.ownerType}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-foreground mb-1">{s.name}</h3>
                  <p className="text-sm text-gray-modern/50 mb-3">{s.location}</p>

                  <div className="flex gap-4 text-sm text-gray-modern/60 mb-3">
                    <span>{t('capacity')} {s.capacity.toLocaleString()} {t('spectators')}</span>
                    <span>{t('inauguration')}: {s.year}</span>
                  </div>

                  <div className="text-xs text-gray-modern/40 mb-2">
                    {t('coordinates')}: {s.lat.toFixed(3)}, {s.lng.toFixed(3)}
                  </div>

                  <button
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className="text-xs text-gold/70 hover:text-gold transition-colors font-medium"
                  >
                    {expanded === s.id ? t('hideHistory') : t('viewHistory')}
                  </button>

                  <AnimatePresence>
                    {expanded === s.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-gray-modern/70 mt-3 leading-relaxed border-t border-foreground/5 pt-3">
                          {s.history}
                        </p>
                        {s.events.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {s.events.map((evt, ei) => (
                              <span key={ei} className="px-2 py-0.5 rounded-full bg-foreground/5 text-[10px] text-gray-modern/50">
                                {evt}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
