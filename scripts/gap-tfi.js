const fs = require('fs');

const text = fs.readFileSync('C:/worldcup-2026/src/data/teams.ts', 'utf8');
const localFiles = new Set(fs.readdirSync('C:/worldcup-2026/public/players').filter(f=>f.endsWith('.avif')).map(f=>f.replace('.avif','')));

function normalize(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['´`.\-]/g,' ').replace(/\s+/g,' ').toLowerCase().trim();
}

// Extract teams and their players
const teams = {};
let currentTeam = null;
const lines = text.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idm = line.match(/^\s*id:\s*"([^"]+)",\s*$/);
  if (idm) {
    currentTeam = idm[1];
    teams[currentTeam] = { name: '', players: [] };
    // name is on next line
    const nm = lines[i+1]?.match(/name:\s*"([^"]+)"/);
    if (nm) teams[currentTeam].name = nm[1];
  }
  const pm = line.match(/\{\s*id:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"/);
  if (pm && currentTeam) {
    teams[currentTeam].players.push({ id: pm[1], name: pm[2] });
  }
}

// TFI folders to team IDs
const tfiMap = {
  'ALEMANIA': 'germany',
  'BRASIL': 'brazil',
  'COLOMBIA': 'colombia',
  'ESPAÑA': 'spain',
  'FRANCIA': 'france',
  'INGLATERRA': 'england',
  'MEXICO': 'mexico',
  'PORTUGAL': 'portugal',
  'URUGUAY': 'uruguay',
  'USA': 'usa',
  'argentina': 'argentina',
  'canada': 'canada',
};

// Get TFI files by team
const path = require('path');
const TFI_DIR = path.resolve('C:/Users/MI PC/OneDrive/Desktop/TFI Programacion');
const tfiFiles = {};
for (const d of fs.readdirSync(TFI_DIR, {withFileTypes:true}).filter(d=>d.isDirectory())) {
  tfiFiles[d.name] = fs.readdirSync(path.join(TFI_DIR,d.name)).filter(f=>f.endsWith('.avif'));
}

console.log('=== PLAYERS WITHOUT LOCAL IMAGE IN TFI TEAMS ===\n');

for (const [folder, teamId] of Object.entries(tfiMap)) {
  const team = teams[teamId];
  if (!team) { console.log(`${teamId}: NOT FOUND in teams.ts\n`); continue; }
  
  const sinFoto = team.players.filter(p => !localFiles.has(p.id));
  const tfiCount = (tfiFiles[folder] || []).length;
  
  console.log(`${team.name} (${teamId}): ${team.players.length - sinFoto.length}/${team.players.length} con foto | ${tfiCount} archivos TFI`);
  
  if (sinFoto.length > 0) {
    console.log('  Sin foto local:');
    for (const p of sinFoto) {
      // Check if there's a TFI file that might match
      const tfiMatch = (tfiFiles[folder] || []).filter(f => {
        const namePart = f.split('_')[0].toLowerCase();
        const pNorm = normalize(p.name);
        return namePart.includes(normalize(p.id)) || namePart.includes(normalize(p.name).split(' ').pop()) || pNorm.split(' ').some(w => namePart.includes(w));
      });
      console.log(`    ${p.id} (${p.name})${tfiMatch.length ? ` ← ${tfiMatch.map(f=>f.split('_')[0]).join(', ')}` : ' [no TFI match]'}`);
    }
  }
  console.log('');
}
