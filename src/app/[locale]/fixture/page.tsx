'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import Navbar from '@/components/Navbar'
import ParticleBackground from '@/components/ParticleBackground'
import MatchCard from '@/components/MatchCard'
import { matches } from '@/data/matches'
import { useTranslations } from 'next-intl'

const phaseFilters = [
  { key: 'all', labelKey: 'phases.all' },
  { key: 'Fase de Grupos', labelKey: 'phases.groups' },
  { key: '16avos de Final', labelKey: 'phases.round32' },
  { key: 'Octavos de Final', labelKey: 'phases.round16' },
  { key: 'Cuartos de Final', labelKey: 'phases.quarters' },
  { key: 'Semifinales', labelKey: 'phases.semis' },
  { key: 'Final', labelKey: 'phases.final' },
]

const groupFilters = ['all', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

const stadiumList = ['all', ...Array.from(new Set(matches.map(m => m.stadium)))]

export default function FixturePage() {
  const t = useTranslations('fixturePage')
  const common = useTranslations('common')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [groupFilter, setGroupFilter] = useState('all')
  const [stadiumFilter, setStadiumFilter] = useState('all')

  const filtered = useMemo(() => {
    return matches.filter(m => {
      if (phaseFilter !== 'all' && m.phase !== phaseFilter) return false
      if (groupFilter !== 'all' && m.group !== groupFilter) return false
      if (stadiumFilter !== 'all' && m.stadium !== stadiumFilter) return false
      return true
    })
  }, [phaseFilter, groupFilter, stadiumFilter])

  const liveMatches = matches.filter(m => m.status === 'live')

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

          {liveMatches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 p-4 rounded-2xl border border-red-500/20 bg-red-500/5"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 font-bold text-sm uppercase tracking-wider">{t('liveMatches')}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveMatches.map((m, i) => (
                  <MatchCard key={m.id} match={m} index={i} />
                ))}
              </div>
            </motion.div>
          )}

          <div className="space-y-4 mb-10">
            <div className="flex flex-wrap justify-center gap-2">
              {phaseFilters.map(f => (
                <button
                  key={f.key}
                  onClick={() => setPhaseFilter(f.key)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    phaseFilter === f.key
                      ? 'bg-gold text-dark font-bold'
                      : 'bg-dark-card text-gray-modern/70 hover:text-foreground hover:bg-dark-hover border border-foreground/5'
                  }`}
                >
                  {t(f.labelKey)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-xs text-gray-modern/40 self-center mr-1">Grupo:</span>
              {groupFilters.map(g => (
                <button
                  key={g}
                  onClick={() => setGroupFilter(g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    groupFilter === g
                      ? 'bg-blue-secondary/30 text-blue-300 border border-blue-500/30'
                      : 'bg-dark-card text-gray-modern/50 hover:text-foreground hover:bg-dark-hover border border-foreground/5'
                  }`}
                >
                  {g === 'all' ? t('phases.all') : g}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-xs text-gray-modern/40 self-center mr-1">Estadio:</span>
              <select
                value={stadiumFilter}
                onChange={e => setStadiumFilter(e.target.value)}
                className="bg-dark-card text-gray-modern/70 border border-foreground/10 rounded-full px-4 py-1.5 text-xs outline-none focus:border-gold/50"
              >
                <option value="all">{t('phases.all')}</option>
                {stadiumList.filter(s => s !== 'all').map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((m, i) => (
              <MatchCard key={m.id} match={m} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-modern/50">
              <p className="text-lg">{t('noMatches')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
