'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Flag from '@/components/Flag'
import { matches } from '@/data/matches'

const eventIcons: Record<string, string> = {
  goal: 's',
  yellow: 'YY',
  red: 'YY',
  substitution: 'Y""',
  penalty: 's',
  var: 'Y"',
}

export default function LiveMatchCenter() {
  const t = useTranslations('liveMatchCenter')
  const liveMatches = matches.filter(m => m.status === 'live')
  const [activeMatchIdx, setActiveMatchIdx] = useState(0)
  const [minute, setMinute] = useState(0)

  useEffect(() => {
    if (liveMatches.length === 0) return
    const m = liveMatches[activeMatchIdx]
    setMinute(m.minute || 0)

    const interval = setInterval(() => {
      setMinute(prev => prev + 1)
    }, 30000)

    return () => clearInterval(interval)
  }, [liveMatches, activeMatchIdx])

  if (liveMatches.length === 0) return null

  const m = liveMatches[activeMatchIdx]

  const totalEvents = m.events.length

  if (!m) return null

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-2xl font-bold text-foreground">{t('title')}</h2>
        </div>

        {liveMatches.length > 1 && (
          <div className="flex justify-center gap-2 mb-6">
            {liveMatches.map((lm, i) => (
              <button
                key={lm.id}
                onClick={() => setActiveMatchIdx(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  i === activeMatchIdx
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-dark-card text-gray-modern/60 border border-foreground/5'
                }`}
              >
                {lm.homeTeam} vs. {lm.awayTeam}
              </button>
            ))}
          </div>
        )}

        <div className="glass-card rounded-3xl p-6 md:p-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 font-bold text-lg">{minute}&apos;</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 mb-8">
            <div className="text-center md:text-right">
              <Flag teamId={m.homeId} teamName={m.homeTeam} className="w-20 h-14 block mb-2 mx-auto md:mx-0 md:ml-auto" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">{m.homeTeam}</h3>
            </div>

            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${m.homeScore}-${m.awayScore}`}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl md:text-7xl font-black text-foreground"
                >
                  {m.homeScore} - {m.awayScore}
                </motion.div>
              </AnimatePresence>
              <div className="text-xs text-gray-modern/40 mt-2 uppercase tracking-wider">
                {m.phase}{m.group ? ` · ${t('group')} ${m.group}` : ''}
              </div>
            </div>

            <div className="text-center md:text-left">
              <Flag teamId={m.awayId} teamName={m.awayTeam} className="w-20 h-14 block mb-2 mx-auto md:mx-0" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">{m.awayTeam}</h3>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-8">
            {[
              { label: t('possession'), home: m.homePossession, away: m.awayPossession },
              { label: t('shots'), home: m.homeShots, away: m.awayShots },
              { label: t('shotsOnTarget'), home: m.homeShotsOnTarget, away: m.awayShotsOnTarget },
              { label: t('corners'), home: m.homeCorners, away: m.awayCorners },
              { label: t('fouls'), home: m.homeFouls, away: m.awayFouls },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-blue-400 w-6 text-right">{stat.home}%</span>
                  <span className="text-[10px] text-gray-modern/40 uppercase">{stat.label}</span>
                  <span className="text-xs font-bold text-red-400 w-6 text-left">{stat.away}%</span>
                </div>
                <div className="h-1.5 bg-dark-hover rounded-full overflow-hidden flex">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.home}%` }}
                    className="bg-blue-secondary h-full rounded-full"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.away}%` }}
                    className="bg-red-canada h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 mb-8 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">YY</span>
              <span>{m.homeYellowCards} - {m.awayYellowCards}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-red-500">YY</span>
              <span>{m.homeRedCards} - {m.awayRedCards}</span>
            </div>
          </div>

          {totalEvents > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-modern/60 uppercase tracking-wider mb-4">{t('timeline')}</h4>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-foreground/10" />
                <div className="space-y-3">
                  {m.events.slice().reverse().map((evt, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-4 relative pl-10"
                    >
                      <span className="absolute left-2 -translate-x-1/2 mt-1 text-base">{eventIcons[evt.type] || '?'}</span>
                      <div>
                        <span className="text-xs font-bold text-gold">{evt.minute}&apos;</span>
                        <p className="text-sm text-gray-modern/80">
                          <span className={evt.team === 'home' ? 'text-blue-400' : 'text-red-400'}>
                            {evt.player}
                          </span>
                          {evt.detail && <span className="text-gray-modern/50"> — {evt.detail}</span>}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
