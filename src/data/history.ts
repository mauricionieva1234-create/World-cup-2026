export interface WorldCupChampion {
  year: number;
  champion: string;
  championFlag: string;
  runnerUp: string;
  runnerUpFlag: string;
  score: string;
  host: string;
  hostFlag: string;
}

export interface TopScorer {
  player: string;
  country: string;
  flag: string;
  goals: number;
  worldCups: string;
  position: string;
  photo: string;
}

export interface TopAssist {
  player: string;
  country: string;
  flag: string;
  assists: number;
  worldCups: string;
  position: string;
  photo: string;
}

export interface Legend {
  name: string;
  country: string;
  flag: string;
  photo: string;
  achievements: string[];
  stats: string[];
  worldCupsPlayed: number;
  position: string;
}

export const worldCupChampions: WorldCupChampion[] = [
  { year: 1930, champion: "Uruguay", championFlag: "🇺🇾", runnerUp: "Argentina", runnerUpFlag: "🇦🇷", score: "4-2", host: "Uruguay", hostFlag: "🇺🇾" },
  { year: 1934, champion: "Italia", championFlag: "🇮🇹", runnerUp: "Checoslovaquia", runnerUpFlag: "🇨🇿", score: "2-1", host: "Italia", hostFlag: "🇮🇹" },
  { year: 1938, champion: "Italia", championFlag: "🇮🇹", runnerUp: "Hungría", runnerUpFlag: "🇭🇺", score: "4-2", host: "Francia", hostFlag: "🇫🇷" },
  { year: 1950, champion: "Uruguay", championFlag: "🇺🇾", runnerUp: "Brasil", runnerUpFlag: "🇧🇷", score: "2-1", host: "Brasil", hostFlag: "🇧🇷" },
  { year: 1954, champion: "Alemania", championFlag: "🇩🇪", runnerUp: "Hungría", runnerUpFlag: "🇭🇺", score: "3-2", host: "Suiza", hostFlag: "🇨🇭" },
  { year: 1958, champion: "Brasil", championFlag: "🇧🇷", runnerUp: "Suecia", runnerUpFlag: "🇸🇪", score: "5-2", host: "Suecia", hostFlag: "🇸🇪" },
  { year: 1962, champion: "Brasil", championFlag: "🇧🇷", runnerUp: "Checoslovaquia", runnerUpFlag: "🇨🇿", score: "3-1", host: "Chile", hostFlag: "🇨🇱" },
  { year: 1966, champion: "Inglaterra", championFlag: "ING", runnerUp: "Alemania", runnerUpFlag: "🇩🇪", score: "4-2", host: "Inglaterra", hostFlag: "ING" },
  { year: 1970, champion: "Brasil", championFlag: "🇧🇷", runnerUp: "Italia", runnerUpFlag: "🇮🇹", score: "4-1", host: "México", hostFlag: "🇲🇽" },
  { year: 1974, champion: "Alemania", championFlag: "🇩🇪", runnerUp: "Países Bajos", runnerUpFlag: "🇳🇱", score: "2-1", host: "Alemania", hostFlag: "🇩🇪" },
  { year: 1978, champion: "Argentina", championFlag: "🇦🇷", runnerUp: "Países Bajos", runnerUpFlag: "🇳🇱", score: "3-1", host: "Argentina", hostFlag: "🇦🇷" },
  { year: 1982, champion: "Italia", championFlag: "🇮🇹", runnerUp: "Alemania", runnerUpFlag: "🇩🇪", score: "3-1", host: "España", hostFlag: "🇪🇸" },
  { year: 1986, champion: "Argentina", championFlag: "🇦🇷", runnerUp: "Alemania", runnerUpFlag: "🇩🇪", score: "3-2", host: "México", hostFlag: "🇲🇽" },
  { year: 1990, champion: "Alemania", championFlag: "🇩🇪", runnerUp: "Argentina", runnerUpFlag: "🇦🇷", score: "1-0", host: "Italia", hostFlag: "🇮🇹" },
  { year: 1994, champion: "Brasil", championFlag: "🇧🇷", runnerUp: "Italia", runnerUpFlag: "🇮🇹", score: "0-0 (3-2 pen)", host: "Estados Unidos", hostFlag: "🇺🇸" },
  { year: 1998, champion: "Francia", championFlag: "🇫🇷", runnerUp: "Brasil", runnerUpFlag: "🇧🇷", score: "3-0", host: "Francia", hostFlag: "🇫🇷" },
  { year: 2002, champion: "Brasil", championFlag: "🇧🇷", runnerUp: "Alemania", runnerUpFlag: "🇩🇪", score: "2-0", host: "Corea/Japón", hostFlag: "🇰🇷🇯🇵" },
  { year: 2006, champion: "Italia", championFlag: "🇮🇹", runnerUp: "Francia", runnerUpFlag: "🇫🇷", score: "1-1 (5-3 pen)", host: "Alemania", hostFlag: "🇩🇪" },
  { year: 2010, champion: "España", championFlag: "🇪🇸", runnerUp: "Países Bajos", runnerUpFlag: "🇳🇱", score: "1-0", host: "Sudáfrica", hostFlag: "🇿🇦" },
  { year: 2014, champion: "Alemania", championFlag: "🇩🇪", runnerUp: "Argentina", runnerUpFlag: "🇦🇷", score: "1-0", host: "Brasil", hostFlag: "🇧🇷" },
  { year: 2018, champion: "Francia", championFlag: "🇫🇷", runnerUp: "Croacia", runnerUpFlag: "🇭🇷", score: "4-2", host: "Rusia", hostFlag: "🇷🇺" },
  { year: 2022, champion: "Argentina", championFlag: "🇦🇷", runnerUp: "Francia", runnerUpFlag: "🇫🇷", score: "3-3 (4-2 pen)", host: "Catar", hostFlag: "🇶🇦" },
];

export const topScorers: TopScorer[] = [
  { player: "Lionel Messi", country: "Argentina", flag: "🇦🇷", goals: 18, worldCups: "2006, 2010, 2014, 2018, 2022", position: "Delantero", photo: "/images/players/Lionel Messi.jpg" },
  { player: "Miroslav Klose", country: "Alemania", flag: "🇩🇪", goals: 16, worldCups: "2002, 2006, 2010, 2014", position: "Delantero", photo: "/images/players/Klose.jpg" },
  { player: "Kylian Mbappé", country: "Francia", flag: "🇫🇷", goals: 16, worldCups: "2018, 2022", position: "Delantero", photo: "/images/players/Mbappe.jpg" },
  { player: "Ronaldo Nazário", country: "Brasil", flag: "🇧🇷", goals: 15, worldCups: "1994, 1998, 2002, 2006", position: "Delantero", photo: "/images/players/Ronaldo Nazario.jpg" },
  { player: "Gerd Müller", country: "Alemania", flag: "🇩🇪", goals: 14, worldCups: "1970, 1974", position: "Delantero", photo: "/images/players/Muller.jpg" },
  { player: "Just Fontaine", country: "Francia", flag: "🇫🇷", goals: 13, worldCups: "1958", position: "Delantero", photo: "/images/players/Just Fontaine.jpeg" },
  { player: "Pelé", country: "Brasil", flag: "🇧🇷", goals: 12, worldCups: "1958, 1962, 1966, 1970", position: "Delantero", photo: "/images/players/Pele.webp" },
  { player: "Sándor Kocsis", country: "Hungría", flag: "🇭🇺", goals: 11, worldCups: "1954", position: "Delantero", photo: "/images/players/Sándor Kocsis.jpg" },
  { player: "Jürgen Klinsmann", country: "Alemania", flag: "🇩🇪", goals: 11, worldCups: "1990, 1994, 1998", position: "Delantero", photo: "/images/players/Jürgen Klinsmann.jpg" },
  { player: "Thomas Müller", country: "Alemania", flag: "🇩🇪", goals: 10, worldCups: "2010, 2014, 2018, 2022", position: "Delantero", photo: "/images/players/Thomas Müller.webp" },
  { player: "Gabriel Batistuta", country: "Argentina", flag: "🇦🇷", goals: 10, worldCups: "1994, 1998, 2002", position: "Delantero", photo: "/images/players/Gabriel Batistuta.jpg" },
  { player: "Gary Lineker", country: "Inglaterra", flag: "ING", goals: 10, worldCups: "1986, 1990", position: "Delantero", photo: "/images/players/Gary Lineker.png" },
  { player: "Teófilo Cubillas", country: "Perú", flag: "🇵🇪", goals: 10, worldCups: "1970, 1978, 1982", position: "Mediocampista", photo: "/images/players/Teófilo Cubillas.jpg" },
  { player: "Helmut Rahn", country: "Alemania", flag: "🇩🇪", goals: 10, worldCups: "1954, 1958", position: "Delantero", photo: "/images/players/Helmut Rahn.jpg" },
  { player: "Cristiano Ronaldo", country: "Portugal", flag: "🇵🇹", goals: 10, worldCups: "2006, 2010, 2014, 2018, 2022", position: "Delantero", photo: "/images/players/Cristiano Ronaldo.webp" },
  { player: "Harry Kane", country: "Inglaterra", flag: "ING", goals: 10, worldCups: "2018, 2022", position: "Delantero", photo: "/images/players/Harry Kane.jpg" },
];

export const topAssists: TopAssist[] = [
  { player: "Lionel Messi", country: "Argentina", flag: "🇦🇷", assists: 8, worldCups: "2006, 2010, 2014, 2018, 2022", position: "Delantero", photo: "/images/players/Lionel Messi.jpg" },
  { player: "Pelé", country: "Brasil", flag: "🇧🇷", assists: 7, worldCups: "1958, 1962, 1966, 1970", position: "Delantero", photo: "/images/players/Pele.webp" },
  { player: "Diego Maradona", country: "Argentina", flag: "🇦🇷", assists: 8, worldCups: "1982, 1986, 1990, 1994", position: "Mediocampista", photo: "/images/players/Diego Maradona.jpg" },
  { player: "Thomas Müller", country: "Alemania", flag: "🇩🇪", assists: 5, worldCups: "2010, 2014, 2018, 2022", position: "Delantero", photo: "/images/players/Thomas Müller.webp" },
  { player: "James Rodríguez", country: "Colombia", flag: "🇨🇴", assists: 5, worldCups: "2014, 2018", position: "Mediocampista", photo: "/images/players/James Rodríguez.jpg" },
  { player: "David Beckham", country: "Inglaterra", flag: "ING", assists: 5, worldCups: "1998, 2002, 2006", position: "Mediocampista", photo: "/images/players/David Beckham.webp" },
  { player: "Xavi Hernández", country: "España", flag: "🇪🇸", assists: 4, worldCups: "2002, 2006, 2010, 2014", position: "Mediocampista", photo: "/images/players/Xavi Hernández.jpg" },
  { player: "Bastian Schweinsteiger", country: "Alemania", flag: "🇩🇪", assists: 4, worldCups: "2006, 2010, 2014, 2016", position: "Mediocampista", photo: "/images/players/Bastian Schweinsteiger.jpg" },
  { player: "Miroslav Klose", country: "Alemania", flag: "🇩🇪", assists: 4, worldCups: "2002, 2006, 2010, 2014", position: "Delantero", photo: "/images/players/Klose.jpg" },
  { player: "Wesley Sneijder", country: "Países Bajos", flag: "🇳🇱", assists: 4, worldCups: "2006, 2010, 2014", position: "Mediocampista", photo: "/images/players/Wesley Sneijder.jpg" },
];

export const legends: Legend[] = [
  {
    name: "Pelé",
    country: "Brasil",
    flag: "🇧🇷",
    photo: "/images/players/Pele.webp",
    achievements: ["3x Campeón del Mundo (1958, 1962, 1970)", "Máximo goleador de la historia de Brasil", "1283 goles en su carrera"],
    stats: ["12 goles en Mundiales", "77 goles con Brasil", "3 Mundiales ganados"],
    worldCupsPlayed: 4,
    position: "Delantero"
  },
  {
    name: "Diego Maradona",
    country: "Argentina",
    flag: "🇦🇷",
    photo: "/images/players/Diego Maradona.jpg",
    achievements: ["Campeón del Mundo 1986", "Subcampeón 1990", "Considerado el mejor jugador de su época"],
    stats: ["8 goles en Mundiales", "34 goles con Argentina", "1 Mundial ganado"],
    worldCupsPlayed: 4,
    position: "Mediocampista"
  },
  {
    name: "Lionel Messi",
    country: "Argentina",
    flag: "🇦🇷",
    photo: "/images/players/Lionel Messi.jpg",
    achievements: ["Campeón del Mundo 2022", "8 Balones de Oro", "Máximo goleador de La Liga y Barcelona"],
    stats: ["18 goles en Mundiales", "109 goles con Argentina", "1 Mundial ganado"],
    worldCupsPlayed: 6,
    position: "Delantero"
  },
  {
    name: "Cristiano Ronaldo",
    country: "Portugal",
    flag: "🇵🇹",
    photo: "/images/players/Cristiano Ronaldo.webp",
    achievements: ["Campeón Eurocopa 2016", "5 Balones de Oro", "Máximo goleador histórico del fútbol"],
    stats: ["8 goles en Mundiales", "135 goles con Portugal", "Máximo goleador histórico"],
    worldCupsPlayed: 6,
    position: "Delantero"
  },
  {
    name: "Zinedine Zidane",
    country: "Francia",
    flag: "🇫🇷",
    photo: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg",
    achievements: ["Campeón del Mundo 1998", "Campeón Eurocopa 2000", "Balón de Oro 1998"],
    stats: ["5 goles en Mundiales", "31 goles con Francia", "1 Mundial ganado"],
    worldCupsPlayed: 3,
    position: "Mediocampista"
  },
  {
    name: "Ronaldo Nazário",
    country: "Brasil",
    flag: "🇧🇷",
    photo: "/images/players/Ronaldo Nazario.jpg",
    achievements: ["2x Campeón del Mundo (1994, 2002)", "2 Balones de Oro", "Máximo goleador de Mundiales (2002)"],
    stats: ["15 goles en Mundiales", "62 goles con Brasil", "2 Mundiales ganados"],
    worldCupsPlayed: 4,
    position: "Delantero"
  }
];

const countryFlagCodes: Record<string, string> = {
  Uruguay: "uy",
  Italia: "it",
  Francia: "fr",
  Brasil: "br",
  Alemania: "de",
  Argentina: "ar",
  Inglaterra: "gb",
  España: "es",
  Hungría: "hu",
  Perú: "pe",
  Portugal: "pt",
  Colombia: "co",
  "Países Bajos": "nl",
}

export function getCountryFlagUrl(country: string): string {
  const code = countryFlagCodes[country]
  return code ? `https://flagcdn.com/${code}.svg` : ""
}

export function getChampionsByCountry(): { country: string; flag: string; flagUrl: string; count: number; years: number[] }[] {
  const championMap = new Map<string, { flag: string; flagUrl: string; count: number; years: number[] }>();
  for (const c of worldCupChampions) {
    const existing = championMap.get(c.champion);
    if (existing) {
      existing.count++;
      existing.years.push(c.year);
    } else {
      championMap.set(c.champion, { flag: c.championFlag, flagUrl: getCountryFlagUrl(c.champion), count: 1, years: [c.year] });
    }
  }
  return Array.from(championMap.entries()).map(([country, data]) => ({
    country, ...data
  })).sort((a, b) => b.count - a.count);
}
