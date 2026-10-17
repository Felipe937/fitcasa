import React, { useState, useEffect, useCallback } from 'react';
import { PageRoute } from '../components/Header';

interface ScoliosisPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export const ScoliosisPage: React.FC<ScoliosisPageProps> = ({ onNavigate }) => {
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const scrollToAnchor = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.focus();
    }
  }, []);

  /* Detecta la sección visible en el viewport y resalta el enlace del TOC. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleId: string | null = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleId = entry.target.id;
          }
        });
        if (visibleId) {
          setActiveSectionId(visibleId);
        }
      },
      { rootMargin: '-60px 0% -70% 0%', threshold: 0.1 },
    );

    const ids = [
      'que-es',
      'tipos',
      'ejercicio-papel',
      'ejercicios-fisioterapia',
      'adaptacion',
      'alertas',
      'faq',
      'siguientes-pasos',
      'fuentes',
    ];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const tocLinks = [
    { id: 'que-es', label: 'Qué es' },
    { id: 'tipos', label: 'Tipos de escoliosis' },
    { id: 'ejercicio-papel', label: 'El ejercicio' },
    { id: 'ejercicios-fisioterapia', label: 'Ejercicios específicos' },
    { id: 'adaptacion', label: 'Adaptaciones' },
    { id: 'alertas', label: 'Señales de alerta' },
    { id: 'faq', label: 'Preguntas frecuentes' },
    { id: 'siguientes-pasos', label: 'Siguientes pasos' },
    { id: 'fuentes', label: 'Fuentes' },
  ];

  const handleNavigateSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToAnchor(id);
  };

  const iconoMovilidad = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="scoliosis-esencial__icono">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="var(--color-secundario-oscuro)" />
    </svg>
  );

  const iconoProfesional = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="scoliosis-esencial__icono">
      <path d="M9 11.5v3L5.5 17 11 19.5l5.5-2.5V17l-3.5-2.5zM16 4h-3V2.5C13 1.12 11.88 0 10.5 0S8 1.12 8 2.5V4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3zM10.5 2C11.6 2 12.5 2.9 12.5 4S11.6 6 10.5 6 8 5.1 8 4 9.4 2 10.5 2z" fill="var(--color-secundario-oscuro)" />
    </svg>
  );

  const iconoSeguridad = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="scoliosis-esencial__icono">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zM12 3c.45 0 .85.37 1 .8L13 5H11l1-1.2c.15-.43.55-.8 1-.8zM12 17.2c-3.2 0-6-2.2-6-5.2S8.8 7 12 7s6 2.2 6 5.2S15.2 17.2 12 17.2z" fill="var(--color-secundario-oscuro)" />
    </svg>
  );

  const iconoWarn = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="scoliosis-notice__icono">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2V7h2v7z" fill="var(--color-terciario-oscuro)" />
    </svg>
  );

  const iconoUrgent = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="scoliosis-notice__icono">
      <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v11.33C7 18.4 7.6 19 8.33 19h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" fill="var(--color-peligro)" />
      <path d="M11 18h2v-2h-2v2zm1-16C13 1.49 12.52 1 12 1s-1 .49-1 1v1h2V3z" fill="var(--color-peligro)" />
    </svg>
  );

  const svgImpresora = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M19 8H5c-1.6 0-3 1.3-3 3v6h0v2c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h0v-6c0-1.7-1.4-3-3-3zm-3 0V4H6v4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM7 10h2v5H7zm10 5h-2v-5h2v5z" fill="currentColor" />
    </svg>
  );

  const svgCopiar = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h0V3h12V1zm3 4H8c-2.2 0-4 1.8-4 4v12c0 2.2 1.8 4 4 4h11c2.2 0 4-1.8 4-4V7c0-2.2-1.8-4-4-4zm0 2.5h-3v-2c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H6v12c0 2.2 1.8 4 4 4h11c2.2 0 4-1.8 4-4V7.5z" fill="currentColor" />
    </svg>
  );

  return (
    <main id="contenido" tabIndex={-1} className="scoliosis-page container py-8">
      {/* Hero editorial */}
      <section className="scoliosis-hero" aria-labelledby="titulo-hero">
        <div className="scoliosis-hero__contenido">
          <span className="scoliosis-hero__chip">
            GUÍA CLÍNICA DIVULGATIVA • ACTUALIZADA 2026
          </span>
          <h1 id="titulo-hero" className="scoliosis-hero__titulo">
            Ejercicio y escoliosis: información para moverte con confianza
          </h1>
          <p className="scoliosis-hero__apertura">
            Una guía divulgativa sobre qué puede aportar —y qué no— el ejercicio en la escoliosis, con las fuentes citadas al final.
          </p>
          <div className="scoliosis-hero__meta">
            <span className="scoliosis-hero__meta-item">
              <span className="scoliosis-hero__etiqueta">Lectura estimada</span>
              <span className="scoliosis-hero__valor" id="tiempo-lectura">6 minutos</span>
            </span>
          </div>
          <div className="scoliosis-hero__acciones">
            <button
              type="button"
              id="imprimir-guia"
              className="scoliosis-hero__btn-imprimir"
              onClick={handlePrint}
            >
              {svgImpresora} Imprimir guía
            </button>
            <button
              type="button"
              id="copiar-enlace"
              className="scoliosis-hero__btn-copiar"
              onClick={handleCopyLink}
              aria-label={copiado ? 'Enlace copiado al portapapeles' : 'Copiar enlace al portapapeles'}
            >
              {svgCopiar}
              {copiado ? '¡Copiado!' : 'Copiar enlace'}
            </button>
          </div>
          <div className="scoliosis-hero__ilustracion" aria-hidden="true">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gradVerde" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#15433b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#5c8276" stopOpacity={1} />
                </linearGradient>
              </defs>
              {/* Eje gravitacional vertical */}
              <line x1="100" y1="20" x2="100" y2="180" stroke="url(#gradVerde)" stroke-width="4" stroke-linecap="round" opacity="0.35" />
              {/* Columna abstracta (curva suave en S) */}
              <path d="M100 160 Q 110 140 100 120 Q 90 100 100 80 Q 110 60 100 40" fill="none" stroke="url(#gradVerde)" stroke-width="6" stroke-linecap="round" />
              {/* Puntos nodales de equilibrio postural */}
              <circle cx="100" cy="160" r="5" fill="#15433b" />
              <circle cx="100" cy="120" r="5" fill="#c86d51" />
              <circle cx="100" cy="80" r="5" fill="#5c8276" />
              <circle cx="100" cy="40" r="5" fill="#0e2f29" />
              {/* Ejes de referencia técnico */}
              <line x1="60" y1="160" x2="140" y2="160" stroke="#15433b" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6" />
              <line x1="60" y1="120" x2="140" y2="120" stroke="#c86d51" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6" />
              <line x1="60" y1="80" x2="140" y2="80" stroke="#5c8276" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6" />
              <line x1="60" y1="40" x2="140" y2="40" stroke="#0e2f29" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.6" />
              {/* Marcas de escala milimétrica discreta */}
              <line x1="96" y1="160" x2="104" y2="160" stroke="#15433b" stroke-width="2" />
              <line x1="96" y1="120" x2="104" y2="120" stroke="#c86d51" stroke-width="2" />
              <line x1="96" y1="80" x2="104" y2="80" stroke="#5c8276" stroke-width="2" />
              <line x1="96" y1="40" x2="104" y2="40" stroke="#0e2f29" stroke-width="2" />
            </svg>
          </div>
        </div>
      </section>

      <div className="container py-8">
        {/* Lo esencial - tríptico */}
        <aside className="scoliosis-esencial" aria-labelledby="titulo-esencial">
          <h2 id="titulo-esencial">Puntos clave en 30 segundos</h2>
          <div className="scoliosis-esencial__grid">
            <div className="scoliosis-esencial__tarjeta">
              <div className="scoliosis-esencial__cabecera">
                <span className="scoliosis-esencial__numero">01</span>
                {iconoMovilidad}
              </div>
              <h3 className="scoliosis-esencial__titulo">Movilidad y alivio</h3>
              <p className="scoliosis-esencial__texto">
                No está demostrado que el ejercicio corrija la curva; en adultos se orienta sobre todo a mantener la movilidad y aliviar el dolor.
              </p>
            </div>
            <div className="scoliosis-esencial__tarjeta">
              <div className="scoliosis-esencial__cabecera">
                <span className="scoliosis-esencial__numero">02</span>
                {iconoProfesional}
              </div>
              <h3 className="scoliosis-esencial__titulo">Instrucción profesional individualizada</h3>
              <p className="scoliosis-esencial__texto">
                Los ejercicios específicos para escoliosis (como Schroth o SEAS) requieren valoración y enseñanza individual por un fisioterapeuta formado, y la evidencia tiene limitaciones.
              </p>
            </div>
            <div className="scoliosis-esencial__tarjeta">
              <div className="scoliosis-esencial__cabecera">
                <span className="scoliosis-esencial__numero">03</span>
                {iconoSeguridad}
              </div>
              <h3 className="scoliosis-esencial__titulo">Seguridad y escucha corporal</h3>
              <p className="scoliosis-esencial__texto">
                Consulta a un profesional antes de empezar y detén la actividad ante dolor nuevo o intenso, debilidad, hormigueo o falta de aire.
              </p>
            </div>
          </div>
        </aside>

        {/* Botón índice móvil */}
        <button
          type="button"
          id="toc-toggle"
          className="scoliosis-toc-toggle"
          aria-expanded={tocOpen}
          aria-controls="toc-list"
          onClick={() => setTocOpen(!tocOpen)}
        >
          Índice de contenidos
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" width="1.25rem" height="1.25rem">
            <path d="M7 14l5-5 5 5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <div className="scoliosis-layout">
          <nav className={`scoliosis-toc ${tocOpen ? 'scoliosis-toc--abierto' : ''}`} aria-labelledby="toc-title">
            <p id="toc-title" className="scoliosis-toc__titulo">En esta página</p>
            <ul id="toc-list" className="scoliosis-toc__lista">
              {tocLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="scoliosis-toc__enlace"
                    aria-current={activeSectionId === link.id ? 'location' : undefined}
                    onClick={handleNavigateSection(link.id)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="scoliosis-contenido">
            {/* Qué es la escoliosis */}
            <section id="que-es" aria-labelledby="titulo-que-es" className="mb-8">
              <article>
                <h2 id="titulo-que-es" className="scoliosis-h2">
                  ¿Qué es la escoliosis?{' '}
                  <a className="scoliosis-ancla" href="#titulo-que-es" aria-label="Enlace a este apartado: ¿Qué es la escoliosis?">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <p>
                  La escoliosis es una curvatura tridimensional de la columna vertebral que combina desviación lateral y rotación de los cuerpos vertebrales. No es una enfermedad en sí, sino una condición estructural que puede variar en gravedad y progreso. Cada caso es individual y requiere una valoración profesional para determinar su relevancia clínica.
                </p>
              </article>
            </section>

            {/* Tipos de escoliosis */}
            <section id="tipos" aria-labelledby="titulo-tipos" className="mb-8">
              <article>
                <h2 id="titulo-tipos" className="scoliosis-h2">
                  Tipos de escoliosis{' '}
                  <a className="scoliosis-ancla" href="#titulo-tipos" aria-label="Enlace a este apartado: Tipos de escoliosis">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <div className="scoliosis-tipos">
                  <div className="scoliosis-tipo">
                    <span className="scoliosis-tipo__insignia">Más frecuente (~80%)</span>
                    <h3 className="scoliosis-tipo__titulo">Idiopática</h3>
                    <p className="scoliosis-tipo__texto">
                      La forma más frecuente, cuyo origen exacto es desconocido y se diagnostica típicamente en la adolescencia. Su estrategia de manejo se adapta a cada caso.
                    </p>
                  </div>
                  <div className="scoliosis-tipo">
                    <span className="scoliosis-tipo__insignia">Estructural de nacimiento</span>
                    <h3 className="scoliosis-tipo__titulo">Congénita</h3>
                    <p className="scoliosis-tipo__texto">
                      Resulta de anomalías estructurales de la columna presentes al nacer. Requiere seguimiento pediátrico y, en edad adulta, valoración especializada.
                    </p>
                  </div>
                  <div className="scoliosis-tipo">
                    <span className="scoliosis-tipo__insignia">Secundaria a afección de base</span>
                    <h3 className="scoliosis-tipo__titulo">Neuromuscular</h3>
                    <p className="scoliosis-tipo__texto">
                      Asociada a trastornos musculares o neurológicos que alteran el control postural. El enfoque se centra en el equilibrio postural y el tono muscular.
                    </p>
                  </div>
                </div>
                <p>
                  Estos tipos se diferencian en su causa y en la manera en que pueden evolucionar, por lo que la estrategia de manejo debe adaptarse a cada caso.
                </p>
              </article>
            </section>

            {/* Papel del ejercicio */}
            <section id="ejercicio-papel" aria-labelledby="titulo-ejercicio-papel" className="mb-8">
              <article>
                <h2 id="titulo-ejercicio-papel" className="scoliosis-h2">
                  ¿Qué papel tiene el ejercicio?{' '}
                  <a className="scoliosis-ancla" href="#titulo-ejercicio-papel" aria-label="Enlace a este apartado: ¿Qué papel tiene el ejercicio?">
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
            <section id="ejercicios-fisioterapia" aria-labelledby="titulo-ejercicios-fisioterapia" className="mb-8">
              <article>
                <h2 id="titulo-ejercicios-fisioterapia" className="scoliosis-h2">
                  Ejercicios fisioterapéuticos específicos para escoliosis{' '}
                  <a className="scoliosis-ancla" href="#titulo-ejercicios-fisioterapia" aria-label="Enlace a este apartado: Ejercicios fisioterapéuticos específicos para escoliosis">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <p>
                  El ejercicio general (caminar, nadar, fortalecimiento simétrico) no es lo mismo que los ejercicios fisioterapéuticos específicos para escoliosis (PSSE, por sus siglas en inglés): estos últimos son intervenciones asimétricas e individualizadas según el patrón de curva y la deformidad tridimensional de cada paciente, e incluyen autocorrección activa, control postural tridimensional, respiración y estabilización del tronco (Lee y Tak, 2026). Las guías SOSORT 2016 dedican 12 recomendaciones a los PSSE para prevenir la progresión durante el crecimiento, con fuerza de recomendación mayoritariamente B y heterogeneidad entre estudios que limita su generalización (Negrini et al., 2018).
                </p>
                <p>
                  Entre los enfoques más estudiados están <em>Schroth</em> y <em>SEAS</em> (además de otros como BSPTS o Lyon). Estos métodos requieren valoración individual e instrucción directa por parte de profesionales formados; no se recomienda su auto‑aprendizaje a través de recursos genéricos. Una revisión reciente encontró que las intervenciones totalmente supervisadas por un terapeuta se asociaron a mejores efectos que las modalidades híbridas o domiciliarias, aunque los autores piden interpretar el hallazgo con cautela por la heterogeneidad y el riesgo de sesgo (Lee y Tak, 2026).
                </p>

                <div className="table-wrapper scoliosis-tabla-wrapper">
                  <table className="scoliosis-tabla-evidencia">
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
                        <td data-label="Límites"><span className="scoliosis-etiqueta-sesgo">Evidencia moderada/baja · Riesgo de sesgo</span> La calidad de la evidencia era moderada a baja y la mayoría de los estudios tenía alto riesgo de sesgo</td>
                      </tr>
                      <tr>
                        <td data-label="Población y estudio">Revisión de 10 ensayos con 600 adolescentes (Lee y Tak, 2026)</td>
                        <td data-label="Qué se estudió">Ejercicios específicos para escoliosis con distintas intensidades de supervisión: ángulo de Cobb, rotación y cuestionario SRS‑22</td>
                        <td data-label="Qué se observó">Mejoras en el ángulo de Cobb y en la rotación con heterogeneidad alta, pero sin mejora significativa en el cuestionario de calidad de vida SRS‑22</td>
                        <td data-label="Límites"><span className="scoliosis-etiqueta-sesgo">Heterogeneidad alta · Riesgo de sesgo</span> Los autores piden interpretar el hallazgo con cautela por la heterogeneidad y el riesgo de sesgo</td>
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
            <section id="adaptacion" aria-labelledby="titulo-adaptacion" className="mb-8">
              <article>
                <h2 id="titulo-adaptacion" className="scoliosis-h2">
                  Actividades que pueden requerir adaptación{' '}
                  <a className="scoliosis-ancla" href="#titulo-adaptacion" aria-label="Enlace a este apartado: Actividades que pueden requerir adaptación">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <p>
                  Cualquier actividad física debe adaptarse a la curvatura y a la capacidad individual. No existe una lista única de ejercicios prohibidos. En su lugar, se sugiere:
                </p>
                <ul>
                  <li>Consultar con un fisioterapeuta antes de iniciar deportes de alto impacto o con movimientos de flexión/extensión intensos.</li>
                  <li>Ajustar la amplitud de movimiento según la tolerancia y el nivel de dolor.</li>
                  <li>Usar técnicas o equipamiento modificado solo con orientación profesional. Una órtesis o corsé debe estar indicado, ajustado y supervisado por el equipo sanitario; no se debe improvisar una faja o cinturón genérico como tratamiento.</li>
                </ul>
              </article>
            </section>

            {/* Señales de alerta */}
            <section id="alertas" aria-labelledby="titulo-alertas" className="mb-8">
              <article>
                <h2 id="titulo-alertas" className="scoliosis-h2">
                  Señales para detener una actividad{' '}
                  <a className="scoliosis-ancla" href="#titulo-alertas" aria-label="Enlace a este apartado: Señales para detener una actividad">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>

                <div className="scoliosis-notice-warn">
                  <div className="scoliosis-notice__header">
                    {iconoWarn}
                    <h3 className="scoliosis-notice__titulo">Consulta sanitaria (pide cita)</h3>
                  </div>
                  <p className="scoliosis-notice__texto">
                    Interrumpe el ejercicio y consulta a un profesional de la salud si experimentas alguno de los siguientes síntomas:
                  </p>
                  <ul>
                    <li>Dolor nuevo, intenso o que aumenta progresivamente.</li>
                    <li>Debilidad o pérdida de fuerza en extremidades.</li>
                    <li>Entumecimiento, hormigueo o sensación persistente de adormecimiento.</li>
                    <li>Dificultad para respirar o sensación de falta de aire durante la actividad.</li>
                    <li>Sensación de inestabilidad o desmayo.</li>
                  </ul>
                </div>

                <aside className="scoliosis-notice-urgent" aria-labelledby="titulo-urgente">
                  <div className="scoliosis-notice__header">
                    {iconoUrgent}
                    <h3 id="titulo-urgente" className="scoliosis-notice__titulo">Atención médica urgente</h3>
                  </div>
                  <p className="scoliosis-notice__texto">
                    En caso de síntomas súbitos y graves (por ejemplo, dolor torácico agudo o pérdida de control de esfínteres), busca atención médica de urgencia sin esperar a una cita.
                  </p>
                </aside>
              </article>
            </section>

            {/* FAQ */}
            <section id="faq" aria-labelledby="titulo-faq" className="mb-8">
              <article>
                <h2 id="titulo-faq" className="scoliosis-h2">
                  Preguntas frecuentes{' '}
                  <a className="scoliosis-ancla" href="#titulo-faq" aria-label="Enlace a este apartado: Preguntas frecuentes">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>

                <section className="scoliosis-faq">
                  <details className="mb-4">
                    <summary className="font-semibold cursor-pointer">¿Puedo hacer ejercicios de cardio si tengo escoliosis?</summary>
                    <p className="mt-2">
                      Según el NHS, el tipo de ejercicio importa menos que mantener la espalda en movimiento. En general, actividades como caminar, nadar o usar bicicleta estática son bien toleradas, pero la intensidad y la postura deben ajustarse a la comodidad individual y a la recomendación del profesional.
                    </p>
                  </details>

                  <details className="mb-4">
                    <summary className="font-semibold cursor-pointer">¿El método Schroth es adecuado para todos los pacientes?</summary>
                    <p className="mt-2">
                      No. Schroth es un enfoque especializado que necesita una valoración personalizada y la supervisión de un fisioterapeuta formado en el método. La evidencia disponible proviene de estudios en adolescentes, con resultados modestos y limitaciones metodológicas importantes, por lo que no debe generalizarse ni practicarse por cuenta propia (Zhu et al., 2025; Lee y Tak, 2026).
                    </p>
                  </details>

                  <details className="mb-4">
                    <summary className="font-semibold cursor-pointer">¿Cuánto tiempo debo dedicar al ejercicio cada semana?</summary>
                    <p className="mt-2">
                      No existe una frecuencia universal para las personas con escoliosis: depende de la edad, el tipo de curva, los síntomas, la condición física y la orientación profesional. Como referencia de salud general para adultos, la OMS recomienda acumular 150‑300 minutos semanales de actividad aeróbica moderada (o 75‑150 minutos vigorosa) y realizar fortalecimiento muscular al menos 2 días por semana. Esta referencia no es una prescripción para tratar la escoliosis; comienza de forma gradual y consulta con un profesional si tienes dolor, una cirugía reciente o restricciones.
                    </p>
                  </details>
                </section>
              </article>
            </section>

            {/* Siguientes pasos - Kit consulta */}
            <section id="siguientes-pasos" aria-labelledby="titulo-siguientes-pasos" className="mb-8">
              <article>
                <h2 id="titulo-siguientes-pasos" className="scoliosis-h2">
                  Siguientes pasos{' '}
                  <a className="scoliosis-ancla" href="#titulo-siguientes-pasos" aria-label="Enlace a este apartado: Siguientes pasos">
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

                <div className="scoliosis-checklist">
                  <h3>
                    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" width="1.5rem" height="1.5rem">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10l-5 5-3-3-1.41 1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" />
                    </svg>
                    Preguntas recomendadas para tu próxima visita al especialista
                  </h3>
                  <ul className="scoliosis-checklist__lista">
                    <li className="scoliosis-checklist__item">
                      <input type="checkbox" className="scoliosis-checklist__casilla" id="q1" />
                      <label htmlFor="q1" className="scoliosis-checklist__texto">¿Qué tipo de curva tengo y cómo puede evolucionar?</label>
                    </li>
                    <li className="scoliosis-checklist__item">
                      <input type="checkbox" className="scoliosis-checklist__casilla" id="q2" />
                      <label htmlFor="q2" className="scoliosis-checklist__texto">¿Qué ejercicios y actividades son adecuados para mí y cuáles debo adaptar o evitar?</label>
                    </li>
                    <li className="scoliosis-checklist__item">
                      <input type="checkbox" className="scoliosis-checklist__casilla" id="q3" />
                      <label htmlFor="q3" className="scoliosis-checklist__texto">¿Necesito ejercicios específicos para escoliosis o basta con ejercicio general?</label>
                    </li>
                    <li className="scoliosis-checklist__item">
                      <input type="checkbox" className="scoliosis-checklist__casilla" id="q4" />
                      <label htmlFor="q4" className="scoliosis-checklist__texto">¿Qué señales deben hacerme parar y a quién debo llamar?</label>
                    </li>
                    <li className="scoliosis-checklist__item">
                      <input type="checkbox" className="scoliosis-checklist__casilla" id="q5" />
                      <label htmlFor="q5" className="scoliosis-checklist__texto">¿Cada cuánto debo revisar mi caso?</label>
                    </li>
                  </ul>
                  <div className="scoliosis-checklist__accion">
                    <button
                      type="button"
                      id="copiar-preguntas"
                      className="scoliosis-checklist__btn-copiar"
                      onClick={handleCopyLink}
                    >
                      {svgCopiar} Copiar preguntas
                    </button>
                  </div>
                  <p id="copiar-confirmacion" className="scoliosis-checklist__confirmacion" aria-live="polite" hidden={!copiado}>
                    Preguntas copiadas al portapapeles
                  </p>
                </div>
              </article>
            </section>

            {/* Fuentes fiables */}
            <section id="fuentes" aria-labelledby="titulo-fuentes" className="mb-8">
              <article>
                <h2 id="titulo-fuentes" className="scoliosis-h2">
                  Fuentes fiables{' '}
                  <a className="scoliosis-ancla" href="#titulo-fuentes" aria-label="Enlace a este apartado: Fuentes fiables">
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
                <ol className="scoliosis-refs">
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
            <section id="aviso-legal" aria-labelledby="titulo-aviso-legal" className="mb-8">
              <article>
                <h2 id="titulo-aviso-legal" className="sr-only">Aviso legal</h2>
                <div className="scoliosis-aviso-legal">
                  <p>
                    <strong>Aviso de salud y responsabilidad:</strong> La información provista es exclusivamente educativa. No constituye diagnóstico, tratamiento ni consejo médico. Consulte siempre a su médico, fisioterapeuta o profesional sanitario antes de iniciar cualquier programa de ejercicio, especialmente si padece escoliosis o cualquier otra condición.
                  </p>
                </div>
              </article>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};
