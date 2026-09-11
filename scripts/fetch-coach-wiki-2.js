const https = require('https');
const fs = require('fs');

const notFound = [
  ['qatar', 'Julen Lopetegui'],
  ['bosnia', 'Sergej Barbarez'],
  ['morocco', 'Mohamed Ouahbi'],
  ['scotland', 'Steve Clarke'],
  ['haiti', 'Sébastien Migné'],
  ['paraguay', 'Gustavo Alfaro'],
  ['australia', 'Tony Popovic'],
  ['turkiye', 'Vincenzo Montella'],
  ['ecuador', 'Sebastián Beccacece'],
  ['ivorycoast', 'Emerse Faé'],
  ['curacao', 'Dick Advocaat'],
  ['tunisia', 'Jalel Kadri'],
  ['sweden', 'Jon Dahl Tomasson'],
  ['capeverde', 'Bubista'],
  ['iraq', 'Jesús Casas'],
  ['jordan', 'Hussein Ammouta'],
  ['uzbekistan', 'Srečko Katanec'],
  ['drcongo', 'Héctor Cúper'],
  ['panama', 'Thomas Christiansen'],
  ['ghana', 'Otto Addo'],
];

function wikiFetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'WorldCup2026Bot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

async function searchAlt(coachName) {
  const searches = [
    coachName,
    coachName.replace(/[éèêë]/g, 'e').replace(/[íìîï]/g, 'i').replace(/[óòôö]/g, 'o').replace(/[úùûü]/g, 'u').replace(/[ñ]/g, 'n'),
    coachName + ' manager',
    coachName + ' football',
  ];
  
  for (const s of [...new Set(searches)]) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(s)}&format=json&srlimit=5&srprop=title`;
    try {
      const data = await wikiFetch(url);
      for (const p of (data?.query?.search || [])) {
        const title = p.title;
        const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&format=json&pithumbsize=400`;
        const imgData = await wikiFetch(imgUrl);
        const page = Object.values(imgData?.query?.pages || {})[0];
        if (page?.thumbnail?.source) return { title, url: page.thumbnail.source };
      }
    } catch(e) {}
    await new Promise(r => setTimeout(r, 200));
  }
  
  // Try Wikidata
  const wdUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(coachName)}&language=en&format=json&limit=3`;
  try {
    const wdData = await wikiFetch(wdUrl);
    for (const r of (wdData?.search || [])) {
      const wdId = r.id;
      const claimsUrl = `https://www.wikidata.org/wiki/Special:EntityData/${wdId}.json`;
      const claimsData = await wikiFetch(claimsUrl);
      const entity = claimsData?.entities?.[wdId];
      if (entity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value) {
        const filename = entity.claims.P18[0].mainsnak.datavalue.value;
        const commonsUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=400`;
        return { title: filename, url: commonsUrl };
      }
    }
  } catch(e) {}
  
  return null;
}

(async () => {
  console.log('=== Second pass: alternative searches ===\n');
  let found = 0;
  
  for (const [teamId, name] of notFound) {
    const result = await searchAlt(name);
    if (result) {
      console.log(`  OK ${teamId.padEnd(15)} ${name.padEnd(30)} ${result.url.split('/').pop()}`);
      found++;
    } else {
      console.log(`  -- ${teamId.padEnd(15)} ${name} (not found)`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log(`\nFound ${found}/${notFound.length} in second pass`);
})();
