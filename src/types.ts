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
