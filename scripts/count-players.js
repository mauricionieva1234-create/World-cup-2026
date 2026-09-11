const fs = require('fs');
const text = fs.readFileSync('C:/worldcup-2026/src/data/teams.ts', 'utf8');
const teams = text.match(/id:\s*"[a-z]+"[\s\S]*?players:\s*\[/g);
const players = text.match(/id:\s*"[a-z]+"[\s\S]*?name:\s*"[^"]+"/g);
console.log(`Teams: ${teams ? teams.length : 0}`);
console.log(`Players: ${players ? players.length : 0}`);
