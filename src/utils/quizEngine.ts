import {
  Exercise,
  QuizAnswers,
  QuizResult,
  Equipment,
  Duration,
  Difficulty,
  ExerciseCategory,
  ScoliosisContextOption,
  ClinicalMetadata,
} from '../types';

export const ALLOWED_VALUES = {
  objective: ['movilidad', 'fuerza', 'bienestar'] as const,
  days: ['1', '2', '3', '4', '5', '6', '7'] as const,
  time: ['10', '20', '30'] as const,
  level: ['principiante', 'intermedio', 'avanzado'] as const,
  equipment: ['ninguno', 'bandas', 'peso', 'colchoneta'] as const,
  safety: ['si', 'no'] as const,
  scoliosisContext: [
    'ninguna',
    'leve_desconocido',
    'moderada',
    'severa',
    'no_sabe',
  ] as const,
};

export const OBJECTIVE_ZONES: Record<string, string[] | null> = {
  movilidad: ['torax', 'hombros', 'cadera', 'lumbar', 'piernas'],
  fuerza: ['piernas', 'glúteos', 'core', 'lumbar', 'hombros'],
  bienestar: null,
};

export function normalizeClinicalMetadata(item: unknown): ClinicalMetadata | undefined {
  if (!item || typeof item !== 'object') return undefined;
  const raw = item as Partial<ClinicalMetadata>;

  const validStatuses: ClinicalMetadata['reviewStatus'][] = [
    'no_revisado',
    'en_revision',
    'revisado_profesional',
  ];
  const reviewStatus = validStatuses.includes(raw.reviewStatus as ClinicalMetadata['reviewStatus'])
    ? (raw.reviewStatus as ClinicalMetadata['reviewStatus'])
    : 'no_revisado';

  return {
    reviewStatus,
    reviewedBy: typeof raw.reviewedBy === 'string' ? raw.reviewedBy : undefined,
    reviewDate: typeof raw.reviewDate === 'string' ? raw.reviewDate : undefined,
    targetPopulation: Array.isArray(raw.targetPopulation)
      ? raw.targetPopulation.filter((s): s is string => typeof s === 'string')
      : undefined,
    precautions: Array.isArray(raw.precautions)
      ? raw.precautions.filter((s): s is string => typeof s === 'string')
      : undefined,
    contraindications: Array.isArray(raw.contraindications)
      ? raw.contraindications.filter((s): s is string => typeof s === 'string')
      : undefined,
    evidenceReferences: Array.isArray(raw.evidenceReferences)
      ? raw.evidenceReferences.filter(
          (ref) => ref && typeof ref.title === 'string' && typeof ref.source === 'string'
        )
      : undefined,
  };
}

export function normalizeExercise(item: unknown): Exercise | null {
  if (!item || typeof item !== 'object') return null;
  const ex = item as Partial<Exercise>;
  if (
    typeof ex.id !== 'string' ||
    typeof ex.name !== 'string' ||
    typeof ex.description !== 'string'
  ) {
    return null;
  }
  if (!['corta', 'media', 'larga'].includes(ex.duration as string)) return null;
  if (!['principiante', 'intermedio', 'avanzado'].includes(ex.difficulty as string)) return null;
  if (!Array.isArray(ex.equipment) || !Array.isArray(ex.zone)) return null;

  const equipment = ex.equipment.filter((value): value is string => typeof value === 'string');
  const zone = ex.zone.filter((value): value is string => typeof value === 'string');
  if (!equipment.length || !zone.length) return null;

  const validCategories: ExerciseCategory[] = [
    'actividad_general',
    'cuidado_postural',
    'psse_supervisado',
  ];
  const category: ExerciseCategory = validCategories.includes(ex.category as ExerciseCategory)
    ? (ex.category as ExerciseCategory)
    : 'actividad_general';

  return {
    id: ex.id,
    name: ex.name,
    description: ex.description,
    duration: ex.duration as Duration,
    difficulty: ex.difficulty as Difficulty,
    equipment,
    zone,
    category,
    adaptation:
      ex.adaptation && typeof ex.adaptation.notes === 'string'
        ? { notes: ex.adaptation.notes }
        : undefined,
    clinicalReview: typeof ex.clinicalReview === 'string' ? ex.clinicalReview : 'pendiente',
    clinicalMetadata: normalizeClinicalMetadata(ex.clinicalMetadata),
    image: ex.image,
    imageAlt: ex.imageAlt,
  };
}

export function normalizeAnswers(data: unknown): QuizAnswers | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Partial<QuizAnswers>;
  const rawEq = Array.isArray(d.equipment) ? d.equipment : [];
  const equipment = rawEq.filter((value): value is Equipment =>
    (ALLOWED_VALUES.equipment as readonly string[]).includes(value as string)
  );

  const answers: QuizAnswers = {
    objective: d.objective as QuizAnswers['objective'],
    days: d.days as QuizAnswers['days'],
    time: d.time as QuizAnswers['time'],
    level: d.level as QuizAnswers['level'],
    equipment: Array.from(new Set(equipment)),
    surgeryNoAuthorization: d.surgeryNoAuthorization as QuizAnswers['surgeryNoAuthorization'],
    clinicalRestriction: d.clinicalRestriction as QuizAnswers['clinicalRestriction'],
    concerningSymptoms: d.concerningSymptoms as QuizAnswers['concerningSymptoms'],
  };

  if (
    typeof d.scoliosisContext === 'string' &&
    (ALLOWED_VALUES.scoliosisContext as readonly string[]).includes(d.scoliosisContext)
  ) {
    answers.scoliosisContext = d.scoliosisContext as ScoliosisContextOption;
  } else {
    answers.scoliosisContext = 'no_sabe';
  }

  if (
    !(ALLOWED_VALUES.objective as readonly string[]).includes(answers.objective) ||
    !(ALLOWED_VALUES.days as readonly string[]).includes(answers.days) ||
    !(ALLOWED_VALUES.time as readonly string[]).includes(answers.time) ||
    !(ALLOWED_VALUES.level as readonly string[]).includes(answers.level)
  ) {
    return null;
  }

  if (
    !answers.equipment.length ||
    !(ALLOWED_VALUES.safety as readonly string[]).includes(answers.surgeryNoAuthorization) ||
    !(ALLOWED_VALUES.safety as readonly string[]).includes(answers.clinicalRestriction) ||
    !(ALLOWED_VALUES.safety as readonly string[]).includes(answers.concerningSymptoms)
  ) {
    return null;
  }

  return answers;
}

export function safetyBlock(answers: QuizAnswers): string[] {
  const reasons: string[] = [];
  if (answers.surgeryNoAuthorization === 'si') {
    reasons.push('una cirugía de columna sin autorización para retomar la actividad');
  }
  if (answers.clinicalRestriction === 'si') {
    reasons.push('una restricción de ejercicio indicada por un profesional sanitario');
  }
  if (answers.concerningSymptoms === 'si') {
    reasons.push(
      'síntomas preocupantes como dolor nuevo, intenso o creciente, debilidad o entumecimiento'
    );
  }
  return reasons;
}

export function durationOptions(time: string): Duration[] {
  if (time === '10') return ['corta'];
  if (time === '20') return ['corta', 'media'];
  return ['corta', 'media', 'larga'];
}

export function levelOrder(level: string): number {
  const map: Record<string, number> = { principiante: 1, intermedio: 2, avanzado: 3 };
  return map[level] || 0;
}

/**
 * Pure deterministic suggestion generator:
 * - Verifies safety red flags (blocks only upon actual clinical flags)
 * - Evaluates optional scoliosis context without prescriptive indexing or arbitrary blocking
 * - Filters compatible library exercises
 */
export function generateSuggestions(
  answers: QuizAnswers,
  availableExercises: Exercise[]
): QuizResult {
  const safeAnswers = normalizeAnswers(answers);
  if (!safeAnswers) {
    return {
      blocked: true,
      reason: 'Las respuestas no están completas o no son válidas.',
      days: [],
    };
  }

  const blockedReasons = safetyBlock(safeAnswers);
  if (blockedReasons.length) {
    return {
      blocked: true,
      reasons: blockedReasons,
      days: [],
    };
  }

  const zones = OBJECTIVE_ZONES[safeAnswers.objective];
  const durations = durationOptions(safeAnswers.time);
  const maxLevel = levelOrder(safeAnswers.level);

  // "ninguno" is always implicitly available: available equipment is "ninguno" + checked items
  const userEquip = Array.from(new Set(['ninguno', ...safeAnswers.equipment]));

  const validExercises = Array.isArray(availableExercises)
    ? availableExercises.map(normalizeExercise).filter((ex): ex is Exercise => ex !== null)
    : [];

  const compatible = validExercises.filter((exercise) => {
    const objectiveMatches =
      !zones || exercise.zone.some((zone) => zones.includes(zone));
    const equipmentMatches = exercise.equipment.every((item) => userEquip.includes(item));
    return (
      objectiveMatches &&
      durations.includes(exercise.duration) &&
      levelOrder(exercise.difficulty) <= maxLevel &&
      equipmentMatches
    );
  });

  const days = Number(safeAnswers.days);
  if (compatible.length < days) {
    return {
      blocked: false,
      insufficient: true,
      available: compatible.length,
      requested: days,
      days: [],
    };
  }

  let scoliosisGuidance: string | undefined = undefined;
  if (safeAnswers.scoliosisContext === 'severa') {
    scoliosisGuidance =
      'Orientación clínica: has indicado una curvatura severa (>45°) o en seguimiento especializado. Esta propuesta contiene ejercicios generales con peso corporal y movilidad suave. Según los criterios de SOSORT y de la Scoliosis Research Society (SRS), las curvas de esta magnitud requieren supervisión médica periódica; comparte este resumen con tu traumatólogo o fisioterapeuta antes de comenzar.';
  } else if (safeAnswers.scoliosisContext === 'moderada') {
    scoliosisGuidance =
      'Orientación clínica: has indicado una curvatura moderada (20° a 45°). Los ejercicios propuestos son de acondicionamiento general y ergonomía postural. Recuerda que no sustituyen los ejercicios fisioterapéuticos específicos para escoliosis (PSSE) que deba pautarte un fisioterapeuta formado.';
  } else if (safeAnswers.scoliosisContext === 'leve_desconocido') {
    scoliosisGuidance =
      'Orientación clínica: para curvaturas leves o estables, la actividad física regular y el fortalecimiento suave del core favorecen la movilidad y el bienestar general.';
  }

  return {
    blocked: false,
    insufficient: false,
    available: compatible.length,
    requested: days,
    scoliosisGuidance,
    scoliosisLevel: safeAnswers.scoliosisContext,
    days: compatible.slice(0, days).map((exercise, index) => ({
      number: index + 1,
      exercise,
    })),
  };
}
