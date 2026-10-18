import { Equipment } from '../types';

export interface ProductoAfiliado {
  id: string;
  nombre: string;
  categoria: Exclude<Equipment, 'ninguno'>;
  descripcionCorta: string;
  porQueEsUtil: string;
  ejerciciosRelacionados?: string[];
  urlAmazon?: string;
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
    urlAmazon: undefined,
  },
  {
    id: 'bandas-resistencia',
    nombre: 'Set de bandas elásticas circulares (resistencia progresiva suave)',
    categoria: 'bandas',
    descripcionCorta: 'Bandas textiles o de látex para activar glúteos, cadera y cintura escapular.',
    porQueEsUtil: 'Permiten aplicar tensión gradual y controlada sin someter a la columna a impactos axiales bruscos.',
    recomendacionUso: 'Comienza siempre por la resistencia más baja para priorizar la alineación y el control motor.',
    urlAmazon: undefined,
  },
  {
    id: 'mancuernas-ligeras',
    nombre: 'Mancuernas de peso ligero o pelotas de peso (0.5 a 2 kg)',
    categoria: 'peso',
    descripcionCorta: 'Cargas reducidas para estabilidad de hombros y fortalecimiento postural.',
    porQueEsUtil: 'Aportan resistencia externa suficiente para estimular musculatura dorsal sin sobrecargar la zona lumbar.',
    recomendacionUso: 'El peso no debe comprometer la fluidez de la respiración ni la postura.',
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