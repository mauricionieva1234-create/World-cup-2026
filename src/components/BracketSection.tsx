'use client'

import { useState, useCallback, useEffect, useMemo, useRef, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { BracketMatch, generateKnockoutBracket, propagateBracket, getWinner } from '@/logic/knockout'
import Flag from '@/components/Flag'

const CARD_H = 52
const UNIT = 60
const COL_W = 170
const CON_W = 30
const TOTAL_H = 8 * UNIT

function cardY(phase: string, idx: number): number {
  if (phase === '16avos de Final') return idx * UNIT + 4
  if (phase === 'Octavos de Final') return idx * UNIT * 2 + (UNIT - CARD_H) / 2
  if (phase === 'Cuartos de Final') return idx * UNIT * 4 + (UNIT * 2 - CARD_H) / 2
  if (phase === 'Semifinales') return (UNIT * 4 - CARD_H) / 2
  return 0
}

function cardMidY(phase: string, idx: number): number {
  return cardY(phase, idx) + CARD_H / 2
}

function pairMidY(phase: string, pi: number): number {
  return (cardMidY(phase, pi * 2) + cardMidY(phase, pi * 2 + 1)) / 2
}

function ConnectorGap({ phase, side, confirmed }: { phase: string; side: 'left' | 'right'; confirmed: boolean }) {
  const nextPhase = phase === '16avos de Final' ? 'Octavos de Final'
    : phase === 'Octavos de Final' ? 'Cuartos de Final'
    : phase === 'Cuartos de Final' ? 'Semifinales'
    : null
  if (!nextPhase) return <div className="w-[30px] shrink-0" />

  const srcX = side === 'left' ? 0 : CON_W
  const dstX = side === 'left' ? CON_W : 0
  const midX = CON_W / 2
  const clr = confirmed ? '#d4af37' : 'rgba(255,255,255,0.15)'
  const sw = confirmed ? 2.5 : 1.5
  const cls = confirmed ? 'drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]' : ''

  return (
    <div className="w-[30px] shrink-0 relative" style={{ height: TOTAL_H }}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[0, 1, 2, 3].map(pi => {
          const a = cardMidY(phase, pi * 2)
          const b = cardMidY(phase, pi * 2 + 1)
          const pm = pairMidY(phase, pi)
          const d = cardMidY(nextPhase, pi)
          return (
            <g key={pi}>
              <path d={`M${srcX},${a} L${midX},${a} L${midX},${pm}`} fill="none" stroke={clr} strokeWidth={sw} strokeLinejoin="round" className={cls} />
              <path d={`M${srcX},${b} L${midX},${b} L${midX},${pm}`} fill="none" stroke={clr} strokeWidth={sw} strokeLinejoin="round" className={cls} />
              <path d={`M${midX},${pm} L${midX},${d} L${dstX},${d}`} fill="none" stroke={clr} strokeWidth={sw} strokeLinejoin="round" className={cls} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

const LS_KEY = 'worldcupSimulation'

interface SimStats {
  goals: Record<string, number>
  assists: Record<string, number>
  mvps: Record<string, number>
  champion: string | null
}

interface MatchPlayerStats {
  homeScorers: { name: string; goals: number }[]
  homeAssisters: { name: string; assists: number }[]
  awayScorers: { name: string; goals: number }[]
  awayAssisters: { name: string; assists: number }[]
}

interface SimData {
  scores: Record<string, { home: number; away: number; penHome?: number; penAway?: number; confirmed: boolean }>
  stats: SimStats
  playerStats: Record<string, MatchPlayerStats>
}

function emptyStats(): SimStats { return { goals: {}, assists: {}, mvps: {}, champion: null } }

function emptyPlayerStats(): MatchPlayerStats {
  return { homeScorers: [], homeAssisters: [], awayScorers: [], awayAssisters: [] }
}

function loadSim(): SimData {
  if (typeof window === 'undefined') return { scores: {}, stats: emptyStats(), playerStats: {} }
  try {
    const r = localStorage.getItem(LS_KEY)
    if (!r) return { scores: {}, stats: emptyStats(), playerStats: {} }
    const d = JSON.parse(r)
    return { ...d, playerStats: d.playerStats || {} }
  }
  catch { return { scores: {}, stats: emptyStats(), playerStats: {} } }
}

function saveSim(d: SimData) { try { localStorage.setItem(LS_KEY, JSON.stringify(d)) } catch { /* */ } }

function topItems(r: Record<string, number>, limit = 5) {
  return Object.entries(r).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([k, v]) => ({ k, v }))
}

export default function BracketSection() {
  const t = useTranslations('bracketSection')
  const [sim, setSim] = useState<SimData>(loadSim)
  const [editing, setEditing] = useState<string | null>(null)
  const [showStats, setShowStats] = useState(false)
  const [animId, setAnimId] = useState<string | null>(null)

  const base = useMemo(() => generateKnockoutBracket(), [])
  const bracket = useMemo(() => propagateBracket(base, sim.scores), [base, sim.scores])

  useEffect(() => { saveSim(sim) }, [sim])

  function confirmed(id: string) { return sim.scores[id]?.confirmed ?? false }

  const hasScores = Object.keys(sim.scores).length > 0

  const setPlayerScorer = useCallback((id: string, side: 'home' | 'away', idx: number, field: 'name' | 'goals', value: string | number) => {
    setSim(p => {
      const ps = { ...(p.playerStats[id] || emptyPlayerStats()) }
      const scorers = side === 'home' ? [...ps.homeScorers] : [...ps.awayScorers]
      while (scorers.length <= idx) scorers.push({ name: '', goals: 0 })
      if (field === 'name') scorers[idx] = { ...scorers[idx], name: value as string }
      else scorers[idx] = { ...scorers[idx], goals: value as number }
      if (side === 'home') ps.homeScorers = scorers
      else ps.awayScorers = scorers
      return { ...p, playerStats: { ...p.playerStats, [id]: ps } }
    })
  }, [])

  const setPlayerAssister = useCallback((id: string, side: 'home' | 'away', idx: number, field: 'name' | 'assists', value: string | number) => {
    setSim(p => {
      const ps = { ...(p.playerStats[id] || emptyPlayerStats()) }
      const assisters = side === 'home' ? [...ps.homeAssisters] : [...ps.awayAssisters]
      while (assisters.length <= idx) assisters.push({ name: '', assists: 0 })
      if (field === 'name') assisters[idx] = { ...assisters[idx], name: value as string }
      else assisters[idx] = { ...assisters[idx], assists: value as number }
      if (side === 'home') ps.homeAssisters = assisters
      else ps.awayAssisters = assisters
      return { ...p, playerStats: { ...p.playerStats, [id]: ps } }
    })
  }, [])

  const setScore = useCallback((id: string, field: 'home' | 'away' | 'penHome' | 'penAway', v: number) => {
    setSim(p => {
      const e = p.scores[id] || { home: 0, away: 0, confirmed: false }
      return { ...p, scores: { ...p.scores, [id]: { ...e, [field]: v } } }
    })
  }, [])

  const handleConfirm = useCallback((id: string) => {
    setSim(p => {
      const s = p.scores[id]
      if (!s || s.confirmed) return p
      const c = { ...s, confirmed: true }
      const ns = { ...p.scores, [id]: c }
      const m = bracket.find(b => b.matchId === id)
      if (!m) return { ...p, scores: ns }
      const w = getWinner(s.home, s.away, s.penHome, s.penAway)
      const wn = w === 'home' ? m.home : m.away
      const st = { ...p.stats }
      if (!st.champion && m.phase === 'Final') st.champion = wn

      const ps = p.playerStats[id]
      if (ps) {
        for (const sc of [...ps.homeScorers, ...ps.awayScorers]) {
          if (sc.name.trim()) st.goals[sc.name] = (st.goals[sc.name] || 0) + sc.goals
        }
        for (const as of [...ps.homeAssisters, ...ps.awayAssisters]) {
          if (as.name.trim()) st.assists[as.name] = (st.assists[as.name] || 0) + as.assists
        }
      }

      setAnimId(id)
      setTimeout(() => setAnimId(null), 1200)
      return { scores: ns, stats: st, playerStats: p.playerStats }
    })
    setEditing(null)
  }, [bracket])

  function randResult(id: string) {
    setSim(p => ({ ...p, scores: { ...p.scores, [id]: { home: Math.floor(Math.random() * 5), away: Math.floor(Math.random() * 5), confirmed: false } } }))
    setEditing(id)
  }

  function resetAll() {
    setSim({ scores: {}, stats: emptyStats(), playerStats: {} })
    localStorage.removeItem(LS_KEY)
    setEditing(null)
  }

  const grouped = useMemo(() => {
    const l = { '16avos de Final': [] as BracketMatch[], 'Octavos de Final': [] as BracketMatch[], 'Cuartos de Final': [] as BracketMatch[], 'Semifinales': [] as BracketMatch[] }
    const r = { '16avos de Final': [] as BracketMatch[], 'Octavos de Final': [] as BracketMatch[], 'Cuartos de Final': [] as BracketMatch[], 'Semifinales': [] as BracketMatch[] }
    let final: BracketMatch | null = null
    let third: BracketMatch | null = null
    for (const m of bracket) {
      if (m.phase === 'Final') { final = m; continue }
      if (m.phase === 'Tercer Puesto') { third = m; continue }
      const id = Number(m.matchId)
      if (id <= 77 || (id >= 86 && id <= 89) || id === 94 || id === 95 || id === 98) l[m.phase]?.push(m)
      else r[m.phase]?.push(m)
    }
    return { left: l, right: r, final, third }
  }, [bracket])

  const statsData = useMemo(() => ({
    goals: topItems(sim.stats.goals),
    assists: topItems(sim.stats.assists),
    mvps: topItems(sim.stats.mvps),
    total: Object.values(sim.stats.goals).reduce((a, b) => a + b, 0),
  }), [sim.stats])

  const champion = useMemo(() => {
    if (!grouped.final || grouped.final.status !== 'finished') return null
    const n = grouped.final.winnerId === grouped.final.homeId ? grouped.final.home : grouped.final.away
    return { name: n }
  }, [grouped.final])

  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollPosRef = useRef(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => { scrollPosRef.current = el.scrollLeft }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollPosRef.current
    }
  })

  function MatchCard({ m }: { m: BracketMatch }) {
    const s = sim.scores[m.matchId]
    const isEdit = editing === m.matchId
    const conf = s?.confirmed
    const real = m.status === 'finished' && !conf
    const isAnim = animId === m.matchId
    const empty = !m.homeId && !m.awayId

    const hS = conf ? s!.home : (real ? m.homeScore : 0)
    const aS = conf ? s!.away : (real ? m.awayScore : 0)

    if (empty) {
      return (
        <div className="flex items-center justify-between gap-1 px-3 h-[52px] text-[11px] rounded-lg border border-dashed border-white/20 bg-dark-card/60">
          <span className="text-gray-modern/40 font-medium">—</span>
          <span className="text-[9px] text-gray-modern/30 uppercase tracking-wider font-semibold">vs</span>
          <span className="text-gray-modern/40 font-medium">—</span>
        </div>
      )
    }

    const ps = sim.playerStats[m.matchId] || emptyPlayerStats()

    return (
      <motion.div
        animate={isAnim ? { scale: [1, 1.06, 1], transition: { duration: 0.5 } } : {}}
        className={`relative rounded-lg border transition-all duration-300 ${
          conf ? 'border-green-500/50 bg-green-500/5' :
          real ? 'border-gold/30 bg-gold/5' :
          isEdit ? 'border-gold/60 bg-dark-hover/80' :
          'border-white/10 bg-dark-card/60 hover:border-white/20'
        } ${isAnim ? 'shadow-[0_0_20px_rgba(212,175,55,0.4)]' : ''}`}
        style={isEdit ? {} : { height: CARD_H }}
      >
        {isAnim && (
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1 }}
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-gold/20 to-transparent pointer-events-none" />
        )}
        <div className={`px-2 ${isEdit ? 'py-1.5' : 'py-1'} ${isEdit ? '' : 'h-full flex flex-col justify-center'}`}>
          <div className="flex items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <Flag teamId={m.homeId} teamName={m.home} className={`w-4 h-3 shrink-0 ${!m.homeId ? 'opacity-20' : ''}`} />
              <span className={`font-semibold truncate text-[11px] ${m.homeId ? 'text-foreground' : 'text-gray-modern/30'}`}>
                {m.homeId ? (m.home || '—') : '—'}
              </span>
            </div>
            {isEdit ? (
              <div className="flex items-center gap-0.5 shrink-0">
                <input type="number" min="0" max="20"
                  value={s?.home ?? 0}
                  onChange={e => setScore(m.matchId, 'home', Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
                  className="w-6 h-5 text-center text-[10px] font-bold bg-dark border border-foreground/20 rounded text-gold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-[10px] text-gray-modern/40">-</span>
                <input type="number" min="0" max="20"
                  value={s?.away ?? 0}
                  onChange={e => setScore(m.matchId, 'away', Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
                  className="w-6 h-5 text-center text-[10px] font-bold bg-dark border border-foreground/20 rounded text-gold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            ) : (
              <span className={`font-bold text-[11px] shrink-0 px-1 ${
                conf ? 'text-green-400' : real ? 'text-gold' : 'text-gray-modern/30'
              }`}>
                {conf || real ? `${hS}–${aS}` : 'vs'}
              </span>
            )}
            <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
              <span className={`font-semibold truncate text-[11px] ${m.awayId ? 'text-foreground' : 'text-gray-modern/30'}`}>
                {m.awayId ? (m.away || '—') : '—'}
              </span>
              <Flag teamId={m.awayId} teamName={m.away} className={`w-4 h-3 shrink-0 ${!m.awayId ? 'opacity-20' : ''}`} />
            </div>
          </div>
          {conf && s?.penHome !== undefined && (
            <div className="text-[9px] text-gold/60 text-center -mt-0.5">({s.penHome}-{s.penAway})</div>
          )}
          {isEdit && (
            <>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <div className="flex items-center gap-0.5 text-[9px] text-gray-modern/40">
                  <span>P:</span>
                  <input type="number" min="0" max="20"
                    value={s?.penHome ?? ''} placeholder="-"
                    onChange={e => setScore(m.matchId, 'penHome', Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
                    className="w-5 h-4 text-center text-[9px] font-bold bg-dark/80 border border-foreground/10 rounded text-gold/80 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span>-</span>
                  <input type="number" min="0" max="20"
                    value={s?.penAway ?? ''} placeholder="-"
                    onChange={e => setScore(m.matchId, 'penAway', Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
                    className="w-5 h-4 text-center text-[9px] font-bold bg-dark/80 border border-foreground/10 rounded text-gold/80 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <button onClick={() => handleConfirm(m.matchId)}
                  className="px-1.5 py-0.5 text-[9px] font-bold bg-green-600 hover:bg-green-500 text-white rounded transition-colors">
                  OK
                </button>
              </div>
              <div className="mt-1 border-t border-foreground/5 pt-1">
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                  <div>
                    <span className="text-[8px] text-gold/40 uppercase tracking-wider">⚽ Local</span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <input type="text" placeholder="Jugador" value={ps.homeScorers[0]?.name || ''} maxLength={20}
                        onChange={e => setPlayerScorer(m.matchId, 'home', 0, 'name', e.target.value)}
                        className="w-full h-4 text-[8px] bg-dark/80 border border-foreground/10 rounded px-1 text-foreground placeholder-gray-modern/30" />
                      <input type="number" min="0" max="10" value={ps.homeScorers[0]?.goals ?? 0}
                        onChange={e => setPlayerScorer(m.matchId, 'home', 0, 'goals', Math.min(10, Math.max(0, Number(e.target.value) || 0)))}
                        className="w-5 h-4 text-center text-[8px] font-bold bg-dark/80 border border-foreground/10 rounded text-gold [appearance:textfield]" />
                    </div>
                    <span className="text-[8px] text-gold/30 uppercase tracking-wider">🅰</span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <input type="text" placeholder="Asistente" value={ps.homeAssisters[0]?.name || ''} maxLength={20}
                        onChange={e => setPlayerAssister(m.matchId, 'home', 0, 'name', e.target.value)}
                        className="w-full h-4 text-[8px] bg-dark/80 border border-foreground/10 rounded px-1 text-foreground placeholder-gray-modern/30" />
                      <input type="number" min="0" max="10" value={ps.homeAssisters[0]?.assists ?? 0}
                        onChange={e => setPlayerAssister(m.matchId, 'home', 0, 'assists', Math.min(10, Math.max(0, Number(e.target.value) || 0)))}
                        className="w-5 h-4 text-center text-[8px] font-bold bg-dark/80 border border-foreground/10 rounded text-gold [appearance:textfield]" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[8px] text-gold/40 uppercase tracking-wider">⚽ Visitante</span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <input type="text" placeholder="Jugador" value={ps.awayScorers[0]?.name || ''} maxLength={20}
                        onChange={e => setPlayerScorer(m.matchId, 'away', 0, 'name', e.target.value)}
                        className="w-full h-4 text-[8px] bg-dark/80 border border-foreground/10 rounded px-1 text-foreground placeholder-gray-modern/30" />
                      <input type="number" min="0" max="10" value={ps.awayScorers[0]?.goals ?? 0}
                        onChange={e => setPlayerScorer(m.matchId, 'away', 0, 'goals', Math.min(10, Math.max(0, Number(e.target.value) || 0)))}
                        className="w-5 h-4 text-center text-[8px] font-bold bg-dark/80 border border-foreground/10 rounded text-gold [appearance:textfield]" />
                    </div>
                    <span className="text-[8px] text-gold/30 uppercase tracking-wider">🅰</span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <input type="text" placeholder="Asistente" value={ps.awayAssisters[0]?.name || ''} maxLength={20}
                        onChange={e => setPlayerAssister(m.matchId, 'away', 0, 'name', e.target.value)}
                        className="w-full h-4 text-[8px] bg-dark/80 border border-foreground/10 rounded px-1 text-foreground placeholder-gray-modern/30" />
                      <input type="number" min="0" max="10" value={ps.awayAssisters[0]?.assists ?? 0}
                        onChange={e => setPlayerAssister(m.matchId, 'away', 0, 'assists', Math.min(10, Math.max(0, Number(e.target.value) || 0)))}
                        className="w-5 h-4 text-center text-[8px] font-bold bg-dark/80 border border-foreground/10 rounded text-gold [appearance:textfield]" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    )
  }

  function RoundColumn({ phase, matches, side }: { phase: string; matches: BracketMatch[]; side: 'left' | 'right' }) {
    return (
      <div className="shrink-0" style={{ width: COL_W }}>
        <div className="text-center mb-2">
          <span className="text-[9px] font-bold text-gold/50 uppercase tracking-[0.15em]">
            {phase === '16avos de Final' ? '16VOS' : phase === 'Octavos de Final' ? '8VOS' : phase === 'Cuartos de Final' ? '4TOS' : 'SEMIS'}
          </span>
        </div>
        <div className="relative" style={{ height: TOTAL_H }}>
          {matches.map((m, i) => (
            <div key={m.matchId} className="absolute left-0 right-0"
              style={{ top: cardY(phase, i), height: CARD_H }}>
              <MatchCard m={m} />
              {!confirmed(m.matchId) && !(m.status === 'finished' && !sim.scores[m.matchId]?.confirmed) && m.homeId && m.awayId && (
                <button onClick={() => randResult(m.matchId)}
                  className="block mx-auto mt-1 text-[10px] font-semibold text-gold/50 hover:text-gold transition-colors">
                  {t('simulate')}
                </button>
              )}
              {confirmed(m.matchId) && (
                <button onClick={() => setEditing(m.matchId)}
                  className="block mx-auto mt-1 text-[10px] font-semibold text-gray-modern/40 hover:text-gold transition-colors">
                  {t('editResult')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  function anyConfirmed(matches: BracketMatch[]) {
    return matches.some(m => confirmed(m.matchId))
  }

  return (
    <section id="eliminacion" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark to-dark pointer-events-none" />
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-red-950/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-950/10 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t('title').split(' ')[0]} <span className="text-gradient">{t('title').split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-gray-modern/60 text-lg">{t('subtitle')}</p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {hasScores && (
            <button onClick={resetAll}
              className="px-4 py-1.5 text-xs font-medium rounded-full bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800/30 transition-colors">
              {t('clear')}
            </button>
          )}
          <button onClick={() => setShowStats(!showStats)}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${
              showStats ? 'bg-gold text-dark' : 'bg-dark-card text-gray-modern/70 hover:text-foreground border border-foreground/5'
            }`}>
            {showStats ? 'Ocultar stats' : 'Mostrar stats'}
          </button>
        </div>

        <AnimatePresence>
          {showStats && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
              <div className="glass-card rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Goleadores</h4>
                  {statsData.goals.length === 0 ? <p className="text-xs text-gray-modern/40">—</p> :
                    statsData.goals.map((p, i) => (
                      <div key={p.k} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-gray-modern/70">{i + 1}. {p.k}</span>
                        <span className="text-gold font-bold">{p.v}</span>
                      </div>
                    ))}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Asistencias</h4>
                  {statsData.assists.length === 0 ? <p className="text-xs text-gray-modern/40">—</p> :
                    statsData.assists.map((p, i) => (
                      <div key={p.k} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-gray-modern/70">{i + 1}. {p.k}</span>
                        <span className="text-gold font-bold">{p.v}</span>
                      </div>
                    ))}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">MVP</h4>
                  {statsData.mvps.length === 0 ? <p className="text-xs text-gray-modern/40">—</p> :
                    statsData.mvps.map((p, i) => (
                      <div key={p.k} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-gray-modern/70">{i + 1}. {p.k}</span>
                        <span className="text-gold font-bold">{p.v}</span>
                      </div>
                    ))}
                </div>
                <div className="text-center">
                  <h4 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Campeón</h4>
                  {sim.stats.champion ? (
                    <div>
                      <p className="text-lg font-black text-gold">🏆</p>
                      <p className="text-sm font-bold text-foreground">{sim.stats.champion}</p>
                    </div>
                  ) : <p className="text-xs text-gray-modern/40">—</p>}
                  <p className="text-[10px] text-gray-modern/30 mt-2">{statsData.total} goles</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={scrollRef} className="w-full overflow-x-auto pb-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="inline-flex items-start gap-0 select-none">
            <RoundColumn phase="16avos de Final" matches={grouped.left['16avos de Final']} side="left" />
            <ConnectorGap phase="16avos de Final" side="left" confirmed={anyConfirmed(grouped.left['16avos de Final'])} />
            <RoundColumn phase="Octavos de Final" matches={grouped.left['Octavos de Final']} side="left" />
            <ConnectorGap phase="Octavos de Final" side="left" confirmed={anyConfirmed(grouped.left['Octavos de Final'])} />
            <RoundColumn phase="Cuartos de Final" matches={grouped.left['Cuartos de Final']} side="left" />
            <ConnectorGap phase="Cuartos de Final" side="left" confirmed={anyConfirmed(grouped.left['Cuartos de Final'])} />
            <RoundColumn phase="Semifinales" matches={grouped.left['Semifinales']} side="left" />

            <div className="w-[200px] shrink-0 px-2">
              <div className="text-center mb-2">
                <span className="text-[9px] font-bold text-gold/50 uppercase tracking-[0.15em]">FINAL</span>
              </div>
              <div className="glass-card rounded-xl p-3 text-center border border-gold/30 relative overflow-hidden" style={{ marginTop: (TOTAL_H - 180) / 2 }}>
                <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
                <div className="relative">
                  <div className="text-3xl mb-1">🏆</div>
                  <h3 className="text-sm font-black text-gold uppercase tracking-wider">FINAL</h3>
                  <p className="text-[9px] text-gray-modern/60 mt-1">19 DE JULIO</p>
                  <p className="text-[9px] text-gray-modern/40">METLIFE NJ</p>
                  {grouped.final && (grouped.final.homeId || grouped.final.awayId) && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between gap-1 text-[10px] bg-dark/60 rounded-lg p-1.5">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <Flag teamId={grouped.final.homeId} teamName={grouped.final.home} className="w-4 h-3 shrink-0" />
                          <span className="font-semibold truncate text-[10px] text-foreground">{grouped.final.home || '—'}</span>
                        </div>
                        {editing === grouped.final.matchId ? (
                          <div className="flex items-center gap-0.5 shrink-0">
                            <input type="number" min="0" max="20"
                              value={sim.scores[grouped.final.matchId]?.home ?? 0}
                              onChange={e => setScore(grouped.final.matchId, 'home', Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
                              className="w-5 h-4 text-center text-[9px] font-bold bg-dark border border-foreground/20 rounded text-gold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-[9px] text-gray-modern/40">-</span>
                            <input type="number" min="0" max="20"
                              value={sim.scores[grouped.final.matchId]?.away ?? 0}
                              onChange={e => setScore(grouped.final.matchId, 'away', Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
                              className="w-5 h-4 text-center text-[9px] font-bold bg-dark border border-foreground/20 rounded text-gold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                        ) : (
                          <span className={`font-bold text-[10px] shrink-0 px-1 ${confirmed(grouped.final.matchId) ? 'text-green-400' : grouped.final.status === 'finished' ? 'text-gold' : 'text-gray-modern/30'}`}>
                            {confirmed(grouped.final.matchId) || grouped.final.status === 'finished' ? `${grouped.final.homeScore}–${grouped.final.awayScore}` : 'vs'}
                          </span>
                        )}
                        <div className="flex items-center gap-1 flex-1 min-w-0 justify-end">
                          <span className="font-semibold truncate text-[10px] text-foreground">{grouped.final.away || '—'}</span>
                          <Flag teamId={grouped.final.awayId} teamName={grouped.final.away} className="w-4 h-3 shrink-0" />
                        </div>
                      </div>
                      {editing === grouped.final.matchId ? (
                        <button onClick={() => handleConfirm(grouped.final.matchId)}
                          className="mt-1.5 text-[8px] font-bold bg-green-600 hover:bg-green-500 text-white px-1.5 py-0.5 rounded transition-colors">
                          OK
                        </button>
                      ) : !confirmed(grouped.final.matchId) && (
                        <button onClick={() => randResult(grouped.final.matchId)} className="mt-1.5 text-[8px] text-gold/40 hover:text-gold transition-colors">
                          {t('simulate')}
                        </button>
                      )}
                    </div>
                  )}
                  {champion && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2 pt-2 border-t border-gold/20">
                      <p className="text-[9px] text-gold/60 uppercase tracking-wider">Campeón</p>
                      <p className="text-sm font-black text-foreground">{champion.name}</p>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="text-center mt-4">
                <span className="text-[9px] font-bold text-gold/40 uppercase tracking-[0.15em]">3° PUESTO</span>
                <div className="mt-1">
                  {grouped.third ? (
                    <div className="rounded-lg border border-white/5 bg-dark-card/40 p-2 text-[10px]">
                      {grouped.third.homeId || grouped.third.awayId ? (
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1 flex-1 min-w-0">
                              <Flag teamId={grouped.third.homeId} teamName={grouped.third.home} className="w-3.5 h-2.5 shrink-0" />
                              <span className="truncate text-foreground">{grouped.third.home || '—'}</span>
                            </div>
                            {editing === grouped.third.matchId ? (
                              <div className="flex items-center gap-0.5 shrink-0">
                                <input type="number" min="0" max="20"
                                  value={sim.scores[grouped.third.matchId]?.home ?? 0}
                                  onChange={e => setScore(grouped.third.matchId, 'home', Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
                                  className="w-5 h-4 text-center text-[9px] font-bold bg-dark border border-foreground/20 rounded text-gold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="text-[9px] text-gray-modern/40">-</span>
                                <input type="number" min="0" max="20"
                                  value={sim.scores[grouped.third.matchId]?.away ?? 0}
                                  onChange={e => setScore(grouped.third.matchId, 'away', Math.min(20, Math.max(0, Number(e.target.value) || 0)))}
                                  className="w-5 h-4 text-center text-[9px] font-bold bg-dark border border-foreground/20 rounded text-gold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                              </div>
                            ) : (
                              <span className={`font-bold text-[10px] shrink-0 px-1 ${confirmed(grouped.third.matchId) ? 'text-green-400' : grouped.third.status === 'finished' ? 'text-gold' : 'text-gray-modern/50'}`}>
                                {confirmed(grouped.third.matchId) || grouped.third.status === 'finished' ? `${grouped.third.homeScore}–${grouped.third.awayScore}` : 'vs'}
                              </span>
                            )}
                            <div className="flex items-center gap-1 flex-1 min-w-0 justify-end">
                              <span className="truncate text-foreground">{grouped.third.away || '—'}</span>
                              <Flag teamId={grouped.third.awayId} teamName={grouped.third.away} className="w-3.5 h-2.5 shrink-0" />
                            </div>
                          </div>
                          {editing === grouped.third.matchId ? (
                            <button onClick={() => handleConfirm(grouped.third.matchId)}
                              className="mt-1 text-[8px] font-bold bg-green-600 hover:bg-green-500 text-white px-1.5 py-0.5 rounded transition-colors">
                              OK
                            </button>
                          ) : !confirmed(grouped.third.matchId) && (
                            <button onClick={() => randResult(grouped.third.matchId)}
                              className="mt-1 text-[8px] text-gold/40 hover:text-gold transition-colors">
                              {t('simulate')}
                            </button>
                          )}
                        </div>
                      ) : <span className="text-gray-modern/30">—</span>}
                    </div>
                  ) : <span className="text-gray-modern/20">—</span>}
                </div>
              </div>
            </div>

            <RoundColumn phase="Semifinales" matches={grouped.right['Semifinales']} side="right" />
            <ConnectorGap phase="Cuartos de Final" side="right" confirmed={anyConfirmed(grouped.right['Cuartos de Final'])} />
            <RoundColumn phase="Cuartos de Final" matches={grouped.right['Cuartos de Final']} side="right" />
            <ConnectorGap phase="Octavos de Final" side="right" confirmed={anyConfirmed(grouped.right['Octavos de Final'])} />
            <RoundColumn phase="Octavos de Final" matches={grouped.right['Octavos de Final']} side="right" />
            <ConnectorGap phase="16avos de Final" side="right" confirmed={anyConfirmed(grouped.right['16avos de Final'])} />
            <RoundColumn phase="16avos de Final" matches={grouped.right['16avos de Final']} side="right" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-[10px] text-gray-modern/40">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold" /> Real</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Simulado</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/20" /> Pendiente</span>
        </div>
      </div>
    </section>
  )
}
