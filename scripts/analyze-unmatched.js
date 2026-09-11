const fs = require('fs');
const path = require('path');

const TFI_DIR = path.resolve('C:/Users/MI PC/OneDrive/Desktop/TFI Programacion');
const TEAMS_FILE = path.resolve(__dirname, '../src/data/teams.ts');
const IMAGES_FILE = path.resolve(__dirname, '../src/data/player-images.ts');

// Load teams data
const teamsText = fs.readFileSync(TEAMS_FILE, 'utf8');
const players = [];
const playerRe = /\{\s*id:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"/g;
let m;
while ((m = playerRe.exec(teamsText)) !== null) {
  const id = m[1], name = m[2];
  if (!players.some(p => p.id === id)) players.push({ id, name });
}
console.log(`Players in teams.ts: ${players.length}`);

function normalize(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['´`.\-]/g, ' ').replace(/\s+/g, ' ').toLowerCase().trim();
}

// Create lookup: normalized name -> player
const playerByName = {};
for (const p of players) {
  const norm = normalize(p.name);
  playerByName[norm] = p;
  playerByName[norm.replace(/ /g, '')] = p;
}

// Load existing image map
const prevText = fs.readFileSync(IMAGES_FILE, 'utf8');
const imageMap = {};
const urlRegex = /"([^"]+)":\s*"([^"]+)"/g;
while ((m = urlRegex.exec(prevText)) !== null) {
  const id = m[1], url = m[2];
  if (id && url && !id.startsWith('//') && id !== 'playerImages' && id !== 'getPlayerImage') {
    imageMap[id] = url;
  }
}
console.log(`Existing images: ${Object.keys(imageMap).length}`);

// Collect all TFI files
const allTfiFiles = {};
const teamDirs = fs.readdirSync(TFI_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
for (const dir of teamDirs) {
  const dirPath = path.join(TFI_DIR, dir.name);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.avif'));
  for (const file of files) {
    allTfiFiles[file] = dir.name;
  }
}

console.log(`\nTotal TFI AVIF files: ${Object.keys(allTfiFiles).length}`);

// Find which ones are NOT in our image map
const matchedFiles = new Set();
for (const [id, url] of Object.entries(imageMap)) {
  if (url.startsWith('/players/')) {
    const filename = path.basename(url);
    matchedFiles.add(filename);
  }
}
console.log(`Matched files: ${matchedFiles.size}`);

// Categorize unmatched
const unmatchedByTeam = {};
const unmatchedWithoutTeam = [];

for (const [file, teamDir] of Object.entries(allTfiFiles)) {
  if (!matchedFiles.has(file)) {
    if (!unmatchedByTeam[teamDir]) unmatchedByTeam[teamDir] = [];
    unmatchedByTeam[teamDir].push(file);
  }
}

console.log(`\n=== UNMATCHED AVIF FILES BY TEAM ===`);
let totalUnmatched = 0;
for (const [team, files] of Object.entries(unmatchedByTeam).sort()) {
  console.log(`\n${team} (${files.length}):`);
  for (const f of files.sort()) {
    const base = f.replace(/\.avif$/, '');
    const namePart = base.split('_')[0];
    const parts = namePart.split('-');
    const first = parts.pop();
    const last = parts.join(' ');
    
    const v1 = normalize(`${first} ${last}`);
    const v2 = normalize(`${last} ${first}`);
    const v3 = normalize(namePart.replace(/-/g, ' '));
    const v4 = normalize(first);
    
    let match = playerByName[v1] || playerByName[v2] || playerByName[v3] || playerByName[v4];
    if (!match) {
      // try mononym (like DANILO)
      const normMono = normalize(last);
      match = playerByName[normMono];
    }
    
    if (match) {
      console.log(`  [MATCH] ${f} -> ${match.id} (${match.name})`);
    } else {
      console.log(`  [NO MATCH] ${f}`);
    }
    totalUnmatched++;
  }
}

console.log(`\nTotal unmatched: ${totalUnmatched}`);
