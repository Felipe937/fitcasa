import React, { useState } from 'react';

export type PageRoute =
  | 'inicio'
  | 'ejercicios'
  | 'quiz'
  | 'panel'
  | 'plan'
  | 'apoya'
  | 'pausas-activas'
  | 'escoliosis'
  | 'actualidad'
  | 'privacidad'
  | 'terminos';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = (page: PageRoute, sectionId?: string) => {
    setMenuOpen(false);
    onNavigate(page, sectionId);
  };

  return (
    <header className="site-header">
      <nav aria-label="Navegación principal" className="container">
        <a
          href="#inicio"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('inicio', 'inicio');
          }}
        >
          FitCasa
        </a>

        <button
          type="button"
          className="menu-toggle"
          id="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="menu-principal"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Menú
        </button>

        <ul
          id="menu-principal"
          className={`menu${menuOpen ? ' menu--open' : ''}`}
        >
          <li>
            <a
              href="#beneficios"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('inicio', 'beneficios');
              }}
            >
              Beneficios
            </a>
          </li>
          <li>
            <a
              href="#programas"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('inicio', 'programas');
              }}
            >
              Programas
            </a>
          </li>
          <li>
            <a
              href="#escoliosis"
              aria-current={currentPage === 'escoliosis' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('escoliosis');
              }}
            >
              Escoliosis
            </a>
          </li>
          <li>
            <a
              href="#actualidad"
              aria-current={currentPage === 'actualidad' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('actualidad');
              }}
            >
              Actualidad
            </a>
          </li>
          <li>
            <a
              href="#ejercicios"
              aria-current={currentPage === 'ejercicios' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('ejercicios');
              }}
            >
              Ejercicios
            </a>
          </li>
          <li>
            <a
              href="#pausas-activas"
              aria-current={currentPage === 'pausas-activas' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('pausas-activas');
              }}
            >
              Pausas
            </a>
          </li>
          <li>
            <a
              href="#quiz"
              aria-current={currentPage === 'quiz' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('quiz');
              }}
            >
              Sugerencias
            </a>
          </li>
          <li>
            <a
              href="#plan"
              aria-current={currentPage === 'plan' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('plan');
              }}
            >
              Mi Plan
            </a>
          </li>
          <li>
            <a
              href="#apoya"
              aria-current={currentPage === 'apoya' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('apoya');
              }}
            >
              Apoya a FitCasa
            </a>
          </li>
          <li>
            <a
              href="#panel"
              aria-current={currentPage === 'panel' ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('panel');
              }}
            >
              Seguimiento
            </a>
          </li>
          <li>
            <a
              href="#como-funciona"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('inicio', 'como-funciona');
              }}
            >
              Cómo funciona
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
