import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PageRoute } from '../components/Header';

interface CuerpoYSaludPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

interface Seccion {
  id: string;
  titulo: string;
}

const SECCIONES: Seccion[] = [
  { id: 'que-es-imc', titulo: 'Qué es el IMC y para qué sirve' },
  { id: 'limitaciones', titulo: 'Qué no te dice un número' },
  { id: 'movimiento', titulo: 'Movimiento sin meta de peso' },
  { id: 'profesional', titulo: 'Cuándo consultar a un profesional' },
];

export const CuerpoYSaludPage: React.FC<CuerpoYSaludPageProps> = ({ onNavigate }) => {
  const [pausado, setPausado] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const irASeccion = useCallback((event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const destino = document.getElementById(id);
    if (!destino) return;
    destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    destino.focus();
  }, []);

  const navegar = (page: PageRoute) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(page);
  };

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );

    document.querySelectorAll('.cuerpo-salud-section[data-reveal]').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <main id="contenido" tabIndex={-1} className="cuerpo-salud-page">
      {/* Hero editorial */}
      <section className="cuerpo-salud-hero" aria-labelledby="hero-titulo">
        <div className="container cuerpo-salud-hero__layout">
          <div className="cuerpo-salud-hero__content">
            <span className="cuerpo-salud-hero__numero" aria-hidden="true">01</span>
            <span className="cuerpo-salud-hero__insignia">
              Educación sobre indicadores de salud
            </span>
            <h1 id="hero-titulo" className="cuerpo-salud-hero__titulo">
              Cuerpo, movimiento y salud
            </h1>
            <p className="cuerpo-salud-hero__subtitulo">
              Qué nos dicen los indicadores y qué no. Comprender las limitaciones del índice de masa
              corporal (IMC) y por qué el bienestar va más allá de una cifra.
            </p>
          </div>
          <div className="cuerpo-salud-hero__visual" role="img" aria-label="Esquema abstracto de una balanza">
            <div className={`cuerpo-salud-hero__escena${pausado ? ' esta-pausado' : ''}`}>
              <svg
                className="cuerpo-salud-hero__svg"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="grad-equilibrio" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--color-primario)" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="var(--color-secundario)" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="var(--color-primario-oscuro)" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Capa trasera (tenue, traslúcida) */}
                <g className="cuerpo-salud-hero__capa--trasera">
                  <rect x="95" y="140" width="10" height="40" fill="var(--color-primario-oscuro)" opacity="0.3" />
                  <rect x="80" y="175" width="40" height="5" rx="2" fill="var(--color-primario-oscuro)" opacity="0.3" />
                  <ellipse cx="60" cy="140" rx="40" ry="8" fill="var(--color-secundario)" opacity="0.2" />
                  <ellipse cx="140" cy="140" rx="40" ry="8" fill="var(--color-secundario)" opacity="0.2" />
                </g>

                {/* Capa media (brazo y platillos) */}
                <g className="cuerpo-salud-hero__capa--media">
                  <rect x="95" y="140" width="10" height="40" fill="var(--color-primario-oscuro)" />
                  <rect x="80" y="175" width="40" height="5" rx="2" fill="var(--color-primario-oscuro)" />
                  <ellipse cx="60" cy="140" rx="40" ry="8" fill="url(#grad-equilibrio)" />
                  <line x1="60" y1="148" x2="95" y2="140" stroke="var(--color-primario-oscuro)" strokeWidth="2" />
                  <ellipse cx="140" cy="140" rx="40" ry="8" fill="url(#grad-equilibrio)" />
                  <line x1="140" y1="148" x2="105" y2="140" stroke="var(--color-primario-oscuro)" strokeWidth="2" />
                </g>

                {/* Capa delantera (detalles de trazo) */}
                <g className="cuerpo-salud-hero__capa--delantera">
                  <circle cx="55" cy="135" r="4" fill="var(--color-salvia-claro)" opacity="0.6" />
                  <circle cx="65" cy="138" r="3" fill="var(--color-salvia-claro)" opacity="0.4" />
                  <circle cx="135" cy="136" r="4" fill="var(--color-salvia-claro)" opacity="0.6" />
                  <circle cx="145" cy="138" r="3" fill="var(--color-salvia-claro)" opacity="0.4" />
                  <circle cx="100" cy="100" r="8" fill="var(--color-secundario)" />
                  <circle cx="100" cy="100" r="4" fill="var(--color-superficie)" />
                </g>
              </svg>
            </div>
            <button
              type="button"
              className="cuerpo-salud-hero__pausa"
              onClick={() => setPausado((p) => !p)}
              aria-pressed={pausado}
            >
              {pausado ? 'Reanudar movimiento' : 'Pausar movimiento'}
            </button>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Índice de contenidos */}
        <nav className="cuerpo-salud-toc" aria-labelledby="toc-titulo">
          <h2 id="toc-titulo">Índice de contenidos</h2>
          <ul>
            {SECCIONES.map((seccion) => (
              <li key={seccion.id}>
                <a href={`#${seccion.id}`} onClick={(e) => irASeccion(e, seccion.id)}>
                  {seccion.titulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sección 1: Qué es el IMC */}
        <section className="cuerpo-salud-section" aria-labelledby="sec-que-es-imc" id="que-es-imc" tabIndex={-1} data-reveal>
          <h2 id="sec-que-es-imc">Qué es el IMC y para qué sirve</h2>
          <p>
            El índice de masa corporal (IMC) es una medida de peso ajustada por estatura. Se calcula
            dividiendo el peso en kilogramos por el cuadrado de la estatura en metros (kg/m²). La
            Organización Mundial de la Salud define el IMC como un índice de peso para estatura
            comúnmente utilizado para clasificar sobrepeso y obesidad.
          </p>
          <p>
            En adultos, los puntos de corte estándar son: sobrepeso cuando el IMC es mayor o igual
            a 25, y obesidad cuando el IMC es mayor o igual a 30. Estos valores se utilizan como
            referencia en salud pública para estimar la prevalencia de sobrepeso y obesidad en
            poblaciones.
          </p>
          <p>
            El IMC es una herramienta de cribado sencilla y económica porque solo requiere peso y
            estatura. Sin embargo, no mide la grasa corporal directamente y no constituye un
            diagnóstico individual de adiposidad ni de estado de salud.
          </p>
          <div className="cuerpo-salud-sources">
            <h3>Fuente</h3>
            <ul>
              <li>
                Organización Mundial de la Salud.{' '}
                <em>Obesity and overweight - Fact sheet</em>. Disponible en:{' '}
                <a
                  href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  who.int
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* Sección 2: Limitaciones */}
        <section className="cuerpo-salud-section" aria-labelledby="sec-limitaciones" id="limitaciones" tabIndex={-1} data-reveal>
          <h2 id="sec-limitaciones">Qué no te dice un número</h2>
          <p>
            El IMC es una medida útil a nivel poblacional, pero tiene limitaciones importantes como
            indicador individual de salud.
          </p>
          <div className="cuerpo-salud-cards">
            <div className="cuerpo-salud-card cuerpo-salud-card--destacada">
              <h3>Composición corporal</h3>
              <p>
                El IMC no distingue entre masa muscular, masa ósea y tejido adiposo. Una persona
                con mucha masa muscular puede tener un IMC elevado sin exceso de grasa. Tampoco indica
                cómo se distribuye la grasa en el cuerpo.
              </p>
            </div>
            <div className="cuerpo-salud-card cuerpo-salud-card--izquierda">
              <h3>Menores de 18 años</h3>
              <p>
                En niños y adolescentes los umbrales de IMC son distintos y dependen de la edad y el
                sexo. La OMS proporciona referencias específicas (IMC para la edad) para el grupo de
                5 a 19 años, que se alinean con los puntos de corte adultos a los 19 años.
              </p>
            </div>
            <div className="cuerpo-salud-card cuerpo-salud-card--derecha">
              <h3>Adultos mayores y grupos étnicos</h3>
              <p>
                Para el mismo IMC, los adultos mayores tienden a tener menor masa muscular y mayor
                masa grasa que los adultos jóvenes. Además, la relación entre IMC y grasa corporal varía
                según el sexo y la etnia, por lo que los puntos de corte habituales pueden no ser
                representativos para todos los grupos.
              </p>
            </div>
            <div className="cuerpo-salud-card cuerpo-salud-card--base">
              <h3>Funcionalidad y bienestar</h3>
              <p>
                El bienestar incluye movilidad, energía, descanso y constancia en los hábitos.
                Ningún número mide por sí solo estos aspectos, que son fundamentales para la calidad
                de vida y la experiencia de vivir en un cuerpo.
              </p>
            </div>
          </div>
          <div className="cuerpo-salud-sources">
            <h3>Fuentes</h3>
            <ul>
              <li>
                Organización Mundial de la Salud.{' '}
                <em>Growth reference data for 5-19 years</em>. Disponible en:{' '}
                <a
                  href="https://www.who.int/tools/growth-reference-data-for-5to19-years"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  who.int
                </a>
              </li>
              <li>
                National Center for Biotechnology Information (NCBI Bookshelf).{' '}
                <em>The Science, Strengths, and Limitations of Body Mass Index</em>. Disponible en:{' '}
                <a
                  href="https://www.ncbi.nlm.nih.gov/books/NBK594362/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ncbi.nlm.nih.gov
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* Sección 3: Movimiento sin meta de peso */}
        <section className="cuerpo-salud-section" aria-labelledby="sec-movimiento" id="movimiento" tabIndex={-1} data-reveal>
          <h2 id="sec-movimiento">Movimiento sin meta de peso</h2>
          <p>
            La actividad física regular aporta beneficios significativos para la salud física y
            mental, independientemente del peso corporal. Según la Organización Mundial de la Salud,
            el ejercicio contribuye a la prevención y manejo de enfermedades no transmisibles como
            enfermedades cardiovasculares, cáncer y diabetes. También reduce síntomas de depresión
            y ansiedad, mejora la salud cerebral y puede aumentar el bienestar general.
          </p>
          <p>
            FitCasa ofrece ejercicios generales y cuidado postural que puedes realizar en casa, sin
            equipamiento especializado. El objetivo es promover movimiento consciente y bienestar
            general, no cambiar el peso ni la apariencia.
          </p>
          <div className="cuerpo-salud-ctas">
            <a href="#ejercicios" className="cuerpo-salud-cta" onClick={navegar('ejercicios')}>
              Explorar ejercicios
            </a>
            <a href="#escoliosis" className="cuerpo-salud-cta secondary" onClick={navegar('escoliosis')}>
              Ver la guía de escoliosis
            </a>
          </div>
          <div className="cuerpo-salud-sources">
            <h3>Fuente</h3>
            <ul>
              <li>
                Organización Mundial de la Salud.{' '}
                <em>Physical activity - Fact sheet</em>. Disponible en:{' '}
                <a
                  href="https://www.who.int/news-room/fact-sheets/detail/physical-activity"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  who.int
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* Sección 4: Cuándo consultar */}
        <section className="cuerpo-salud-section" aria-labelledby="sec-profesional" id="profesional" tabIndex={-1} data-reveal>
          <h2 id="sec-profesional">Cuándo consultar a un profesional</h2>
          <p>
            Un profesional de salud puede interpretar los indicadores como el IMC en el contexto
            individual, considerando historial médico, circunstancias personales y otros factores que
            un número aislado no refleja. La evaluación clínica completa incluye mediciones adicionales
                y una valoración del estado de salud integral.
          </p>
          <p>
            Si tienes dudas sobre tu estado de salud, cambios bruscos de peso o síntomas que te
            preocupan, consulta con un profesional sanitario cualificado.
          </p>
        </section>

        {/* Nota de rigor */}
        <div className="cuerpo-salud-disclaimer" role="note">
          <p>
            <strong>Contenido educativo elaborado por un estudiante.</strong> No sustituye la
            valoración de un profesional de la salud. Fuentes citadas al final de cada sección.
          </p>
        </div>
      </div>
    </main>
  );
};
