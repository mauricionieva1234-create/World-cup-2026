'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { getStandings, getGroups } from '@/logic/standings'
import Flag from '@/components/Flag'

const colorMap: Record<string, string> = {
  'UEFA': 'bg-blue-500/20 text-blue-400',
  'CONMEBOL': 'bg-green-500/20 text-green-400',
  'CONCACAF': 'bg-orange-500/20 text-orange-400',
  'AFC': 'bg-red-500/20 text-red-400',
  'CAF': 'bg-yellow-500/20 text-yellow-400',
}

export default function StandingsSection() {
  const t = useTranslations('standingsSection')
  const groups = getGroups()
  const [activeGroup, setActiveGroup] = useState(groups[0] || 'A')

  const standings = useMemo(() => getStandings(activeGroup), [activeGroup])

  const maxPts = standings.length > 0 ? standings[0].pts : 1

  return (
    <section id="posiciones" className="relative py-24 px-4">
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

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {groups.map(g => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeGroup === g
                  ? 'bg-gold text-dark font-bold'
                  : 'bg-dark-card text-gray-modern/70 hover:text-foreground hover:bg-dark-hover border border-foreground/5'
              }`}
            >
              {t('group', { group: g })}
            </button>
          ))}
        </div>

        <motion.div
          key={activeGroup}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-3xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-foreground/10 text-gray-modern/50 text-xs uppercase tracking-wider">
                  <th className="text-left py-4 px-4 md:px-6 w-10">{t('num')}</th>
                  <th className="text-left py-4 pr-4">{t('team')}</th>
                  <th className="text-center py-4 px-3">{t('p')}</th>
                  <th className="text-center py-4 px-3 hidden sm:table-cell">{t('w')}</th>
                  <th className="text-center py-4 px-3 hidden sm:table-cell">{t('d')}</th>
                  <th className="text-center py-4 px-3 hidden sm:table-cell">{t('l')}</th>
                  <th className="text-center py-4 px-3 hidden md:table-cell">{t('gf')}</th>
                  <th className="text-center py-4 px-3 hidden md:table-cell">{t('ga')}</th>
                  <th className="text-center py-4 px-3 hidden md:table-cell">{t('gd')}</th>
                  <th className="text-center py-4 px-3">{t('pts')}</th>
                  <th className="text-center py-4 px-3 hidden lg:table-cell">{t('form')}</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((entry, i) => {
                  const isQualified = i < 2
                  const barWidth = maxPts > 0 ? (entry.pts / maxPts) * 100 : 0

                  return (
                    <motion.tr
                      key={entry.teamId}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className={`border-b border-foreground/5 hover:bg-foreground/5 transition-colors ${
                        isQualified ? 'bg-gold/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4 md:px-6">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          isQualified ? 'bg-gold/20 text-gold' : 'text-gray-modern/40'
                        }`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Flag teamId={entry.teamId} teamName={entry.teamName} className="w-7 h-5 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="font-semibold text-foreground truncate block">{entry.teamName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-3 font-medium text-foreground">{entry.gp}</td>
                      <td className="text-center py-3 px-3 hidden sm:table-cell text-green-400">{entry.w}</td>
                      <td className="text-center py-3 px-3 hidden sm:table-cell text-yellow-400">{entry.d}</td>
                      <td className="text-center py-3 px-3 hidden sm:table-cell text-red-400">{entry.l}</td>
                      <td className="text-center py-3 px-3 hidden md:table-cell text-foreground">{entry.gf}</td>
                      <td className="text-center py-3 px-3 hidden md:table-cell text-foreground">{entry.ga}</td>
                      <td className={`text-center py-3 px-3 hidden md:table-cell font-mono font-bold ${
                        entry.gd > 0 ? 'text-green-400' : entry.gd < 0 ? 'text-red-400' : 'text-gray-modern/50'
                      }`}>
                        {entry.gd > 0 ? `+${entry.gd}` : entry.gd}
                      </td>
                      <td className="text-center py-3 px-3">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-lg font-black text-gold">{entry.pts}</span>
                          <div className="w-12 h-1.5 bg-dark-hover rounded-full overflow-hidden hidden md:block">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold transition-all duration-700"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-3 hidden lg:table-cell">
                        <div className="flex gap-1 justify-center">
                          {entry.form.slice(-5).map((r, fi) => (
                            <span
                              key={fi}
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                r === 'G' ? 'bg-green-500/20 text-green-400' :
                                r === 'E' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {standings.length === 0 && (
            <div className="text-center py-16 text-gray-modern/50">
              <p className="text-lg">{t('noData')}</p>
            </div>
          )}

          <div className="px-6 py-4 border-t border-foreground/5 flex flex-wrap gap-4 text-xs text-gray-modern/40">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-gold/20" />
              {t('qualifiedR32')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500/50" />{t('win')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-500/50" />{t('draw')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/50" />{t('loss')}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
