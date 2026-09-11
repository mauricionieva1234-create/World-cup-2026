'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import Navbar from '@/components/Navbar'
import ParticleBackground from '@/components/ParticleBackground'
import { teams } from '@/data/teams'
import { useTranslations } from 'next-intl'

type Tab = 'goleadores' | 'asistencias' | 'ranking' | 'arquero' | 'revelacion'

const tabs: { key: Tab; labelKey: string }[] = [
  { key: 'goleadores', labelKey: 'scorers' },
  { key: 'asistencias', labelKey: 'assistsList' },
  { key: 'ranking', labelKey: 'classification' },
  { key: 'arquero', labelKey: 'bestGK' },
  { key: 'revelacion', labelKey: 'revelation' },
]

export default function StatsPage() {
  const t = useTranslations('statsSection')
  const common = useTranslations('common')
  const [activeTab, setActiveTab] = useState<Tab>('goleadores')

  const allPlayers = useMemo(() => {
    return teams.flatMap(t => t.players.map(p => ({ ...p, teamName: t.name, teamFlag: t.flag })))
  }, [])

  const sortedByGoals = useMemo(() => {
    return [...allPlayers].sort((a, b) => b.stats.goals - a.stats.goals)
  }, [allPlayers])

  const sortedByAssists = useMemo(() => {
    return [...allPlayers].sort((a, b) => b.stats.assists - a.stats.assists)
  }, [allPlayers])

  const sortedByRating = useMemo(() => {
    return [...allPlayers].sort((a, b) => b.rating - a.rating)
  }, [allPlayers])

  const bestGK = useMemo(() => {
    return [...allPlayers].filter(p => p.position === 'Arquero').sort((a, b) => b.rating - a.rating).slice(0, 5)
  }, [allPlayers])

  const revelation = useMemo(() => {
    return [...allPlayers].filter(p => p.rating > 8.0).sort((a, b) => a.age - b.age).slice(0, 5)
  }, [allPlayers])

  const maxGoals = sortedByGoals.length > 0 ? sortedByGoals[0].stats.goals : 1
  const maxRating = sortedByRating.length > 0 ? sortedByRating[0].rating : 10

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

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-gold text-dark font-bold'
                    : 'bg-dark-card text-gray-modern/70 hover:text-foreground hover:bg-dark-hover border border-foreground/5'
                }`}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === 'goleadores' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-3xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">{t('topScorers')}</h2>
                <div className="space-y-4">
                  {sortedByGoals.slice(0, 15).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i === 0 ? 'bg-gold text-dark' : i === 1 ? 'bg-gray-modern/20 text-gray-modern' : i === 2 ? 'bg-amber-700/30 text-amber-500' : 'bg-foreground/5 text-gray-modern/50'
                      }`}>
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">{p.name}</span>
                            <span className="text-xs text-gray-modern/50">{p.teamFlag} {p.teamName}</span>
                          </div>
                          <span className="text-sm font-bold text-gold">{p.stats.goals} {common('goalsAbbr')}</span>
                        </div>
                        <div className="h-3 bg-dark-hover rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(p.stats.goals / maxGoals) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                            className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'asistencias' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-3xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">{t('topAssists')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedByAssists.slice(0, 15).map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card rounded-xl p-4 flex items-center gap-3 hover:border-gold/30 transition-all"
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i === 0 ? 'bg-gold text-dark' : 'bg-foreground/5 text-gray-modern/50'
                      }`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-gray-modern/50">{p.teamFlag} {p.teamName}</p>
                      </div>
                      <span className="text-sm font-bold text-gold">{p.stats.assists}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'ranking' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-3xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">Ranking General por Valoración</h2>
                <div className="space-y-4">
                  {sortedByRating.slice(0, 20).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i === 0 ? 'bg-gold text-dark' : i < 5 ? 'bg-blue-secondary/30 text-blue-300' : 'bg-foreground/5 text-gray-modern/50'
                      }`}>
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">{p.name}</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-foreground/5 text-gray-modern/50">{p.position}</span>
                            <span className="text-xs text-gray-modern/50">{p.teamFlag}</span>
                          </div>
                          <span className="text-sm font-bold text-gold">{p.rating.toFixed(1)}</span>
                        </div>
                        <div className="h-2 bg-dark-hover rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(p.rating / maxRating) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.03 }}
                            className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'arquero' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-3xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">{t('bestGK')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bestGK.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card rounded-2xl p-6 text-center hover:border-gold/30 transition-all"
                    >
                      <div className={`text-3xl mb-2 ${i === 0 ? 'animate-glow' : ''}`}>🥅</div>
                      <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                      <p className="text-xs text-gray-modern/50 mb-3">{p.teamFlag} {p.teamName}</p>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl text-gold">⭐</span>
                        <span className="text-xl font-bold text-gold">{p.rating.toFixed(1)}</span>
                      </div>
                      <div className="h-1.5 bg-dark-hover rounded-full overflow-hidden mb-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(p.rating / 10) * 100}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
                        />
                      </div>
                      <div className="flex justify-center gap-4 text-xs text-gray-modern/40">
                        <span>{t('years', { age: p.age })}</span>
                        <span>{p.height} {common('height')}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'revelacion' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-3xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">{t('revelation')}</h2>
                <p className="text-sm text-gray-modern/50 mb-6">Jóvenes talentos con valoración superior a 8.0</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {revelation.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card rounded-2xl p-6 text-center hover:border-gold/30 transition-all"
                    >
                      <div className="text-3xl mb-2">🌟</div>
                      <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                      <p className="text-xs text-gray-modern/50 mb-1">{p.teamFlag} {p.teamName}</p>
                      <p className="text-xs text-gray-modern/40 mb-3">{p.position} · {t('years', { age: p.age })}</p>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl text-gold">⭐</span>
                        <span className="text-xl font-bold text-gold">{p.rating.toFixed(1)}</span>
                      </div>
                      <div className="h-1.5 bg-dark-hover rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(p.rating / 10) * 100}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
