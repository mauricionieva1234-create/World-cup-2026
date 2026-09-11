'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { worldCupChampions, topScorers, topAssists, legends, getChampionsByCountry, getCountryFlagUrl } from '@/data/history'

type SubTab = 'champions' | 'scorers' | 'assists' | 'legends'

export default function HistorySection() {
  const t = useTranslations('historySection')
  const [activeTab, setActiveTab] = useState<SubTab>('champions')

  const championsByCountry = getChampionsByCountry()

  return (
    <section id="historia" className="relative py-24 px-4">
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

        <div className="flex justify-center gap-2 mb-10">
          {([
            { key: 'champions' as SubTab, label: t('champions') },
            { key: 'scorers' as SubTab, label: t('topScorers') },
            { key: 'assists' as SubTab, label: '🎯 Asistencias' },
            { key: 'legends' as SubTab, label: t('legends') },
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

        {activeTab === 'champions' && (
          <div className="space-y-10">
            <div className="glass-card rounded-3xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">{t('championsByCountry')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {championsByCountry.map((c, i) => (
                  <motion.div
                    key={c.country}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-xl p-4 text-center"
                  >
                    <img src={c.flagUrl} alt={c.country} className="w-10 h-7 block mx-auto mb-2 object-contain" />
                    <h4 className="text-sm font-bold text-foreground">{c.country}</h4>
                    <p className="text-2xl font-black text-gold">{t('titles', { count: c.count })}</p>
                    <p className="text-xs text-gray-modern/50 mt-1">{c.years.join(', ')}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-foreground mb-6">{t('allChampions')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 text-gray-modern/50 text-xs uppercase tracking-wider">
                      <th className="text-left py-3 pr-4">{t('year')}</th>
                      <th className="text-left py-3 pr-4">{t('champion')}</th>
                      <th className="text-left py-3 pr-4">{t('runnerUp')}</th>
                      <th className="text-left py-3 pr-4">{t('score')}</th>
                      <th className="text-left py-3">{t('host')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {worldCupChampions.slice().reverse().map((c, i) => (
                      <motion.tr
                        key={c.year}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                      >
                        <td className="py-3 pr-4 font-bold text-foreground">{c.year}</td>
                        <td className="py-3 pr-4">
                          <span className="flex items-center gap-2">
                            <span>{c.championFlag}</span>
                            <span className="font-semibold text-foreground">{c.champion}</span>
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="flex items-center gap-2">
                            <span>{c.runnerUpFlag}</span>
                            <span className="text-gray-modern/70">{c.runnerUp}</span>
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-mono font-bold text-gold">{c.score}</td>
                        <td className="py-3 text-gray-modern/50"><span className="mr-1">{c.hostFlag}</span>{c.host}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scorers' && (
          <div className="glass-card rounded-3xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">{t('allTimeTopScorers')}</h3>
            <div className="space-y-1">
              {topScorers.map((s, i) => (
                <motion.div
                  key={s.player}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-dark-hover/50 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-modern/40 w-6">{i + 1}</span>
                  <div className="w-10 h-10 rounded-full bg-dark-hover overflow-hidden flex-shrink-0">
                    <img src={s.photo} alt={s.player} className="w-full h-full object-cover"
                      onError={e => { const t = e.target as HTMLImageElement; if (!t.dataset.fallback) { t.dataset.fallback = '1'; t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.player)}&background=AC8E4B&color=fff&size=128` } }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{s.player}</span>
                      <img src={getCountryFlagUrl(s.country)} alt={s.country} className="w-5 h-4 object-contain" />
                    </div>
                    <span className="text-xs text-gray-modern/50">{s.country} · {s.position}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-gold">{s.goals}</div>
                    <div className="text-[10px] text-gray-modern/40">{t('goals')}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assists' && (
          <div className="glass-card rounded-3xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">🎯 Máximos Asistentes</h3>
            <div className="space-y-1">
              {topAssists.map((a, i) => (
                <motion.div
                  key={a.player}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-dark-hover/50 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-modern/40 w-6">{i + 1}</span>
                  <div className="w-10 h-10 rounded-full bg-dark-hover overflow-hidden flex-shrink-0">
                    <img src={a.photo} alt={a.player} className="w-full h-full object-cover"
                      onError={e => { const t = e.target as HTMLImageElement; if (!t.dataset.fallback) { t.dataset.fallback = '1'; t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(a.player)}&background=AC8E4B&color=fff&size=128` } }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{a.player}</span>
                      <img src={getCountryFlagUrl(a.country)} alt={a.country} className="w-5 h-4 object-contain" />
                    </div>
                    <span className="text-xs text-gray-modern/50">{a.country} · {a.position}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-gold">{a.assists}</div>
                    <div className="text-[10px] text-gray-modern/40">Asistencias</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'legends' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legends.map((l, i) => (
              <motion.div
                key={l.name}
                initial={{ opacity: 0, rotateY: 90 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                className="glass-card rounded-3xl p-6 group perspective"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="text-center mb-4">
                  <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-2 border-gold/30 group-hover:border-gold/60 transition-all">
                    <img src={l.photo} alt={l.name} className="w-full h-full object-cover"
                      onError={e => { const t = e.target as HTMLImageElement; if (!t.dataset.fallback) { t.dataset.fallback = '1'; t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(l.name)}&background=AC8E4B&color=fff&size=128` } }} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{l.name}</h3>
                  <p className="text-sm text-gray-modern/50"><img src={getCountryFlagUrl(l.country)} alt={l.country} className="w-5 h-4 inline-block object-contain align-middle mr-1" /> {l.country}</p>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-gold/10 text-gold text-xs font-medium mt-2">
                    {l.position}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {l.achievements.slice(0, 3).map((a, ai) => (
                    <div key={ai} className="flex items-start gap-2 text-xs">
                      <span className="text-gold mt-0.5">⭐</span>
                      <span className="text-gray-modern/70">{a}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-foreground/5 pt-3 grid grid-cols-3 gap-2 text-center">
                  {l.stats.slice(0, 3).map((stat, si) => (
                    <div key={si} className="text-[10px] text-gray-modern/50">
                      {stat}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
