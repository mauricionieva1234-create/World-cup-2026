'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Navbar from '@/components/Navbar'
import ParticleBackground from '@/components/ParticleBackground'
import HeroSection from '@/components/HeroSection'
import FixtureSection from '@/components/FixtureSection'
import LiveMatchCenter from '@/components/LiveMatchCenter'
import StandingsSection from '@/components/StandingsSection'
import BracketSection from '@/components/BracketSection'
import GoalAnimation from '@/components/GoalAnimation'
import TeamsSection from '@/components/TeamsSection'
import StadiumSection from '@/components/StadiumSection'
import StatsSection from '@/components/StatsSection'
import HistorySection from '@/components/HistorySection'
import ComparadorSection from '@/components/ComparadorSection'
import AIChat from '@/components/AIChat'
export default function Home() {
  const [goalAnim, setGoalAnim] = useState({ show: false, team: '', player: '', minute: 0 })
  const t = useTranslations('footer')

  const triggerGoal = useCallback((team: string, player: string, minute: number) => {
    setGoalAnim({ show: true, team, player, minute })
  }, [])

  return (
    <div className="relative min-h-screen bg-dark overflow-x-hidden">
      <ParticleBackground />
      <Navbar />
      <HeroSection />
      <FixtureSection />
      <LiveMatchCenter />
      <StandingsSection />
      <BracketSection />
      <TeamsSection />
      <StadiumSection />
      <StatsSection />
      <ComparadorSection />
      <HistorySection />
      <section id="ia" className="relative" />
      <AIChat />

      <GoalAnimation
        show={goalAnim.show}
        team={goalAnim.team}
        player={goalAnim.player}
        minute={goalAnim.minute}
        onClose={() => setGoalAnim({ show: false, team: '', player: '', minute: 0 })}
      />

      <footer className="relative py-8 px-4 border-t border-foreground/5">
        <div className="max-w-7xl mx-auto text-center">
          <img src="/images/logomundial.webp" alt="Mundial 2026" className="h-10 w-auto mx-auto mb-3 opacity-70" />
          <p className="text-gold font-bold text-lg mb-1">Mundial 2026</p>
          <p className="text-gray-modern/40 text-xs">
            México · Estados Unidos · Canadá
          </p>
          <p className="text-gray-modern/30 text-[10px] mt-2">
            {t('copyright')}
          </p>
        </div>
      </footer>
    </div>
  )
}
