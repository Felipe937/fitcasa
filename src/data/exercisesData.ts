import { Exercise } from '../types';

export const EXERCISES_DATA: Exercise[] = [
  {
    id: "e01",
    name: "Sentadilla con peso corporal",
    description: "Ejercicio básico de fuerza para piernas y glúteos, ejecutado con el propio peso corporal.",
    duration: "corta",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["piernas", "glúteos"],
    category: "actividad_general",
    image: "assets/sentadilla.jpg",
    adaptation: { notes: "Mantenga la espalda recta y evite flexionar excesivamente la columna durante la bajada." },
    clinicalReview: "pendiente",
    clinicalMetadata: {
      reviewStatus: "en_revision",
      targetPopulation: ["adultos_asintomaticos", "escoliosis_leve_estable"],
      precautions: [
        "No arquear la columna lumbar ni redondear la zona dorsal.",
        "Si existe dismetría pélvica, mantener apoyos simétricos de ambos pies sin desplazar el peso a un solo lado."
      ],
      contraindications: ["Dolor articular agudo en rodilla o cadera", "Radiculopatía lumbar activa"],
      evidenceReferences: [
        {
          title: "General physical activity guidelines for spinal health",
          source: "NHS Choices - Exercise and Back Pain (2023)",
          url: "https://www.nhs.uk/conditions/scoliosis/treatment-in-adults/"
        }
      ]
    }
  },
  {
    id: "e02",
    name: "Puente de glúteos",
    description: "Fortalece el glúteo mayor y la zona lumbar mediante elevación de la pelvis.",
    duration: "corta",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["glúteos", "lumbar"],
    category: "cuidado_postural",
    image: "assets/puente.jpg",
    adaptation: { notes: "Controlar el movimiento para no hiperextender la columna." },
    clinicalReview: "revisado",
    clinicalMetadata: {
      reviewStatus: "revisado_profesional",
      reviewedBy: "Revisión documental en fisioterapia de columna",
      reviewDate: "2026-01-15",
      targetPopulation: ["adultos_asintomaticos", "escoliosis_leve_estable", "escoliosis_moderada_estable"],
      precautions: [
        "Evitar la hiperextensión lumbar al alcanzar el punto máximo de elevación.",
        "Activar la musculatura del suelo pélvico y abdomen transverso antes de despegar la pelvis."
      ],
      contraindications: ["Espondilolistesis activa inestable con dolor a la extensión"],
      evidenceReferences: [
        {
          title: "SOSORT 2016 Guidelines: Core stabilization and gluteal activation",
          source: "Scoliosis and Spinal Disorders (Negrini et al., 2018)",
          url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5795289/"
        }
      ]
    }
  },
  {
    id: "e03",
    name: "Plancha frontal",
    description: "Ejercicio isométrico para el core, manteniendo el cuerpo en línea recta.",
    duration: "media",
    difficulty: "intermedio",
    equipment: ["ninguno"],
    zone: ["core"],
    category: "actividad_general",
    image: "assets/plancha.jpg",
    adaptation: { notes: "Puede apoyar las rodillas para reducir la carga lumbar." },
    clinicalReview: "pendiente",
    clinicalMetadata: {
      reviewStatus: "en_revision",
      targetPopulation: ["adultos_con_buen_control_motor"],
      precautions: [
        "No permitir que la pelvis caiga hacia el suelo ni elevar los glúteos en exceso.",
        "Progresar desde apoyo de rodillas antes de realizar la versión completa si hay fatiga postural."
      ],
      contraindications: ["Dolor lumbar agudo al mantenimiento isométrico"],
      evidenceReferences: [
        {
          title: "Isometric trunk endurance and spine mechanics",
          source: "McGill SM. Low Back Disorders (3rd ed.)"
        }
      ]
    }
  },
  {
    id: "e04",
    name: "Elevación lateral de pierna",
    description: "Trabaja abductores y glúteos, ideal para equilibrar la musculatura de la cadera.",
    duration: "corta",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["piernas", "cadera"],
    category: "cuidado_postural",
    image: "assets/elevacion_lateral.jpg",
    adaptation: { notes: "Evite inclinar el tronco; mantenga pelvis neutra." },
    clinicalReview: "pendiente",
    clinicalMetadata: {
      reviewStatus: "en_revision",
      targetPopulation: ["adultos_asintomaticos", "asimetria_pelvica_leve"],
      precautions: ["Mantener la pelvis alineada perpendicular al suelo, sin rotación anterior."],
      contraindications: ["Bursitis trocantérea aguda"]
    }
  },
  {
    id: "e05",
    name: "Superman",
    description: "Fortalece extensores de la columna y glúteos en posición prona.",
    duration: "corta",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["lumbar", "glúteos"],
    category: "cuidado_postural",
    image: "assets/superman.jpg",
    adaptation: { notes: "Elevar sólo ligeramente los brazos y piernas si hay dolor lumbar." },
    clinicalReview: "revisado",
    clinicalMetadata: {
      reviewStatus: "revisado_profesional",
      reviewedBy: "Revisión documental en fisioterapia de columna",
      reviewDate: "2026-01-15",
      targetPopulation: ["escoliosis_estable_sin_hiperlordosis"],
      precautions: [
        "Mantener la cabeza neutra mirando hacia el suelo para evitar hiperextensión cervical.",
        "Elevaciones cortas y controladas: la intención es activación suave, no máxima extensión."
      ],
      contraindications: ["Estenosis de canal lumbar", "Espondilolisis sintomática"],
      evidenceReferences: [
        {
          title: "Paraspinal muscle activation in trunk extension exercises",
          source: "Journal of Orthopaedic & Sports Physical Therapy"
        }
      ]
    }
  },
  {
    id: "e06",
    name: "Rotación torácica en cuatro puntos",
    description: "Mejora la movilidad torácica, fundamental para la postura en escoliosis.",
    duration: "media",
    difficulty: "intermedio",
    equipment: ["ninguno"],
    zone: ["torax"],
    category: "cuidado_postural",
    image: "assets/rotacion_toracica.jpg",
    adaptation: { notes: "No forzar el rango de movimiento; detener ante cualquier molestia." },
    clinicalReview: "pendiente",
    clinicalMetadata: {
      reviewStatus: "en_revision",
      targetPopulation: ["escoliosis_toracica_con_rigidez_leve"],
      precautions: [
        "Mover despacio dentro de la zona indolora; la rotación en escoliosis tiene asimetría anatómica y nunca debe forzarse contra resistencia."
      ],
      contraindications: ["Dolor punzante costal o paravertebral", "Osteopenia u osteoporosis severa"]
    }
  },
  {
    id: "e07",
    name: "Estiramiento de pectorales contra la pared",
    description: "Abre el pecho y favorece una mejor alineación de la columna superior.",
    duration: "corta",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["torax", "hombros"],
    category: "cuidado_postural",
    image: "assets/estiramiento_pectoral.jpg",
    adaptation: { notes: "Mantener los brazos a la altura de los hombros y no exceder la presión contra la pared." },
    clinicalReview: "revisado",
    clinicalMetadata: {
      reviewStatus: "revisado_profesional",
      reviewedBy: "Revisión documental en fisioterapia de columna",
      reviewDate: "2026-01-15",
      targetPopulation: ["adultos_asintomaticos", "hipercifosis_asociada", "escoliosis_estable"],
      precautions: [
        "Respirar con naturalidad sin contener el aire.",
        "No rotar bruscamente el tronco lejos del brazo apoyado."
      ],
      contraindications: ["Inestabilidad glenohumeral anterior aguda"]
    }
  },
  {
    id: "e08",
    name: "Bird‑Dog",
    description: "Ejercicio de estabilidad que activa la zona lumbar y glúteos en diagonal.",
    duration: "corta",
    difficulty: "intermedio",
    equipment: ["ninguno"],
    zone: ["lumbar", "glúteos", "hombros"],
    category: "cuidado_postural",
    image: "assets/bird_dog.jpg",
    adaptation: { notes: "Puede mantener la rodilla y mano en el suelo si la extensión completa genera incomodidad." },
    clinicalReview: "pendiente",
    clinicalMetadata: {
      reviewStatus: "en_revision",
      targetPopulation: ["escoliosis_estable", "adultos_asintomaticos"],
      precautions: [
        "Extender el brazo y la pierna paralelos al suelo sin balanceo pélvico ni torsión del tronco.",
        "Mantener cuello largo y coronilla proyectada hacia adelante."
      ],
      contraindications: ["Vértigo posicional en cuadrupedia"]
    }
  },
  {
    id: "e09",
    name: "Estiramiento de cadena posterior sentado",
    description: "Alarga isquiotibiales y zona lumbar, favoreciendo la flexibilidad espinal.",
    duration: "media",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["piernas", "lumbar"],
    category: "cuidado_postural",
    image: "assets/estiramiento_cadena.jpg",
    adaptation: { notes: "No forzar la flexión; mantener la espalda recta." },
    clinicalReview: "pendiente",
    clinicalMetadata: {
      reviewStatus: "en_revision",
      targetPopulation: ["acortamiento_isquiotibial_con_rigidez_pelvica"],
      precautions: ["Flexionar desde las caderas, no desde la curvatura dorsal."]
    }
  },
  {
    id: "e10",
    name: "Twist espinal de pie",
    description: "Rotación de la columna en posición de pie, mejora movilidad y control postural.",
    duration: "corta",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["torax", "lumbar"],
    category: "cuidado_postural",
    image: "assets/twist_pe.jpg",
    adaptation: { notes: "Realizar sin torsión excesiva; detener si aparece dolor." },
    clinicalReview: "pendiente",
    clinicalMetadata: {
      reviewStatus: "en_revision",
      precautions: ["Mantener las rodillas desbloqueadas y no rotar bruscamente."]
    }
  },
  {
    id: "e11",
    name: "Lunge estático",
    description: "Ejercicio de fuerza para cuádriceps y glúteos, con gran estabilidad.",
    duration: "corta",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["piernas", "glúteos"],
    category: "actividad_general",
    image: "assets/lunge.jpg",
    adaptation: { notes: "Mantenga la rodilla alineada con el tobillo; evite avanzar demasiado." },
    clinicalReview: "pendiente"
  },
  {
    id: "e12",
    name: "Elevación de talones (gemelo)",
    description: "Fortalece los músculos gastrocnemio y sóleo, útil para la estabilidad del tobillo.",
    duration: "corta",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["piernas"],
    category: "actividad_general",
    image: "assets/elevacion_talones.jpg",
    adaptation: { notes: "Puede realizarse cerca de una pared para soporte si es necesario." },
    clinicalReview: "revisado",
    clinicalMetadata: {
      reviewStatus: "revisado_profesional",
      reviewedBy: "Revisión documental en fisioterapia",
      reviewDate: "2026-01-15",
      targetPopulation: ["toda_poblacion_general"],
      precautions: ["Apoyarse en pared o silla estable si existen problemas de equilibrio."]
    }
  },
  {
    id: "e13",
    name: "Círculos de brazos",
    description: "Movilidad de la articulación del hombro, ayuda a la postura de la zona superior.",
    duration: "corta",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["hombros"],
    category: "cuidado_postural",
    image: "assets/circulos_brazos.jpg",
    adaptation: { notes: "Realizar movimientos suaves; evitar amplitud que cause dolor." },
    clinicalReview: "pendiente"
  },
  {
    id: "e14",
    name: "Escalador (Mountain climber)",
    description: "Ejercicio cardiovascular y de core, aumenta la frecuencia cardiaca.",
    duration: "media",
    difficulty: "intermedio",
    equipment: ["ninguno"],
    zone: ["core", "piernas"],
    category: "actividad_general",
    image: "assets/escalador.jpg",
    adaptation: { notes: "Puede reducir la velocidad o apoyar las rodillas si hay molestias en la zona lumbar." },
    clinicalReview: "pendiente"
  },
  {
    id: "e15",
    name: "Side plank (plancha lateral)",
    description: "Fortalece oblicuos y mejora la estabilidad lateral de la columna.",
    duration: "corta",
    difficulty: "intermedio",
    equipment: ["ninguno"],
    zone: ["core"],
    category: "cuidado_postural",
    image: "assets/plancha_lateral.jpg",
    adaptation: { notes: "Puede apoyar la rodilla inferior para disminuir la carga si es necesario." },
    clinicalReview: "pendiente",
    clinicalMetadata: {
      reviewStatus: "en_revision",
      precautions: [
        "En escoliosis con curva toracolumbar, realizar ambos lados sin hiperextensión del cuello.",
        "Si un lado resulta sensible o doloroso, suspender dicho lado y consultar con el fisioterapeuta."
      ]
    }
  },
  {
    id: "e16",
    name: "Puente con una pierna",
    description: "Versión avanzada del puente, incrementa la carga en glúteos y zona lumbar.",
    duration: "media",
    difficulty: "avanzado",
    equipment: ["ninguno"],
    zone: ["glúteos", "lumbar"],
    category: "actividad_general",
    image: "assets/puente_un_pierna.jpg",
    adaptation: { notes: "Mantenga la pelvis alineada y no compense con exceso de hiperextensión." },
    clinicalReview: "pendiente"
  },
  {
    id: "e17",
    name: "Sentadilla sumo",
    description: "Variación de la sentadilla que enfatiza aductores y zona interior de muslos.",
    duration: "corta",
    difficulty: "intermedio",
    equipment: ["ninguno"],
    zone: ["piernas", "aductores"],
    category: "actividad_general",
    image: "assets/sentadilla_sumo.jpg",
    adaptation: { notes: "Mantenga la espalda recta; la amplitud de los pies puede ajustarse según comodidad." },
    clinicalReview: "pendiente"
  },
  {
    id: "e18",
    name: "Estiramiento de gato‑vaca",
    description: "Movilidad de la columna vertebral, mejora la flexión y extensión suaves.",
    duration: "corta",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["lumbar", "torax"],
    category: "cuidado_postural",
    image: "assets/gato_vaca.jpg",
    adaptation: { notes: "Mantenga los movimientos dentro de su rango de comodidad; evitar hiperextensión." },
    clinicalReview: "revisado",
    clinicalMetadata: {
      reviewStatus: "revisado_profesional",
      reviewedBy: "Revisión documental en fisioterapia de columna",
      reviewDate: "2026-01-15",
      targetPopulation: ["escoliosis_estable", "movilidad_espinal_general"],
      precautions: [
        "Mover sincrónico con la respiración (inhalar en extensión suave, exhalar en flexión).",
        "Evitar hundir el cuello o forzar la lordosis lumbar baja."
      ]
    }
  },
  {
    id: "e19",
    name: "Elevación de talones sentado",
    description: "Ejercicio de bajo impacto para los gemelos, ideal para personas con limitaciones de equilibrio.",
    duration: "corta",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["piernas"],
    category: "actividad_general",
    image: "assets/elevacion_talones_sentado.jpg",
    adaptation: { notes: "Realizar con una silla firme; levantar los talones sin forzar la planta del pie." },
    clinicalReview: "pendiente"
  },
  {
    id: "e20",
    name: "Respiración diafragmática",
    description: "Técnica de respiración que favorece la relajación y la activación del core.",
    duration: "corta",
    difficulty: "principiante",
    equipment: ["ninguno"],
    zone: ["torax"],
    category: "cuidado_postural",
    image: "assets/respiracion.jpg",
    adaptation: { notes: "Practicar en posición sentada o de pie, con la espalda recta." },
    clinicalReview: "revisado",
    clinicalMetadata: {
      reviewStatus: "revisado_profesional",
      reviewedBy: "Revisión documental en fisioterapia de columna",
      reviewDate: "2026-01-15",
      targetPopulation: ["toda_poblacion_general", "escoliosis_en_cualquier_grado"],
      precautions: [
        "Respirar a ritmo pausado sin hiperventilar.",
        "Ideal como inicio y cierre de cualquier sesión para disminuir tensión paravertebral."
      ],
      evidenceReferences: [
        {
          title: "Breathing techniques and chest expansion in scoliosis care",
          source: "SOSORT Guidelines 2016",
          url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5795289/"
        }
      ]
    }
  }
];
