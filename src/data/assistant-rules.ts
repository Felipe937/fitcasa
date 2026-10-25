import { PageRoute } from '../components/Header';

/**
 * Normaliza una pregunta para el motor de reglas: minúsculas, sin tildes,
 * sin puntuación y espacios colapsados. No envía nada a la red.
 */
export const normalizarPregunta = (texto: string): string =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^\w\s]/g, '') // quita puntuación
    .replace(/\s+/g, ' ')
    .trim();

export interface ReglaAsistente {
  /** Palabras clave en minúsculas, sin tildes. */
  palabrasClave: string[];
  /** Respuesta redactada con frases del sitio. Sin diagnóstico ni promesas médicas. */
  respuesta: string;
  /** Destino opcional al que navegar si la regla coincide. */
  destino?: PageRoute;
}

const CORREO_PROYECTO = 'spaceyisusshop@gmail.com';

/**
 * Catálogo de reglas. El orden importa: las reglas más específicas van primero.
 * La regla de dolor se resuelve con prioridad absoluta en `buscarRegla`.
 */
export const REGLAS_ASISTENTE: ReglaAsistente[] = [
  {
    palabrasClave: ['ejercicios', 'biblioteca', 'catalogo'],
    respuesta: 'En la biblioteca de ejercicios encontrarás el catálogo completo de movimientos de FitCasa, organizados por zona del cuerpo y dificultad, con indicaciones de técnica y repeticiones.',
    destino: 'ejercicios',
  },
  {
    palabrasClave: ['cuestionario', 'quiz', 'que ejercicios me convienen', 'que ejercicio me conviene', 'sugerencias'],
    respuesta: 'El cuestionario de FitCasa te ayuda a elegir los ejercicios que más te convienen según tu nivel y tus objetivos. Responde unas preguntas y recibe una rutina sugerida.',
    destino: 'quiz',
  },
  {
    palabrasClave: ['plan', 'semanas', 'rutina', 'mi plan'],
    respuesta: 'Mi Plan es la guía de actividad semana a semana de FitCasa: progresión de ejercicios, duración y días de entrenamiento para seguir una rutina ordenada.',
    destino: 'plan',
  },
  {
    palabrasClave: ['panel', 'seguimiento', 'registro'],
    respuesta: 'El panel es tu historial de actividad: registra tus pausas activas, ejercicios y avances para hacer seguimiento de tu constancia.',
    destino: 'panel',
  },
  {
    palabrasClave: ['escoliosis', 'columna', 'curvatura'],
    respuesta: 'La guía de escoliosis de FitCasa explica qué es la escoliosis, cómo afecta a la columna y qué papel tiene el ejercicio terapéutico como parte del abordaje, sin promesas de corrección.',
    destino: 'escoliosis',
  },
  {
    palabrasClave: ['pausas activas', 'descanso', 'pausa'],
    respuesta: 'Las pausas activas son descansos breves de movimiento para aliviar la tensión del cuerpo durante el día. Puedes elegir duración y modalidad (de pie, sentado o libre).',
    destino: 'pausas-activas',
  },
  {
    palabrasClave: ['alimentacion', 'comer', 'nutricion'],
    respuesta: 'La sección de alimentación de FitCasa reúne recomendaciones generales de nutrición y bienestar para acompañar tu actividad física, sin sustituir el consejo de un profesional.',
    destino: 'alimentacion',
  },
  {
    palabrasClave: ['cuerpo', 'peso', 'imc', 'salud'],
    respuesta: 'Cuerpo y salud recoge indicadores generales de salud y movimiento. FitCasa no emite diagnósticos ni garantiza cambios en el IMC; es una referencia informativa, no médica.',
    destino: 'cuerpo-y-salud',
  },
  {
    palabrasClave: ['apoya', 'donacion', 'contribuir'],
    respuesta: 'Apoya a FitCasa contribuyendo al proyecto para que siga siendo libre y accesible. Puedes colaborar desde la sección Apoya a FitCasa.',
    destino: 'apoya',
  },
  {
    palabrasClave: ['privacidad', 'datos', 'informacion'],
    respuesta: 'La política de privacidad de FitCasa explica qué datos se recopilan, cómo se usan y cómo ejercer tus derechos. FitCasa no almacena datos del asistente de navegación.',
    destino: 'privacidad',
  },
];

/** Respuesta fija ante síntomas/dolor. Sin destino, sin evaluación clínica. */
export const RESPUESTA_DOLOR =
  'Si sientes dolor durante un ejercicio, detén la actividad. Consulta a un profesional de salud si el dolor persiste. FitCasa no puede evaluar síntomas individuales.';

/** Palabras que activan siempre la respuesta de dolor, ignorando otras reglas. */
export const PALABRAS_DOLOR = ['dolor', 'duele', 'lesion', 'lesión', 'herida'];

export const RESPUESTA_FALLBACK = `No tengo una respuesta para eso. Puedes explorar los ejercicios, la guía de escoliosis o escribirnos a ${CORREO_PROYECTO}.`;

/**
 * Motor de reglas. Busca la primera coincidencia por inclusión de subcadena
 * sobre la pregunta normalizada. La regla de dolor tiene prioridad absoluta.
 */
export const buscarRegla = (pregunta: string): ReglaAsistente | null => {
  const normalizada = normalizarPregunta(pregunta);

  if (PALABRAS_DOLOR.some((palabra) => normalizada.includes(palabra))) {
    return {
      palabrasClave: PALABRAS_DOLOR,
      respuesta: RESPUESTA_DOLOR,
    };
  }

  for (const regla of REGLAS_ASISTENTE) {
    if (regla.palabrasClave.some((palabra) => normalizada.includes(palabra))) {
      return regla;
    }
  }

  return null;
};

export type { PageRoute };