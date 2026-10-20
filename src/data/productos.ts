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
    urlAmazon: 'https://www.amazon.com/-/es/Fit-Simplify-Resistencia-Instrucciones-Transporte/dp/B01AVDVHTI?tag=yisusrecomien-20',
  },
  {
    id: 'gaiam-essentials-yoga-mat',
    nombre: 'Gaiam Essentials Yoga Mat 6mm',
    categoria: 'colchoneta',
    descripcionCorta: 'Esterilla de 6 mm con superficie texturizada antideslizante para amortiguar el contacto con el suelo.',
    porQueEsUtil: 'Amortigua el contacto con el suelo en posturas de cuadrupedia y decúbito, evitando molestias óseas.',
    recomendacionUso: 'Busca superficies densas que no deslicen y aíslen del frío.',
    asin: 'B07H9PZ6MH',
    urlAmazon: 'https://www.amazon.com/-/es/Gaiam-Essentials-Amortiguaci%C3%B3n-antideslizante-texturizada/dp/B07H9PZ6MH?tag=yisusrecomien-20',
  },
  {
    id: 'triggerpoint-grid-foam-roller',
    nombre: 'TriggerPoint GRID 1.0 Foam Roller',
    categoria: 'peso',
    descripcionCorta: 'Rodillo de espuma de densidad firme para liberación miofascial y movilidad torácica.',
    porQueEsUtil: 'Aporta resistencia externa suficiente para estimular musculatura dorsal sin sobrecargar la zona lumbar.',
    recomendacionUso: 'El peso no debe comprometer la fluidez de la respiración ni la postura.',
    asin: 'B006GUC9KC',
    urlAmazon: 'https://www.amazon.com/-/es/Rodillo-TriggerPoint-pulgadas-instructivos-garantizado/dp/B006GUC9KC?tag=yisusrecomien-20',
  },
  {
    id: 'gaiam-yoga-block-strap',
    nombre: 'Gaiam Yoga Block and Strap Combo',
    categoria: 'peso',
    descripcionCorta: 'Bloque de yoga y correa para apoyar la alineación y ampliar el alcance en posturas de movilidad.',
    porQueEsUtil: 'Aporta soporte estable para mantener la alineación sin forzar el rango de movimiento.',
    recomendacionUso: 'Utilízalo como apoyo, no como sustituto de la valoración profesional.',
    asin: 'B075W5FNJX',
    urlAmazon: 'https://www.amazon.com/-/es/Gaiam-05-62961/dp/B075W5FNJX?tag=yisusrecomien-20',
  },
];