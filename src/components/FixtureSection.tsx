'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { matches, UserScores } from '@/data/matches'
import { simulateMatch } from '@/data/teamStrengths'
import MatchCard, { emptyMatchPlayerStats, MatchPlayerStats } from './MatchCard'

const STORAGE_KEY = 'fixtureUserScores'
const PLAYER_STATS_KEY = 'fixturePlayerStats'

type PlayerStatsMap = Record<string, MatchPlayerStats>

const filters = [
  { key: 'all', label: 'Todos' },
  { key: 'Fase de Grupos', label: 'Fase de Grupos' },
  { key: '16avos de Final', label: 'Dieciseisavos' },
  { key: 'Octavos de Final', label: 'Octavos' },
  { key: 'Cuartos de Final', label: 'Cuartos' },
  { key: 'Semifinales', label: 'Semifinal' },
  { key: 'Final', label: 'Final' },
]

function loadScores(): UserScores {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveScores(scores: UserScores) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}

function loadPlayerStats(): PlayerStatsMap {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(PLAYER_STATS_KEY) || '{}') }
  catch { return {} }
}

function savePlayerStats(stats: PlayerStatsMap) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(stats))
}

export default function FixtureSection() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [editMode, setEditMode] = useState(false)
  const [userScores, setUserScores] = useState<UserScores>({})
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set())
  const [playerStats, setPlayerStats] = useState<PlayerStatsMap>({})

  useEffect(() => {
    setUserScores(loadScores())
    setPlayerStats(loadPlayerStats())
  }, [])

  const handleScoreChange = useCallback((id: string, home: number, away: number) => {
    setUserScores(prev => {
      const next = { ...prev, [id]: { home, away } }
      saveScores(next)
      return next
    })
  }, [])

  const handleConfirm = useCallback((id: string) => {
    setConfirmedIds(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    const ps = playerStats[id]
    if (ps) {
      try {
        const existing = JSON.parse(localStorage.getItem('worldcupSimulation') || '{}')
        const st = existing.stats || { goals: {}, assists: {}, mvps: {}, champion: null }
        if (!st.goals) st.goals = {}
        if (!st.assists) st.assists = {}
        for (const s of [...ps.homeScorers, ...ps.awayScorers]) {
          if (s.name.trim()) st.goals[s.name] = (st.goals[s.name] || 0) + 1
        }
        for (const a of [...ps.homeAssisters, ...ps.awayAssisters]) {
          if (a.name.trim()) st.assists[a.name] = (st.assists[a.name] || 0) + 1
        }
        existing.stats = st
        localStorage.setItem('worldcupSimulation', JSON.stringify(existing))
      } catch { /* */ }
    }
  }, [playerStats])

  const handleEdit = useCallback((id: string) => {
    setConfirmedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const handlePlayerScorerChange = useCallback((id: string, side: 'home' | 'away', idx: number, name: string) => {
    setPlayerStats(prev => {
      const ps = { ...(prev[id] || emptyMatchPlayerStats()) }
      const scorers = side === 'home' ? [...ps.homeScorers] : [...ps.awayScorers]
      while (scorers.length <= idx) scorers.push({ name: '', value: 0 })
      scorers[idx] = { ...scorers[idx], name }
      if (side === 'home') ps.homeScorers = scorers
      else ps.awayScorers = scorers
      const next = { ...prev, [id]: ps }
      savePlayerStats(next)
      return next
    })
  }, [])

  const handlePlayerAssisterChange = useCallback((id: string, side: 'home' | 'away', idx: number, name: string) => {
    setPlayerStats(prev => {
      const ps = { ...(prev[id] || emptyMatchPlayerStats()) }
      const assisters = side === 'home' ? [...ps.homeAssisters] : [...ps.awayAssisters]
      while (assisters.length <= idx) assisters.push({ name: '', value: 0 })
      assisters[idx] = { ...assisters[idx], name }
      if (side === 'home') ps.homeAssisters = assisters
      else ps.awayAssisters = assisters
      const next = { ...prev, [id]: ps }
      savePlayerStats(next)
      return next
    })
  }, [])

  const clearScores = useCallback(() => {
    setUserScores({})
    setConfirmedIds(new Set())
    setPlayerStats({})
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(PLAYER_STATS_KEY)
  }, [])

  const simulateAll = useCallback(() => {
    const scores: UserScores = {}
    for (const m of matches) {
      if (m.status === 'finished' || m.status === 'live') continue
      scores[m.id] = simulateMatch(m.homeId, m.awayId)
    }
    setUserScores(scores)
    saveScores(scores)
  }, [])

  const hasUserScores = Object.keys(userScores).length > 0

  const filtered = activeFilter === 'all'
    ? matches
    : matches.filter(m => m.phase === activeFilter)

  const liveMatches = matches.filter(m => m.status === 'live')

  return (
    <section id="fixture" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Calendario <span className="text-gradient">Mundial 2026</span>
          </h2>
          <p className="text-gray-modern/60 text-lg">
            Todos los partidos del torneo
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              editMode
                ? 'bg-green-500 text-white font-bold'
                : 'bg-dark-card text-gray-modern/70 hover:text-foreground border border-foreground/5'
            }`}
          >
            {editMode ? '✕ Cerrar Editor' : '✏️ Editar Resultados'}
          </button>
          {editMode && (
            <button
              onClick={simulateAll}
              className="px-5 py-2 rounded-full text-sm font-medium bg-gold/20 text-gold hover:bg-gold/30 transition-all"
            >
              🎲 Simular Mundial
            </button>
          )}
          {hasUserScores && editMode && (
            <button
              onClick={clearScores}
              className="px-5 py-2 rounded-full text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
            >
              Limpiar todo
            </button>
          )}
        </div>

        {editMode && (
          <div className="text-center mb-4">
            <p className="text-xs text-gray-modern/50">
              Hacé clic en los marcadores para editar los resultados. Los cambios se guardan automáticamente.
            </p>
          </div>
        )}

        {liveMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 p-4 rounded-2xl border border-red-500/20 bg-red-500/5"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Partidos en Vivo</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveMatches.map((m, i) => (
                <MatchCard key={m.id} match={m} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === f.key
                  ? 'bg-gold text-dark font-bold'
                  : 'bg-dark-card text-gray-modern/70 hover:text-foreground hover:bg-dark-hover border border-foreground/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((m, i) => (
            <MatchCard
              key={m.id}
              match={m}
              index={i}
              editMode={editMode}
              userScore={userScores[m.id]}
              onScoreChange={handleScoreChange}
              confirmed={confirmedIds.has(m.id)}
              onConfirm={handleConfirm}
              onEdit={handleEdit}
              playerStats={playerStats[m.id]}
              onPlayerScorerChange={handlePlayerScorerChange}
              onPlayerAssisterChange={handlePlayerAssisterChange}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-modern/50">
            <p className="text-lg">No hay partidos en esta fase</p>
          </div>
        )}
      </div>
    </section>
  )
}
