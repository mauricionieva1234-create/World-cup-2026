const fs = require('fs');
const path = require('path');

const text = fs.readFileSync('C:/worldcup-2026/src/data/teams.ts', 'utf8');
const players = [];
const re = /\{\s*id:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"\s*,\s*number:\s*(\d+)/g;
let m;
while ((m = re.exec(text)) !== null) players.push({ id: m[1], name: m[2], number: parseInt(m[3]) });

const localFiles = new Set(fs.readdirSync('C:/worldcup-2026/public/players').filter(f=>f.endsWith('.avif')).map(f=>f.replace('.avif','')));

const sinFoto = players.filter(p => !localFiles.has(p.id));
console.log(`Total jugadores: ${players.length}`);
console.log(`Con foto local: ${players.length - sinFoto.length}`);
console.log(`Sin foto local: ${sinFoto.length}\n`);

for (const p of sinFoto) console.log(`${p.id}\t${p.name}`);
