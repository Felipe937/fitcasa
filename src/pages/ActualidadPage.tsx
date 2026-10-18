import React from 'react';
import { ArticuloCientifico } from '../data/noticias';
import { PageRoute } from '../components/Header';

interface ActualidadPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  articulo: ArticuloCientifico;
}

export const ActualidadPage: React.FC<ActualidadPageProps> = ({ articulo, onNavigate }) => {
  const fuentes = articulo.enlaces;

  return (
    <main id="contenido" tabIndex={-1} className="actualidad-page container">
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
        <span className="actualidad-kicker">{articulo.etiquetaEditorial}</span>
        <h1 className="actualidad-h1">La ciencia de la escoliosis, explicada con claridad</h1>
        <p className="actualidad-subtitulo">
          FitCasa traduce publicaciones científicas indexadas a un lenguaje comprensible, diferenciando hipótesis tempranas de guías clínicas consolidadas.
        </p>
        <p className="actualidad-curaduría">
          Revisión bibliográfica humana y manual · Selección basada en revistas con revisión por pares
        </p>
      </header>

      {/* --- Artículo Protagonista (Hero Editorial) --- */}
      <section className="actualidad-hero" aria-labelledby="articulo-titular">
        <div className="actualidad-hero-metadatos">
          <span className="actualidad-badge-categoria">
            {articulo.categoria}
          </span>
          <div className="actualidad-meta-info">
            <span className="actualidad-meta-item">
              <strong>Revista:</strong> {articulo.revista}
            </span>
            <span className="actualidad-meta-item">
              <strong>Fecha:</strong> {articulo.fechaPublicacion}
            </span>
            <span className="actualidad-meta-item">
              <strong>DOI:</strong> {articulo.doi}
            </span>
          </div>
        </div>

        <div className="actualidad-hero-titular">
          <h2 id="articulo-titular" className="actualidad-titular">{articulo.tituloEditorial}</h2>
          <p className="actualidad-subtitulo-riguroso">
            {articulo.enPocasPalabras}
          </p>
        </div>

        <div className="actualidad-hero-fuentes">
          <nav aria-label="Enlaces a fuentes originales">
            <ul>
              {fuentes.map((fuente) => (
                <li key={fuente.tipo}>
                  <a
                    href={fuente.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="actualidad-enlace-fuente"
                  >
                    {fuente.texto}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* --- Bloque «En pocas palabras» --- */}
      <section className="actualidad-pocas-palabras" aria-labelledby="pocas-palabras-titulo">
        <h2 id="pocas-palabras-titulo" className="actualidad-seccion-titulo">En pocas palabras</h2>
        <div className="actualidad-card-pocas-palabras">
          <p className="actualidad-card-texto">{articulo.resumenBreve}</p>
          <p className="actualidad-card-texto-secundario">{articulo.enPocasPalabras}</p>
        </div>
      </section>

      {/* --- ¿Qué se investigó? --- */}
      <section className="actualidad-seccion" aria-labelledby="investigo-titulo">
        <h2 id="investigo-titulo" className="actualidad-seccion-titulo">¿Qué se investigó?</h2>
        <p className="actualidad-parrafo-meta">
          {articulo.preguntaInvestigacion}
        </p>
      </section>

      {/* --- Principales hallazgos --- */}
      <section className="actualidad-seccion" aria-labelledby="hallazgos-titulo">
        <h2 id="hallazgos-titulo" className="actualidad-seccion-titulo">Principales hallazgos</h2>
        <ul className="actualidad-lista-hallazgos">
          {articulo.queEncontraron.map((item, i) => (
            <li key={i} className="actualidad-lista-item">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* --- Por qué es de interés para la ciencia --- */}
      <section className="actualidad-seccion" aria-labelledby="interes-titulo">
        <h2 id="interes-titulo" className="actualidad-seccion-titulo">Por qué es de interés para la ciencia</h2>
        <ul className="actualidad-lista-hallazgos">
          {articulo.porQueImporta.map((item, i) => (
            <li key={i} className="actualidad-lista-item">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* --- Bloque Crítico: Lo que este estudio NO demuestra --- */}
      <section className="actualidad-bloque-aviso" aria-labelledby="aviso-titulo">
        <div className="actualidad-aviso-icono" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" width="1.5rem" height="1.5rem">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" />
          </svg>
        </div>
        <div className="actualidad-aviso-contenido">
          <h2 id="aviso-titulo" className="actualidad-aviso-titulo">Lo que este estudio NO demuestra</h2>
          <p className="actualidad-aviso-texto">
            Las limitaciones prácticas más relevantes, diseñadas para una responsabilidad clínica:
          </p>
          <ul className="actualidad-lista-sin-rides">
            {articulo.loQueNoDemuestra.map((item, i) => (
              <li key={i} className="actualidad-lista-aviso">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- ¿Qué significa esto para ti hoy? --- */}
      <section className="actualidad-seccion" aria-labelledby="significado-titulo">
        <h2 id="significado-titulo" className="actualidad-seccion-titulo">¿Qué significa esto para ti hoy?</h2>
        <p className="actualidad-parrafo-meta">
          {articulo.queSignificaParaLector}
        </p>
      </section>

      {/* --- Ficha bibliográfica completa --- */}
      <section className="actualidad-ficha-bibliografica" aria-labelledby="ficha-titulo">
        <h2 id="ficha-titulo" className="actualidad-ficha-titulo">Ficha bibliográfica completa</h2>
        <blockquote className="actualidad-cita-formateada">
          <p>
            {articulo.tituloEditorial}. {articulo.revista}, {articulo.volumenArticulo}.
          </p>
          <p>
            DOI: <a href={`https://doi.org/${articulo.doi}`} target="_blank" rel="noopener noreferrer">
              {articulo.doi}
            </a>
          </p>
          <p>
            Autores: {articulo.autores.join(', ')}.
          </p>
          <p>
            Fecha de publicación: {articulo.fechaPublicacion}.
          </p>
          <p>
            Verificación: {articulo.fechaVerificacion}.
          </p>
        </blockquote>
      </section>
    </main>
  );
};

export default ActualidadPage;