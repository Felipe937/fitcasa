import {
  Exercise,
  QuizAnswers,
  UserPlan,
  PlanWeek,
  PlanSession,
  Equipment,
} from '../types';
import { safetyBlock, generateSuggestions, normalizeExercise } from './quizEngine';
import { EXERCISES_DATA } from '../data/exercisesData';

export interface PlanGenerationResult {
  blocked: boolean;
  reasons?: string[];
  plan?: UserPlan;
  insufficient?: boolean;
  available?: number;
  requested?: number;
}

const WEEK_FOCUS: Record<number, { title: string; description: string }> = {
  1: {
    title: 'Semana 1: Adaptación y control del movimiento',
    description: 'Toma de contacto con los ejercicios, foco en la técnica y la respiración. Prioriza la calidad del movimiento sobre la cantidad.',
  },
  2: {
    title: 'Semana 2: Consistencia y ritmo postural',
    description: 'Establece una rutina regular. Repetir los mismos ejercicios ayuda a internalizar patrones posturales y ganar confianza.',
  },
  3: {
    title: 'Semana 3: Afianzamiento y propiocepción',
    description: 'Profundiza en el control motor. Observa cómo responde tu cuerpo y ajusta la intensidad dentro de tu zona de confort.',
  },
  4: {
    title: 'Semana 4: Consolidación y autonomía',
    description: 'Integra lo aprendido. El objetivo es que puedas elegir y adaptar tus sesiones con criterio propio, sin depender de la guía.',
  },
};

function generatePlanId(): string {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `plan-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function generateSessionId(weekNumber: number, sessionNumber: number): string {
  return `sem${weekNumber}-ses${sessionNumber}`;
}

/**
 * Genera una rotación armónica de ejercicios para evitar fatiga o aburrimiento,
 * manteniendo el determinismo (misma entrada = mismo plan).
 */
function distributeExercises(
  compatibleExercises: Exercise[],
  daysPerWeek: number,
  totalWeeks: number
): Exercise[][] {
  const totalSessions = daysPerWeek * totalWeeks;
  if (compatibleExercises.length === 0) return [];

  const result: Exercise[][] = [];
  const exerciseCount = compatibleExercises.length;

  for (let session = 0; session < totalSessions; session++) {
    const sessionExercises: Exercise[] = [];
    const exercisesPerSession = Math.max(1, Math.min(3, exerciseCount));
    const startIndex = session % exerciseCount;

    for (let i = 0; i < exercisesPerSession; i++) {
      const idx = (startIndex + i) % exerciseCount;
      sessionExercises.push(compatibleExercises[idx]);
    }
    result.push(sessionExercises);
  }

  return result;
}

export function generatePlan(
  answers: QuizAnswers,
  availableExercises: Exercise[] = EXERCISES_DATA
): PlanGenerationResult {
  const userEquip: Equipment[] = Array.from(new Set(['ninguno', ...answers.equipment])) as Equipment[];
  const safeAnswers: QuizAnswers = {
    ...answers,
    equipment: userEquip,
  };

  const blockedReasons = safetyBlock(safeAnswers);
  if (blockedReasons.length > 0) {
    return {
      blocked: true,
      reasons: blockedReasons,
    };
  }

  const suggestions = generateSuggestions(safeAnswers, availableExercises);
  if (suggestions.blocked) {
    return {
      blocked: true,
      reasons: suggestions.reasons,
    };
  }
  if (suggestions.insufficient) {
    return {
      blocked: false,
      insufficient: true,
      available: suggestions.available,
      requested: suggestions.requested,
    };
  }

  const daysPerWeek = Number(safeAnswers.days);
  const totalWeeks = 4;

  const validExercises = availableExercises
    .map(normalizeExercise)
    .filter((ex): ex is Exercise => ex !== null);

  const zones = {
    movilidad: ['torax', 'hombros', 'cadera', 'lumbar', 'piernas'],
    fuerza: ['piernas', 'glúteos', 'core', 'lumbar', 'hombros'],
    bienestar: null,
  }[safeAnswers.objective];

  const durations = (() => {
    if (safeAnswers.time === '10') return ['corta'];
    if (safeAnswers.time === '20') return ['corta', 'media'];
    return ['corta', 'media', 'larga'];
  })();

  const maxLevel = { principiante: 1, intermedio: 2, avanzado: 3 }[safeAnswers.level] || 3;

  const compatible = validExercises.filter((exercise) => {
    const objectiveMatches =
      !zones || exercise.zone.some((zone) => zones.includes(zone));
    const equipmentMatches = exercise.equipment.every((item) => userEquip.includes(item as Equipment));
    return (
      objectiveMatches &&
      durations.includes(exercise.duration) &&
      ({ principiante: 1, intermedio: 2, avanzado: 3 }[exercise.difficulty] || 0) <= maxLevel &&
      equipmentMatches
    );
  });

  if (compatible.length < daysPerWeek) {
    return {
      blocked: false,
      insufficient: true,
      available: compatible.length,
      requested: daysPerWeek,
    };
  }

  const distributed = distributeExercises(compatible, daysPerWeek, totalWeeks);

  const weeks: PlanWeek[] = [];
  let sessionIndex = 0;

  for (let week = 1; week <= totalWeeks; week++) {
    const focus = WEEK_FOCUS[week];
    const sessions: PlanSession[] = [];

    for (let day = 1; day <= daysPerWeek; day++) {
      const exercisesForSession = distributed[sessionIndex] || [];
      sessions.push({
        id: generateSessionId(week, day),
        sessionNumber: day,
        weekNumber: week,
        exercises: exercisesForSession.map((ex) => ({ exerciseId: ex.id })),
        completed: false,
      });
      sessionIndex++;
    }

    weeks.push({
      weekNumber: week,
      focusTitle: focus.title,
      focusDescription: focus.description,
      sessions,
    });
  }

  const plan: UserPlan = {
    id: generatePlanId(),
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    answersSnapshot: safeAnswers,
    weeks,
  };

  return {
    blocked: false,
    plan,
  };
}

export function getPlanFromStorageOrGenerate(
  answers: QuizAnswers,
  availableExercises: Exercise[] = EXERCISES_DATA
): PlanGenerationResult {
  return generatePlan(answers, availableExercises);
}

export function areAnswersEqual(a: QuizAnswers, b: QuizAnswers): boolean {
  return (
    a.objective === b.objective &&
    a.days === b.days &&
    a.time === b.time &&
    a.level === b.level &&
    JSON.stringify([...a.equipment].sort()) === JSON.stringify([...b.equipment].sort()) &&
    a.surgeryNoAuthorization === b.surgeryNoAuthorization &&
    a.clinicalRestriction === b.clinicalRestriction &&
    a.concerningSymptoms === b.concerningSymptoms &&
    a.scoliosisContext === b.scoliosisContext
  );
}

export function markSessionCompleted(
  plan: UserPlan,
  weekNumber: number,
  sessionNumber: number
): UserPlan {
  const updatedWeeks = plan.weeks.map((week) => {
    if (week.weekNumber !== weekNumber) return week;
    return {
      ...week,
      sessions: week.sessions.map((session) => {
        if (session.sessionNumber !== sessionNumber) return session;
        if (session.completed) return session;
        return {
          ...session,
          completed: true,
          completedAt: new Date().toISOString(),
        };
      }),
    };
  });
  return { ...plan, weeks: updatedWeeks };
}

export function getPlanProgress(plan: UserPlan): { completed: number; total: number; percentage: number } {
  let completed = 0;
  let total = 0;
  for (const week of plan.weeks) {
    for (const session of week.sessions) {
      total++;
      if (session.completed) completed++;
    }
  }
  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function getWeekProgress(plan: UserPlan, weekNumber: number): { completed: number; total: number } {
  const week = plan.weeks.find((w) => w.weekNumber === weekNumber);
  if (!week) return { completed: 0, total: 0 };
  let completed = 0;
  for (const session of week.sessions) {
    if (session.completed) completed++;
  }
  return { completed, total: week.sessions.length };
}