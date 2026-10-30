import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { ArticuloCientifico } from '../data/noticias';
import { PageRoute } from '../components/Header';
import { VisualAsociacion } from '../components/VisualAsociacion';

interface ActualidadPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  articulo: ArticuloCientifico;
}

/** Margen superior del rail pegajoso: cabecera sticky (4,5 rem) + aire. */
const OFFSET_RAIL = 88;

export const ActualidadPage: React.FC<ActualidadPageProps> = ({ articulo, onNavigate }) => {
  const fuentes = articulo.enlaces;
  const pageRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLElement>(null);

  // La clase de movimiento se aplica antes del primer pintado: si se añadiera
  // después, la página aparecería y se desvaneceria sola al cargar.
  useLayoutEffect(() => {
    pageRef.current?.classList.add('motion-ready');
  }, []);

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return undefined;

    const revealItems = Array.from(page.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
    const temporizadores: number[] = [];

    /**
     * Revela un elemento. `will-change` solo se aplica mientras dura la
     * animación de ese elemento, nunca a todo el bloque desde el principio.
     */
    const revelar = (item: HTMLElement) => {
      item.dataset.revealed = 'true';
      item.classList.add('is-revelando');

      const soltar = () => {
        item.classList.remove('is-revelando');
        item.removeEventListener('transitionend', soltar);
      };

      item.addEventListener('transitionend', soltar);
      temporizadores.push(window.setTimeout(soltar, 1400));
    };

    const revelarTodo = () => revealItems.forEach((item) => { item.dataset.revealed = 'true'; });

    if (reducirMovimiento.matches || !('IntersectionObserver' in window)) {
      revelarTodo();
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revelar(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      revealItems.forEach((item) => observer.observe(item));

      return () => {
        observer.disconnect();
        temporizadores.forEach((id) => window.clearTimeout(id));
      };
    }

    return () => temporizadores.forEach((id) => window.clearTimeout(id));
  }, []);

  // El rail solo se pega si cabe en la altura visible: si no, se queda en el
  // flujo para que ningún enlace quede fuera de la pantalla.
  useEffect(() => {
    const rail = railRef.current;

    if (!rail) return undefined;

    const medir = () => {
      const disponible = window.innerHeight - OFFSET_RAIL;
      rail.classList.toggle('actualidad-rail--larga', rail.scrollHeight > disponible);
    };

    medir();
    window.addEventListener('resize', medir);

    const observador = new ResizeObserver(medir);
    observador.observe(rail);

    return () => {
      window.removeEventListener('resize', medir);
      observador.disconnect();
    };
  }, []);

  return (
    <main id="contenido" ref={pageRef} tabIndex={-1} className="actualidad-page container">
      <nav aria-label="Miga de pan" className="actualidad-miga">
        <a
          href="#inicio"
          className="actualidad-breadcrumb-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('inicio');
          }}
        >
          <span aria-hidden="true">&#8592;</span>
          Volver al inicio
        </a>
      </nav>

      {/* --- Cabecera de pagina: portada editorial --- */}
      <header className="actualidad-masthead">
        <p className="actualidad-etiqueta" data-reveal="masthead-context">
          {articulo.etiquetaEditorial}
        </p>
        <h1 className="actualidad-h1" data-reveal="masthead-title">
          <span className="actualidad-h1__linea">La ciencia de la escoliosis,</span>
          <span className="actualidad-h1__linea actualidad-h1__linea--acento">explicada con claridad.</span>
        </h1>
        <p className="actualidad-subtitulo" data-reveal="masthead-copy">
          FitCasa traduce publicaciones científicas indexadas a un lenguaje comprensible,
          diferenciando hipótesis tempranas de guías clínicas consolidadas.
        </p>
      </header>

      {/* --- Artículo protagonista --- */}
      <section className="actualidad-hero" aria-labelledby="articulo-titular">
        <div className="actualidad-hero__meta" data-reveal="hero-meta">
          <span className="actualidad-badge-categoria">{articulo.categoria}</span>
          <span className="actualidad-meta-item">
            <strong>Artículo original</strong>
            <span aria-hidden="true">·</span>
            {articulo.revista}
          </span>
          <span className="actualidad-meta-item">
            <strong>Publicado</strong>
            <span aria-hidden="true">·</span>
            {articulo.fechaPublicacion}
          </span>
        </div>

        <h2 id="articulo-titular" className="actualidad-titular" data-reveal="hero-title">
          {articulo.tituloEditorial}
        </h2>

        <div className="actualidad-hero__banda">
          <div className="actualidad-hero__texto" data-reveal="hero-deck">
            <p className="actualidad-deck">{articulo.enPocasPalabras}</p>
            <p className="actualidad-curacion">
              Revisión bibliográfica humana y manual · Selección basada en revistas con revisión por pares
            </p>
          </div>
          <div className="actualidad-hero__visual" data-reveal="hero-visual">
            <VisualAsociacion />
          </div>
        </div>
      </section>

      {/* --- Limites: lo más visible después del titular --- */}
      <section className="actualidad-limites" aria-labelledby="limites-titulo" data-reveal="limites">
        <div className="actualidad-limites__cabecera">
          <p className="actualidad-limites__kicker">
            <span className="actualidad-limites__marca" aria-hidden="true" />
            Nota de responsabilidad
          </p>
          <h3 id="limites-titulo" className="actualidad-limites__titulo">
            Lo que este estudio NO demuestra
          </h3>
        </div>
        <div className="actualidad-limites__cuerpo">
          <p className="actualidad-limites__intro">
            Las limitaciones prácticas más relevantes, diseñadas para una responsabilidad clínica:
          </p>
          <ul className="actualidad-lista-limites">
            {articulo.loQueNoDemuestra.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="actualidad-reading-layout">
        <article className="actualidad-reading-body">
          <section className="actualidad-seccion" aria-labelledby="pocas-palabras-titulo">
            <h3 id="pocas-palabras-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">
              En pocas palabras
            </h3>
            <p className="actualidad-resumen" data-reveal="section-content">
              {articulo.resumenBreve}
            </p>
          </section>

          <section className="actualidad-seccion" aria-labelledby="investigo-titulo">
            <h3 id="investigo-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">
              ¿Qué se investigó?
            </h3>
            <p className="actualidad-parrafo" data-reveal="section-content">
              {articulo.preguntaInvestigacion}
            </p>
          </section>

          <section className="actualidad-seccion actualidad-seccion--hallazgos" aria-labelledby="hallazgos-titulo">
            <h3 id="hallazgos-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">
              Principales hallazgos
            </h3>
            <ul className="actualidad-lista" data-reveal="section-content">
              {articulo.queEncontraron.map((item, i) => (
                <li key={i} className="actualidad-lista-item">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="actualidad-seccion" aria-labelledby="interes-titulo">
            <h3 id="interes-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">
              Por qué es de interés para la ciencia
            </h3>
            <ul className="actualidad-lista" data-reveal="section-content">
              {articulo.porQueImporta.map((item, i) => (
                <li key={i} className="actualidad-lista-item">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="actualidad-seccion" aria-labelledby="significado-titulo">
            <h3 id="significado-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">
              ¿Qué significa esto para ti hoy?
            </h3>
            <p className="actualidad-parrafo" data-reveal="section-content">
              {articulo.queSignificaParaLector}
            </p>
          </section>

          <section className="actualidad-ficha" aria-labelledby="ficha-titulo" data-reveal="section-heading">
            <h3 id="ficha-titulo" className="actualidad-seccion-titulo" data-reveal="section-content">
              Ficha bibliográfica completa
            </h3>
            <dl className="actualidad-registro" data-reveal="section-content">
              <div className="actualidad-registro__fila">
                <dt>Título original</dt>
                <dd lang="en">{articulo.tituloOriginal}</dd>
              </div>
              <div className="actualidad-registro__fila">
                <dt>Autores</dt>
                <dd>{articulo.autores.join(', ')}</dd>
              </div>
              <div className="actualidad-registro__fila">
                <dt>Revista</dt>
                <dd>{articulo.revista}</dd>
              </div>
              <div className="actualidad-registro__fila">
                <dt>Volumen</dt>
                <dd>{articulo.volumenArticulo}</dd>
              </div>
              <div className="actualidad-registro__fila">
                <dt>Fecha de publicación</dt>
                <dd>{articulo.fechaPublicacion}</dd>
              </div>
              <div className="actualidad-registro__fila">
                <dt>DOI</dt>
                <dd>
                  <a
                    className="actualidad-enlace-doi"
                    href={`https://doi.org/${articulo.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {articulo.doi}
                  </a>
                </dd>
              </div>
              <div className="actualidad-registro__fila">
                <dt>Verificación editorial</dt>
                <dd>{articulo.fechaVerificacion}</dd>
              </div>
            </dl>
          </section>
        </article>

        <aside className="actualidad-rail" ref={railRef} aria-label="Ficha editorial y fuentes originales">
          <div className="actualidad-rail__bloque">
            <h3 className="actualidad-rail__titulo">Ficha editorial</h3>
            <dl className="actualidad-rail__datos">
              <div>
                <dt>Revista</dt>
                <dd>{articulo.revista}</dd>
              </div>
              <div>
                <dt>Publicado</dt>
                <dd>{articulo.fechaPublicacion}</dd>
              </div>
              <div>
                <dt>Volumen</dt>
                <dd>{articulo.volumenArticulo}</dd>
              </div>
              <div>
                <dt>DOI</dt>
                <dd>
                  <a
                    className="actualidad-enlace-doi"
                    href={`https://doi.org/${articulo.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {articulo.doi}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="actualidad-rail__bloque">
            <h3 className="actualidad-rail__titulo">Fuentes originales</h3>
            <nav aria-label="Enlaces a fuentes originales">
              <ul className="actualidad-fuentes">
                {fuentes.map((fuente) => (
                  <li key={fuente.tipo}>
                    <a
                      href={fuente.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="actualidad-enlace-fuente"
                    >
                      <span>{fuente.texto}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <p className="actualidad-rail__nota">
            Lectura de FitCasa · Verificación editorial: {articulo.fechaVerificacion}
          </p>
        </aside>
      </div>
    </main>
  );
};

export default ActualidadPage;