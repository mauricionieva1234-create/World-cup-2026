const https = require('https');

function wikiFetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'WorldCup2026Bot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

const remaining = [
  ['qatar', ['Julen Lopetegui', 'Lopetegui']],
  ['bosnia', ['Sergej Barbarez', 'Barbarez']],
  ['morocco', ['Walid Regragui', 'Regragui']],
  ['scotland', ['Steve Clarke', 'Steve Clarke football']],
  ['haiti', ['Sébastien Migné', 'Sebastien Migne']],
  ['paraguay', ['Gustavo Alfaro', 'Gustavo Alfaro football']],
  ['australia', ['Tony Popovic', 'Tony Popovic football']],
  ['turkiye', ['Vincenzo Montella', 'Montella']],
  ['ecuador', ['Sebastián Beccacece', 'Sebastian Beccacece']],
  ['ivorycoast', ['Emerse Faé', 'Emerse Fae']],
  ['curacao', ['Dick Advocaat', 'Advocaat']],
  ['uzbekistan', ['Srečko Katanec', 'Srecko Katanec']],
  ['drcongo', ['Héctor Cúper', 'Hector Cuper']],
  ['panama', ['Thomas Christiansen', 'Thomas Christiansen football']],
  ['ghana', ['Otto Addo', 'Otto Addo football']],
];

async function getImage(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&format=json&pithumbsize=400`;
  const data = await wikiFetch(url);
  const page = Object.values(data?.query?.pages || {})[0];
  return page?.thumbnail?.source || null;
}

(async () => {
  console.log('=== Third pass: direct Wikipedia titles ===\n');
  
  for (const [teamId, names] of remaining) {
    let found = null;
    for (const n of names) {
      const url = await getImage(n);
      if (url) { found = url; break; }
      await new Promise(r => setTimeout(r, 300));
    }
    if (found) {
      console.log(`  OK ${teamId.padEnd(15)} ${names[0].padEnd(30)} ${found.split('/').pop()}`);
    } else {
      // Try Commons direct
      const commonsName = names[0].replace(/[éèêë]/g,'e').replace(/[íìîï]/g,'i').replace(/[óòôö]/g,'o').replace(/[úùûü]/g,'u').replace(/[ñ]/g,'n').replace(/ /g,'_');
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(commonsName)}&format=json&srlimit=5`;
      try {
        const cd = await wikiFetch(commonsUrl);
        for (const p of (cd?.query?.search || [])) {
          if (p.title.includes(commonsName.replace(/_/g,' '))) {
            const imgUrl = `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&titles=${encodeURIComponent(p.title)}&format=json&iiprop=url`;
            const imgData = await wikiFetch(imgUrl);
            const page = Object.values(imgData?.query?.pages || {})[0];
            if (page?.imageinfo?.[0]?.url) { found = page.imageinfo[0].url; break; }
          }
        }
      } catch(e) {}
      
      if (found) {
        console.log(`  OK ${teamId.padEnd(15)} ${names[0].padEnd(30)} (from commons)`);
      } else {
        console.log(`  -- ${teamId.padEnd(15)} ${names[0]}`);
      }
    }
    await new Promise(r => setTimeout(r, 500));
  }
})();
