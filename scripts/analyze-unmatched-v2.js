const fs = require('fs');
const path = require('path');

const TFI_DIR = path.resolve('C:/Users/MI PC/OneDrive/Desktop/TFI Programacion');
const PUBLIC_DIR = path.resolve(__dirname, '../public/players');
const TEAMS_FILE = path.resolve(__dirname, '../src/data/teams.ts');

const teamsText = fs.readFileSync(TEAMS_FILE, 'utf8');
const players = [];
const playerRe = /\{\s*id:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"/g;
let m;
while ((m = playerRe.exec(teamsText)) !== null) {
  if (!players.some(p => p.id === m[1])) players.push({ id: m[1], name: m[2] });
}

function norm(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['´`.\-]/g,' ').replace(/\s+/g,' ').toLowerCase().trim();
}
function normDe(s) {
  return norm(s).replace(/ue/g,'u').replace(/ae/g,'a').replace(/oe/g,'o');
}

const pbn = {};
for (const p of players) {
  const n = norm(p.name);
  pbn[n] = p;
  pbn[normDe(p.name)] = p;
  const w = n.split(' ');
  if (w.length>=2) { pbn[w.slice(-1).concat(w.slice(0,-1)).join(' ')] = p; const w2 = normDe(p.name).split(' '); pbn[w2.slice(-1).concat(w2.slice(0,-1)).join(' ')] = p; }
}

const localFiles = new Set(fs.readdirSync(PUBLIC_DIR).filter(f => f.endsWith('.avif')));
const tfiFiles = [];
for (const d of fs.readdirSync(TFI_DIR, {withFileTypes:true}).filter(d=>d.isDirectory())) {
  for (const f of fs.readdirSync(path.join(TFI_DIR,d.name)).filter(f=>f.endsWith('.avif'))) {
    tfiFiles.push({file:f, team:d.name});
  }
}

console.log(`Players: ${players.length}, TFI: ${tfiFiles.length}, Local: ${localFiles.size}\n`);

const newMatches = [], unmatched = [];
for (const {file, team} of tfiFiles) {
  const namePart = file.split('_')[0];
  const parts = namePart.split('-');
  const first = parts.pop();
  const last = parts.join(' ');
  const vs = [...new Set([
    norm(`${first} ${last}`), norm(`${last} ${first}`), norm(namePart.replace(/-/g,' ')),
    norm(first), norm(last),
    normDe(`${first} ${last}`), normDe(`${last} ${first}`), normDe(namePart.replace(/-/g,' ')), normDe(last)
  ])];
  let found = null;
  for (const v of vs) { if (pbn[v]) { found = pbn[v]; break; } }
  if (found) {
    if (!localFiles.has(`${found.id}.avif`)) newMatches.push({file,team,pid:found.id,pname:found.name});
  } else {
    unmatched.push({file,team});
  }
}

console.log(`=== NEW MATCHES (${newMatches.length}) ===`);
for (const nm of newMatches) {
  console.log(`  ${nm.file} -> ${nm.pid} (${nm.pname}) from ${nm.team}`);
}

console.log(`\n=== UNMATCHED (${unmatched.length}) ===`);
const byTeam = {};
for (const u of unmatched) { if (!byTeam[u.team]) byTeam[u.team]=[]; byTeam[u.team].push(u.file); }
for (const [team, files] of Object.entries(byTeam).sort()) {
  console.log(`\n${team} (${files.length}):`);
  for (const f of files.sort()) console.log(`  ${f}`);
}
