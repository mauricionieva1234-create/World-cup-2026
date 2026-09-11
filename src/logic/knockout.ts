import { getStandings, StandingsEntry } from './standings'
import { teams } from '@/data/teams'
import { matches, Match } from '@/data/matches'

export interface QualifiedTeam {
  entry: StandingsEntry
  position: number
}

export interface BracketMatch {
  matchId: string
  phase: string
  home: string | null
  away: string | null
  homeId: string | null
  awayId: string | null
  homeFlag: string | null
  awayFlag: string | null
  homeScore: number
  awayScore: number
  penHome?: number
  penAway?: number
  status: 'scheduled' | 'finished'
  winnerId: string | null
  date: string
  time: string
  stadium: string
  nextMatchId: string | null
}

export interface UserScoreEntry {
  home: number
  away: number
  penHome?: number
  penAway?: number
  confirmed: boolean
}

export function getQualifiedTeams(): { winners: QualifiedTeam[]; runners: QualifiedTeam[]; third: QualifiedTeam[] } {
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
  const winners: QualifiedTeam[] = []
  const runners: QualifiedTeam[] = []
  const third: QualifiedTeam[] = []

  for (const g of groups) {
    const standing = getStandings(g)
    if (standing.length >= 1) winners.push({ entry: standing[0], position: 1 })
    if (standing.length >= 2) runners.push({ entry: standing[1], position: 2 })
    for (let i = 2; i < standing.length; i++) {
      third.push({ entry: standing[i], position: i + 1 })
    }
  }

  third.sort((a, b) => {
    if (b.entry.pts !== a.entry.pts) return b.entry.pts - a.entry.pts
    if (b.entry.gd !== a.entry.gd) return b.entry.gd - a.entry.gd
    return b.entry.gf - a.entry.gf
  })

  return { winners, runners, third: third.slice(0, 8) }
}

function getTeamById(id: string) {
  return teams.find(t => t.id === id) || null
}

export const nextMatchMap: Record<string, string> = {
  "70": "86", "71": "86", "72": "87", "73": "87",
  "74": "88", "75": "88", "76": "89", "77": "89",
  "78": "90", "79": "90", "80": "91", "81": "91",
  "82": "92", "83": "92", "84": "93", "85": "93",
  "86": "94", "87": "94", "88": "95", "89": "95",
  "90": "96", "91": "96", "92": "97", "93": "97",
  "94": "98", "95": "98", "96": "99", "97": "99",
  "98": "100", "99": "100",
}

export const loserNextMatchMap: Record<string, string> = {
  "98": "101", "99": "101",
}

export function buildWinnerSlotMap(): Record<string, 'home' | 'away'> {
  const map: Record<string, 'home' | 'away'> = {}
  const groups = new Map<string, string[]>()
  for (const [matchId, nextId] of Object.entries(nextMatchMap)) {
    if (!groups.has(nextId)) groups.set(nextId, [])
    groups.get(nextId)!.push(matchId)
  }
  for (const matchIds of groups.values()) {
    matchIds.sort((a, b) => Number(a) - Number(b))
    matchIds.forEach((id, i) => { map[id] = i === 0 ? 'home' : 'away' })
  }
  return map
}

export function getWinner(
  homeScore: number, awayScore: number,
  penHome?: number, penAway?: number
): 'home' | 'away' {
  if (homeScore !== awayScore) return homeScore > awayScore ? 'home' : 'away'
  if (penHome !== undefined && penAway !== undefined) return penHome > penAway ? 'home' : 'away'
  return homeScore > awayScore ? 'home' : 'away'
}

export function generateKnockoutBracket(): BracketMatch[] {
  const { winners, runners, third } = getQualifiedTeams()

  const allQualified: (QualifiedTeam | null)[] = [
    ...winners,
    ...Array(12 - winners.length).fill(null),
    ...runners,
    ...Array(12 - runners.length).fill(null),
    ...third,
  ]

  const knockoutMatches = matches.filter(m =>
    m.phase === '16avos de Final' || m.phase === 'Octavos de Final' ||
    m.phase === 'Cuartos de Final' || m.phase === 'Semifinales' ||
    m.phase === 'Final' || m.phase === 'Tercer Puesto'
  )

  const bracket: BracketMatch[] = []

  for (const match of knockoutMatches) {
    let home: string | null = null
    let away: string | null = null
    let homeId: string | null = null
    let awayId: string | null = null
    let homeFlag: string | null = null
    let awayFlag: string | null = null

    if (match.phase === '16avos de Final') {
      const mid = Number(match.id) - 70
      if (mid >= 0 && mid < 8) {
        const h = allQualified[mid]
        if (h) { const t = teams.find(t => t.id === h.entry.teamId); if (t) { home = t.name; homeId = t.id; homeFlag = t.flag } }
        const a = allQualified[24 + mid]
        if (a) { const t = teams.find(t => t.id === a.entry.teamId); if (t) { away = t.name; awayId = t.id; awayFlag = t.flag } }
      } else if (mid >= 8 && mid < 12) {
        const h = allQualified[mid]
        if (h) { const t = teams.find(t => t.id === h.entry.teamId); if (t) { home = t.name; homeId = t.id; homeFlag = t.flag } }
        const a = allQualified[12 + (mid - 8)]
        if (a) { const t = teams.find(t => t.id === a.entry.teamId); if (t) { away = t.name; awayId = t.id; awayFlag = t.flag } }
      } else {
        const i = mid - 12
        const h = allQualified[12 + 4 + i]
        if (h) { const t = teams.find(t => t.id === h.entry.teamId); if (t) { home = t.name; homeId = t.id; homeFlag = t.flag } }
        const a = allQualified[12 + 8 + i]
        if (a) { const t = teams.find(t => t.id === a.entry.teamId); if (t) { away = t.name; awayId = t.id; awayFlag = t.flag } }
      }
    } else {
      const ht = getTeamById(match.homeId)
      const at = getTeamById(match.awayId)
      if (ht) { home = match.homeTeam; homeId = ht.id; homeFlag = ht.flag }
      if (at) { away = match.awayTeam; awayId = at.id; awayFlag = at.flag }
    }

    const isFinished = match.status === 'finished' && !!(home && away)
    const winner = isFinished
      ? getWinner(match.homeScore, match.awayScore)
      : null

    bracket.push({
      matchId: match.id,
      phase: match.phase,
      home,
      away,
      homeId,
      awayId,
      homeFlag,
      awayFlag,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      status: isFinished ? 'finished' : 'scheduled',
      winnerId: winner ? (winner === 'home' ? homeId : awayId) : null,
      date: match.date,
      time: match.time,
      stadium: `${match.stadium}, ${match.city}`,
      nextMatchId: nextMatchMap[match.id] || null,
    })
  }

  return bracket
}

export function propagateBracket(
  baseBracket: BracketMatch[],
  userScores: Record<string, UserScoreEntry>
): BracketMatch[] {
  const map = new Map<string, BracketMatch>()
  for (const m of baseBracket) map.set(m.matchId, { ...m })

  for (const [id, s] of Object.entries(userScores)) {
    if (!s.confirmed) continue
    const m = map.get(id)
    if (!m) continue
    m.homeScore = s.home
    m.awayScore = s.away
    m.penHome = s.penHome
    m.penAway = s.penAway
    m.status = 'finished'
    map.set(id, m)
  }

  const sorted = [...map.keys()].sort((a, b) => Number(a) - Number(b))
  const winnerSlotMap = buildWinnerSlotMap()

  for (const id of sorted) {
    const m = map.get(id)!
    if (m.status !== 'finished' || !m.homeId || !m.awayId) continue
    m.winnerId = getWinner(m.homeScore, m.awayScore, m.penHome, m.penAway) === 'home' ? m.homeId : m.awayId

    const nextId = nextMatchMap[id]
    if (nextId && map.has(nextId)) {
      const winner = m.winnerId === m.homeId ? m.home : m.away
      const winnerId = m.winnerId
      const winnerFlag = m.winnerId === m.homeId ? m.homeFlag : m.awayFlag
      const slot = winnerSlotMap[id]
      const next = map.get(nextId)!
      if (slot === 'home') { next.home = winner; next.homeId = winnerId; next.homeFlag = winnerFlag }
      else { next.away = winner; next.awayId = winnerId; next.awayFlag = winnerFlag }
      map.set(nextId, next)
    }

    const loserNextId = loserNextMatchMap[id]
    if (loserNextId && map.has(loserNextId)) {
      const loser = m.winnerId !== m.homeId ? m.home : m.away
      const loserId = m.winnerId !== m.homeId ? m.homeId : m.awayId
      const loserFlag = m.winnerId !== m.homeId ? m.homeFlag : m.awayFlag
      const next = map.get(loserNextId)!
      if (!next.homeId) { next.home = loser; next.homeId = loserId; next.homeFlag = loserFlag }
      else { next.away = loser; next.awayId = loserId; next.awayFlag = loserFlag }
      map.set(loserNextId, next)
    }
  }

  return [...map.values()]
}
