'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { topScorers as historicScorers, topAssists as historicAssists } from '@/data/history'

type Tab = 'goals' | 'assists'

interface DynamicStat {
  name: string
  value: number
}

function loadDynamicStats(): { goals: DynamicStat[]; assists: DynamicStat[] } {
  if (typeof window === 'undefined') return { goals: [], assists: [] }
  try {
    const r = localStorage.getItem('worldcupSimulation')
    if (!r) return { goals: [], assists: [] }
    const d = JSON.parse(r)
    const stats = d.stats || {}
    const goals: DynamicStat[] = Object.entries(stats.goals || {})
      .map(([name, v]) => ({ name, value: v as number }))
      .sort((a, b) => b.value - a.value)
    const assists: DynamicStat[] = Object.entries(stats.assists || {})
      .map(([name, v]) => ({ name, value: v as number }))
      .sort((a, b) => b.value - a.value)
    return { goals, assists }
  } catch {
    return { goals: [], assists: [] }
  }
}

export default function StatsSection() {
  const t = useTranslations('statsSection')
  const [activeTab, setActiveTab] = useState<Tab>('goals')
  const [dynamicStats, setDynamicStats] = useState<{ goals: DynamicStat[]; assists: DynamicStat[] }>({ goals: [], assists: [] })

  useEffect(() => {
    setDynamicStats(loadDynamicStats())
    const handle = () => setDynamicStats(loadDynamicStats())
    window.addEventListener('storage', handle)
    const interval = setInterval(() => setDynamicStats(loadDynamicStats()), 2000)
    return () => { window.removeEventListener('storage', handle); clearInterval(interval) }
  }, [])

  const allScorers = [...dynamicStats.goals, ...historicScorers.map(p => ({ name: p.player, value: p.goals }))]
  const allAssists = [...dynamicStats.assists, ...historicAssists.map(p => ({ name: p.player, value: p.assists }))]
  const maxGoals = allScorers.length > 0 ? Math.max(...allScorers.map(s => s.value)) : 1
  const maxAssists = allAssists.length > 0 ? Math.max(...allAssists.map(s => s.value)) : 1

  const renderRow = (name: string, value: number, max: number, idx: number, isDynamic: boolean, photoLookup: { player: string; photo: string }[]) => {
    const barWidth = (value / max) * 100
    const photo = photoLookup.find(p => p.player === name)?.photo

    return (
      <motion.div
        key={`${name}-${idx}`}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.03 }}
        className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-dark-hover/50 transition-colors"
      >
        <span className="text-xs font-bold text-gray-modern/40 w-6">{idx + 1}</span>
        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg overflow-hidden ${isDynamic ? 'bg-gold/20' : 'bg-dark-hover'}`}>
          {isDynamic ? '⚽' : (photo ? <img src={photo} alt={name} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-modern/40">?</span>)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate">{name}</span>
            {isDynamic && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold font-bold uppercase tracking-wider">Sim</span>}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-black text-gold">{value}</div>
          <div className="w-20 h-1.5 bg-dark-hover rounded-full overflow-hidden mt-1 ml-auto">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold transition-all duration-1000"
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <section id="estadisticas" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
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

        <div className="flex justify-center gap-2 mb-10">
          {([
            { key: 'goals' as Tab, label: t('scorers') },
            { key: 'assists' as Tab, label: t('assistsList') },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-gold text-dark font-bold'
                  : 'bg-dark-card text-gray-modern/70 hover:text-foreground border border-foreground/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'goals' && (
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">{t('topScorers')}</h3>
            <div className="space-y-1">
              {allScorers.length === 0 && (
                <p className="text-center text-gray-modern/50 py-8 text-sm">Cargá resultados en la sección Eliminación para ver estadísticas</p>
              )}
              {allScorers.map((p, i) => renderRow(p.name, p.value, maxGoals, i, dynamicStats.goals.some(ds => ds.name === p.name), historicScorers))}
            </div>
          </div>
        )}

        {activeTab === 'assists' && (
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">{t('topAssists')}</h3>
            <div className="space-y-1">
              {allAssists.length === 0 && (
                <p className="text-center text-gray-modern/50 py-8 text-sm">Cargá resultados en la sección Eliminación para ver estadísticas</p>
              )}
              {allAssists.map((p, i) => renderRow(p.name, p.value, maxAssists, i, dynamicStats.assists.some(ds => ds.name === p.name), historicAssists))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
