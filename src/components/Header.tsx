import React, { useState, useRef, useEffect } from 'react';

export type PageRoute =
  | 'inicio'
  | 'ejercicios'
  | 'guided-session'
  | 'quiz'
  | 'panel'
  | 'plan'
  | 'apoya'
  | 'pausas-activas'
  | 'escoliosis'
  | 'actualidad'
  | 'privacidad'
  | 'terminos'
  | 'salud-indicadores';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

const primaryNavItems: Array<{ page: PageRoute; label: string; sectionId?: string }> = [
  { page: 'inicio', label: 'Beneficios', sectionId: 'beneficios' },
  { page: 'inicio', label: 'Programas', sectionId: 'programas' },
  { page: 'escoliosis', label: 'Escoliosis' },
  { page: 'ejercicios', label: 'Ejercicios' },
];

const secondaryNavItems: Array<{ page: PageRoute; label: string; sectionId?: string }> = [
  { page: 'actualidad', label: 'Actualidad' },
  { page: 'pausas-activas', label: 'Pausas' },
  { page: 'quiz', label: 'Sugerencias' },
  { page: 'plan', label: 'Mi Plan' },
  { page: 'apoya', label: 'Apoya a FitCasa' },
  { page: 'panel', label: 'Seguimiento' },
  { page: 'inicio', label: 'Cómo funciona', sectionId: 'como-funciona' },
  { page: 'salud-indicadores', label: 'Cuerpo y salud' },
  { page: 'privacidad', label: 'Privacidad' },
  { page: 'terminos', label: 'Términos' },
];

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const moreMenuRef = useRef<HTMLUListElement>(null);

  const handleLinkClick = (page: PageRoute, sectionId?: string) => {
    setMenuOpen(false);
    setMoreOpen(false);
    onNavigate(page, sectionId);
  };

  const toggleMore = () => {
    setMoreOpen(!moreOpen);
  };

  const closeMore = () => {
    setMoreOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreOpen && moreButtonRef.current && !moreButtonRef.current.contains(event.target as Node)) {
        if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
          closeMore();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreOpen]);

  useEffect(() => {
    if (moreOpen) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closeMore();
          moreButtonRef.current?.focus();
        }
        if (event.key === 'Tab') {
          const focusableElements = moreMenuRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [moreOpen]);

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
          {primaryNavItems.map((item) => (
            <li key={item.page + (item.sectionId || '')}>
              <a
                href={item.sectionId ? `#${item.sectionId}` : `#${item.page}`}
                aria-current={item.sectionId ? (currentPage === item.page ? 'page' : undefined) : (currentPage === item.page ? 'page' : undefined)}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.page, item.sectionId);
                }}
              >
                {item.label}
              </a>
            </li>
          ))}

          <li className="menu-item-mas">
            <button
              ref={moreButtonRef}
              type="button"
              className="mas-toggle"
              aria-expanded={moreOpen}
              aria-controls="menu-mas"
              aria-haspopup="true"
              onClick={toggleMore}
            >
              Más
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </button>

            <ul
              ref={moreMenuRef}
              id="menu-mas"
              className={`menu-mas${moreOpen ? ' menu-mas--open' : ''}`}
              role="menu"
            >
              {secondaryNavItems.map((item) => (
                <li key={item.page + (item.sectionId || '')} role="none">
                  <a
                    role="menuitem"
                    href={item.sectionId ? `#${item.sectionId}` : `#${item.page}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(item.page, item.sectionId);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};
