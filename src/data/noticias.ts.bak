export interface EnlaceFuente {
  texto: string;
  url: string;
  tipo: 'pubmed' | 'pmc' | 'revista' | 'doi';
}

export interface ArticuloCientifico {
  id: string;
  categoria: string;
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
  fechaVerificacion: string;
}

export const articulosNoticias: ArticuloCientifico[] = [
  {
    id: 'aise-genetica-01',
    categoria: 'Genética y Biología Molecular',
    etiquetaEditorial: 'DIVULGACIÓN CIENTÍFICA Y EVIDENCIA',
    tituloEditorial: 'Genética y gravedad en la escoliosis idiopática del adolescente: qué hallaron los investigadores',
    tituloOriginal: 'Genome-wide association study identifies GAK and KLF12 associated with curve severity of adolescent idiopathic scoliosis',
    revista: 'PeerJ',
    fechaPublicacion: '19 de enero de 2026',
    volumenArticulo: 'PeerJ 14:e20638',
    doi: '10.7717/peerj.20638',
    autores: ['Zhicheng Dai y colaboradores'],
    enlaces: [
      {
        texto: 'PubMed',
        url: 'https://pubmed.ncbi.nlm.nih.gov/41584833/',
        tipo: 'pubmed',
      },
      {
        texto: 'PMC (texto completo)',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12826036/',
        tipo: 'pmc',
      },
      {
        texto: 'DOI / PeerJ',
        url: 'https://doi.org/10.7717/peerj.20638',
        tipo: 'doi',
      },
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
      'No justifica cambiar rutinas de ejercicio, uso de corsés ni decisiones de manejo basadas solo en pruebas genéticas.',
    ],
    queSignificaParaLector: 'Es investigación básica de biología molecular; las decisiones de manejo continúan rigiéndose por la valoración clínica especializada y los protocolos establecidos.',
    fechaVerificacion: '19 de enero de 2026',
  },
];