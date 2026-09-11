'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
export default function HeroSection() {
  const t = useTranslations('hero')
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
  }

  return (
    <section id="inicio" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-card to-dark" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #AC8E4B 0%, transparent 60%), radial-gradient(circle at 70% 50%, #AC8E4B 0%, transparent 60%)' }} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-4xl"
      >
        <motion.div variants={itemVariants} className="mb-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-semibold border border-gold/30">
            {t('badge')}
          </span>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center mb-4">
          <img src="/images/logomundial.webp" alt={t('title')} className="h-24 md:h-32 lg:h-40 w-auto drop-shadow-2xl" />
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black text-gradient mb-4 tracking-tight">
          {t('title')}
        </motion.h1>

        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-modern/90 font-light mb-2">
          {t('subtitle')}
        </motion.p>

        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gold/80 font-medium mb-6">
          {t('hosts')}
        </motion.p>

        <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-modern/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('description')}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center">
          <motion.a
            href="#fixture"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="gradient-gold text-dark font-bold px-8 py-4 rounded-xl text-lg animate-glow inline-block"
          >
            {t('cta')}
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.a
          href="#fixture"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="block text-foreground/50 hover:text-foreground/80 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5" />
            <path d="M7 6l5 5 5-5" />
          </svg>
        </motion.a>
      </motion.div>
    </section>
  )
}
