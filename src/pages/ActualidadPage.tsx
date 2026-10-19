import React, { useEffect, useRef } from 'react';
import { ArticuloCientifico } from '../data/noticias';
import { PageRoute } from '../components/Header';

interface ActualidadPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  articulo: ArticuloCientifico;
}

const networkLinks = [
  ['node-a', 'node-b'],
  ['node-a', 'node-c'],
  ['node-b', 'node-d'],
  ['node-b', 'node-e'],
  ['node-c', 'node-e'],
  ['node-c', 'node-f'],
  ['node-d', 'node-g'],
  ['node-e', 'node-g'],
  ['node-e', 'node-h'],
  ['node-f', 'node-h'],
] as const;

const networkNodes = [
  { id: 'node-a', cx: 74, cy: 152, r: 9, tone: 'light' },
  { id: 'node-b', cx: 158, cy: 92, r: 13, tone: 'primary' },
  { id: 'node-c', cx: 174, cy: 214, r: 11, tone: 'terra' },
  { id: 'node-d', cx: 272, cy: 54, r: 8, tone: 'salvia' },
  { id: 'node-e', cx: 286, cy: 150, r: 16, tone: 'primary' },
  { id: 'node-f', cx: 304, cy: 258, r: 8, tone: 'light' },
  { id: 'node-g', cx: 390, cy: 92, r: 10, tone: 'terra' },
  { id: 'node-h', cx: 414, cy: 214, r: 13, tone: 'salvia' },
] as const;

const ScienceVisual: React.FC = () => (
  <figure className="science-visual" aria-labelledby="science-visual-caption" data-reveal="science-visual">
    <div className="science-visual__frame">
      <svg
        className="science-visual__svg"
        viewBox="0 0 488 320"
        role="img"
        aria-label="Red abstracta de nodos y conexiones, ilustración conceptual"
        focusable="false"
      >
        <g className="science-visual__orbital" aria-hidden="true">
          <ellipse cx="244" cy="160" rx="202" ry="105" />
          <ellipse cx="244" cy="160" rx="144" ry="183" transform="rotate(45 244 160)" />
          <path d="M67 241C156 183 238 192 320 116S432 54 466 74" />
        </g>
        <g className="science-visual__connections" aria-hidden="true">
          {networkLinks.map(([from, to]) => {
            const fromNode = networkNodes.find((node) => node.id === from);
            const toNode = networkNodes.find((node) => node.id === to);

            if (!fromNode || !toNode) return null;

            return (
              <line
                key={`${from}-${to}`}
                x1={fromNode.cx}
                y1={fromNode.cy}
                x2={toNode.cx}
                y2={toNode.cy}
              />
            );
          })}
        </g>
        <g className="science-visual__network" aria-hidden="true">
          {networkNodes.map((node) => (
            <g key={node.id} className={`science-visual__node science-visual__node--${node.tone}`}>
              <circle className="science-visual__node-shadow" cx={node.cx + 4} cy={node.cy + 6} r={node.r + 3} />
              <circle className="science-visual__node-core" cx={node.cx} cy={node.cy} r={node.r} />
              <circle className="science-visual__node-glint" cx={node.cx - node.r * 0.3} cy={node.cy - node.r * 0.3} r={Math.max(2, node.r * 0.18)} />
            </g>
          ))}
        </g>
        <g className="science-visual__labels" aria-hidden="true">
          <text x="50" y="286">ASOCIACIÓN</text>
          <text x="348" y="38">SEVERIDAD</text>
          <text x="222" y="302">NO ES DESTINO</text>
        </g>
      </svg>
      <span className="science-visual__stamp">FIG. 01 / CONCEPTUAL</span>
    </div>
    <figcaption id="science-visual-caption" className="science-visual__caption">
      Una lectura visual de las conexiones estudiadas: abstracta, no representativa de datos genéticos reales.
    </figcaption>
  </figure>
);

export const ActualidadPage: React.FC<ActualidadPageProps> = ({ articulo, onNavigate }) => {
  const fuentes = articulo.enlaces;
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return undefined;

    const revealItems = Array.from(page.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const revealEverything = () => {
      revealItems.forEach((item) => item.dataset.revealed = 'true');
    };

    page.classList.add('motion-ready');

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      revealEverything();
    }

    const observer = reducedMotion.matches || !('IntersectionObserver' in window)
      ? null
      : new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = 'true';
            observer?.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    revealItems.forEach((item) => observer?.observe(item));

    const visualFrame = page.querySelector<HTMLElement>('.science-visual__frame');
    let frameRequest = 0;

    const updateParallax = () => {
      frameRequest = 0;
      if (!visualFrame) return;

      const drift = Math.max(-10, Math.min(10, window.scrollY * -0.018));
      visualFrame.style.setProperty('--science-parallax', `${drift}px`);
    };

    const handleScroll = () => {
      if (reducedMotion.matches || !visualFrame || frameRequest) return;
      frameRequest = window.requestAnimationFrame(updateParallax);
    };

    if (!reducedMotion.matches && visualFrame) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      updateParallax();
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (frameRequest) window.cancelAnimationFrame(frameRequest);
    };
  }, []);

  return (
    <main id="contenido" ref={pageRef} tabIndex={-1} className="actualidad-page container">
      <nav aria-label="Miga de pan" className="mb-4">
        <a
          href="#inicio"
          className="actualidad-breadcrumb-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('inicio');
          }}
        >
          ← Volver al inicio
        </a>
      </nav>

      {/* --- Cabecera de Sección --- */}
      <header className="actualidad-header">
        <div className="actualidad-header__index" aria-hidden="true">
          <span>ACTUALIDAD</span>
          <span>01 / 01</span>
        </div>
        <span className="actualidad-header__context" data-reveal="masthead-context">{articulo.etiquetaEditorial}</span>
        <h1 className="actualidad-h1" data-reveal="masthead-title">
          <span>La ciencia de la escoliosis,</span>
          <span>explicada con claridad.</span>
        </h1>
        <p className="actualidad-subtitulo" data-reveal="masthead-copy">
          FitCasa traduce publicaciones científicas indexadas a un lenguaje comprensible, diferenciando hipótesis tempranas de guías clínicas consolidadas.
        </p>
        <div className="actualidad-curaduria-row">
          <p className="actualidad-curaduría">
            Revisión bibliográfica humana y manual · Selección basada en revistas con revisión por pares
          </p>
          <span className="actualidad-header__rule" aria-hidden="true" />
        </div>
      </header>

      {/* --- Artículo Protagonista (Hero Editorial) --- */}
      <section className="actualidad-hero" aria-labelledby="articulo-titular">
        <div className="actualidad-hero__copy">
          <div className="actualidad-hero-metadatos">
            <span className="actualidad-badge-categoria" data-reveal="hero-meta">
              {articulo.categoria}
            </span>
            <span className="actualidad-meta-item" data-reveal="hero-meta">
              <strong>Artículo original</strong>
              <span aria-hidden="true">·</span>
              {articulo.revista}
            </span>
          </div>

          <div className="actualidad-hero-titular">
            <p className="actualidad-hero__eyebrow" data-reveal="hero-copy">LA INVESTIGACIÓN / 01</p>
            <h2 id="articulo-titular" className="actualidad-titular" data-reveal="hero-copy">{articulo.tituloEditorial}</h2>
            <p className="actualidad-subtitulo-riguroso" data-reveal="hero-copy">
              {articulo.enPocasPalabras}
            </p>
          </div>
        </div>
        <ScienceVisual />
      </section>

      <div className="actualidad-reading-layout">
        <article className="actualidad-reading-body">
          {/* --- Bloque «En pocas palabras» --- */}
          <section className="actualidad-pocas-palabras" aria-labelledby="pocas-palabras-titulo">
            <p className="actualidad-section-index">01 / RESUMEN</p>
            <h2 id="pocas-palabras-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">En pocas palabras</h2>
            <div className="actualidad-card-pocas-palabras" data-reveal="section-content">
              <p className="actualidad-card-texto">{articulo.resumenBreve}</p>
              <p className="actualidad-card-texto-secundario">{articulo.enPocasPalabras}</p>
            </div>
          </section>

          {/* --- ¿Qué se investigó? --- */}
          <section className="actualidad-seccion" aria-labelledby="investigo-titulo">
            <p className="actualidad-section-index">02 / PREGUNTA</p>
            <h2 id="investigo-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">¿Qué se investigó?</h2>
            <p className="actualidad-parrafo-meta" data-reveal="section-content">{articulo.preguntaInvestigacion}</p>
          </section>

          {/* --- Principales hallazgos --- */}
          <section className="actualidad-seccion" aria-labelledby="hallazgos-titulo">
            <p className="actualidad-section-index">03 / EVIDENCIA</p>
            <h2 id="hallazgos-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">Principales hallazgos</h2>
            <ul className="actualidad-lista-hallazgos" data-reveal="section-content">
              {articulo.queEncontraron.map((item, i) => (
                <li key={i} className="actualidad-lista-item">{item}</li>
              ))}
            </ul>
          </section>

          {/* --- Por qué es de interés para la ciencia --- */}
          <section className="actualidad-seccion" aria-labelledby="interes-titulo">
            <p className="actualidad-section-index">04 / CONTEXTO</p>
            <h2 id="interes-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">Por qué es de interés para la ciencia</h2>
            <ul className="actualidad-lista-hallazgos" data-reveal="section-content">
              {articulo.porQueImporta.map((item, i) => (
                <li key={i} className="actualidad-lista-item">{item}</li>
              ))}
            </ul>
          </section>

          {/* --- Bloque Crítico: Lo que NO demuestra --- */}
          <section className="actualidad-bloque-aviso" aria-labelledby="aviso-titulo" data-reveal="responsibility-note">
            <div className="actualidad-aviso-icono" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false" width="1.5rem" height="1.5rem">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
              </svg>
            </div>
            <div className="actualidad-aviso-contenido">
              <p className="actualidad-section-index">NOTA DE RESPONSABILIDAD</p>
              <h2 id="aviso-titulo" className="actualidad-aviso-titulo">Lo que este estudio NO demuestra</h2>
              <p className="actualidad-aviso-texto">Las limitaciones prácticas más relevantes, diseñadas para una responsabilidad clínica:</p>
              <ul className="actualidad-lista-sin-rides">
                {articulo.loQueNoDemuestra.map((item, i) => (
                  <li key={i} className="actualidad-lista-aviso">{item}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* --- ¿Qué significa esto para ti hoy? --- */}
          <section className="actualidad-seccion" aria-labelledby="significado-titulo">
            <p className="actualidad-section-index">05 / APLICACIÓN</p>
            <h2 id="significado-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">¿Qué significa esto para ti hoy?</h2>
            <p className="actualidad-parrafo-meta" data-reveal="section-content">{articulo.queSignificaParaLector}</p>
          </section>

          {/* --- Ficha bibliográfica completa --- */}
          <section className="actualidad-ficha-bibliografica" aria-labelledby="ficha-titulo">
            <p className="actualidad-section-index">REGISTRO DE FUENTE</p>
            <h2 id="ficha-titulo" className="actualidad-ficha-titulo" data-reveal="section-heading">Ficha bibliográfica completa</h2>
            <blockquote className="actualidad-cita-formateada" data-reveal="section-content">
              <p>{articulo.tituloEditorial}. {articulo.revista}, {articulo.volumenArticulo}.</p>
              <p>DOI: <a href={`https://doi.org/${articulo.doi}`} target="_blank" rel="noopener noreferrer">{articulo.doi}</a></p>
              <p>Autores: {articulo.autores.join(', ')}.</p>
              <p>Fecha de publicación: {articulo.fechaPublicacion}.</p>
              <p>Verificación: {articulo.fechaVerificacion}.</p>
            </blockquote>
          </section>
        </article>

        <aside className="actualidad-rail" aria-label="Ficha editorial y fuentes">
          <div className="actualidad-rail__block actualidad-rail__block--primary" data-reveal="rail-block">
            <p className="actualidad-section-index">FICHA EDITORIAL</p>
            <dl className="actualidad-rail__facts">
              <div><dt>Revista</dt><dd>{articulo.revista}</dd></div>
              <div><dt>Publicado</dt><dd>{articulo.fechaPublicacion}</dd></div>
              <div><dt>Volumen</dt><dd>{articulo.volumenArticulo}</dd></div>
              <div>
                <dt>DOI</dt>
                <dd>
                  <a
                    href={`https://doi.org/${articulo.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="actualidad-rail__doi"
                  >
                    {articulo.doi}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <div className="actualidad-rail__block actualidad-hero-fuentes" data-reveal="rail-block">
            <p className="actualidad-section-index">FUENTES ORIGINALES</p>
            <nav aria-label="Enlaces a fuentes originales">
              <ul>
                {fuentes.map((fuente) => (
                  <li key={fuente.tipo}>
                    <a href={fuente.url} target="_blank" rel="noopener noreferrer" className="actualidad-enlace-fuente">
                      <span>{fuente.texto}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className="actualidad-rail__note">Lectura de FitCasa · Verificación editorial: {articulo.fechaVerificacion}</p>
        </aside>
      </div>
    </main>
  );
};

export default ActualidadPage;
