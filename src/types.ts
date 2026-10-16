export type Duration = 'corta' | 'media' | 'larga';
export type Difficulty = 'principiante' | 'intermedio' | 'avanzado';
export type Equipment = 'ninguno' | 'bandas' | 'peso' | 'colchoneta';
export type Zone =
  | 'piernas'
  | 'glúteos'
  | 'cadera'
  | 'aductores'
  | 'core'
  | 'lumbar'
  | 'torax'
  | 'hombros';

export type ExerciseCategory =
  | 'actividad_general'
  | 'cuidado_postural'
  | 'psse_supervisado';

export interface EvidenceReference {
  title: string;
  source: string;
  url?: string;
}

export interface ClinicalMetadata {
  reviewStatus: 'no_revisado' | 'en_revision' | 'revisado_profesional';
  reviewedBy?: string; // Rol profesional verificado (ej: "Revisión documental fisioterapia comunitaria")
  reviewDate?: string;
  targetPopulation?: string[];
  precautions?: string[];
  contraindications?: string[];
  evidenceReferences?: EvidenceReference[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: Duration;
  difficulty: Difficulty;
  equipment: string[];
  zone: string[];
  image?: string;
  imageAlt?: string;
  adaptation?: {
    notes?: string;
  };
  clinicalReview?: 'revisado' | 'pendiente' | string;
  category?: ExerciseCategory;
  clinicalMetadata?: ClinicalMetadata;
}

export type QuizObjective = 'movilidad' | 'fuerza' | 'bienestar';
export type QuizDays = '1' | '2' | '3' | '4' | '5' | '6' | '7';
export type QuizTime = '10' | '20' | '30';
export type QuizLevel = 'principiante' | 'intermedio' | 'avanzado';
export type SafetyAnswer = 'si' | 'no';

export type ScoliosisContextOption =
  | 'ninguna'
  | 'leve_desconocido'
  | 'moderada'
  | 'severa'
  | 'no_sabe';

export interface QuizAnswers {
  objective: QuizObjective;
  days: QuizDays;
  time: QuizTime;
  level: QuizLevel;
  equipment: Equipment[];
  surgeryNoAuthorization: SafetyAnswer;
  clinicalRestriction: SafetyAnswer;
  concerningSymptoms: SafetyAnswer;
  scoliosisContext?: ScoliosisContextOption;
}

export interface DaySuggestion {
  number: number;
  exercise: Exercise;
}

export interface QuizResult {
  blocked: boolean;
  reasons?: string[];
  reason?: string;
  insufficient?: boolean;
  available?: number;
  requested?: number;
  days: DaySuggestion[];
  scoliosisGuidance?: string;
  scoliosisLevel?: ScoliosisContextOption;
}

/**
 * Registro de decisiones sobre los documentos legales.
 *
 * Cada documento lleva su propia versión, para pedir una decisión nueva solo
 * cuando cambie el fondo del texto y no por retoques de maquetación.
 *
 * Sobre el valor probatorio: el registro vive en el `localStorage` que la
 * propia persona controla, así que puede editarlo o borrarlo cuando quiera.
 * Acredita una trazabilidad personal; no es un documento firmado ni una
 * prueba fehaciente frente a un tercero, y el almacenamiento local no está
 * cifrado. La clasificación normativa de estos datos —datos sensibles de
 * salud bajo la Ley 1581 de 2012— requiere revisión jurídica: véase
 * TERMINOS.md, cláusula 3.2.
 */

/** Versión del contenido de cada documento. Cambia solo con cambios de fondo. */
export const DOC_VERSIONS = {
  terminos: '2026-10-16',
  privacidad: '2026-10-16',
} as const;

/** Finalidad declarada de la autorización sobre datos de salud. */
export const HEALTH_DATA_PURPOSE =
  'Guardar en este dispositivo el dolor percibido, la nota de bienestar y la actividad que anotas, para que puedas consultarlos y editarlos tú mismo.';

export interface Decision<TVersion extends string = string> {
  accepted: true;
  /** Fecha y hora de la decisión en ISO 8601. */
  at: string;
  /** Versión del documento en el momento de decidir. */
  docVersion: TVersion;
}

export interface ConsentRegistry {
  terms: Decision<(typeof DOC_VERSIONS)['terminos']>;
  privacy: Decision<(typeof DOC_VERSIONS)['privacidad']>;
  /** Autorización separada para los datos de salud, con su finalidad. */
  health: Decision & { purpose: string };
  /** Última modificación del registro. */
  updatedAt: string;
}

export interface PanelRecord {
  id: string;
  date: string; // YYYY-MM-DD
  activity: string;
  pain: number; // 0-10
  note: string;
  exerciseId?: string;
}

export interface StorageResult<T> {
  available: boolean;
  value: T | null;
  reason: 'ok' | 'missing' | 'unknown-version' | 'corrupt' | 'unavailable';
}
