export interface Stadium {
  id: string;
  name: string;
  location: string;
  capacity: number;
  year: number;
  image: string;
  history: string;
  owner: string;
  ownerType: "MLS" | "NFL" | "Otro";
  events: string[];
  lat: number;
  lng: number;
}

export const stadiums: Stadium[] = [
  {
    id: "azteca",
    name: "Estadio Azteca",
    location: "Ciudad de México, México",
    capacity: 87523,
    year: 1966,
    image: "/images/stadiums/azteca.jpg",
    history: "El Estadio Azteca es uno de los estadios más emblemáticos del mundo. Ha sido sede de dos finales de Copa del Mundo (1970 y 1986).",
    owner: "Club América",
    ownerType: "Otro",
    events: ["Final Mundial 1970", "Final Mundial 1986", "Mundial 2026"],
    lat: 19.303,
    lng: -99.150
  },
  {
    id: "metlife",
    name: "MetLife Stadium",
    location: "East Rutherford, Nueva Jersey, EE. UU.",
    capacity: 82500,
    year: 2010,
    image: "/images/stadiums/metlife.jpg",
    history: "El MetLife Stadium es el estadio más grande de la NFL. Será sede de la Final del Mundial 2026.",
    owner: "New York Giants / New York Jets",
    ownerType: "NFL",
    events: ["Final Mundial 2026", "Super Bowl XLVIII", "Copa América 2024"],
    lat: 40.813,
    lng: -74.074
  },
  {
    id: "sofi",
    name: "SoFi Stadium",
    location: "Inglewood, California, EE. UU.",
    capacity: 70240,
    year: 2020,
    image: "/images/stadiums/sofi.jpg",
    history: "Estadio de última generación con techo translúcido. Sede de los Rams y Chargers de la NFL.",
    owner: "Los Angeles Rams / Los Angeles Chargers",
    ownerType: "NFL",
    events: ["Super Bowl LVI", "Mundial 2026"],
    lat: 33.953,
    lng: -118.339
  },
  {
    id: "att",
    name: "AT&T Stadium",
    location: "Arlington, Texas, EE. UU.",
    capacity: 80000,
    year: 2009,
    image: "/images/stadiums/att.jpg",
    history: "Conocido como 'Jerry World', es uno de los estadios más modernos del mundo con una pantalla de video gigante.",
    owner: "Dallas Cowboys",
    ownerType: "NFL",
    events: ["Super Bowl XLV", "Mundial 2026"],
    lat: 32.747,
    lng: -97.093
  },
  {
    id: "rosebowl",
    name: "Rose Bowl",
    location: "Pasadena, California, EE. UU.",
    capacity: 92542,
    year: 1922,
    image: "/images/stadiums/rosebowl.jpg",
    history: "El Rose Bowl es un estadio histórico. Fue sede de la Final de la Copa del Mundo 1994 y del Mundial Femenino 1999.",
    owner: "City of Pasadena",
    ownerType: "Otro",
    events: ["Final Mundial 1994", "Final Mundial Femenino 1999", "Mundial 2026"],
    lat: 34.161,
    lng: -118.168
  },
  {
    id: "mercedesbenz",
    name: "Estadio Mercedes-Benz",
    location: "Atlanta, Georgia, EE. UU.",
    capacity: 71000,
    year: 2017,
    image: "/images/stadiums/mercedesbenz.jpg",
    history: "Estadio multipropósito con techo retráctil en forma de pétalo. Casa de los Falcons y Atlanta United.",
    owner: "Atlanta Falcons",
    ownerType: "NFL",
    events: ["Super Bowl LIII", "Mundial 2026"],
    lat: 33.755,
    lng: -84.401
  },
  {
    id: "nrg",
    name: "Estadio NRG",
    location: "Houston, Texas, EE. UU.",
    capacity: 72220,
    year: 2002,
    image: "/images/stadiums/nrg.jpg",
    history: "Estadio con techo retráctil, sede de los Houston Texans.",
    owner: "Houston Texans",
    ownerType: "NFL",
    events: ["Super Bowl LI", "Mundial 2026"],
    lat: 29.685,
    lng: -95.411
  },
  {
    id: "bbva",
    name: "Estadio BBVA",
    location: "Houston, Texas, EE. UU.",
    capacity: 22039,
    year: 2012,
    image: "/images/stadiums/bbva.jpg",
    history: "Estadio boutique de los Houston Dynamo de la MLS.",
    owner: "Houston Dynamo",
    ownerType: "MLS",
    events: ["Mundial 2026"],
    lat: 29.752,
    lng: -95.352
  },
  {
    id: "bcplace",
    name: "BC Place",
    location: "Vancouver, Columbia Británica, Canadá",
    capacity: 54500,
    year: 1983,
    image: "/images/stadiums/bcplace.jpg",
    history: "Estadio con techo retráctil, sede de los BC Lions y Vancouver Whitecaps.",
    owner: "BC Pavilion Corporation",
    ownerType: "MLS",
    events: ["Juegos Olímpicos 2010", "Mundial Femenino 2015", "Mundial 2026"],
    lat: 49.276,
    lng: -123.112
  },
  {
    id: "akron",
    name: "Estadio Akron",
    location: "Zapopan, Jalisco, México",
    capacity: 46355,
    year: 2010,
    image: "/images/stadiums/akron.jpg",
    history: "Estadio de las Chivas Rayadas del Guadalajara.",
    owner: "Club Deportivo Guadalajara",
    ownerType: "Otro",
    events: ["Mundial 2026"],
    lat: 20.683,
    lng: -103.463
  },
  {
    id: "levis",
    name: "Estadio Levi's",
    location: "Santa Clara, California, EE. UU.",
    capacity: 68500,
    year: 2014,
    image: "/images/stadiums/levis.jpg",
    history: "Estadio de los San Francisco 49ers. Sede de Super Bowl 50.",
    owner: "San Francisco 49ers",
    ownerType: "NFL",
    events: ["Super Bowl 50", "Mundial 2026"],
    lat: 37.403,
    lng: -121.970
  }
];
