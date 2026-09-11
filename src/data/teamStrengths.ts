export interface TeamStrength {
  name: string
  strength: number
  label: string
}

export const teamStrengths: Record<string, number> = {
  argentina: 0.105,
  australia: 0.002,
  austria: 0.005,
  belgium: 0.025,
  bosnia: 0.003,
  brazil: 0.10,
  canada: 0.003,
  capeverde: 0.001,
  colombia: 0.008,
  croatia: 0.015,
  curacao: 0.001,
  czechia: 0.004,
  drcongo: 0.002,
  ecuador: 0.005,
  egypt: 0.004,
  england: 0.125,
  france: 0.155,
  germany: 0.07,
  ghana: 0.003,
  haiti: 0.001,
  iran: 0.002,
  iraq: 0.002,
  ivorycoast: 0.005,
  japan: 0.01,
  jordan: 0.001,
  mexico: 0.008,
  morocco: 0.01,
  netherlands: 0.03,
  newzealand: 0.001,
  norway: 0.005,
  panama: 0.002,
  paraguay: 0.003,
  portugal: 0.065,
  qatar: 0.001,
  saudiarabia: 0.002,
  scotland: 0.003,
  senegal: 0.01,
  southafrica: 0.003,
  southkorea: 0.006,
  spain: 0.17,
  sweden: 0.005,
  switzerland: 0.01,
  tunisia: 0.003,
  turkiye: 0.004,
  uruguay: 0.015,
  usa: 0.006,
  uzbekistan: 0.001,
  algeria: 0.004,
}

function poissonRandom(lambda: number): number {
  const L = Math.exp(-lambda)
  let k = 0
  let p = 1
  do {
    k++
    p *= Math.random()
  } while (p > L)
  return k - 1
}

export function simulateMatch(homeId: string, awayId: string): { home: number; away: number } {
  const homeStr = teamStrengths[homeId] ?? 0.001
  const awayStr = teamStrengths[awayId] ?? 0.001
  const total = homeStr + awayStr

  const baseGoals = 2.5
  const homeAdvantage = 1.15
  const expectedHome = baseGoals * (homeStr / total) * homeAdvantage
  const expectedAway = baseGoals * (awayStr / total)

  return {
    home: poissonRandom(expectedHome),
    away: poissonRandom(expectedAway),
  }
}
