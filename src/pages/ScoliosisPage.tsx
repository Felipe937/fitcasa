import React, { useState } from 'react';
import { PageRoute } from '../components/Header';

interface ScoliosisPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export const ScoliosisPage: React.FC<ScoliosisPageProps> = ({ onNavigate }) => {
  const [tocOpen, setTocOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.focus();
    }
  };

  return (
    <main id="contenido" tabIndex={-1} className="page-escoliosis">
      {/* Hero */}
      <section className="hero hero--compact" aria-labelledby="titulo-hero" tabIndex={-1}>
        <div className="container">
          <h1 id="titulo-hero" className="texto-3xl">
            Ejercicio y escoliosis: información para moverte con confianza
          </h1>
          <p className="hero-apertura">
            Una guía divulgativa sobre qué puede aportar —y qué no— el ejercicio en la escoliosis, con las fuentes citadas al final.
          </p>
          <p className="hero-meta">
            Lectura: <span id="tiempo-lectura">6 minutos</span>{' '}
            <button
              type="button"
              id="imprimir-guia"
              className="btn secondary"
              style={{ marginLeft: '1rem', padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
              onClick={handlePrint}
            >
              Imprimir esta guía
            </button>
          </p>
        </div>
      </section>

      <div className="container py-8">
        <aside className="notice notice-info" aria-labelledby="titulo-esencial">
          <h2 id="titulo-esencial">Lo esencial</h2>
          <ul>
            <li>No está demostrado que el ejercicio corrija la curva; en adultos se orienta sobre todo a mantener la movilidad y aliviar el dolor.</li>
            <li>Los ejercicios específicos para escoliosis (como Schroth o SEAS) requieren valoración y enseñanza individual por un fisioterapeuta formado, y la evidencia tiene limitaciones que se explican más abajo.</li>
            <li>Consulta a un profesional antes de empezar un programa nuevo y detén la actividad ante dolor nuevo o intenso, debilidad, hormigueo o falta de aire.</li>
          </ul>
        </aside>

        <button
          type="button"
          id="toc-toggle"
          className="btn secondary my-4"
          aria-expanded={tocOpen}
          aria-controls="toc-list"
          onClick={() => setTocOpen(!tocOpen)}
        >
          Índice de contenidos
        </button>

        <div className="guia-layout">
          <nav
            className={`toc ${tocOpen ? 'toc--open' : ''}`}
            aria-labelledby="toc-title"
            style={tocOpen ? { display: 'block' } : undefined}
          >
            <p id="toc-title" className="font-bold">En esta página</p>
            <ul id="toc-list">
              <li>
                <a
                  href="#que-es"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToAnchor('que-es');
                  }}
                >
                  Qué es
                </a>
              </li>
              <li>
                <a
                  href="#tipos"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToAnchor('tipos');
                  }}
                >
                  Tipos
                </a>
              </li>
              <li>
                <a
                  href="#ejercicio-papel"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToAnchor('ejercicio-papel');
                  }}
                >
                  El ejercicio
                </a>
              </li>
              <li>
                <a
                  href="#ejercicios-fisioterapia"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToAnchor('ejercicios-fisioterapia');
                  }}
                >
                  Ejercicios específicos
                </a>
              </li>
              <li>
                <a
                  href="#adaptacion"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToAnchor('adaptacion');
                  }}
                >
                  Adaptaciones
                </a>
              </li>
              <li>
                <a
                  href="#alertas"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToAnchor('alertas');
                  }}
                >
                  Señales de alerta
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToAnchor('faq');
                  }}
                >
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a
                  href="#siguientes-pasos"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToAnchor('siguientes-pasos');
                  }}
                >
                  Siguientes pasos
                </a>
              </li>
              <li>
                <a
                  href="#fuentes"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToAnchor('fuentes');
                  }}
                >
                  Fuentes
                </a>
              </li>
            </ul>
          </nav>

          <div className="guia-contenido">
            {/* Qué es la escoliosis */}
            <section id="que-es" aria-labelledby="titulo-que-es" tabIndex={-1} className="mb-8">
              <article>
                <h2 id="titulo-que-es">
                  ¿Qué es la escoliosis?{' '}
                  <a className="anchor-link" href="#titulo-que-es" aria-label="Enlace a este apartado: ¿Qué es la escoliosis?">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <p>
                  La escoliosis es una curvatura tridimensional de la columna vertebral que combina desviación lateral y rotación de los cuerpos vertebrales. No es una enfermedad en sí, sino una condición estructural que puede variar en gravedad y progreso. Cada caso es individual y requiere una valoración profesional para determinar su relevancia clínica.
                </p>
              </article>
            </section>

            {/* Tipos de escoliosis */}
            <section id="tipos" aria-labelledby="titulo-tipos" tabIndex={-1} className="mb-8">
              <article>
                <h2 id="titulo-tipos">
                  Tipos de escoliosis{' '}
                  <a className="anchor-link" href="#titulo-tipos" aria-label="Enlace a este apartado: Tipos de escoliosis">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <ul>
                  <li>
                    <strong>Idiopática:</strong> La forma más frecuente, cuyo origen exacto es desconocido y se diagnostica típicamente en la adolescencia.
                  </li>
                  <li>
                    <strong>Congénita:</strong> Resulta de anomalías estructurales de la columna presentes al nacer.
                  </li>
                  <li>
                    <strong>Neuromuscular:</strong> Asociada a trastornos musculares o neurológicos (por ejemplo, parálisis cerebral, distrofia muscular) que alteran el control postural.
                  </li>
                </ul>
                <p>
                  Estos tipos se diferencian en su causa y en la manera en que pueden evolucionar, por lo que la estrategia de manejo debe adaptarse a cada caso.
                </p>
              </article>
            </section>

            {/* Papel del ejercicio */}
            <section id="ejercicio-papel" aria-labelledby="titulo-ejercicio-papel" tabIndex={-1} className="mb-8">
              <article>
                <h2 id="titulo-ejercicio-papel">
                  ¿Qué papel tiene el ejercicio?{' '}
                  <a className="anchor-link" href="#titulo-ejercicio-papel" aria-label="Enlace a este apartado: ¿Qué papel tiene el ejercicio?">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <p>
                  En adultos, el dolor de espalda es uno de los principales problemas asociados a la escoliosis, y el tratamiento se orienta sobre todo a aliviarlo (NHS, 2023). Las actividades que fortalecen y estiran la espalda pueden ayudar a reducir el dolor y a mantener un peso saludable; el tipo concreto de ejercicio importa menos que mantener la espalda en movimiento con una actividad que se disfrute y se pueda mantener en el tiempo (NHS, 2023). Los ejercicios enseñados por un fisioterapeuta es poco probable que mejoren la curvatura, pero pueden ayudar con el dolor (NHS, 2023). En personas con escoliosis, la actividad física puede:
                </p>
                <ul>
                  <li>Mantener la movilidad y un estilo de vida activo.</li>
                  <li>Fortalecer y estirar la musculatura de la espalda, lo que puede ayudar a reducir el dolor, sin que esté demostrado que corrija la curva.</li>
                  <li>Complementar el seguimiento profesional: conviene consultar con un médico, especialista o fisioterapeuta antes de empezar un programa nuevo, para comprobar que sea seguro (NHS, 2023).</li>
                </ul>
                <p>
                  Los objetivos específicos (por ejemplo, prevención de la progresión, alivio del dolor) dependen de la evaluación individual hecha por un fisioterapeuta o médico especializado.
                </p>
              </article>
            </section>

            {/* Ejercicios fisioterapéuticos específicos */}
            <section id="ejercicios-fisioterapia" aria-labelledby="titulo-ejercicios-fisioterapia" tabIndex={-1} className="mb-8">
              <article>
                <h2 id="titulo-ejercicios-fisioterapia">
                  Ejercicios fisioterapéuticos específicos para escoliosis{' '}
                  <a className="anchor-link" href="#titulo-ejercicios-fisioterapia" aria-label="Enlace a este apartado: Ejercicios fisioterapéuticos específicos para escoliosis">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <p>
                  El ejercicio general (caminar, nadar, fortalecimiento simétrico) no es lo mismo que los ejercicios fisioterapéuticos específicos para escoliosis (PSSE, por sus siglas en inglés): estos últimos son intervenciones asimétricas e individualizadas según el patrón de curva y la deformidad tridimensional de cada paciente, e incluyen autocorrección activa, control postural tridimensional, respiración y estabilización del tronco (Lee y Tak, 2026). Las guías SOSORT 2016 dedican 12 recomendaciones a los PSSE para prevenir la progresión durante el crecimiento, con fuerza de recomendación mayoritariamente B y heterogeneidad entre estudios que limita su generalización (Negrini et al., 2018).
                </p>
                <p>
                  Entre los enfoques más estudiados están <em>Schroth</em> y <em>SEAS</em> (además de otros como BSPTS o Lyon). Estos métodos requieren valoración individual e instrucción directa por parte de profesionales formados; no se recomienda su auto‑aprendizaje a través de recursos genéricos. Una revisión reciente encontró que las intervenciones totalmente supervisadas por un terapeuta se asociaron a mejores efectos que las modalidades híbridas o domiciliarias, aunque los autores piden interpretar el hallazgo con cautela por la heterogeneidad y el riesgo de sesgo (Lee y Tak, 2026).
                </p>

                <div className="table-wrapper overflow-x-auto my-4">
                  <table className="tabla-evidencia w-full">
                    <caption>Qué dicen los estudios</caption>
                    <thead>
                      <tr>
                        <th scope="col">Población y estudio</th>
                        <th scope="col">Qué se estudió</th>
                        <th scope="col">Qué se observó</th>
                        <th scope="col">Límites</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td data-label="Población y estudio">Metaanálisis de 11 ensayos aleatorizados con 446 adolescentes (Zhu et al., 2025)</td>
                        <td data-label="Qué se estudió">Ejercicios de Schroth: ángulo de Cobb, rotación del tronco y calidad de vida</td>
                        <td data-label="Qué se observó">Reducción media del ángulo de Cobb de unos 3,2 grados, por debajo del umbral de 5 grados que suele considerarse clínicamente relevante, sin efecto significativo en la rotación del tronco y con mejora de la calidad de vida</td>
                        <td data-label="Límites">La calidad de la evidencia era moderada a baja y la mayoría de los estudios tenía alto riesgo de sesgo</td>
                      </tr>
                      <tr>
                        <td data-label="Población y estudio">Revisión de 10 ensayos con 600 adolescentes (Lee y Tak, 2026)</td>
                        <td data-label="Qué se estudió">Ejercicios específicos para escoliosis con distintas intensidades de supervisión: ángulo de Cobb, rotación y cuestionario SRS‑22</td>
                        <td data-label="Qué se observó">Mejoras en el ángulo de Cobb y en la rotación con heterogeneidad alta, pero sin mejora significativa en el cuestionario de calidad de vida SRS‑22</td>
                        <td data-label="Límites">Los autores piden interpretar el hallazgo con cautela por la heterogeneidad y el riesgo de sesgo</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  Ambos trabajos estudiaron solo a adolescentes con escoliosis idiopática y seguimientos cortos, por lo que sus resultados no pueden generalizarse a adultos.
                </p>
              </article>
            </section>

            {/* Actividades que requieren adaptación */}
            <section id="adaptacion" aria-labelledby="titulo-adaptacion" tabIndex={-1} className="mb-8">
              <article>
                <h2 id="titulo-adaptacion">
                  Actividades que pueden requerir adaptación{' '}
                  <a className="anchor-link" href="#titulo-adaptacion" aria-label="Enlace a este apartado: Actividades que pueden requerir adaptación">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <p>
                  Cualquier actividad física debe adaptarse a la curvatura y a la capacidad individual. No existe una lista única de ejercicios “prohibidos”. En su lugar, se sugiere:
                </p>
                <ul>
                  <li>Consultar con un fisioterapeuta antes de iniciar deportes de alto impacto o con movimientos de flexión/extensión intensos.</li>
                  <li>Ajustar la amplitud de movimiento según la tolerancia y el nivel de dolor.</li>
                  <li>Usar técnicas o equipamiento modificado solo con orientación profesional. Una órtesis o corsé debe estar indicado, ajustado y supervisado por el equipo sanitario; no se debe improvisar una faja o cinturón genérico como tratamiento.</li>
                </ul>
              </article>
            </section>

            {/* Señales de alerta */}
            <section id="alertas" aria-labelledby="titulo-alertas" tabIndex={-1} className="mb-8">
              <article>
                <h2 id="titulo-alertas">
                  Señales para detener una actividad{' '}
                  <a className="anchor-link" href="#titulo-alertas" aria-label="Enlace a este apartado: Señales para detener una actividad">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <div className="notice notice-warn">
                  <p>
                    <strong>Consulta sanitaria (pide cita):</strong> interrumpa el ejercicio y consulte a un profesional de la salud si experimenta alguno de los siguientes síntomas:
                  </p>
                  <ul>
                    <li>Dolor nuevo, intenso o que aumenta progresivamente.</li>
                    <li>Debilidad o pérdida de fuerza en extremidades.</li>
                    <li>Entumecimiento, hormigueo o sensación persistente de adormecimiento.</li>
                    <li>Dificultad para respirar o sensación de falta de aire durante la actividad.</li>
                    <li>Sensación de inestabilidad o desmayo.</li>
                  </ul>
                </div>
                <aside className="notice notice-urgent" aria-labelledby="titulo-urgente">
                  <h3 id="titulo-urgente">Atención urgente</h3>
                  <p>
                    En caso de síntomas súbitos y graves (por ejemplo, dolor torácico agudo o pérdida de control de esfínteres), busque atención médica de urgencia sin esperar a una cita.
                  </p>
                </aside>
              </article>
            </section>

            {/* FAQ */}
            <section id="faq" aria-labelledby="titulo-faq" tabIndex={-1} className="mb-8">
              <article>
                <h2 id="titulo-faq">
                  Preguntas frecuentes{' '}
                  <a className="anchor-link" href="#titulo-faq" aria-label="Enlace a este apartado: Preguntas frecuentes">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>

                <details className="mb-4 p-4 border border-[var(--color-borde)] rounded-[var(--radio-md)]">
                  <summary className="font-semibold cursor-pointer">¿Puedo hacer ejercicios de cardio si tengo escoliosis?</summary>
                  <p className="mt-2">
                    Según el NHS, el tipo de ejercicio importa menos que mantener la espalda en movimiento. En general, actividades como caminar, nadar o usar bicicleta estática son bien toleradas, pero la intensidad y la postura deben ajustarse a la comodidad individual y a la recomendación del profesional.
                  </p>
                </details>

                <details className="mb-4 p-4 border border-[var(--color-borde)] rounded-[var(--radio-md)]">
                  <summary className="font-semibold cursor-pointer">¿El método Schroth es adecuado para todos los pacientes?</summary>
                  <p className="mt-2">
                    No. Schroth es un enfoque especializado que necesita una valoración personalizada y la supervisión de un fisioterapeuta formado en el método. La evidencia disponible proviene de estudios en adolescentes, con resultados modestos y limitaciones metodológicas importantes, por lo que no debe generalizarse ni practicarse por cuenta propia (Zhu et al., 2025; Lee y Tak, 2026).
                  </p>
                </details>

                <details className="mb-4 p-4 border border-[var(--color-borde)] rounded-[var(--radio-md)]">
                  <summary className="font-semibold cursor-pointer">¿Cuánto tiempo debo dedicar al ejercicio cada semana?</summary>
                  <p className="mt-2">
                    No existe una frecuencia universal para las personas con escoliosis: depende de la edad, el tipo de curva, los síntomas, la condición física y la orientación profesional. Como referencia de salud general para adultos, la OMS recomienda acumular 150‑300 minutos semanales de actividad aeróbica moderada (o 75‑150 minutos vigorosa) y realizar fortalecimiento muscular al menos 2 días por semana. Esta referencia no es una prescripción para tratar la escoliosis; comienza de forma gradual y consulta con un profesional si tienes dolor, una cirugía reciente o restricciones.
                  </p>
                </details>
              </article>
            </section>

            {/* Siguientes pasos */}
            <section id="siguientes-pasos" aria-labelledby="titulo-siguientes-pasos" tabIndex={-1} className="mb-8">
              <article>
                <h2 id="titulo-siguientes-pasos">
                  Siguientes pasos{' '}
                  <a className="anchor-link" href="#titulo-siguientes-pasos" aria-label="Enlace a este apartado: Siguientes pasos">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <ul>
                  <li>
                    <a
                      href="#ejercicios"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('ejercicios');
                      }}
                    >
                      Explorar ejercicios generales
                    </a>
                    . Son ejercicios generales: no sustituyen los ejercicios específicos para escoliosis que pauta un fisioterapeuta.
                  </li>
                  <li>
                    <a
                      href="#panel"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('panel');
                      }}
                    >
                      Registrar cómo me siento
                    </a>
                  </li>
                </ul>

                <h3>Para llevar a tu consulta</h3>
                <ul>
                  <li>¿Qué tipo de curva tengo y cómo puede evolucionar?</li>
                  <li>¿Qué ejercicios y actividades son adecuados para mí y cuáles debo adaptar o evitar?</li>
                  <li>¿Necesito ejercicios específicos para escoliosis o basta con ejercicio general?</li>
                  <li>¿Qué señales deben hacerme parar y a quién debo llamar?</li>
                  <li>¿Cada cuánto debo revisar mi caso?</li>
                </ul>
              </article>
            </section>

            {/* Fuentes fiables */}
            <section id="fuentes" aria-labelledby="titulo-fuentes" tabIndex={-1} className="mb-8">
              <article>
                <h2 id="titulo-fuentes">
                  Fuentes fiables{' '}
                  <a className="anchor-link" href="#titulo-fuentes" aria-label="Enlace a este apartado: Fuentes fiables">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <ul>
                  <li>
                    <a href="https://sosort.org" target="_blank" rel="noopener noreferrer">
                      Guías SOSORT – Sociedad Internacional sobre el Tratamiento Ortopédico y Rehabilitador de la Escoliosis (SOSORT)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.srs.org" target="_blank" rel="noopener noreferrer">
                      Scoliosis Research Society (SRS)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.who.int/initiatives/behealthy/physical-activity" target="_blank" rel="noopener noreferrer">
                      OMS – Recomendaciones generales de actividad física
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nhs.uk/conditions/scoliosis/treatment-in-adults/" target="_blank" rel="noopener noreferrer">
                      NHS – Tratamiento de la escoliosis en adultos
                    </a>
                  </li>
                  <li>
                    <a href="https://www.rnoh.nhs.uk/services/scoliosis/conservative-management-scoliosis/outpatient-scoliosis-physiotherapy" target="_blank" rel="noopener noreferrer">
                      Royal National Orthopaedic Hospital – Fisioterapia para escoliosis
                    </a>
                  </li>
                  <li>
                    <a href="https://www.mayoclinic.org/diseases-conditions/scoliosis/symptoms-causes/syc-20350716" target="_blank" rel="noopener noreferrer">
                      Mayo Clinic – Escoliosis
                    </a>
                  </li>
                </ul>

                <h3>Referencias citadas en esta página</h3>
                <ol className="refs">
                  <li id="ref-1">
                    Negrini, S., et al. (2018). Guías SOSORT 2016: tratamiento ortopédico y rehabilitador de la escoliosis idiopática durante el crecimiento.{' '}
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5795289/" target="_blank" rel="noopener noreferrer">
                      PMC5795289
                    </a>.
                  </li>
                  <li id="ref-2">
                    Zhu, Y., et al. (2025). Efectividad de los ejercicios de Schroth en la escoliosis idiopática adolescente: metaanálisis de 11 ensayos aleatorizados.{' '}
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12248227/" target="_blank" rel="noopener noreferrer">
                      PMC12248227
                    </a>.
                  </li>
                  <li id="ref-3">
                    Lee, S.-Y. y Tak, J.-Y. (2026). Efecto de la supervisión en los ejercicios específicos para escoliosis en adolescentes: revisión sistemática y metaanálisis de 10 ensayos aleatorizados.{' '}
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC13117688/" target="_blank" rel="noopener noreferrer">
                      PMC13117688
                    </a>.
                  </li>
                  <li id="ref-4">
                    NHS (revisado en 2023). Tratamiento de la escoliosis en adultos.{' '}
                    <a href="https://www.nhs.uk/conditions/scoliosis/treatment-in-adults/" target="_blank" rel="noopener noreferrer">
                      nhs.uk
                    </a>.
                  </li>
                  <li id="ref-5">
                    OMS (2020). Directrices sobre actividad física y comportamiento sedentario (referencia de salud general, no guía de escoliosis).{' '}
                    <a href="https://www.who.int/publications/i/item/9789240015128" target="_blank" rel="noopener noreferrer">
                      who.int
                    </a>.
                  </li>
                </ol>
              </article>
            </section>

            {/* Aviso legal */}
            <section id="aviso-legal" aria-labelledby="titulo-aviso-legal" tabIndex={-1}>
              <article>
                <h2 id="titulo-aviso-legal" className="sr-only">Aviso legal</h2>
                <p>
                  <strong>Aviso de salud y responsabilidad:</strong> La información provista es exclusivamente educativa. No constituye diagnóstico, tratamiento ni consejo médico. Consulte siempre a su médico, fisioterapeuta o profesional sanitario antes de iniciar cualquier programa de ejercicio, especialmente si padece escoliosis o cualquier otra condición.
                </p>
              </article>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};
