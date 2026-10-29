/**
 * Manifiesto de vídeos de demostración.
 *
 * Convención de nombres: cada archivo en `public/videos/` se llama `eNN.mp4`,
 * donde `eNN` es el identificador exacto del ejercicio en EXERCISES_DATA.
 *
 * Excepción registrada: el clip de Bird-Dog llegó como `bird dog ejercicio.mp4`,
 * que no cumple la convención, y se asoció manualmente a `e08`. Consta aquí para
 * que la asignación sea auditable y no parezca automática.
 *
 * Si un ejercicio no tiene entrada con `hasVideo: true`, su tarjeta muestra el
 * estado «Demostración próximamente» y no monta ningún elemento <video>, de
 * modo que la carga inicial no descarga ni un byte de vídeo.
 */
export interface ExerciseVideoAsset {
  id: string;
  hasVideo: boolean;
  src?: string;
  poster?: string;
  durationText?: string;
}

const pendiente = (id: string): ExerciseVideoAsset => ({ id, hasVideo: false });

export const EXERCISE_VIDEOS: Record<string, ExerciseVideoAsset> = {
  e01: pendiente('e01'),
  e02: pendiente('e02'),
  e03: pendiente('e03'),
  e04: {
    id: 'e04',
    hasVideo: true,
    src: '/videos/e04.mp4',
    poster: '/posters/e04.svg',
    durationText: 'Clip corto',
  },
  e05: pendiente('e05'),
  e06: pendiente('e06'),
  e07: pendiente('e07'),
  e08: {
    id: 'e08',
    hasVideo: true,
    src: '/videos/e08.mp4',
    poster: '/posters/e08.svg',
    durationText: 'Clip corto',
  },
  e09: {
    id: 'e09',
    hasVideo: true,
    src: '/videos/e09.mp4',
    poster: '/posters/e09.svg',
    durationText: 'Clip corto',
  },
  e10: pendiente('e10'),
  e11: pendiente('e11'),
  e12: {
    id: 'e12',
    hasVideo: true,
    src: '/videos/e12.mp4',
    poster: '/posters/e12.svg',
    durationText: 'Clip corto',
  },
  e13: {
    id: 'e13',
    hasVideo: true,
    src: '/videos/e13.mp4',
    poster: '/posters/e13.svg',
    durationText: 'Clip corto',
  },
  e14: {
    id: 'e14',
    hasVideo: true,
    src: '/videos/e14.mp4',
    poster: '/posters/e14.svg',
    durationText: 'Clip corto',
  },
  e15: pendiente('e15'),
  e16: pendiente('e16'),
  e17: pendiente('e17'),
  e18: {
    id: 'e18',
    hasVideo: true,
    src: '/videos/e18.mp4',
    poster: '/posters/e18.svg',
    durationText: 'Clip corto',
  },
  e19: {
    id: 'e19',
    hasVideo: true,
    src: '/videos/e19.mp4',
    poster: '/posters/e19.svg',
    durationText: 'Clip corto',
  },
  e20: pendiente('e20'),
};

const SIN_VIDEO: ExerciseVideoAsset = { id: '', hasVideo: false };

export const getExerciseVideo = (id: string): ExerciseVideoAsset =>
  EXERCISE_VIDEOS[id] || { ...SIN_VIDEO, id };

export const EXERCISES_WITH_VIDEO = Object.values(EXERCISE_VIDEOS).filter((v) => v.hasVideo).length;