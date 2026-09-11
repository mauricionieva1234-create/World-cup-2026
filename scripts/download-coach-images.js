const fs = require('fs');
const https = require('https');
const path = require('path');
const http = require('http');

const COACHES_DIR = path.resolve(__dirname, '../public/coaches');
const DATA_FILE = path.resolve(__dirname, '../src/data/coach-images.ts');

if (!fs.existsSync(COACHES_DIR)) fs.mkdirSync(COACHES_DIR, { recursive: true });

// Parse URLs from coach-images.ts
const text = fs.readFileSync(DATA_FILE, 'utf8');
const urlRe = /"([^"]+)":\s*"([^"]+)"/g;
const images = [];
let m;
while ((m = urlRe.exec(text)) !== null) {
  const teamId = m[1], url = m[2];
  if (teamId && url && !teamId.startsWith('/') && teamId !== 'coachImages' && teamId !== 'getCoachImage') {
    images.push({ teamId, url });
  }
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${response.statusCode} for ${url}`));
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

(async () => {
  let ok = 0, fail = 0;
  for (const { teamId, url } of images) {
    const ext = url.split('.').pop().split('?')[0] || 'jpg';
    const dest = path.join(COACHES_DIR, `${teamId}.jpg`);
    if (fs.existsSync(dest)) { ok++; continue; }
    try {
      await download(url, dest);
      console.log(`  OK ${teamId}: ${url.split('/').pop()}`);
      ok++;
    } catch (e) {
      console.log(`  FAIL ${teamId}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\nDone: ${ok} OK, ${fail} failed`);
})();
