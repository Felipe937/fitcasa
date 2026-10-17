import React, { useEffect, useMemo, useState } from 'react';
import { PageRoute } from '../components/Header';
import { readStorage, STORAGE_KEYS, PANEL_STORAGE_VERSION } from '../utils/storage';
import { PanelRecord } from '../types';
import { EXERCISES_DATA } from '../data/exercisesData';
import {
  durationLabels,
  difficultyLabels,
  equipmentLabels,
  zoneLabels,
} from '../data/exerciseLabels';

interface HomePageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [recordCount, setRecordCount] = useState<number>(0);

  useEffect(() => {
    const res = readStorage<PanelRecord[]>(
      STORAGE_KEYS.panel,
      PANEL_STORAGE_VERSION,
      (data) => (Array.isArray(data) ? (data as PanelRecord[]) : [])
    );
    if (res.available && res.value) {
      setRecordCount(res.value.length);
    }
  }, []);

  /**
   * Cifras de la biblioteca calculadas desde los datos reales, no escritas a
   * mano: si la colección cambia, estas tarjetas dejan de mentir solas.
   */
  const biblioteca = useMemo(() => {
    const total = EXERCISES_DATA.length;
    const sinEquipamiento = EXERCISES_DATA.filter(
      (e) => e.equipment.length > 0 && e.equipment.every((eq) => eq === 'ninguno')
    ).length;
    const zonas = new Set(EXERCISES_DATA.flatMap((e) => e.zone)).size;
    const postural = EXERCISES_DATA.filter((e) => e.category === 'cuidado_postural').length;
    // El primer ejercicio de cuidado postural es el que Illustramos: encaja con
    // el encuadre de la portada en lugar de ser un ejercicio cualquiera.
    const destacado =
      EXERCISES_DATA.find((e) => e.category === 'cuidado_postural') ?? EXERCISES_DATA[0];
    // Muestra de la portada: los tres primeros, con sus datos reales.
    const muestra = EXERCISES_DATA.slice(0, 3);
    return { total, sinEquipamiento, zonas, postural, destacado, muestra };
  }, []);

  const ir = (page: PageRoute) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <>
      {/* Hero */}
      <section id="inicio" className="hero" aria-labelledby="titulo-inicio" tabIndex={-1}>
        <div className="container hero-layout">
          <div className="hero-copy">
            <p className="hero-insignia">
              <span className="hero-insignia__punto" aria-hidden="true" />
              Movimiento guiado y consciente en casa
            </p>
            <h1 id="titulo-inicio" className="hero-titular">
              Muévete mejor <em>desde casa</em>, a tu ritmo
            </h1>
            <p className="hero-lead">
              Explora ejercicios generales, organiza tu actividad y registra cómo te sientes. Sin
              cuenta, sin equipamiento y sin enviar tus datos a ningún servidor.
            </p>
            <div className="hero-actions">
              <a href="#ejercicios" className="btn hero-cta" onClick={ir('ejercicios')}>
                Explorar ejercicios
              </a>
              <a href="#quiz" className="btn secondary hero-cta" onClick={ir('quiz')}>
                Organizar mi actividad
              </a>
            </div>
            <a href="#escoliosis" className="hero-enlace" onClick={ir('escoliosis')}>
              ¿Buscas información sobre escoliosis? Leer la guía completa
              <span aria-hidden="true"> →</span>
            </a>
            <ul className="hero-datos" aria-label="Cómo funciona FitCasa con tus datos">
              <li>Sin cuenta</li>
              <li>{biblioteca.sinEquipamiento === biblioteca.total ? 'Sin equipamiento' : `${biblioteca.sinEquipamiento} de ${biblioteca.total} sin equipamiento`}</li>
              <li>Tus datos se quedan en tu navegador</li>
            </ul>
          </div>

          {/* Composición visual: lámina ilustrada en el cabeza de la ficha real
              de la biblioteca, con dos datos reales flotando en las esquinas. */}
          <div className="hero-visual">
            <figure className="hero-ficha" data-ui>
              <svg
                className="hero-forma"
                viewBox="0 0 400 180"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
                focusable="false"
              >
                <rect width="400" height="180" fill="var(--color-fondo-verde)" />
                <ellipse cx="200" cy="154" rx="112" ry="17" fill="var(--color-secundario)" opacity="0.22" />
                <g
                  fill="none"
                  stroke="var(--color-primario)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.34"
                >
                  {/* Columna en curva suave: la figura sentada, en reposo. */}
                  <path d="M200 46c-4 24 4 42 0 64" />
                  <path d="M200 110c-30 12-46 24-50 38" />
                  <path d="M200 110c30 12 46 24 50 38" />
                  <path d="M198 64c-28 10-42 26-46 42" />
                </g>
                <circle cx="200" cy="26" r="19" fill="var(--color-primario)" opacity="0.3" />
              </svg>
              <figcaption className="hero-ficha__cabecera">
                <span className="hero-ficha__zona">
                  {zoneLabels[biblioteca.destacado.zone[0]] ?? biblioteca.destacado.zone[0]}
                </span>
                <span className="hero-ficha__aviso">Contenido educativo</span>
              </figcaption>
              <p className="hero-ficha__nombre">{biblioteca.destacado.name}</p>
              <p className="hero-ficha__descripcion">{biblioteca.destacado.description}</p>
              <dl className="hero-ficha__datos">
                <div>
                  <dt>Duración</dt>
                  <dd>{durationLabels[biblioteca.destacado.duration]}</dd>
                </div>
                <div>
                  <dt>Nivel</dt>
                  <dd>{difficultyLabels[biblioteca.destacado.difficulty]}</dd>
                </div>
                <div>
                  <dt>Equipamiento</dt>
                  <dd>
                    {equipmentLabels[biblioteca.destacado.equipment[0]] ??
                      biblioteca.destacado.equipment[0]}
                  </dd>
                </div>
              </dl>
              <a
                href="#ejercicios"
                className="hero-ficha__enlace"
                onClick={ir('ejercicios')}
              >
                Ver la biblioteca completa
                <span aria-hidden="true"> →</span>
              </a>
            </figure>

            <p className="hero-mini hero-mini--a">
              <strong>{biblioteca.total}</strong>
              <span>ejercicios en la biblioteca</span>
            </p>
            <p className="hero-mini hero-mini--b">
              <strong>{biblioteca.postural}</strong>
              <span>de {biblioteca.total} son de cuidado postural</span>
            </p>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" aria-labelledby="titulo-beneficios" tabIndex={-1} className="container seccion">
        <h2 id="titulo-beneficios">Beneficios del ejercicio en casa</h2>
        <ul className="beneficios-grid">
          {/* Protagonista: ocupa 2x2 de la retícula en escritorio. */}
          <li className="beneficio beneficio--destacado">
            <article>
              <svg className="beneficio__icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 3.5 19 6v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="m9.5 12 1.8 1.8 3.4-3.6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Seguridad ante todo</h3>
              <p>
                FitCasa es un recurso educativo y no sustituye la valoración de un profesional de
                la salud. Cada ejercicio declara su duración y su nivel para que elijas con
                criterio, y conviene detener la actividad ante dolor o síntomas inusuales.
              </p>
              <a className="card-link" href="#escoliosis" onClick={ir('escoliosis')}>
                Leer la guía de escoliosis
              </a>
            </article>
          </li>

          {/* Tercera columna, fila 1. */}
          <li className="beneficio">
            <article>
              <svg className="beneficio__icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 11.5 12 4l8 7.5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M6.5 10v9.5h4.5v-5h2v5h4.5V10" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Comodidad sin desplazamientos</h3>
              <p>
                Entrena en tu hogar con horarios flexibles. Los {biblioteca.total} ejercicios de la
                biblioteca se hacen con tu propio cuerpo, sin material ni desplazamientos.
              </p>
              <a className="card-link" href="#ejercicios" onClick={ir('ejercicios')}>
                Explorar la biblioteca
              </a>
            </article>
          </li>

          {/* Tercera columna, fila 2. */}
          <li className="beneficio">
            <article>
              <svg className="beneficio__icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 20h16" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M7 20v-5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 20V9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M17 20V6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Progresión controlada y gradual</h3>
              <p>
                Cada ejercicio indica su duración y su nivel de exigencia para que comieces
                desde tu punto de partida real y avances con serenidad.
              </p>
              <a className="card-link" href="#ejercicios" onClick={ir('ejercicios')}>
                Ver duraciones y niveles
              </a>
            </article>
          </li>

          {/* Fila 3 apaisada, ancho completo. */}
          <li className="beneficio beneficio--ancho">
            <article>
              <svg className="beneficio__icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 8h9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M17 8h3" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M4 16h3" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M11 16h9" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="15" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="9" cy="16" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Adaptabilidad a tu nivel</h3>
              <p>
                Filtra por zona corporal o responde el cuestionario para recibir una propuesta
                adaptada a tus tiempos y preferencias. Es una orientación educativa, no un plan
                clínico.
              </p>
              <a className="card-link" href="#quiz" onClick={ir('quiz')}>
                Obtener orientación
              </a>
            </article>
          </li>
        </ul>
      </section>

{/* Programas */}
      <section id="programas" aria-labelledby="titulo-programas" tabIndex={-1} className="container seccion">
        <h2 id="titulo-programas">Un camino de tres pasos</h2>
        <p className="seccion-intro">
          Explora, orienta tu actividad y registra cómo te sientes.
        </p>

        <div className="programas-grid">
          {/* Paso 01 · protagonista. Fondo verde bosque y una muestra real de
              la biblioteca, sacada de los datos y no escrita a mano. */}
          <article className="programa programa--destacado">
            <svg
              className="programa__motivo"
              viewBox="0 0 320 200"
              preserveAspectRatio="xMinYMax slice"
              aria-hidden="true"
              focusable="false"
            >
              <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M-20 60c54-62 108-62 162 0s108 62 162 0" />
                <path d="M-20 110c54-62 108-62 162 0s108 62 162 0" opacity="0.62" />
                <path d="M-20 160c54-62 108-62 162 0s108 62 162 0" opacity="0.34" />
              </g>
            </svg>
            <header className="programa__cabecera">
              <p className="programa__numero" aria-hidden="true">01</p>
              <p className="programa__foco">Explora</p>
            </header>
            <h3>Biblioteca de ejercicios</h3>
            <p className="programa__texto">
              Filtra la colección educativa por duración, dificultad, equipamiento y zona
              corporal, y abre cada ficha con su adaptación.
            </p>
            <ul className="programa__muestra" aria-label="Ejercicios de la biblioteca">
              {biblioteca.muestra.map((e) => (
                <li key={e.id}>
                  <span className="programa__nombre">{e.name}</span>
                  <span className="programa__meta">
                    {durationLabels[e.duration]} · {zoneLabels[e.zone[0]] ?? e.zone[0]}
                  </span>
                </li>
              ))}
            </ul>
            <a className="card-link programa__enlace" href="#ejercicios" onClick={ir('ejercicios')}>
              Abrir biblioteca
            </a>
          </article>

          {/* Paso 02. Los tres pasos son los del cuestionario real:
              Actividad, Seguridad y Revisión. */}
          <article className="programa programa--orienta">
            <header className="programa__cabecera">
              <p className="programa__numero" aria-hidden="true">02</p>
              <p className="programa__foco">Orienta</p>
            </header>
            <h3>Sugerencias de actividad</h3>
            <ol className="programa__pasos" aria-label="Pasos del cuestionario">
              <li>Actividad</li>
              <li>Seguridad</li>
              <li>Revisión</li>
            </ol>
            <p className="programa__texto">
              Responde el cuestionario para ordenar una propuesta educativa general basada en la
              biblioteca disponible. No es un diagnóstico ni un tratamiento personalizado.
            </p>
            <a className="card-link programa__enlace" href="#quiz" onClick={ir('quiz')}>
              Responder cuestionario
            </a>
          </article>

          {/* Paso 03. Soberanía de datos y estado local. */}
          <article className="programa programa--registra">
            <header className="programa__cabecera">
              <p className="programa__numero" aria-hidden="true">03</p>
              <p className="programa__foco">Registra</p>
            </header>
            <h3>Seguimiento personal</h3>
            <p className="programa__texto">
              Registra actividad, dolor subjetivo y bienestar en este dispositivo.
            </p>
            <p className="programa__local">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M6.5 10.5h11V20a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-9.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 10.5V7.75a3 3 0 1 1 6 0v2.75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>
                Estado:{' '}
                <span id="seguimiento-badge" role="status">
                  {recordCount > 0 ? `${recordCount} entradas guardadas` : 'Seguimiento local'}
                </span>
                . Tus registros nunca salen de este navegador.
              </span>
            </p>
            <a className="card-link programa__enlace" href="#panel" onClick={ir('panel')}>
              Abrir seguimiento
            </a>
          </article>
        </div>
      </section>
{/* Escoliosis */}
      <section id="escoliosis" aria-labelledby="titulo-escoliosis" tabIndex={-1} className="container seccion">
        {/* Placa editorial: campo de tono propio, sin borde ni sombra. Las zonas
            se marcan por superficie y espacio, no por tarjetas anidadas. */}
        <div className="escoliosis-placa">
          <div className="escoliosis-grid">
            <div className="escoliosis-texto">
              <header className="escoliosis-cabecera">
                <p className="escoliosis-insignia">
                  <span className="escoliosis-insignia__punto" aria-hidden="true" />
                  Enfoque postural consciente
                </p>
                <h2 id="titulo-escoliosis">Cuidado postural y enfoque en escoliosis</h2>
                {/* h3 y no p: visualmente es un subtitulo, pero para quien
                    navega por titulos sigue siendo un tema de la seccion. */}
                <h3 className="escoliosis-subtitulo">
                  Comprensión y respeto hacia cada columna vertebral
                </h3>
              </header>

              <div className="escoliosis-cuerpo">
                <p>
                  La escoliosis implica curvas y rotaciones tridimensionales que varían en cada
                  persona. No existen rutinas universales ni ejercicios estándar válidos para todas
                  las curvaturas.
                </p>
                <p>
                  En FitCasa brindamos pautas divulgativas sobre higiene postural, estiramientos
                  suaves y activación muscular equilibrada, diseñadas para acompañar tu bienestar
                  cotidiano.
                </p>
              </div>

              {/* Aviso clinico. Se nombra con aria-labelledby y NO con aria-label:
                  un aria-label sustituiria el texto visible por su nombre accesible
                  y el lector de pantalla se saltaria los 282 caracteres del aviso. */}
              <div
                className="escoliosis-aviso"
                role="note"
                aria-labelledby="escoliosis-aviso-titulo"
              >
                <span className="escoliosis-aviso__icono" aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 3.5 19 6v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M12 8.5v4.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M12 15.8h.01" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </span>
                <p className="escoliosis-aviso__cuerpo">
                  <strong id="escoliosis-aviso-titulo">Aviso esencial de salud:</strong> Nuestros
                  contenidos tienen un propósito exclusivamente formativo y no constituyen
                  tratamiento médico ni correctivo. Consulta siempre con tu traumatólogo o
                  fisioterapeuta antes de comenzar, y suspende de inmediato la actividad si
                  experimentas dolor punzante, adormecimiento o mareos.
                </p>
              </div>

              <div className="escoliosis-acciones">
                <a href="#escoliosis" className="btn escoliosis-cta" onClick={ir('escoliosis')}>
                  Leer guía completa de escoliosis
                </a>
                <a
                  href="#ejercicios"
                  className="escoliosis-acciones__secundario"
                  onClick={ir('ejercicios')}
                >
                  Ver ejercicios de cuidado postural
                </a>
              </div>
            </div>

            {/* Lamina editorial. Tres formas de caracter distinto —una curva
                dominante, un arco tendido y una traza punteada— sobre una
                matriz de puntos y un eje de referencia. No representa ninguna
                curvatura concreta ni un modelo anatomico. */}
            <div className="escoliosis-visual">
              <svg
                className="escoliosis-arte"
                viewBox="0 0 360 430"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <defs>
                  <pattern id="escoliosis-puntos" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.3" fill="var(--color-primario)" opacity="0.13" />
                  </pattern>
                </defs>
                <rect x="196" y="42" width="128" height="150" fill="url(#escoliosis-puntos)" />

                {/* Eje de referencia con marcas alternas: escala de atlas. */}
                <g stroke="var(--color-primario-oscuro)" strokeLinecap="round">
                  <path d="M40 64v304" strokeWidth="1" opacity="0.2" />
                  <path d="M40 100h9M40 152h18M40 204h9M40 256h18M40 308h9M40 360h18" strokeWidth="1.5" opacity="0.42" />
                </g>

                {/* 1. Curva dominante: el foco de la lamina. */}
                <path
                  d="M164 62C228 102 118 156 182 214 246 272 136 326 219 370"
                  stroke="var(--color-primario)"
                  strokeWidth="3.25"
                  strokeLinecap="round"
                />
                {/* 2. Arco tendido: cruza en horizontal, no repite la S. */}
                <path
                  d="M54 306C134 346 236 258 330 306"
                  stroke="var(--color-secundario)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  opacity="0.62"
                />
                {/* 3. Traza punteada, casi vertical, en el flanco derecho. */}
                <path
                  d="M312 74C268 162 328 254 274 358"
                  stroke="var(--color-terciario-oscuro)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeDasharray="2 7"
                  opacity="0.5"
                />

                {/* Marcas de referencia en los puntos de inflexion. */}
                <g stroke="var(--color-primario)" strokeWidth="1" opacity="0.3">
                  <path d="M40 178h56" />
                  <path d="M40 286h104" />
                </g>
                <g>
                  <circle cx="164" cy="62" r="7.5" fill="var(--color-primario)" />
                  <circle cx="134" cy="178" r="4.5" fill="var(--color-secundario-oscuro)" />
                  <circle cx="230" cy="286" r="6" fill="var(--color-primario-oscuro)" />
                  <circle cx="219" cy="370" r="5.5" fill="var(--color-terciario-oscuro)" />
                </g>
              </svg>
              <p className="escoliosis-ficha">
                <strong>Cada columna es tridimensional y única.</strong>
                <span>Sin fórmulas universales.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" aria-labelledby="titulo-como-funciona" tabIndex={-1} className="container seccion como-funciona">
        <header className="como-funciona__cabecera">
          <span className="como-funciona__etiqueta">METODOLOGÍA FITCASA</span>
          <h2 id="titulo-como-funciona" className="como-funciona__titulo">Cómo funciona FitCasa</h2>
          <p className="como-funciona__intro">
            Una experiencia en tres pasos para informarte, elegir con más contexto y observar tu
            propia práctica. No sustituye la valoración de un profesional de la salud.
          </p>
          <div className="como-funciona__rigor" role="note" aria-label="Rigor divulgativo">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 7v10" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            <span>Contenido educativo: información de referencia, no prescripción médica.</span>
          </div>
        </header>

        <ol className="pasos-trayectoria" aria-label="Recorrido guiado en tres pasos">
          <li className="paso">
            <span className="paso__marcador">01</span>
            <div className="paso__contenido">
              <div className="paso__icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M4 4h8v16H4z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <path d="M12 4h8v16h-8z" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <path d="M8 8l3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="paso__titulo">Explora</h3>
              <p className="paso__texto">
                Consulta ejercicios y sus adaptaciones informativas sin asumir que una etiqueta
                equivale a una autorización clínica.
              </p>
            </div>
          </li>
          <li className="paso">
            <span className="paso__marcador">02</span>
            <div className="paso__contenido">
              <div className="paso__icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <path d="M12 3v6M12 15v6M3 12h6M15 12h6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <path d="M12 12l4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="paso__titulo">Orienta</h3>
              <p className="paso__texto">
                Usa el cuestionario para ordenar una propuesta educativa según tu tiempo, experiencia
                y equipamiento.
              </p>
            </div>
          </li>
          <li className="paso">
            <span className="paso__marcador">03</span>
            <div className="paso__contenido">
              <div className="paso__icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <rect x="3" y="4" width="8" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <rect x="11" y="4" width="4" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  <path d="M7 8l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="paso__titulo">Registra</h3>
              <p className="paso__texto">
                Observa tu actividad y tus sensaciones en un historial local voluntario, sin crear
                una cuenta.
              </p>
            </div>
          </li>
        </ol>
      </section>
    </>
  );
};

export default HomePage;
