// Maps team ID to coach image URL
export const coachImages: Record<string, string | undefined> = {
  "argentina": "https://upload.wikimedia.org/wikipedia/commons/9/95/Lionel_Scaloni_2023_%28cropped%29.jpg",
  "france": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Didier_Deschamps.jpg",
  "england": "https://upload.wikimedia.org/wikipedia/commons/5/54/Gareth_Southgate.jpg",
  "germany": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Julian_Nagelsmann_2023_%28cropped%29.jpg",
  "netherlands": "https://upload.wikimedia.org/wikipedia/commons/6/60/Ronald_Koeman_2021.jpg",
  "portugal": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Roberto_Mart%C3%ADnez_2018.jpg",
  "belgium": "https://upload.wikimedia.org/wikipedia/commons/2/29/Domenico_Tedesco_2023.jpg",
  "croatia": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Zlatko_Dali%C4%87_2018.jpg",
  "spain": "https://upload.wikimedia.org/wikipedia/commons/3/3f/Luis_de_la_Fuente_2023_%28cropped%29.jpg",
  "uruguay": "https://upload.wikimedia.org/wikipedia/commons/9/90/Marcelo_Bielsa_2020.jpg",
  "usa": "https://upload.wikimedia.org/wikipedia/commons/4/48/Mauricio_Pochettino_2018.jpg",
  "colombia": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Reinaldo_Rueda_2014.jpg",
  "japan": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Hajime_Moriyasu_2019.jpg",
  "senegal": "https://upload.wikimedia.org/wikipedia/commons/a/a6/Aliou_Ciss%C3%A9_2018.jpg",
  "norway": "https://upload.wikimedia.org/wikipedia/commons/2/2c/St%C3%A5le_Solbakken_2014.jpg",
  "austria": "https://upload.wikimedia.org/wikipedia/commons/e/e7/Ralf_Rangnick_2022.jpg",
  "algeria": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Djamel_Belmadi_2019.jpg",
  // New additions - batch 1
  "southkorea": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Kim_Do-hoon_13990928000200637438936196291499.jpg/500px-Kim_Do-hoon_13990928000200637438936196291499.jpg",
  "southafrica": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Hugo_Broos_1.jpg",
  "czechia": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/FC_Viktoria_Plze%C5%88_-_Czech_League_title_celebration_May_2015_-_05.jpg/500px-FC_Viktoria_Plze%C5%88_-_Czech_League_title_celebration_May_2015_-_05.jpg",
  "canada": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Jesse_Marsch_2024.jpg",
  "switzerland": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Spartak-Zrvena_%283%29.jpg/500px-Spartak-Zrvena_%283%29.jpg",
  "iran": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Amir_Ghalenoei_14021114000776638425776058160814_23579.jpg/500px-Amir_Ghalenoei_14021114000776638425776058160814_23579.jpg",
  "egypt": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Hossam_Hassan.png",
  "newzealand": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Darren_Bazeley_%2830_March%29.jpg/500px-Darren_Bazeley_%2830_March%29.jpg",
  "saudiarabia": "https://upload.wikimedia.org/wikipedia/commons/d/d0/Roberto_Mancini_Saudi_Arabia-South_Korea_match_2023_AFC_Asian_Cup.jpg",
  // New additions - batch 2
  "qatar": "https://upload.wikimedia.org/wikipedia/commons/e/ed/Julen_Lopetegui.jpg",
  "turkiye": "https://upload.wikimedia.org/wikipedia/commons/2/2b/Vincenzo_Montella_ICC_2016_%28edited%29.jpg",
  "curacao": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Dick_Advocaat.jpg",
  "scotland": "https://upload.wikimedia.org/wikipedia/commons/6/60/Steve_Clarke_2019.jpg",
  "paraguay": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Gustavo_Alfaro_%282022%29_%28cropped%29.jpg",
  "australia": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Tony_Popovic-2010-08-03.jpg",
  "drcongo": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Cuper_Hector.jpg",
  // Batch 3 - from Wikidata
  "tunisia": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Jalel_Kadri_%28cropped%29.jpg",
  "sweden": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Dahl_Thomasson_2021_%28cropped%29.jpg/500px-Dahl_Thomasson_2021_%28cropped%29.jpg",
  "capeverde": "https://upload.wikimedia.org/wikipedia/commons/5/55/C.J._dos_Santos_%28cropped_2%29.jpg",
  "iraq": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Jesus_Casas_2.jpg",
  "jordan": "https://upload.wikimedia.org/wikipedia/commons/8/86/Hussein_Amotta.jpg",
  "ecuador": "https://upload.wikimedia.org/wikipedia/commons/8/87/Sebasti%C3%A1n_Beccacece_-_Russia_2018.jpg",
  "ivorycoast": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Emerse_Fa%C3%A9_Jumbo_%28cropped%29.jpg",
  // Batch 4 - remaining coaches
  "brazil": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Carlo_ancelotti.jpg",
  "mexico": "https://upload.wikimedia.org/wikipedia/commons/b/b4/Javier_Aguirre.png",
  "panama": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Partido_Galicia_-_Panam%C3%A1_en_Bala%C3%ADdos_149.jpg",
  "bosnia": "https://upload.wikimedia.org/wikipedia/commons/1/29/Sergej_Barbarez_04_%28cropped%29.jpg",
  "uzbekistan": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Sre%C4%8Dko_Katanec_2015_%28cropped%29.jpg",
  "ghana": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Otto_Addo_%E2%80%93_Tag_der_Legenden_2016_01.jpg",
  "morocco": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Mohamed_Ouahbi_vs_Paraguay.jpg",
  "haiti": "/coaches/haiti.webp",
};

export function getCoachImage(teamId: string): string | undefined {
  const url = coachImages[teamId];
  if (url === null) return undefined;
  return url;
}
