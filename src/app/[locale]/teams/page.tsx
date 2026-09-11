'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Navbar from '@/components/Navbar'
import ParticleBackground from '@/components/ParticleBackground'
import { teams } from '@/data/teams'
import Flag from '@/components/Flag'

const confederations = ['all', 'CONMEBOL', 'UEFA', 'CONCACAF', 'AFC', 'CAF']

export default function TeamsPage() {
  const t = useTranslations('teamsPage')
  const common = useTranslations('common')
  const [search, setSearch] = useState('')
  const [confFilter, setConfFilter] = useState('all')

  const filtered = useMemo(() => {
    return teams.filter(t => {
      if (confFilter !== 'all' && t.confederation !== confFilter) return false
      if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.country.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, confFilter])

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
              <span>?</span> {common('backToHome')}
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3">
              {t('title')}
            </h1>
            <p className="text-gray-modern/60 text-lg">
              {t('subtitle')}
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <input
              type="text"
              placeholder={t('search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md px-5 py-3 rounded-xl bg-dark-card border border-foreground/10 text-foreground text-sm placeholder:text-gray-modern/30 outline-none focus:border-gold/50 transition-colors"
            />
            <div className="flex flex-wrap justify-center gap-2">
              {confederations.map(c => (
                <button
                  key={c}
                  onClick={() => setConfFilter(c)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                    confFilter === c
                      ? 'bg-gold text-dark font-bold'
                      : 'bg-dark-card text-gray-modern/70 hover:text-foreground hover:bg-dark-hover border border-foreground/5'
                  }`}
                >
                  {c === 'all' ? t('confAll') : c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((team, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card rounded-2xl p-6 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <motion.div
                    className="w-14 h-10 block mx-auto"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                  >
                    <Flag teamId={team.id} teamName={team.name} className="w-full h-full object-contain" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-foreground">
                    {team.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-modern/50">
                    <span className="px-2 py-0.5 rounded-full bg-foreground/5">{team.confederation}</span>
                    <span className="px-2 py-0.5 rounded-full bg-foreground/5">#{team.ranking}</span>
                    <span className="px-2 py-0.5 rounded-full bg-foreground/5">{common('group')} {team.group}</span>
                  </div>
                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-modern/50">
              <p className="text-lg">{t('notFound')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
