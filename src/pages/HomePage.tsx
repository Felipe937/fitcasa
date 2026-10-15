import React, { useEffect, useState } from 'react';
import { PageRoute } from '../components/Header';
import { readStorage, STORAGE_KEYS, PANEL_STORAGE_VERSION } from '../utils/storage';
import { PanelRecord } from '../types';

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

  return (
    <>
      {/* Hero */}
      <section id="inicio" className="hero" aria-labelledby="titulo-inicio" tabIndex={-1}>
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">Proyecto educativo · ejercicio en casa</span>
            <h1 id="titulo-inicio">Muévete mejor desde casa, a tu ritmo</h1>
            <p className="hero-lead">
              Explora ejercicios generales, organiza tu actividad y registra cómo te sientes en una experiencia sencilla y responsable.
            </p>
            <div className="hero-actions">
              <a
                href="#ejercicios"
                className="btn"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('ejercicios');
                }}
              >
                Explorar ejercicios
              </a>
              <a
                href="#quiz"
                className="btn secondary"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('quiz');
                }}
              >
                Organizar mi actividad
              </a>
            </div>
            <a
              href="#escoliosis"
              className="card-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('escoliosis');
              }}
            >
              Guía sobre escoliosis
            </a>
            <ul className="hero-chips" aria-label="Características de FitCasa">
              <li>Sin cuenta</li>
              <li>Sin equipamiento</li>
              <li>Tus datos se quedan en tu navegador</li>
            </ul>
          </div>

          <aside className="hero-card" aria-label="Ejemplo de la biblioteca">
            <p className="font-bold">Sentadilla con peso corporal</p>
            <p>Ejercicio básico de fuerza para piernas y glúteos, ejecutado con el propio peso corporal.</p>
            <p>Duración: corta</p>
            <p>Dificultad: principiante</p>
            <p>Equipamiento: Sin equipamiento</p>
            <p>Información general · sin revisión profesional</p>
            <a
              href="#ejercicios"
              className="card-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('ejercicios');
              }}
            >
              Ver todos los ejercicios
            </a>
          </aside>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" aria-labelledby="titulo-beneficios" tabIndex={-1} className="container py-12">
        <h2 id="titulo-beneficios">Beneficios del ejercicio en casa</h2>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 list-none p-0">
          <li>
            <article>
              <svg className="benefit-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 11.5 12 4l8 7.5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M6.5 10v9.5h4.5v-5h2v5h4.5V10" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Comodidad sin desplazamientos</h3>
              <p>Entrena en tu hogar con horarios flexibles. La biblioteca incluye ejercicios sin equipamiento, solo con tu propio cuerpo.</p>
              <a
                className="card-link"
                href="#ejercicios"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('ejercicios');
                }}
              >
                Explorar la biblioteca
              </a>
            </article>
          </li>

          <li>
            <article>
              <svg className="benefit-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 20h16" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M7 20v-5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 20V9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M17 20V6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Progresión controlada y gradual</h3>
              <p>Cada ejercicio indica su duración y su nivel de dificultad, para que elijas por dónde empezar y avances a tu ritmo.</p>
              <a
                className="card-link"
                href="#ejercicios"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('ejercicios');
                }}
              >
                Ver duraciones y niveles
              </a>
            </article>
          </li>

          <li>
            <article>
              <svg className="benefit-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 8h9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M17 8h3" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M4 16h3" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M11 16h9" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="15" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="9" cy="16" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Adaptabilidad a tu nivel</h3>
              <p>Filtra por zona corporal o responde el cuestionario para recibir una orientación educativa. No es un plan clínico personalizado.</p>
              <a
                className="card-link"
                href="#quiz"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('quiz');
                }}
              >
                Obtener orientación
              </a>
            </article>
          </li>

          <li>
            <article>
              <svg className="benefit-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 3.5 19 6v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="m9.5 12 1.8 1.8 3.4-3.6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Seguridad ante todo</h3>
              <p>FitCasa es un recurso educativo y no sustituye la valoración de un profesional de la salud. Detén la actividad ante dolor o síntomas inusuales.</p>
              <a
                className="card-link"
                href="#escoliosis"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('escoliosis');
                }}
              >
                Leer la guía de escoliosis
              </a>
            </article>
          </li>
        </ul>
      </section>

      {/* Programas */}
      <section id="programas" aria-labelledby="titulo-programas" tabIndex={-1} className="container py-12">
        <h2 id="titulo-programas">Elige tu siguiente paso</h2>
        <p className="section-intro">
          Tres caminos para moverte con información clara: explora, orienta tu actividad o registra cómo te sientes.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="programa-card programa-card--biblioteca">
            <span className="programa-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M4 19V5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M4 19h16" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M8 19v-4" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 19V9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M16 19v-6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <span className="card-kicker">Colección educativa</span>
            <h3>Biblioteca de ejercicios</h3>
            <p>Filtra la colección educativa por duración, dificultad, equipamiento y zona corporal.</p>
            <a
              className="card-link"
              href="#ejercicios"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('ejercicios');
              }}
            >
              Abrir biblioteca
            </a>
          </article>

          <article className="programa-card programa-card--sugerencias">
            <span className="programa-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7.5v5" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="16" r="0.5" fill="currentColor" />
              </svg>
            </span>
            <span className="card-kicker">Orientación educativa</span>
            <h3>Sugerencias de actividad</h3>
            <p>
              Responde el cuestionario para organizar una propuesta educativa general basada en la biblioteca disponible. No es un diagnóstico ni un tratamiento personalizado.
            </p>
            <a
              className="card-link"
              href="#quiz"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('quiz');
              }}
            >
              Responder cuestionario
            </a>
          </article>

          <article className="programa-card programa-card--seguimiento">
            <span className="programa-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M6 3.5h9L19 7.5V20.5H6Z" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M14.5 3.5v4.5H19" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M9 13h6" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M9 16.5h6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <span className="card-kicker">Registro local</span>
            <h3>Seguimiento personal</h3>
            <p>Registra actividad, dolor subjetivo y bienestar en este dispositivo, sin enviar datos a FitCasa.</p>
            <p className="programa-estado">
              Estado:{' '}
              <span id="seguimiento-badge" role="status">
                {recordCount > 0 ? `${recordCount} entradas guardadas` : 'Seguimiento local'}
              </span>
            </p>
            <a
              className="card-link"
              href="#panel"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('panel');
              }}
            >
              Abrir seguimiento
            </a>
          </article>
        </div>
      </section>

      {/* Escoliosis Preview */}
      <section id="escoliosis" aria-labelledby="titulo-escoliosis" tabIndex={-1} className="container py-12">
        <h2 id="titulo-escoliosis">Cuidado postural y enfoque en escoliosis</h2>
        <article className="app-card">
          <h3>Comprensión y respeto hacia cada columna vertebral</h3>
          <p>
            La escoliosis implica curvas y rotaciones tridimensionales que varían en cada persona. No existen rutinas universales ni ejercicios estándar válidos para todas las curvaturas.
          </p>
          <p>
            En FitCasa brindamos pautas divulgativas sobre higiene postural, estiramientos suaves y activación muscular equilibrada, diseñadas para acompañar tu bienestar cotidiano.
          </p>
          <p>
            <strong>Aviso esencial de salud:</strong> Nuestros contenidos tienen un propósito exclusivamente formativo y no constituyen tratamiento médico ni correctivo. Consulta siempre con tu traumatólogo o fisioterapeuta antes de comenzar, y suspende de inmediato la actividad si experimentas dolor punzante, adormecimiento o mareos.
          </p>
          <p>
            <a
              href="#escoliosis"
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('escoliosis');
              }}
            >
              Leer guía completa de escoliosis
            </a>
          </p>
        </article>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" aria-labelledby="titulo-como-funciona" tabIndex={-1} className="container py-12">
        <span className="eyebrow">Sin promesas exageradas</span>
        <h2 id="titulo-como-funciona">Cómo funciona FitCasa</h2>
        <p className="section-intro">
          Una experiencia en tres pasos para informarte, elegir con más contexto y observar tu propia práctica. No sustituye la valoración de un profesional de la salud.
        </p>
        <div className="workflow-grid">
          <article className="workflow-card">
            <span className="workflow-number" aria-hidden="true">1</span>
            <h3>Explora</h3>
            <p>Consulta ejercicios y sus adaptaciones informativas sin asumir que una etiqueta equivale a una autorización clínica.</p>
          </article>
          <article className="workflow-card">
            <span className="workflow-number" aria-hidden="true">2</span>
            <h3>Orienta</h3>
            <p>Usa el cuestionario para ordenar una propuesta educativa según tu tiempo, experiencia y equipamiento.</p>
          </article>
          <article className="workflow-card">
            <span className="workflow-number" aria-hidden="true">3</span>
            <h3>Registra</h3>
            <p>Observa tu actividad y tus sensaciones en un historial local voluntario, sin crear una cuenta.</p>
          </article>
        </div>
      </section>
    </>
  );
};
