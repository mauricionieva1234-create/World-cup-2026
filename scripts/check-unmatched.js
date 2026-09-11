const fs = require('fs');
const text = fs.readFileSync('C:/worldcup-2026/src/data/teams.ts', 'utf8');

const players = [];
const re = /\{\s*id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"/g;
let m;
while ((m = re.exec(text)) !== null) {
  players.push({ id: m[1], name: m[2] });
}

const names = [
  ['Enzo Fernandez', 'Enzo Fernández'],
  ['Ousmane Dembele', 'Ousmane Dembélé'],
  ['Jules Kounde', 'Jules Koundé'],
  ['Cristian Romero'],
  ['Ferran Torres'],
  ['Ngolo Kante', "N'Golo Kanté"],
  ['Harry Kane'],
  ['Marcus Rashford'],
  ['Reece James'],
  ['Eberechi Eze'],
  ['Marcos Senesi'],
  ['Deiver Machado'],
  ['Davinson Sanchez', 'Davinson Sánchez'],
];

for (const [fifaName, ...alts] of names) {
  const allNames = [fifaName, ...alts];
  let found = null;
  for (const n of allNames) {
    const norm = n.toLowerCase().replace(/['´`]/g, '');
    found = players.find(p => p.name.toLowerCase().includes(norm) || norm.includes(p.name.toLowerCase()));
    if (found) break;
  }
  console.log(`${fifaName}: ${found ? found.id + ' (' + found.name + ')' : 'NOT FOUND in teams.ts'}`);
}
