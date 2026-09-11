'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface GoalAnimationProps {
  show: boolean
  team: string
  player: string
  minute: number
  onClose: () => void
}

const confettiColors = ['#D4AF37', '#F0D060', '#002868', '#0057B8', '#D52B1E', '#006847', '#FFD700', '#FF6347']

export default function GoalAnimation({ show, team, player, minute, onClose }: GoalAnimationProps) {
  const t = useTranslations('goalAnimation')
  const [particles, setParticles] = useState<{ id: number; color: string; left: number; delay: number; size: number }[]>([])

  useEffect(() => {
    if (!show) return
    const p = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
      size: Math.random() * 10 + 5,
    }))
    setParticles(p)
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute animate-confetti"
              style={{
                left: `${p.left}%`,
                top: '-10%',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animationDelay: `${p.delay}s`,
                opacity: 0.9,
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative z-10 text-center px-8 py-12 rounded-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(0,0,0,0.8) 100%)',
              boxShadow: '0 0 100px rgba(212,175,55,0.5)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-7xl mb-4"
            >
              s
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black text-gold mb-3"
            >
              {t('goal')}
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl font-bold text-foreground mb-2"
            >
              {team}
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-modern/80 mb-2"
            >
              {player}
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg text-gold/70"
            >
              {t('minute', { minute })}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 text-sm text-gray-modern/40"
            >
              {t('stadiumRoaring')}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
