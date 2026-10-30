import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PageRoute } from '../components/Header';

import { VisualAsociacion } from '../components/VisualAsociacion';
import { ArticuloCientifico, articulosNoticias } from '../data/noticias';

interface ActualidadPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  articulo?: ArticuloCientifico;
}

export const ActualidadPage: React.FC<ActualidadPageProps> = ({ articulo, onNavigate }) => {
  const [articulos, setArticulos] = useState<ArticuloCientifico[]>(articulosNoticias);
  const [indice, setIndice] = useState<number>(() => {
    const hash = window.location.hash;
    const match = hash.match(/actualidad\/(genetica|ejercicio)/);
    if (match) {
      return match[1] === 'genetica' ? 0 : 1;
    }
    if (articulo) {
      const found = articulosNoticias.findIndex((a) => a.id === articulo.id);
      if (found !== -1) return found;
    }
    return 0;
  });
  const pageRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLElement>(null);

  const articuloActual: ArticuloCientifico = articulos[indice] || articulo || articulos[0];
  const isActive = (id: string) => articulos.findIndex((a) => a.id === id) === indice;

  const cambiarArticulo = (id: string) => {
    const i = articulos.findIndex((a) => a.id === id);
    if (i === -1) return;
    setIndice(i);
    setArticulos([...articulos]);
    window.history.replaceState(null, '', `#actualidad/${i === 0 ? 'genetica' : 'ejercicio'}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fuentes = articuloActual.enlaces;

  // La clase de movimiento se aplica antes del primer pintado.
  useLayoutEffect(() => {
    pageRef.current?.classList.add('motion-ready');
  }, []);

  // RevelaciÃ³n progresiva de secciones.
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;

    const revealItems = Array.from(page.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
    const temporizadores: number[] = [];

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

  // Rail sticky
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    const medir = () => {
      const disponible = window.innerHeight - 0;
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

      {/* Selector editorial entre publicaciones */}
      <nav aria-label="Publicaciones de Actualidad" className="actualidad-indice">
        <span className="actualidad-indice__titulo">ArtÃ­culos</span>
        <div className="actualidad-indice__listado">
          {articulos.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`actualidad-indice__boton${isActive(a.id) ? ' actualidad-indice__boton--activo' : ''}`}
              onClick={() => cambiarArticulo(a.id)}
              aria-pressed={isActive(a.id)}
            >
              <span className="actualidad-indice__etiqueta">{a.etiquetaEditorial}</span>
              <span className="actualidad-indice__titulo">{a.tituloEditorial}</span>
              <span className="actualidad-indice__fecha">{a.fechaPublicacion}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Cabecera de pÃ¡gina */}
      <header className="actualidad-masthead">
        <p className="actualidad-etiqueta" data-reveal="masthead-context">
          {articuloActual.etiquetaEditorial}
        </p>
        <h1 className="actualidad-h1" data-reveal="masthead-title">
          <span className="actualidad-h1__linea">La ciencia de la escoliosis,</span>
          <span className="actualidad-h1__linea actualidad-h1__linea--acento">explicada con claridad.</span>
        </h1>
        <p className="actualidad-subtitulo" data-reveal="masthead-copy">
          FitCasa traduce publicaciones cientÃ­ficas indexadas a un lenguaje comprensible,
          diferenciando hipÃ³tesis tempranas de guÃ­as clÃ­nicas consolidadas.
        </p>
      </header>

      {/* ArtÃ­culo protagonista */}
      <section className="actualidad-hero" aria-labelledby="articulo-titular">
        <div className="actualidad-hero__meta" data-reveal="hero-meta">
          <span className="actualidad-badge-categoria">{articuloActual.categoria}</span>
          <span className="actualidad-meta-item">
            <strong>ArtÃ­culo original</strong>
            <span aria-hidden="true">Â·</span>
            {articuloActual.revista}
          </span>
          <span className="actualidad-meta-item">
            <strong>Publicado</strong>
            <span aria-hidden="true">Â·</span>
            {articuloActual.fechaPublicacion}
          </span>
        </div>

        <h2 id="articulo-titular" className="actualidad-titular" data-reveal="hero-title">
          {articuloActual.tituloEditorial}
        </h2>

        <div className="actualidad-hero__banda">
          <div className="actualidad-hero__texto" data-reveal="hero-deck">
            <p className="actualidad-deck">{articuloActual.enPocasPalabras}</p>
            <p className="actualidad-curacion">
              RevisiÃ³n bibliogrÃ¡fica humana y manual Â· SelecciÃ³n basada en revistas con revisiÃ³n por pares
            </p>
          </div>
          <div className="actualidad-hero__visual" data-reveal="hero-visual">
            {articuloActual.tipo === 'ejercicio' ? (
              <VisualAsociacion />
            ) : (
              <VisualAsociacion />
            )}
          </div>
        </div>
      </section>

      {/* Limites */}
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
            Las limitaciones prÃ¡cticas mÃ¡s relevantes, diseÃ±adas para una responsabilidad clÃ­nica:
          </p>
          <ul className="actualidad-lista-limites">
            {articuloActual.loQueNoDemuestra.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="actualidad-reading-layout">
        <article className="actualidad-reading-body">
          {/* En pocas palabras */}
          <section className="actualidad-seccion" aria-labelledby="pocas-palabras-titulo">
            <h3 id="pocas-palabras-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">
              En pocas palabras
            </h3>
            <p className="actualidad-resumen" data-reveal="section-content">
              {articuloActual.resumenBreve}
            </p>
          </section>

          {/* Â¿QuÃ© se investigÃ³? */}
          <section className="actualidad-seccion" aria-labelledby="investigo-titulo">
            <h3 id="investigo-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">
              Â¿QuÃ© se investigÃ³?
            </h3>
            <p className="actualidad-parrafo" data-reveal="section-content">
              {articuloActual.preguntaInvestigacion}
            </p>
          </section>

          {/* Hallazgos */}
          <section className="actualidad-seccion actualidad-seccion--hallazgos" aria-labelledby="hallazgos-titulo">
            <h3 id="hallazgos-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">
              Principales hallazgos
            </h3>
            <ul className="actualidad-lista" data-reveal="section-content">
              {articuloActual.queEncontraron.map((item) => (
                <li key={item} className="actualidad-lista-item">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Por quÃ© es de interÃ©s */}
          <section className="actualidad-seccion" aria-labelledby="interes-titulo">
            <h3 id="interes-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">
              Por quÃ© es de interÃ©s para la ciencia
            </h3>
            <ul className="actualidad-lista" data-reveal="section-content">
              {articuloActual.porQueImporta.map((item) => (
                <li key={item} className="actualidad-lista-item">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* InterpretaciÃ³n */}
          <section className="actualidad-seccion" aria-labelledby="significado-titulo">
            <h3 id="significado-titulo" className="actualidad-seccion-titulo" data-reveal="section-heading">
              Â¿QuÃ© significa esto para ti hoy?
            </h3>
            <p className="actualidad-parrafo" data-reveal="section-content">
              {articuloActual.queSignificaParaLector}
            </p>
          </section>

          {/* Ficha bibliogrÃ¡fica */}
          <section className="actualidad-ficha" aria-labelledby="ficha-titulo" data-reveal="section-heading">
            <h3 id="ficha-titulo" className="actualidad-seccion-titulo" data-reveal="section-content">
              Ficha bibliogrÃ¡fica completa
            </h3>
            <dl className="actualidad-registro" data-reveal="section-content">
              <div className="actualidad-registro__fila">
                <dt>TÃ­tulo original</dt>
                <dd lang="en">{articuloActual.tituloOriginal}</dd>
              </div>
              <div className="actualidad-registro__fila">
                <dt>Autores</dt>
                <dd>{articuloActual.autores.join(', ')}</dd>
              </div>
              <div className="actualidad-registro__fila">
                <dt>Revista</dt>
                <dd>{articuloActual.revista}</dd>
              </div>
              <div className="actualidad-registro__fila">
                <dt>Volumen</dt>
                <dd>{articuloActual.volumenArticulo}</dd>
              </div>
              <div className="actualidad-registro__fila">
                <dt>Fecha de publicaciÃ³n</dt>
                <dd>{articuloActual.fechaPublicacion}</dd>
              </div>
              <div className="actualidad-registro__fila">
                <dt>DOI</dt>
                <dd>
                  <a
                    className="actualidad-enlace-doi"
                    href={`https://doi.org/${articuloActual.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {articuloActual.doi}
                  </a>
                </dd>
              </div>
              <div className="actualidad-registro__fila">
                <dt>VerificaciÃ³n editorial</dt>
                <dd>{articuloActual.fechaVerificacion}</dd>
              </div>
            </dl>
          </section>
        </article>

        {/* Rail */}
        <aside className="actualidad-rail" ref={railRef} aria-label="Ficha editorial y fuentes originales">
          <div className="actualidad-rail__bloque">
            <h3 className="actualidad-rail__titulo">Ficha editorial</h3>
            <dl className="actualidad-rail__datos">
              <div>
                <dt>Revista</dt>
                <dd>{articuloActual.revista}</dd>
              </div>
              <div>
                <dt>Publicado</dt>
                <dd>{articuloActual.fechaPublicacion}</dd>
              </div>
              <div>
                <dt>Volumen</dt>
                <dd>{articuloActual.volumenArticulo}</dd>
              </div>
              <div>
                <dt>DOI</dt>
                <dd>
                  <a
                    className="actualidad-enlace-doi"
                    href={`https://doi.org/${articuloActual.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {articuloActual.doi}
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
            Lectura de FitCasa Â· VerificaciÃ³n editorial: {articuloActual.fechaVerificacion}
          </p>
        </aside>
      </div>
    </main>
  );
};

export default ActualidadPage;
