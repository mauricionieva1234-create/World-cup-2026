'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Team } from '@/data/teams'
import Flag from '@/components/Flag'

interface TeamCardProps {
  team: Team
}

export default function TeamCard({ team }: TeamCardProps) {
  const tCommon = useTranslations('common')

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -6 }}
      className="glass-card rounded-2xl p-6 transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <motion.div
          className="w-14 h-10 block"
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
          <span className="px-2 py-0.5 rounded-full bg-foreground/5">{tCommon('group')} {team.group}</span>
        </div>

        <motion.div
          className="w-full mt-2"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
        >
          <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  )
}
