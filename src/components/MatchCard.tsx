'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Match, TORNADO_TIMEZONE } from '@/data/matches'
import Flag from '@/components/Flag'

export interface MatchPlayerStatRow {
  name: string
  value: number
}

export interface MatchPlayerStats {
  homeScorers: MatchPlayerStatRow[]
  homeAssisters: MatchPlayerStatRow[]
  awayScorers: MatchPlayerStatRow[]
  awayAssisters: MatchPlayerStatRow[]
}

export function emptyMatchPlayerStats(): MatchPlayerStats {
  return { homeScorers: [], homeAssisters: [], awayScorers: [], awayAssisters: [] }
}

interface MatchCardProps {
  match: Match
  index: number
  editMode?: boolean
  userScore?: { home: number; away: number }
  onScoreChange?: (id: string, home: number, away: number) => void
  confirmed?: boolean
  onConfirm?: (id: string) => void
  onEdit?: (id: string) => void
  playerStats?: MatchPlayerStats
  onPlayerScorerChange?: (id: string, side: 'home' | 'away', idx: number, name: string) => void
  onPlayerAssisterChange?: (id: string, side: 'home' | 'away', idx: number, name: string) => void
}

export default function MatchCard({ match, index, editMode, userScore, onScoreChange, confirmed, onConfirm, onEdit, playerStats, onPlayerScorerChange, onPlayerAssisterChange }: MatchCardProps) {
  const t = useTranslations('matchCard')
  const isFinal = match.phase === 'Final'
  const isKnockout = ['Dieciseisavos', 'Octavos', 'Cuartos', 'Semifinal', 'Final'].includes(match.phase)
  const displayScore = userScore || { home: match.homeScore, away: match.awayScore }
  const isUserModified = userScore !== undefined

  const statusBadge = () => {
    if (match.status === 'live') {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {t('live')}
        </span>
      )
    }
    if (match.status === 'finished') {
      return (
        <span className="px-2.5 py-1 rounded-full bg-foreground/10 text-gray-modern/80 text-xs font-medium">
          {t('finished')}
        </span>
      )
    }
    return (
      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium">
        {t('upcoming')}
      </span>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`match-card rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
        isFinal ? 'border-gold/60 animate-glow' : ''
      } ${isKnockout && !isFinal ? 'border-gold/30' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-modern/60 uppercase tracking-wider">
          {match.phase}{match.group ? t('group', { group: match.group }) : ''}
        </span>
        {statusBadge()}
      </div>

      <div className="flex items-center justify-between gap-3 py-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Flag teamId={match.homeId} teamName={match.homeTeam} className="w-8 h-6 rounded-sm" />
          <span className="text-sm font-semibold text-foreground truncate">{match.homeTeam}</span>
        </div>

        <div className="flex-shrink-0 text-center min-w-[80px]">
          {editMode && confirmed ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-black text-foreground">{displayScore.home} - {displayScore.away}</span>
              <button onClick={() => onEdit?.(match.id)}
                className="px-2 py-0.5 text-[10px] font-medium bg-dark-hover text-gold/70 hover:text-gold rounded border border-foreground/10 transition-colors">
                {t('edit')}
              </button>
            </div>
          ) : editMode ? (
            <div className="flex items-center justify-center gap-1">
              <input
                type="number"
                min={0}
                max={99}
                value={displayScore.home}
                onChange={e => onScoreChange?.(match.id, Math.min(99, Math.max(0, Number(e.target.value) || 0)), displayScore.away)}
                className="w-10 h-10 text-center text-lg font-black text-gold bg-dark-card border border-gold/30 rounded-lg focus:outline-none focus:border-gold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="text-lg font-bold text-gray-modern/50">-</span>
              <input
                type="number"
                min={0}
                max={99}
                value={displayScore.away}
                onChange={e => onScoreChange?.(match.id, displayScore.home, Math.min(99, Math.max(0, Number(e.target.value) || 0)))}
                className="w-10 h-10 text-center text-lg font-black text-gold bg-dark-card border border-gold/30 rounded-lg focus:outline-none focus:border-gold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button onClick={() => onConfirm?.(match.id)}
                className="px-2 py-1 text-[10px] font-bold bg-green-600 hover:bg-green-500 text-white rounded transition-colors ml-1">
                {t('confirm')}
              </button>
            </div>
          ) : match.status === 'scheduled' ? (
            <span className="text-lg font-bold text-gray-modern/50">{t('vs')}</span>
          ) : (
            <span className="text-2xl font-black text-foreground">
              {match.homeScore} - {match.awayScore}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
          <span className="text-sm font-semibold text-foreground truncate">{match.awayTeam}</span>
          <Flag teamId={match.awayId} teamName={match.awayTeam} className="w-8 h-6 rounded-sm" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-foreground/5 text-xs text-gray-modern/50">
        <span>{match.date} · {match.time} {TORNADO_TIMEZONE}</span>
        <span>{match.stadium}, {match.city}</span>
      </div>

      {editMode && !confirmed && playerStats && (
        <div className="mt-3 pt-3 border-t border-foreground/5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] text-gold/40 uppercase tracking-wider">⚽ Local</span>
              <input type="text" placeholder="Goleador" value={playerStats.homeScorers[0]?.name || ''} maxLength={20}
                onChange={e => onPlayerScorerChange?.(match.id, 'home', 0, e.target.value)}
                className="w-full h-6 text-[10px] bg-dark-card border border-foreground/10 rounded px-2 text-foreground placeholder-gray-modern/30 mt-1" />
            </div>
            <div>
              <span className="text-[9px] text-gold/40 uppercase tracking-wider">⚽ Visitante</span>
              <input type="text" placeholder="Goleador" value={playerStats.awayScorers[0]?.name || ''} maxLength={20}
                onChange={e => onPlayerScorerChange?.(match.id, 'away', 0, e.target.value)}
                className="w-full h-6 text-[10px] bg-dark-card border border-foreground/10 rounded px-2 text-foreground placeholder-gray-modern/30 mt-1" />
            </div>
            <div>
              <span className="text-[9px] text-gold/40 uppercase tracking-wider">🅰 Local</span>
              <input type="text" placeholder="Asistente" value={playerStats.homeAssisters[0]?.name || ''} maxLength={20}
                onChange={e => onPlayerAssisterChange?.(match.id, 'home', 0, e.target.value)}
                className="w-full h-6 text-[10px] bg-dark-card border border-foreground/10 rounded px-2 text-foreground placeholder-gray-modern/30 mt-1" />
            </div>
            <div>
              <span className="text-[9px] text-gold/40 uppercase tracking-wider">🅰 Visitante</span>
              <input type="text" placeholder="Asistente" value={playerStats.awayAssisters[0]?.name || ''} maxLength={20}
                onChange={e => onPlayerAssisterChange?.(match.id, 'away', 0, e.target.value)}
                className="w-full h-6 text-[10px] bg-dark-card border border-foreground/10 rounded px-2 text-foreground placeholder-gray-modern/30 mt-1" />
            </div>
          </div>
        </div>
      )}

      {editMode && (
        <div className="mt-3 pt-3 border-t border-foreground/5 flex items-center justify-center">
          <span className={`text-[10px] italic ${confirmed ? 'text-green-400' : 'text-gray-modern/40'}`}>
            {confirmed ? '✓ Confirmado' : (isUserModified || (playerStats && (playerStats.homeScorers[0]?.name || playerStats.awayScorers[0]?.name)) ? 'Sin confirmar' : 'Sin modificar')}
          </span>
        </div>
      )}

      {match.status === 'finished' && match.mvp && (
        <div className="mt-3 pt-3 border-t border-foreground/5 text-xs text-gray-modern/70">
          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{t('mvp')}</span>{' '}
          <span>{match.mvp.name}</span>{' '}
          <span>⭐ {match.mvp.rating}</span>
        </div>
      )}

      {match.status === 'live' && match.minute && (
        <div className="mt-3 pt-3 border-t border-foreground/5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-400 font-medium">{match.minute}{t('minute')}</span>
        </div>
      )}
    </motion.div>
  )
}
