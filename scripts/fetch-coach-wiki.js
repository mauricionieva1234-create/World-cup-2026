const https = require('https');
const fs = require('fs');

const text = fs.readFileSync('C:/worldcup-2026/src/data/teams.ts', 'utf8');
const lines = text.split('\n');

// Extract all coaches with their team IDs
const coaches = [];
for (let i = 0; i < lines.length; i++) {
  const idm = lines[i].match(/^\s*id:\s*"([^"]+)",?\s*$/);
  if (idm) {
    const teamId = idm[1];
    let teamName = teamId;
    for (let k = Math.max(0, i-3); k < i; k++) {
      const nm = lines[k].match(/^\s*name:\s*"([^"]+)",?\s*$/);
      if (nm) { teamName = nm[1]; break; }
    }
    // Find coach within next 30 lines
    for (let j = i; j < Math.min(i + 30, lines.length); j++) {
      const cm = lines[j].match(/coach:\s*\{\s*name:\s*"([^"]+)"\s*,\s*nationality:\s*"([^"]+)"\s*,\s*since:\s*"([^"]+)"\s*,\s*photo:\s*"([^"]*)"/);
      if (cm) {
        coaches.push({ teamId, teamName, name: cm[1], nationality: cm[2] });
        break;
      }
      // Handle multi-line coach: {
      if (lines[j].match(/coach:\s*\{/) && !lines[j].match(/name:/)) {
        for (let k = j + 1; k < Math.min(j + 10, lines.length); k++) {
          const cm2 = lines[k].match(/name:\s*"([^"]+)"\s*,\s*nationality:\s*"([^"]+)"\s*,\s*since:\s*"([^"]+)"\s*,\s*photo:\s*"([^"]*)"/);
          if (cm2) {
            coaches.push({ teamId, teamName, name: cm2[1], nationality: cm2[2] });
            break;
          }
        }
        break;
      }
    }
  }
}

// Also find team name from the name line after id
const teamNames = {};
for (let i = 0; i < lines.length; i++) {
  const idm = lines[i].match(/^\s*id:\s*"([^"]+)",?\s*$/);
  const nm = lines[i+1]?.match(/^\s*name:\s*"([^"]+)",?\s*$/);
  if (idm && nm) teamNames[idm[1]] = nm[1];
}

for (const c of coaches) {
  if (teamNames[c.teamId]) c.teamName = teamNames[c.teamId];
}

console.log(`Found ${coaches.length} coaches\n`);

// Load existing images
const dataText = fs.readFileSync('C:/worldcup-2026/src/data/coach-images.ts', 'utf8');
const existing = {};
const re = /"([^"]+)":\s*"([^"]+)"/g;
let m;
while ((m = re.exec(dataText)) !== null) {
  if (m[1] && m[2] && !m[1].startsWith('/') && m[1] !== 'coachImages' && m[1] !== 'getCoachImage') {
    existing[m[1]] = m[2];
  }
}

const missing = coaches.filter(c => !existing[c.teamId]);
console.log(`Missing: ${missing.length}\n`);
for (const c of missing) {
  console.log(`  ${c.teamId.padEnd(15)} ${c.name.padEnd(25)} ${c.teamName}`);
}

// Search Wikipedia for each missing coach
function wikiFetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'WorldCup2026Bot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function searchCoachImage(coachName) {
  // Step 1: Search for the page
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(coachName + ' football manager')}&format=json&srlimit=3`;
  try {
    const searchData = await wikiFetch(searchUrl);
    const pages = searchData?.query?.search || [];
    if (pages.length === 0) return null;
    
    // Step 2: Get image for the first result
    const title = encodeURIComponent(pages[0].title);
    const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${title}&format=json&pithumbsize=400`;
    const imgData = await wikiFetch(imgUrl);
    const pages2 = imgData?.query?.pages || {};
    const page = Object.values(pages2)[0];
    return page?.thumbnail?.source || null;
  } catch (e) {
    return null;
  }
}

(async () => {
  console.log('\n=== Searching Wikipedia for each coach ===\n');
  const results = {};
  
  for (const c of missing) {
    const url = await searchCoachImage(c.name);
    if (url) {
      console.log(`  OK ${c.teamId.padEnd(15)} ${c.name.padEnd(30)} ${url.split('/').pop()}`);
      results[c.teamId] = url;
    } else {
      console.log(`  -- ${c.teamId.padEnd(15)} ${c.name} (not found)`);
    }
    // Small delay to be polite to Wikipedia
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n=== Found ${Object.keys(results).length}/${missing.length} ===\n`);
  for (const [id, url] of Object.entries(results)) {
    console.log(`  "${id}": "${url}",`);
  }
})();
