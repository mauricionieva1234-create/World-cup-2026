import { teams } from '@/data/teams'
import { matches, Match } from '@/data/matches'

export interface StandingsEntry {
  teamId: string
  teamName: string
  flag: string
  group: string
  gp: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  gd: number
  pts: number
  form: ('G' | 'E' | 'P')[]
}

export function getStandings(group?: string): StandingsEntry[] {
  const groupMatches = group
    ? matches.filter(m => m.group === group && m.phase === 'Fase de Grupos')
    : matches.filter(m => m.phase === 'Fase de Grupos')

  const teamMap = new Map<string, StandingsEntry>()

  for (const team of teams) {
    const g = team.group
    if (group && g !== group) continue
    if (!groupMatches.some(m => m.homeId === team.id || m.awayId === team.id)) continue
    teamMap.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      flag: team.flag,
      group: g,
      gp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [],
    })
  }

  for (const match of groupMatches) {
    if (match.status !== 'finished') continue

    const home = teamMap.get(match.homeId)
    const away = teamMap.get(match.awayId)
    if (!home || !away) continue

    home.gp++
    away.gp++
    home.gf += match.homeScore
    home.ga += match.awayScore
    away.gf += match.awayScore
    away.ga += match.homeScore

    if (match.homeScore > match.awayScore) {
      home.w++; home.pts += 3; home.form.push('G')
      away.l++; away.form.push('P')
    } else if (match.homeScore < match.awayScore) {
      away.w++; away.pts += 3; away.form.push('G')
      home.l++; home.form.push('P')
    } else {
      home.d++; home.pts += 1; home.form.push('E')
      away.d++; away.pts += 1; away.form.push('E')
    }
  }

  const entries = Array.from(teamMap.values())

  entries.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts
    if (b.gd !== a.gd) return b.gd - a.gd
    if (b.gf !== a.gf) return b.gf - a.gf
    return 0
  })

  let i = 0
  while (i < entries.length) {
    let j = i + 1
    while (
      j < entries.length &&
      entries[j].pts === entries[i].pts &&
      entries[j].gd === entries[i].gd &&
      entries[j].gf === entries[i].gf
    ) {
      j++
    }
    if (j - i > 1) {
      const cluster = entries.slice(i, j)
      const clusterIds = new Set(cluster.map(e => e.teamId))
      const miniMap = new Map<string, { pts: number; gd: number; gf: number }>()
      for (const e of cluster) miniMap.set(e.teamId, { pts: 0, gd: 0, gf: 0 })

      for (const match of groupMatches) {
        if (match.status !== 'finished') continue
        if (!clusterIds.has(match.homeId) || !clusterIds.has(match.awayId)) continue
        const h = miniMap.get(match.homeId)!
        const a = miniMap.get(match.awayId)!
        h.gf += match.homeScore; h.gd += match.homeScore - match.awayScore
        a.gf += match.awayScore; a.gd += match.awayScore - match.homeScore
        if (match.homeScore > match.awayScore) h.pts += 3
        else if (match.homeScore < match.awayScore) a.pts += 3
        else { h.pts += 1; a.pts += 1 }
      }

      cluster.sort((a, b) => {
        const ma = miniMap.get(a.teamId)!
        const mb = miniMap.get(b.teamId)!
        if (mb.pts !== ma.pts) return mb.pts - ma.pts
        if (mb.gd !== ma.gd) return mb.gd - ma.gd
        if (mb.gf !== ma.gf) return mb.gf - ma.gf
        return a.teamName.localeCompare(b.teamName)
      })

      for (let k = 0; k < cluster.length; k++) entries[i + k] = cluster[k]
    }
    i = j
  }

  return entries
}

export function getGroups(): string[] {
  const gs = new Set<string>()
  for (const m of matches) {
    if (m.group) gs.add(m.group)
  }
  return Array.from(gs).sort()
}
