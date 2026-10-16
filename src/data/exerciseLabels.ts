import { Duration, Difficulty, ExerciseCategory } from '../types';

/**
 * Etiquetas en espanol de los atributos de un ejercicio.
 *
 * Viven aqui para que la ficha que muestra la portada y la de la biblioteca
 * digan exactamente lo mismo: duplicar estos mapas invita a que una tarjeta y
 * otra se contradigan. Los valores son los que ya renderizaba la biblioteca.
 */

export const durationLabels: Record<Duration, string> = {
  corta: '≤10 min',
  media: '10–20 min',
  larga: '>20 min',
};

export const difficultyLabels: Record<Difficulty, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

export const equipmentLabels: Record<string, string> = {
  ninguno: 'Sin equipamiento',
  bandas: 'Bandas elásticas',
  peso: 'Pesas/Mancuernas',
  colchoneta: 'Colchoneta',
};

export const zoneLabels: Record<string, string> = {
  piernas: 'Piernas',
  glúteos: 'Glúteos',
  cadera: 'Cadera',
  aductores: 'Aductores',
  core: 'Core',
  lumbar: 'Zona lumbar',
  torax: 'Tórax',
  hombros: 'Hombros',
};

export const categoryLabels: Record<ExerciseCategory, string> = {
  actividad_general: 'Actividad física general',
  cuidado_postural: 'Cuidado postural y movilidad',
  psse_supervisado: 'Específico supervisado (PSSE)',
};
