'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@/i18n/routing'
import Navbar from '@/components/Navbar'
import ParticleBackground from '@/components/ParticleBackground'
import { worldCupChampions, topScorers, legends, getChampionsByCountry, getCountryFlagUrl } from '@/data/history'
import { useTranslations } from 'next-intl'

export default function HistoryPage() {
  const t = useTranslations('historySection')
  const common = useTranslations('common')
  const [flippedId, setFlippedId] = useState<number | null>(null)
  const championsByCountry = getChampionsByCountry()

  return (
    <div className="relative min-h-screen bg-dark overflow-x-hidden">
      <ParticleBackground />
      <Navbar />
      <div className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
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

          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-foreground mb-8 text-center"
            >
              {t('championsByCountry')}
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {championsByCountry.map((c, i) => (
                <motion.div
                  key={c.country}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl p-6 text-center hover:border-gold/30 transition-all"
                >
                  <img src={c.flagUrl} alt={c.country} className="w-12 h-8 block mx-auto mb-2 object-contain" />
                  <h3 className="text-lg font-bold text-foreground">{c.country}</h3>
                  <p className="text-3xl font-black text-gold my-2">{c.count}</p>
                  <p className="text-xs text-gray-modern/50">{t('titles', { count: c.count })}</p>
                  <div className="flex flex-wrap justify-center gap-1 mt-3">
                    {c.years.map(year => (
                      <span key={year} className="px-2 py-0.5 rounded-full bg-foreground/5 text-gray-modern/60 text-[10px]">
                        {year}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-foreground mb-8 text-center"
            >
              {t('allChampions')}
            </motion.h2>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/40 via-gold/20 to-transparent hidden lg:block" />
              <div className="space-y-6">
                {worldCupChampions.slice().reverse().map((c, i) => (
                  <motion.div
                    key={c.year}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex flex-col lg:flex-row items-center gap-4 lg:gap-8 ${
                      i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                      <div className="glass-card rounded-2xl p-5 inline-block w-full">
                        <div className="flex items-center gap-4 justify-center lg:justify-start">
                          <span className="text-3xl">{c.championFlag}</span>
                          <div>
                            <p className="text-lg font-bold text-foreground">{c.champion}</p>
                            <p className="text-xs text-gray-modern/50">{c.year} · <span className="mr-1">{c.hostFlag}</span>{c.host}</p>
                          </div>
                          <div className="text-right ml-auto">
                            <p className="text-sm font-bold text-gold">{c.score}</p>
                            <p className="text-xs text-gray-modern/40">{t('vs')} {c.runnerUp} {c.runnerUpFlag}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="hidden lg:flex w-10 h-10 rounded-full bg-gold/20 border-2 border-gold/50 items-center justify-center text-gold font-bold text-sm flex-shrink-0 z-10">
                      {c.year}
                    </div>
                    <div className="flex-1 hidden lg:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-foreground mb-8 text-center"
            >
              {t('allTimeTopScorers')}
            </motion.h2>
            <div className="glass-card rounded-3xl p-6 md:p-8">
              <div className="space-y-4">
                {topScorers.map((scorer, i) => (
                  <motion.div
                    key={scorer.player}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4"
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      i === 0 ? 'bg-gold text-dark' : i < 3 ? 'bg-blue-secondary/30 text-blue-300' : 'bg-foreground/5 text-gray-modern/50'
                    }`}>
                      {i + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-dark-hover overflow-hidden flex-shrink-0">
                      <img src={scorer.photo} alt={scorer.player} className="w-full h-full object-cover"
                        onError={e => { const t = e.target as HTMLImageElement; if (!t.dataset.fallback) { t.dataset.fallback = '1'; t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(scorer.player)}&background=AC8E4B&color=fff&size=128` } }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground truncate">{scorer.player}</span>
                        <img src={getCountryFlagUrl(scorer.country)} alt={scorer.country} className="w-5 h-4 object-contain inline-block" />
                      </div>
                      <p className="text-[11px] text-gray-modern/40 truncate">{scorer.country} · {scorer.position}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gold">{scorer.goals}</p>
                      <p className="text-[10px] text-gray-modern/40">{t('goals')}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-foreground mb-8 text-center"
            >
              {t('legends')}
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {legends.map((legend, i) => (
                <motion.div
                  key={legend.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="perspective-1000"
                  style={{ perspective: '1000px' }}
                >
                  <motion.div
                    className="relative w-full cursor-pointer"
                    style={{ minHeight: '320px', transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: flippedId === i ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    onClick={() => setFlippedId(flippedId === i ? null : i)}
                  >
                    <div
                      className="absolute inset-0 glass-card rounded-2xl p-6 flex flex-col items-center text-center"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-dark-hover mb-4 border-2 border-gold/30">
                        <img src={legend.photo} alt={legend.name} className="w-full h-full object-cover"
                          onError={e => { const t = e.target as HTMLImageElement; if (!t.dataset.fallback) { t.dataset.fallback = '1'; t.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(legend.name)}&background=AC8E4B&color=fff&size=128` } }} />
                      </div>
                      <img src={getCountryFlagUrl(legend.country)} alt={legend.country} className="w-8 h-6 mx-auto mb-2 object-contain" />
                      <h3 className="text-xl font-bold text-foreground">{legend.name}</h3>
                      <p className="text-sm text-gray-modern/50 mb-2">{legend.country} · {legend.position}</p>
                      <p className="text-xs text-gray-modern/40">{t('worldCupsPlayed', { count: legend.worldCupsPlayed })}</p>
                      <p className="text-xs text-gold/60 mt-3">{t('tapToSeeAchievements')}</p>
                    </div>

                    <div
                      className="absolute inset-0 glass-card rounded-2xl p-6 flex flex-col justify-center"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <h3 className="text-lg font-bold text-gold mb-3 text-center">{legend.name}</h3>
                      <div className="space-y-2">
                        {legend.achievements.map((a, j) => (
                          <p key={j} className="text-xs text-gray-modern/70 flex items-start gap-2">
                            <span className="text-gold mt-0.5">•</span>
                            <span>{a}</span>
                          </p>
                        ))}
                      </div>
                      <div className="border-t border-foreground/5 mt-4 pt-4">
                        {legend.stats.map((s, j) => (
                          <p key={j} className="text-xs text-gray-modern/50 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                            {s}
                          </p>
                        ))}
                      </div>
                      <p className="text-xs text-gray-modern/40 text-center mt-3">{t('tapToSeePhoto')}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
