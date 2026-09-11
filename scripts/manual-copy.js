const fs = require('fs');
const path = require('path');

const text = fs.readFileSync('C:/worldcup-2026/src/data/teams.ts', 'utf8');
const localFiles = new Set(fs.readdirSync('C:/worldcup-2026/public/players'));

// Extract teams with their players
const teams = {};
let currentTeamId = '', currentTeamName = '';
const lines = text.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idm = line.match(/^\s*id:\s*"([^"]+)",?\s*$/);
  if (idm) { currentTeamId = idm[1]; currentTeamName = ''; continue; }
  const nm = line.match(/^\s*name:\s*"([^"]+)",?\s*$/);
  if (nm && currentTeamId && !currentTeamName) {
    currentTeamName = nm[1];
    if (!teams[currentTeamId]) teams[currentTeamId] = { name: currentTeamName, players: {} };
    continue;
  }
  const pm = line.match(/\{\s*id:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"/);
  if (pm && currentTeamId) {
    if (!teams[currentTeamId]) teams[currentTeamId] = { name: currentTeamName, players: {} };
    teams[currentTeamId].players[pm[1]] = pm[2];
  }
}

const tfiMap = {
  'ALEMANIA': { id: 'germany', players: {} },
  'BRASIL': { id: 'brazil', players: {} },
  'COLOMBIA': { id: 'colombia', players: {} },
  'ESPAÑA': { id: 'spain', players: {} },
  'FRANCIA': { id: 'france', players: {} },
  'INGLATERRA': { id: 'england', players: {} },
  'MEXICO': { id: 'mexico', players: {} },
  'PORTUGAL': { id: 'portugal', players: {} },
  'URUGUAY': { id: 'uruguay', players: {} },
  'USA': { id: 'usa', players: {} },
  'argentina': { id: 'argentina', players: {} },
  'canada': { id: 'canada', players: {} },
};

const TFI_DIR = 'C:/Users/MI PC/OneDrive/Desktop/TFI Programacion';
for (const d of fs.readdirSync(TFI_DIR, {withFileTypes:true}).filter(d=>d.isDirectory())) {
  for (const f of fs.readdirSync(path.join(TFI_DIR,d.name)).filter(f=>f.endsWith('.avif'))) {
    if (tfiMap[d.name]) tfiMap[d.name].players[f.split('_')[0]] = f;
  }
}

// Manual: TFI namePart -> playerId
const manual = {
  // ALEMANIA
  'RUEDIGER-Antonio': 'rudiger',
  'BAUMANN-Oliver': 'baumann',
  'BEIER-Maximilian': 'beier',
  'GORETZKA-Leon': 'goretzka',
  'HAVERTZ-Kai': 'havertz',
  'KIMMICH-Joshua': 'kimmich',
  'MUSIALA-Jamal': 'musiala',
  'NEUER-Manuel': 'neuer',
  'RAUM-David': 'rauum',
  'SANE-Leroy': 'sane',
  'SCHLOTTERBECK-Nico': 'schlotterbeck',
  'TAH-Jonathan': 'tah',
  'WIRTZ-Florian': 'wirtz',
  // BRASIL
  'VINICIUS-JUNIOR': 'vinicius',
  // COLOMBIA
  'ARIAS-Jhon': null, 'ARIAS-Santiago': null,
  'CAMPAZ-Leandro': null, 'CARRASCAL-Jorge': 'carrascal',
  'CASTANO-Kevin': null, 'CORDOBA-Jhon': null,
  'DIAZ-Luis': 'diaz', 'DITTA-Willer': null,
  'GOMEZ-Andres': null, 'HERNANDEZ-Cucho': null,
  'LERMA-Jefferson': 'lerma', 'LUCUMI-Jhon': null,
  'MACHADO-Deiver': null, 'MINA-Yerry': 'machado',
  'MOJICA-Johan': null, 'MONTERO-Alvaro': null,
  'MUNOZ-Daniel': 'munoz', 'OSPINA-David': 'ospina',
  'PORTILLA-Juan': null, 'PUERTA-Gustavo': null,
  'QUINTERO-Juan': null, 'RIOS-Richard': null,
  'RODRIGUEZ-James': 'rodriguez', 'SANCHEZ-Davinson': null,
  'SUAREZ-Luis': 'suarez', 'VARGAS-Camilo': 'vargas',
  // ESPAÑA
  'WILLIAMS-Nico': 'williams',
  'CARVAJAL-Dani': 'carvajal',
  'ASENSIO-Marco': 'asensio',
  'REMIRO-Alex': 'remiro',
  // FRANCIA
  'DEMBELE-Ousmane': 'dembele',
  'KONATE-Ibrahima': 'konate',
  'THURAM-Marcus': 'nta',
  // INGLATERRA
  'KANE-Harry': 'kane',
  // MEXICO - all already matched
  // PORTUGAL
  'BERNARDO-SILVA': 'silva',
  'BRUNO-FERNANDES': null,
  'DIOGO-COSTA': null,
  'GONCALO-RAMOS': null,
  'MATHEUS-NUNES': null,
  'NELSON-SEMEDO': null,
  'NUNO-MENDES': null,
  'RENATO-VEIGA': null,
  'RUBEN-NEVES': null,
  'RUI-SILVA': null,
  'SAMU-COSTA': null,
  'TOMAS-ARAUJO': null,
  'FRANCISCO-CONCEICAO': null,
  'GONCALO-GUEDES': null,
  // URUGUAY
  'PIQUEREZ-Joaquin': 'piquerez',
  'CACERES-Sebastian': 'caceres',
  'RODRIGUEZ-Brian': null,
  'SANABRIA-Juan-Manuel': null,
  // USA
  // ARGENTINA
  'GONZALEZ-Nico': 'gonzalez',
  // CANADA - all matched
};

console.log('=== NEW MAPPINGS TO ADD ===\n');
const PK_DIR = 'C:/worldcup-2026/public/players';

for (const [folder, tfi] of Object.entries(tfiMap)) {
  const team = teams[tfi.id];
  if (!team) { console.log(`${tfi.id}: TEAM NOT FOUND`); continue; }
  
  for (const [namePart, file] of Object.entries(tfi.players)) {
    const destFile = `${namePart}.avif`;
    let playerId = null;

    if (manual[namePart] !== undefined) {
      playerId = manual[namePart];
    }
    
    if (!playerId) continue;
    if (!team.players[playerId]) {
      console.log(`  SKIP: ${namePart} -> ${playerId} NOT IN ${tfi.id} squad (${team.name})`);
      continue;
    }
    
    const targetFile = `${playerId}.avif`;
    if (!localFiles.has(targetFile)) {
      const src = path.join(TFI_DIR, folder, file);
      const dst = path.join(PK_DIR, targetFile);
      fs.copyFileSync(src, dst);
      console.log(`  COPIED: ${src.split('TFI Programacion\\')[1]} -> ${targetFile} (${team.players[playerId]})`);
    }
  }
}

console.log('\nDone!');
