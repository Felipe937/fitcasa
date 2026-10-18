import React from 'react';
import { ProductoAfiliado } from '../data/productos';

interface ProductoRecomendadoProps {
  producto: ProductoAfiliado;
  variant?: 'card' | 'inline';
  onNavigate?: (page: string, sectionId?: string) => void;
}

const CATEGORIA_ICONOS: Record<string, React.ReactNode> = {
  colchoneta: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 12h12" />
    </svg>
  ),
  bandas: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" />
      <path d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" />
    </svg>
  ),
  peso: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
};

const CATEGORIA_LABELS: Record<string, string> = {
  colchoneta: 'Colchoneta',
  bandas: 'Bandas elásticas',
  peso: 'Peso ligero',
};

export const ProductoRecomendado: React.FC<ProductoRecomendadoProps> = ({
  producto,
  variant = 'card',
}) => {
  const { nombre, categoria, descripcionCorta, porQueEsUtil, urlAmazon, recomendacionUso } = producto;
  const Icono = CATEGORIA_ICONOS[categoria];
  const CategoriaLabel = CATEGORIA_LABELS[categoria];

  const hasUrl = Boolean(urlAmazon);

  if (variant === 'inline') {
    return (
      <div className="producto-inline">
        <span className="producto-inline__icono" aria-hidden="true">
          {Icono}
        </span>
        <div className="producto-inline__contenido">
          <strong className="producto-inline__nombre">{nombre}</strong>
          <span className="producto-inline__categoria">{CategoriaLabel}</span>
          <p className="producto-inline__descripcion">{descripcionCorta}</p>
        </div>
        {hasUrl ? (
          <a
            href={urlAmazon}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="producto-inline__link"
            aria-label={`Consultar ${nombre} en Amazon (enlace externo patrocinado, se abre en nueva pestaña)`}
          >
            Consultar en Amazon ↗
          </a>
        ) : (
          <span className="producto-inline__estado">Orientación de compra · Enlace en preparación</span>
        )}
      </div>
    );
  }

  return (
    <article className="producto-card">
      <div className="producto-card__icono" aria-hidden="true">
        {Icono}
      </div>
      <div className="producto-card__contenido">
        <div className="producto-card__cabecera">
          <span className="producto-card__categoria">{CategoriaLabel}</span>
          <h3 className="producto-card__nombre">{nombre}</h3>
        </div>
        <p className="producto-card__descripcion">{descripcionCorta}</p>
        <p className="producto-card__utilidad">{porQueEsUtil}</p>
        <p className="producto-card__recomendacion"><strong>Recomendación:</strong> {recomendacionUso}</p>
      </div>
      <div className="producto-card__acciones">
        {hasUrl ? (
          <a
            href={urlAmazon}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="btn producto-card__link"
            aria-label={`Consultar ${nombre} en Amazon (enlace externo patrocinado, se abre en nueva pestaña)`}
          >
            Consultar en Amazon ↗
          </a>
        ) : (
          <div className="producto-card__estado">
            <span className="producto-card__estado-texto">Orientación de compra</span>
            <span className="producto-card__estado-badge">Enlace en preparación</span>
          </div>
        )}
        <p className="producto-card__patrocinado" aria-hidden="true">Enlace patrocinado</p>
      </div>
    </article>
  );
};

export default ProductoRecomendado;