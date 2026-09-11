'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { teams } from '@/data/teams'
import { matches } from '@/data/matches'
import { worldCupChampions } from '@/data/history'
import Flag from '@/components/Flag'

function getWorldCups(teamName: string): number {
  return worldCupChampions.filter(c => c.champion === teamName).length
}

function getHeadToHead(idA: string, idB: string) {
  return matches.filter(m =>
    (m.homeId === idA && m.awayId === idB) ||
    (m.homeId === idB && m.awayId === idA)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export default function ComparadorSection() {
  const t = useTranslations('comparadorSection')
  const [teamA, setTeamA] = useState('argentina')
  const [teamB, setTeamB] = useState('brazil')

  const teamList = useMemo(() => [...teams].sort((a, b) => a.name.localeCompare(b.name)), [])

  const dataA = teams.find(t => t.id === teamA)
  const dataB = teams.find(t => t.id === teamB)

  const h2h = useMemo(() => {
    if (!dataA || !dataB) return []
    return getHeadToHead(dataA.id, dataB.id)
  }, [dataA, dataB])

  if (!dataA || !dataB) return null

  const wcA = getWorldCups(dataA.name)
  const wcB = getWorldCups(dataB.name)

  const stats: { label: string; valA: string | number; valB: string | number; better: 'A' | 'B' | 'tie' }[] = [
    { label: t('rankingFIFA'), valA: `#${dataA.ranking}`, valB: `#${dataB.ranking}`, better: dataA.ranking < dataB.ranking ? 'A' : dataA.ranking > dataB.ranking ? 'B' : 'tie' },
    { label: t('confederation'), valA: dataA.confederation, valB: dataB.confederation, better: 'tie' },
    { label: t('worldCupsWon'), valA: wcA, valB: wcB, better: wcA > wcB ? 'A' : wcA < wcB ? 'B' : 'tie' },
  ]

  return (
    <section id="comparador" className="relative py-24 px-4">
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

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
          <select
            value={teamA}
            onChange={e => setTeamA(e.target.value)}
            className="w-full md:w-64 px-5 py-3 rounded-xl bg-dark-card border border-foreground/10 text-foreground text-sm outline-none focus:border-gold/50 transition-all"
          >
            {teamList.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          <span className="text-2xl font-black text-gold">{t('vs')}</span>

          <select
            value={teamB}
            onChange={e => setTeamB(e.target.value)}
            className="w-full md:w-64 px-5 py-3 rounded-xl bg-dark-card border border-foreground/10 text-foreground text-sm outline-none focus:border-gold/50 transition-all"
          >
            {teamList.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-6 text-center"
          >
            <Flag teamId={dataA.id} teamName={dataA.name} className="w-16 h-11 block mb-3 mx-auto" />
            <h3 className="text-2xl font-bold text-foreground mb-1">{dataA.name}</h3>
            <span className="text-sm text-gray-modern/50">{dataA.confederation} · #{dataA.ranking}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center"
          >
            <span className="text-4xl mb-2">🤝</span>
            <span className="text-sm text-gray-modern/50">{t('headToHead')}</span>
            <span className="text-3xl font-black text-gold my-2">{t('vs')}</span>
            <span className="text-xs text-gray-modern/40 text-center">
              {h2h.length > 0 ? t('matchups', { count: h2h.length }) : t('noMatchups')}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-6 text-center"
          >
            <Flag teamId={dataB.id} teamName={dataB.name} className="w-16 h-11 block mb-3 mx-auto" />
            <h3 className="text-2xl font-bold text-foreground mb-1">{dataB.name}</h3>
            <span className="text-sm text-gray-modern/50">{dataB.confederation} · #{dataB.ranking}</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-foreground/5">
            <h3 className="text-lg font-bold text-foreground">{t('detailedComparison')}</h3>
          </div>
          <div className="divide-y divide-white/5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-3 gap-4 px-6 py-4 items-center"
              >
                <div className={`text-right font-semibold ${stat.better === 'A' ? 'text-gold' : 'text-gray-modern/70'}`}>
                  {stat.valA}
                </div>
                <div className="text-center">
                  <span className="text-xs text-gray-modern/40 uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className={`text-left font-semibold ${stat.better === 'B' ? 'text-gold' : 'text-gray-modern/70'}`}>
                  {stat.valB}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {h2h.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-6 mt-6"
          >
            <h3 className="text-lg font-bold text-foreground mb-4">{t('h2hHistory')}</h3>
            <div className="space-y-3">
              {h2h.map(m => (
                <div key={m.id} className="flex items-center justify-between py-2 px-4 rounded-xl bg-dark-hover/50">
                  <span className="text-xs text-gray-modern/40">{m.date} · {m.phase}</span>
                  <div className="flex items-center gap-3">
                    <Flag teamId={m.homeId} teamName={m.homeTeam} className="w-5 h-4 inline-block" />
                    <span className="font-semibold text-foreground">{m.homeTeam}</span>
                    <span className="font-bold text-gold">
                      {m.status === 'finished' ? `${m.homeScore}-${m.awayScore}` : 'vs.'}
                    </span>
                    <span className="font-semibold text-foreground">{m.awayTeam}</span>
                    <Flag teamId={m.awayId} teamName={m.awayTeam} className="w-5 h-4 inline-block" />
                  </div>
                  <span className="text-xs text-gray-modern/40">{m.stadium}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
