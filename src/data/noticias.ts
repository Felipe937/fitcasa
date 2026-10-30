export interface EnlaceFuente {
  texto: string;
  url: string;
  tipo: 'pubmed' | 'pmc' | 'revista' | 'doi';
}

export interface Visualizacion {
  filas: string[][];
  filasResultados?: string[][];
  tituloFila: string;
  subtituloFila: string;
}

export interface ArticuloCientifico {
  id: string;
  tipo: 'genetica' | 'ejercicio';
  etiquetaEditorial: string;
  tituloEditorial: string;
  tituloOriginal: string;
  revista: string;
  fechaPublicacion: string;
  volumenArticulo: string;
  doi: string;
  autores: string[];
  enlaces: EnlaceFuente[];
  resumenBreve: string;
  enPocasPalabras: string;
  preguntaInvestigacion: string;
  queEncontraron: string[];
  porQueImporta: string[];
  loQueNoDemuestra: string[];
  queSignificaParaLector: string;
  advertenciaClinica: string;
  fechaVerificacion: string;
  categoria: string;
  visualizacion: Visualizacion[];
}

export const articulosNoticias: ArticuloCientifico[] = [
  {
    id: 'aise-genetica-01',
    tipo: 'genetica',
    etiquetaEditorial: 'DIVULGACIÓN CIENTÍFICA Y EVIDENCIA',
    tituloEditorial: 'Genética y gravedad en la escoliosis idiopática del adolescente: qué hallaron los investigadores',
    tituloOriginal: 'Genome-wide association study identifies GAK and KLF12 associated with curve severity of adolescent idiopathic scoliosis',
    revista: 'PeerJ',
    fechaPublicacion: '19 de enero de 2026',
    volumenArticulo: 'PeerJ 14:e20638',
    doi: '10.7717/peerj.20638',
    autores: ['Zhicheng Dai y colaboradores'],
    enlaces: [
      { texto: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/41584833/', tipo: 'pubmed' },
      { texto: 'PMC (texto completo)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12826036/', tipo: 'pmc' },
      { texto: 'DOI / PeerJ', url: 'https://doi.org/10.7717/peerj.20638', tipo: 'doi' },
    ],
    resumenBreve: 'Un estudio de asociación del genoma completo (GWAS) identificó variantes genéticas cercanas a los genes GAK y KLF12 que se asocian con la severidad de la curvatura en pacientes con escoliosis idiopática del adolescente (AIS).',
    enPocasPalabras: 'Se encontraron asociaciones genéticas con la severidad de la curva, pero aún no son de uso clínico.',
    preguntaInvestigacion: 'Investigar posibles asociaciones genéticas vinculadas a la severidad de la curvatura en pacientes con escoliosis idiopática del adolescente (AIS).',
    queEncontraron: [
      'Se identificaron asociaciones estadísticamente significativas en regiones cercanas al gen GAK.',
      'Se identificaron asociaciones estadísticamente significativas en regiones cercanas al gen KLF12.',
      'Las variantes genéticas correlacionan con el grado de curvatura radiográfica, pero no determinan el resultado individual.',
    ],
    porQueImporta: [
      'Ofrece nuevas vías para entender los mecanismos biológicos subyacentes de la progresión de las curvas.',
      'Puede ayudar en el desarrollo de futuros biomarcadores de progresión.',
      'Refuerza la evidencia de que la escoliosis AIS tiene un componente genético complejo.',
    ],
    loQueNoDemuestra: [
      'No constituye una prueba diagnóstica lista para su uso en clínica.',
      'No identifica una "cura genética" para la escoliosis.',
      'No sustituye los controles radiológicos ni el seguimiento clínico habitual.',
      'No justifica cambiar rutinas de ejercicio, uso de corsé ni decisiones de manejo basadas solo en pruebas genéticas.',
    ],
    queSignificaParaLector: 'Es investigación básica de biología molecular; las decisiones de manejo continúan rigiéndose por la valoración clínica especializada y los protocolos establecidos.',
    advertenciaClinica: 'Esta investigación es educativa y no sustituye la valoración clínica especializada. Los ejercicios y decisiones de manejo deben basarse en la evaluación de profesionales cualificados.',
    fechaVerificacion: '19 de enero de 2026',
    categoria: 'Genética y Biología Molecular',
    visualizacion: [
      {
        filas: [
          ['Fondo', 'Puntos de referencia'],
          ['Picos', 'Dos regiones: GAK y KLF12'],
          ['Marcas', 'Nodos de interés sin conexión entre sí'],
        ],
        tituloFila: 'Estructura conceptual',
        subtituloFila: 'Las dos regiones no están unidas: el estudio no afirma relación entre ellas.',
      },
    ],
  },
  {
    id: 'escoliosis-ejercicio-02',
    tipo: 'ejercicio',
    etiquetaEditorial: 'REVISIÓN SISTÉMICA · METAANÁLISIS EN RED',
    tituloEditorial: '¿Qué sabemos sobre los ejercicios específicos para la escoliosis?',
    tituloOriginal: 'Evaluating exercise therapies in adolescent idiopathic scoliosis: a systematic review with Bayesian network meta-analysis',
    revista: 'PeerJ',
    fechaPublicacion: '31 de marzo de 2025',
    volumenArticulo: 'PeerJ 13:e19175',
    doi: '10.7717/peerj.19175',
    autores: [
      'Yang Jiang',
      'Hao Peng',
      'Yanping Song',
      'Li Huang',
      'Hongbo Chen',
      'Pengcheng Li',
      'Guoshun Yang',
      'Yueyu Song',
      'Qigang Chen',
      'Na Yao',
    ],
    enlaces: [
      { texto: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/40183057/', tipo: 'pubmed' },
      { texto: 'DOI / PeerJ', url: 'https://doi.org/10.7717/peerj.19175', tipo: 'doi' },
    ],
    resumenBreve: 'Un metaanálisis en red de 23 estudios incluyó a 1.289 personas con escoliosis idiopática del adolescente (ISA) y comparó distintas modalidades de entrenamiento, evaluando ángulo de Cobb, rotación axial del tronco (ATR) y calidad de vida mediante SRS-22.',
    enPocasPalabras: 'Los estudios hallaron resultados prometedores para distintas modalidades, aunque la certeza de la evidencia sigue siendo baja y hace falta confirmación en estudios más rigurosos.',
    preguntaInvestigacion: 'Evaluar la eficacia de distintas modalidades de ejercicio en el tratamiento de la escoliosis idiopática del adolescente mediante un metaanálisis en red bayesiano.',
    queEncontraron: [
      'Se incluyeron 23 estudios con 1.289 participantes.',
      'Se compararon modalidades: PSSE, Schroth, Schroth con otras intervenciones, Pilates, entrenamiento de suspensión y PNF.',
      'En el análisis secundario, Schroth + Core mostró una diferencia media de -5,27° en el ángulo de Cobb frente al control, con intervalo de credibilidad de -14,15 a -3,5.',
      'El resultado principal del análisis combinado (SchrothCo) fue -4,79° para el ángulo de Cobb frente al control.',
      'La certeza de la evidencia para Schroth + Core fue baja según CINeMA.',
    ],
    porQueImporta: [
      'Permite comparar múltiples intervenciones en una sola red de evidencia.',
      'Ofrece una visión integral de la evidencia actual sobre ejercicio y escoliosis.',
    ],
    loQueNoDemuestra: [
      'La certeza de la evidencia para varias comparaciones fue baja.',
      'Los resultados de una comparación indirecta no equivalen a demostrar superioridad universal de un método.',
      'Los resultados no garantizan que una intervención produzca el mismo efecto en cada persona.',
      'Los autores señalan que hacen falta estudios más rigurosos para fortalecer la evidencia.',
      'Los resultados corresponden a escoliosis idiopática del adolescente y no deben extrapolarse a otras condiciones.',
    ],
    queSignificaParaLector: 'La evidencia actual sugiere que los ejercicios específicos pueden ser una opción complementaria, pero la certeza de los efectos es baja. Los resultados informan sobre estimaciones de grupo, no sobre promesas individuales.',
    advertenciaClinica: 'Esta investigación no constituye una rutina de ejercicios ni una recomendación individual de tratamiento. Los ejercicios específicos para la escoliosis deben valorarse y adaptarse con profesionales cualificados. La información de FitCasa es educativa y no sustituye la evaluación clínica.',
    fechaVerificacion: '31 de marzo de 2025',
    categoria: 'Ejercicio y Rehabilitación',
    visualizacion: [
      {
        filas: [
          ['PSSE', 'Ejercicios de función postural general'],
          ['Schroth', 'Método esquematizado, 3D'],
          ['Schroth + Core', 'Combinación con entrenamiento core'],
          ['Pilates', 'Entrenamiento core y postural'],
          ['Suspensión', 'Ejercicios con cuerda de suspensión'],
          ['PNF', 'Estimulación propioceptiva neuromuscular'],
        ],
        filasResultados: [
          ['Schroth', 'Cobb: -4,79° (vs control)', 'ATR: sin diferencia significativa'],
          ['Schroth + Core', 'Cobb: -5,27° (vs control), IC 95%: -14,15 a -3,5', 'ATR: mejoría en subanálisis'],
          ['Pilates', 'Cobb: sin diferencia significativa', 'ATR: sin diferencia significativa'],
        ],
        tituloFila: 'Análisis secundario: resultados aproximados (Intervalo de Credibilidad)',
        subtituloFila: 'Las cifras son estimaciones de grupo, no garantías individuales.',
      },
    ],
  },
];