import React from 'react';
import { ProductoAfiliado } from '../data/productos';

interface ProductoRecomendadoProps {
  producto: ProductoAfiliado;
  variant?: 'card' | 'inline';
  onNavigate?: (page: string, sectionId?: string) => void;
}

const PRODUCTO_ILUSTRACIONES: Record<string, React.ReactNode> = {
  bandas: (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g strokeOpacity="0.3">
        <path d="M20 60 Q60 30 100 60 Q60 90 20 60" />
        <path d="M25 60 Q60 38 95 60 Q60 82 25 60" />
        <path d="M30 60 Q60 45 90 60 Q60 75 30 60" />
      </g>
      <g strokeOpacity="1">
        <path d="M35 60 Q60 48 85 60 Q60 72 35 60" strokeWidth="2" />
        <path d="M40 60 Q60 52 80 60 Q60 68 40 60" strokeWidth="2.5" />
      </g>
      <circle cx="60" cy="60" r="8" fill="currentColor" strokeWidth="0" opacity="0.15" />
    </svg>
  ),
  colchoneta: (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="12" y="30" width="96" height="60" rx="8" strokeWidth="2" />
      <g strokeWidth="1" strokeDasharray="8 4" opacity="0.5">
        <line x1="20" y1="45" x2="100" y2="45" />
        <line x1="20" y1="60" x2="100" y2="60" />
        <line x1="20" y1="75" x2="100" y2="75" />
      </g>
      <g strokeWidth="1.5" opacity="0.8">
        <path d="M35 50 Q40 45 45 50" fill="none" />
        <path d="M75 50 Q80 45 85 50" fill="none" />
        <path d="M35 70 Q40 75 45 70" fill="none" />
        <path d="M75 70 Q80 75 85 70" fill="none" />
      </g>
    </svg>
  ),
  peso: (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="60" cy="60" r="28" strokeWidth="2" />
      <circle cx="60" cy="60" r="18" strokeWidth="1.5" opacity="0.5" />
      <g strokeWidth="2.5">
        <line x1="60" y1="20" x2="60" y2="40" />
        <line x1="60" y1="80" x2="60" y2="100" />
        <line x1="20" y1="60" x2="40" y2="60" />
        <line x1="80" y1="60" x2="100" y2="60" />
      </g>
      <g strokeWidth="1.5" opacity="0.6">
        <line x1="35" y1="35" x2="48" y2="48" />
        <line x1="72" y1="48" x2="85" y2="35" />
        <line x1="35" y1="85" x2="48" y2="72" />
        <line x1="72" y1="72" x2="85" y2="85" />
      </g>
      <circle cx="60" cy="60" r="6" fill="currentColor" strokeWidth="0" opacity="0.2" />
    </svg>
  ),
  rodillo: (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="25" y="45" width="70" height="30" rx="15" strokeWidth="2" />
      <g strokeWidth="1" strokeDasharray="4 3" opacity="0.4">
        <line x1="30" y1="50" x2="90" y2="50" />
        <line x1="30" y1="60" x2="90" y2="60" />
        <line x1="30" y1="70" x2="90" y2="70" />
      </g>
      <g strokeWidth="1.5" opacity="0.7">
        <path d="M35 55 Q40 50 45 55" fill="none" />
        <path d="M55 55 Q60 50 65 55" fill="none" />
        <path d="M75 55 Q80 50 85 55" fill="none" />
        <path d="M35 65 Q40 70 45 65" fill="none" />
        <path d="M55 65 Q60 70 65 65" fill="none" />
        <path d="M75 65 Q80 70 85 65" fill="none" />
      </g>
      <ellipse cx="60" cy="45" rx="20" ry="4" fill="none" strokeWidth="1.5" opacity="0.5" />
      <ellipse cx="60" cy="75" rx="20" ry="4" fill="none" strokeWidth="1.5" opacity="0.5" />
    </svg>
  ),
  bloque: (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="30" y="35" width="60" height="50" rx="4" strokeWidth="2" />
      <g strokeWidth="1" opacity="0.3">
        <line x1="40" y1="45" x2="80" y2="45" />
        <line x1="40" y1="55" x2="80" y2="55" />
        <line x1="40" y1="65" x2="80" y2="65" />
        <line x1="45" y1="35" x2="45" y2="85" />
        <line x1="55" y1="35" x2="55" y2="85" />
        <line x1="65" y1="35" x2="65" y2="85" />
        <line x1="75" y1="35" x2="75" y2="85" />
      </g>
      <path d="M25 60 Q60 40 95 60" strokeWidth="2" fill="none" opacity="0.8" />
      <path d="M25 60 Q60 80 95 60" strokeWidth="2" fill="none" opacity="0.8" />
      <path d="M45 30 Q60 20 75 30" strokeWidth="1.5" fill="none" strokeDasharray="4 3" opacity="0.5" />
      <path d="M45 90 Q60 100 75 90" strokeWidth="1.5" fill="none" strokeDasharray="4 3" opacity="0.5" />
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
  const Ilustracion = PRODUCTO_ILUSTRACIONES[categoria] || PRODUCTO_ILUSTRACIONES.peso;
  const CategoriaLabel = CATEGORIA_LABELS[categoria];

  const hasUrl = Boolean(urlAmazon);

  if (variant === 'inline') {
    return (
      <div className="producto-inline">
        <span className="producto-inline__icono" aria-hidden="true">
          {Ilustracion}
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
          <span className="producto-inline__estado">Orientación de compra</span>
        )}
      </div>
    );
  }

  return (
    <article className="producto-card">
      <div className="producto-card__ilustracion" aria-hidden="true">
        <div className="producto-card__ilustracion-inner">
          {Ilustracion}
        </div>
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
          </div>
        )}
        <p className="producto-card__patrocinado" aria-hidden="true">Enlace patrocinado</p>
      </div>
    </article>
  );
};

export default ProductoRecomendado;