'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { teams } from '@/data/teams'
import TeamCard from './TeamCard'

const groups = ['all', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export default function TeamsSection() {
  const t = useTranslations('teamsSection')
  const [activeGroup, setActiveGroup] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = teams.filter(t => {
    const groupMatch = activeGroup === 'all' || t.group === activeGroup
    const searchMatch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.country.toLowerCase().includes(search.toLowerCase())
    return groupMatch && searchMatch
  })

  return (
    <section id="selecciones" className="relative py-24 px-4">
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
          {groups.map(g => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeGroup === g
                  ? 'bg-gold text-dark font-bold'
                  : 'bg-dark-card text-gray-modern/70 hover:text-foreground hover:bg-dark-hover border border-foreground/5'
              }`}
            >
              {g === 'all' ? t('all') : t('group', { group: g })}
            </button>
          ))}
        </div>

        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-dark-card border border-foreground/10 text-foreground placeholder:text-gray-modern/40 focus:outline-none focus:border-gold/50 transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <TeamCard team={team} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-modern/50">
            <p className="text-lg">{t('notFound')}</p>
          </div>
        )}
      </div>
    </section>
  )
}
