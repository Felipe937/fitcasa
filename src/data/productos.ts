import { Equipment } from '../types';

export interface ProductoAfiliado {
  id: string;
  nombre: string;
  categoria: Exclude<Equipment, 'ninguno'>;
  descripcionCorta: string;
  porQueEsUtil: string;
  ejerciciosRelacionados?: string[];
  urlAmazon?: string;
  asin?: string;
  recomendacionUso: string;
}

export const CATALOGO_EQUIPAMIENTO: ProductoAfiliado[] = [
  {
    id: 'colchoneta-movilidad',
    nombre: 'Colchoneta de ejercicio y movilidad (mínimo 10-15 mm)',
    categoria: 'colchoneta',
    descripcionCorta: 'Esterilla antideslizante de grosor adecuado para apoyar rodillas y columna.',
    porQueEsUtil: 'Amortigua el contacto con el suelo en posturas de cuadrupedia y decúbito, evitando molestias óseas.',
    recomendacionUso: 'Busca superficies densas que no deslicen y aíslen del frío.',
    ejerciciosRelacionados: ['e01', 'e02', 'e08', 'e10', 'e14', 'e16', 'e17', 'e18'],
    urlAmazon: undefined,
  },
  {
    id: 'bandas-resistencia',
    nombre: 'Set de bandas elásticas circulares (resistencia progresiva suave)',
    categoria: 'bandas',
    descripcionCorta: 'Bandas textiles o de látex para activar glúteos, cadera y cintura escapular.',
    porQueEsUtil: 'Permiten aplicar tensión gradual y controlada sin someter a la columna a impactos axiales bruscos.',
    recomendacionUso: 'Comienza siempre por la resistencia más baja para priorizar la alineación y el control motor.',
    ejerciciosRelacionados: ['e04', 'e06', 'e13', 'e20'],
    urlAmazon: undefined,
  },
  {
    id: 'mancuernas-ligeras',
    nombre: 'Mancuernas de peso ligero o pelotas de peso (0.5 a 2 kg)',
    categoria: 'peso',
    descripcionCorta: 'Cargas reducidas para estabilidad de hombros y fortalecimiento postural.',
    porQueEsUtil: 'Aportan resistencia externa suficiente para estimular musculatura dorsal sin sobrecargar la zona lumbar.',
    recomendacionUso: 'El peso no debe comprometer la fluidez de la respiración ni la postura.',
    ejerciciosRelacionados: ['e07', 'e11', 'e12', 'e15', 'e19'],
    urlAmazon: undefined,
  },
];

export function getProductosByCategoria(categoria: Exclude<Equipment, 'ninguno'>): ProductoAfiliado[] {
  return CATALOGO_EQUIPAMIENTO.filter((p) => p.categoria === categoria);
}

export function getProductoById(id: string): ProductoAfiliado | undefined {
  return CATALOGO_EQUIPAMIENTO.find((p) => p.id === id);
}

export function getProductosByEjercicioId(ejercicioId: string): ProductoAfiliado[] {
  return CATALOGO_EQUIPAMIENTO.filter((p) => p.ejerciciosRelacionados?.includes(ejercicioId));
}

// Selección editorial curada para la página #apoya (URLs pendientes de verificación)
export const PRODUCTOS_APOYA: ProductoAfiliado[] = [
  {
    id: 'fit-simplify-loop-bands',
    nombre: 'Fit Simplify Resistance Loop Bands Set of 5',
    categoria: 'bandas',
    descripcionCorta: 'Set de cinco bandas elásticas de resistencia progresiva para activar glúteos, cadera y cintura escapular.',
    porQueEsUtil: 'Permite aplicar tensión gradual y controlada sin someter a la columna a impactos axiales bruscos.',
    recomendacionUso: 'Comienza siempre por la resistencia más baja para priorizar la alineación y el control motor.',
    asin: 'B01AVDVHTI',
    urlAmazon: 'https://www.amazon.com/-/es/Fit-Simplify-Resistencia-Instrucciones-Transporte/dp/B01AVDVHTI?__mk_es_US=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1S6L3BM1PVNKQ&dib=eyJ2IjoiMSJ9.nHuR0uUzYevl5yc-IPq7CPfUYpFkENio1bk-YD-2PWDVji2YK0wbDe1WO2zITtcsNU0CNuw-Ll_BdE48Habm8ZhFjCMNHE1-1SV6MjS_-4X6JCp-YfL2geYXL0aDz6AdKQxHemcRe2w62qMR551W3-OtPd22VLLQz9MjYqSyljP6Cqvax1px9olXlvE1vzmJJIi42Xl6ehylHkLVQ6ZmteVgVUqAJiwUyG1eUjXsp0uQrHUrIdcLXm2ylsMgU_M9MDvHG7h7O34FLBH3Zd82T34W0s6NwYoMfIEgfuZowhg.PucaWyEb2DFWavouFMiUujSpBqPIi3aWClzRGQ7tRnI&dib_tag=se&keywords=Fit+Simplify+Resistance+Loop+Bands+Set+of+5&nsdOptOutParam=true&qid=1792504315&sprefix=%2Caps%2C178&sr=8-1&linkCode=ll2&tag=yisusrecomien-20&linkId=c086d668c04fb80649e0018d4dda069d&language=es_US&gaOptInStatus=true&ref_=as_li_ss_tl',
  },
  {
    id: 'gaiam-essentials-yoga-mat',
    nombre: 'Gaiam Essentials Yoga Mat 6mm',
    categoria: 'colchoneta',
    descripcionCorta: 'Esterilla de 6 mm con superficie texturizada antideslizante para amortiguar el contacto con el suelo.',
    porQueEsUtil: 'Amortigua el contacto con el suelo en posturas de cuadrupedia y decúbito, evitando molestias óseas.',
    recomendacionUso: 'Busca superficies densas que no deslicen y aíslen del frío.',
    asin: 'B07H9PZ6MH',
    urlAmazon: 'https://www.amazon.com/-/es/Gaiam-Essentials-Amortiguaci%C3%B3n-antideslizante-texturizada/dp/B07H9PZ6MH?__mk_es_US=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1FSDR33DJHCDX&dib=eyJ2IjoiMSJ9.NIKEGZcyZhiDhvG-5D1Uu48DQeLSanKJ1yOUf0m9fr_jGC47NTxu8_i774Pe0XJqei8OPPfzsH924LtqcHG4FJTW_CB6pSsdODapLghGv9hgJwmz2jOs3K4pwyTAUO4RTwPNC005L4IZfeRL8lQOHjl2SqULzSe1WlIjCFS4FpgWq8sPV79GoeTdnICJBq63q-HnLnBE4pkN_fJLt33gDIJXqzwQ0ezLhEw150-rspUPjnGhyOG7_PL6RP0FrdK8S9L7CIGu1VF4IZ2K7yutjg.dGOKs1gGZYWsRRc4q_NR9GhD2TC8Ssc7FDTH9fYs9bs&dib_tag=se&keywords=Gaiam+Essentials+Yoga+Mat+6mm&qid=1792504351&sprefix=gaiam+essentials+yoga+mat+6mm%2Caps%2C221&sr=8-1&linkCode=ll2&tag=yisusrecomien-20&linkId=4f101e31f25367aab8be55dbcad815f1&language=es_US&gaOptInStatus=true&ref_=as_li_ss_tl',
  },
  {
    id: 'triggerpoint-grid-foam-roller',
    nombre: 'TriggerPoint GRID 1.0 Foam Roller',
    categoria: 'peso',
    descripcionCorta: 'Rodillo de espuma de densidad firme para liberación miofascial y movilidad torácica.',
    porQueEsUtil: 'Aporta resistencia externa suficiente para estimular musculatura dorsal sin sobrecargar la zona lumbar.',
    recomendacionUso: 'El peso no debe comprometer la fluidez de la respiración ni la postura.',
    asin: 'B006GUC9KC',
    urlAmazon: 'https://www.amazon.com/-/es/Rodillo-TriggerPoint-pulgadas-instructivos-garantizado/dp/B006GUC9KC?__mk_es_US=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=ZGZWEDRG5ROW&dib=eyJ2IjoiMSJ9.jO9OofcgPsJ_w-J7HkCjg1VweUi9VnQx_nymeEiEH37FBeMzFbdDSemv4ekBYhO8Ee-6TJ81qn2DzUoINt50PV9rAX8eni31wEYurEfZB_2idoi0IU4gk-CI0jzZMQouFzi0yGIhPi7WvAT3UCfvQrfB-WYvXTbeA1ZPJkMwZsRQZfBfr3psmUkGXEnMgAZKlRKGCqgPeOiB5GrOvlGXqaoKPbVRcsGMSTO4jiq6bA-OlUI9DnbELkbZzaPscYs6U03SPPqCx5uL6LRDiNZ3Q-BGFOBa6y2tvt8z1Gps7d8.66kqKYs3LO9W2z23w4eW_Q1D-VDJbWc5qhjcJjPonuw&dib_tag=se&keywords=TriggerPoint+GRID+Foam+Roller&qid=1792504389&sprefix=triggerpoint+grid+foam+roller%2Caps%2C200&sr=8-2&linkCode=ll2&tag=yisusrecomien-20&linkId=bb3a22e303c7108d59a3db1465d9e7d8&language=es_US&gaOptInStatus=true&ref_=as_li_ss_tl',
  },
  {
    id: 'gaiam-yoga-block-strap',
    nombre: 'Gaiam Yoga Block and Strap Combo',
    categoria: 'peso',
    descripcionCorta: 'Bloque de yoga y correa para apoyar la alineación y ampliar el alcance en posturas de movilidad.',
    porQueEsUtil: 'Aporta soporte estable para mantener la alineación sin forzar el rango de movimiento.',
    recomendacionUso: 'Utilízalo como apoyo, no como sustituto de la valoración profesional.',
    asin: 'B075W5FNJX',
    urlAmazon: 'https://www.amazon.com/-/es/Gaiam-05-62961/dp/B075W5FNJX?__mk_es_US=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=IEK6XDFMIFTC&dib=eyJ2IjoiMSJ9.0aD-8HIAlLtj1KFG9x08s7635UyuTTLTEYgSchF8DR3GjHj071QN20LucGBJIEps.uVVlel_ep7OCfeuRPe6gTJlBGJ4VaYeFIN0ShKmJcpk&dib_tag=se&keywords=Gaiam+Yoga+Block+%26+Strap+Combo&qid=1792504436&sprefix=gaiam+yoga+block+%26+strap+combo%2Caps%2C200&sr=8-1&linkCode=ll2&tag=yisusrecomien-20&linkId=184dd9ae11a9cbde25e1837051d52e80&language=es_US&gaOptInStatus=true&ref_=as_li_ss_tl',
  },
];