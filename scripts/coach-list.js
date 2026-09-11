const fs = require('fs');
const text = fs.readFileSync('C:/worldcup-2026/src/data/teams.ts', 'utf8');

const teams = [];
const lines = text.split('\n');
for (let i = 0; i < lines.length; i++) {
  const idm = lines[i].match(/^\s*id:\s*"([^"]+)",?\s*$/);
  if (idm) {
    const teamId = idm[1];
    // find the coach line (within same object block)
    for (let j = i; j < Math.min(i + 30, lines.length); j++) {
      const cm = lines[j].match(/coach:\s*\{\s*name:\s*"([^"]+)"\s*,\s*nationality:\s*"([^"]+)"\s*,\s*since:\s*"([^"]+)"\s*,\s*photo:\s*"([^"]+)"/);
      if (cm) {
        // find name on next line above
        let teamName = teamId;
        for (let k = i; k >= Math.max(0, i - 5); k--) {
          const nm = lines[k].match(/^\s*name:\s*"([^"]+)"/);
          if (nm) { teamName = nm[1]; break; }
        }
        teams.push({ id: teamId, name: teamName, coach: cm[1], nationality: cm[2], since: cm[3], photo: cm[4] });
        break;
      }
    }
  }
}

console.log(`=== TODOS LOS COACHES (${teams.length}) ===\n`);
const sinFoto = teams.filter(t => !t.photo);
const conFoto = teams.filter(t => t.photo);

console.log(`Con foto: ${conFoto.length}`);
for (const t of conFoto) console.log(`  ${t.id}: ${t.coach} -> ${t.photo}`);

console.log(`\nSin foto: ${sinFoto.length}\n`);
let count = 0;
// Suggest Wikipedia URLs using common patterns
for (const t of sinFoto) {
  count++;
  const nameEnc = encodeURIComponent(t.coach);
  console.log(`  ${t.name} (${t.id}): ${t.coach}`);
}
