import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header, PageRoute } from './components/Header';
import { Footer } from './components/Footer';
import { TopDisclaimer } from './components/TopDisclaimer';
import {
  ConsentGuard,
  ProtectedRoute,
  loadRegistry,
} from './components/ConsentGuard';
import { ConsentRegistry } from './types';
import { HomePage } from './pages/HomePage';
import { ExercisesPage } from './pages/ExercisesPage';
import GuidedSessionPage from './pages/GuidedSessionPage';
import { QuizPage } from './pages/QuizPage';
import { PanelPage } from './pages/PanelPage';
import { PlanPage } from './pages/PlanPage';
import { ApoyaPage } from './pages/ApoyaPage';
import { PausasActivasPage } from './pages/PausasActivasPage';
import { ScoliosisPage } from './pages/ScoliosisPage';
import { ActualidadPage } from './pages/ActualidadPage';
import { PrivacidadPage } from './pages/PrivacidadPage';
import { TerminosPage } from './pages/TerminosPage';
import { SaludIndicadoresPage } from './pages/SaludIndicadoresPage';
import { CuerpoYSaludPage } from './pages/CuerpoYSaludPage';
import { AlimentacionPage } from './pages/AlimentacionPage';
import { articulosNoticias } from './data/noticias';
import { NavigationAssistant } from './components/NavigationAssistant';
import { initGA4, pageView, disableGA4, hasAnalyticsConsent } from './utils/ga4';

/**
 * Rutas cuyo uso guarda datos introducidos por la persona. Requieren una
 * decisión registrada y vigente; el resto del sitio es público.
 */
const PROTECTED_ROUTES: ProtectedRoute[] = ['panel', 'quiz', 'plan'];

/** URL base del sitio publicado para canonical y Open Graph. */
const BASE_URL = 'https://fitcasa.fv143962.workers.dev';

/** Descripciones meta específicas por página pública. */
const DESCRIPTIONS: Record<PageRoute, string> = {
  inicio: 'Plataforma educativa de ejercicio en casa. Biblioteca de movimientos, orientación postural y seguimiento personal. Sin suscripción.',
  ejercicios: 'Biblioteca de 20 ejercicios para casa con filtros por dificultad, duración y zona corporal. Información educativa general.',
  'guided-session': 'Sesión guiada de ejercicio con temporizador y orientación de duración para practicar en casa.',
  quiz: 'Cuestionario de sugerencias de actividad física para obtener un plan de ejercicio personalizado según tus objetivos y disponibilidad.',
  panel: 'Panel de seguimiento personal para registrar actividad física, molestias y bienestar.',
  plan: 'Mi Plan de Actividad de 4 semanas: rutina semanal personalizada de ejercicio en casa.',
  apoya: 'Apoya el proyecto FitCasa con un apoyo voluntario o explorando los productos recomendados.',
  'pausas-activas': 'Pausas de movimiento breves para el trabajo o estudio en casa. Temporizador incluido.',
  escoliosis: 'Guía educativa sobre escoliosis: tipos, papel del ejercicio, evidencia disponible y señales de alarma. No sustituye valoración profesional.',
  actualidad: 'Artículo de divulgación científica sobre escoliosis y actividad física. Fuentes citadas.',
  privacidad: 'Política de privacidad de FitCasa: datos almacenados localmente, derechos y cómo ejercerlos.',
  terminos: 'Términos de uso de FitCasa: carácter educativo, alcance del contenido y condiciones de uso.',
  'salud-indicadores': 'Indicadores de salud y movimiento: qué miden y qué no. Guía educativa sin datos personales.',
  'cuerpo-y-salud': 'Qué es el IMC, sus limitaciones y por qué el bienestar va más allá de un número. Contenido educativo.',
  'alimentacion': 'Información educativa general sobre grupos de alimentos, nutrientes y hábitos. Sin dietas ni prescripciones.',
};

/** Rutas canónicas por página pública (sin fragmento de hash). */
const CANONICAL_PATHS: Record<PageRoute, string> = {
  inicio: '/',
  ejercicios: '/ejercicios',
  'guided-session': '/guided-session',
  quiz: '/quiz',
  panel: '/panel',
  plan: '/plan',
  apoya: '/apoya',
  'pausas-activas': '/pausas-activas',
  escoliosis: '/escoliosis',
  actualidad: '/actualidad',
  privacidad: '/privacidad',
  terminos: '/terminos',
  'salud-indicadores': '/salud-indicadores',
  'cuerpo-y-salud': '/cuerpo-y-salud',
  'alimentacion': '/alimentacion',
};

/** Actualiza etiquetas meta, canonical y Open Graph según la página actual. */
function updateMetaTags(page: PageRoute): void {
  const title = document.title;
  const description = DESCRIPTIONS[page] || DESCRIPTIONS.inicio;
  const canonical = CANONICAL_PATHS[page] || CANONICAL_PATHS.inicio;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // Canonical
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', BASE_URL + canonical);

  // Open Graph title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);

  // Open Graph description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute('content', description);

  // Open Graph URL
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', BASE_URL + canonical);
}

function getRouteFromUrl(): { page: PageRoute; sectionId?: string } {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const path = window.location.pathname.toLowerCase();

  if (hash.startsWith('guided-session') || path.includes('guided-session')) {
    return { page: 'guided-session' };
  }
  if (hash === 'ejercicios' || path.endsWith('/ejercicios') || path.endsWith('/ejercicios.html')) {
    return { page: 'ejercicios' };
  }
  if (hash === 'quiz' || path.endsWith('/quiz') || path.endsWith('/quiz.html')) {
    return { page: 'quiz' };
  }
  if (hash === 'panel' || path.endsWith('/panel') || path.endsWith('/panel.html')) {
    return { page: 'panel' };
  }
  if (hash === 'escoliosis' || path.endsWith('/escoliosis') || path.endsWith('/escoliosis.html')) {
    return { page: 'escoliosis' };
  }
  if (hash === 'privacidad' || path.endsWith('/privacidad') || path.endsWith('/privacidad.html')) {
    return { page: 'privacidad' };
  }
  if (hash === 'terminos' || path.endsWith('/terminos') || path.endsWith('/terminos.html')) {
    return { page: 'terminos' };
  }
  if (hash === 'actualidad' || path.endsWith('/actualidad') || path.endsWith('/actualidad.html')) {
    return { page: 'actualidad' };
  }
  if (hash === 'salud-indicadores' || path.endsWith('/salud-indicadores') || path.endsWith('/salud-indicadores.html')) {
    return { page: 'salud-indicadores' };
  }
  if (hash === 'cuerpo-y-salud' || path.endsWith('/cuerpo-y-salud') || path.endsWith('/cuerpo-y-salud.html')) {
    return { page: 'cuerpo-y-salud' };
  }
  if (hash === 'alimentacion' || path.endsWith('/alimentacion') || path.endsWith('/alimentacion.html')) {
    return { page: 'alimentacion' };
  }
  if (hash === 'plan' || path.endsWith('/plan') || path.endsWith('/plan.html')) {
    return { page: 'plan' };
  }
  if (hash === 'apoya' || path.endsWith('/apoya') || path.endsWith('/apoya.html')) {
    return { page: 'apoya' };
  }
  if (hash === 'pausas-activas' || path.endsWith('/pausas-activas') || path.endsWith('/pausas-activas.html')) {
    return { page: 'pausas-activas' };
  }
  if (hash === 'beneficios' || hash === 'programas' || hash === 'como-funciona') {
    return { page: 'inicio', sectionId: hash };
  }
  return { page: 'inicio' };
}

export const App: React.FC = () => {
  const initial = getRouteFromUrl();
  const [currentPage, setCurrentPage] = useState<PageRoute>(initial.page);
  // Registro vigente, o `null` si no hay decisión, está corrupto o quedó
  // desactualizado respecto a la versión actual de los documentos.
  const [registry, setRegistry] = useState<ConsentRegistry | null>(() => loadRegistry());
  const ga4Initialized = useRef(false);

  /** Vuelve a leer el registro: por ejemplo tras borrar los datos del sitio. */
  const refreshConsent = useCallback(() => setRegistry(loadRegistry()), []);

  useEffect(() => {
    const handlePopState = () => {
      const next = getRouteFromUrl();
      setCurrentPage(next.page);
      refreshConsent();
      if (next.sectionId) {
        setTimeout(() => {
          const el = document.getElementById(next.sectionId!);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [refreshConsent]);

  /** Inicializa GA4 solo si hay consentimiento de analítica; lo desactiva si se revoca. */
  useEffect(() => {
    if (!hasAnalyticsConsent(registry)) {
      disableGA4();
      ga4Initialized.current = false;
      return;
    }
    let cancelled = false;
    (async () => {
      if (ga4Initialized.current || cancelled) return;
      await initGA4();
      if (cancelled) return;
      ga4Initialized.current = true;
      pageView(window.location.pathname + window.location.hash, document.title);
    })();
    return () => {
      cancelled = true;
    };
  }, [registry]);

  useEffect(() => {
    const titles: Record<PageRoute, string> = {
      inicio: 'FitCasa | Ejercicio en casa y rutinas guiadas',
      ejercicios: 'FitCasa – Biblioteca de ejercicios',
      'guided-session': 'FitCasa – Práctica guiada',
      quiz: 'FitCasa – Sugerencias de actividad',
      panel: 'FitCasa – Panel de seguimiento',
      plan: 'FitCasa – Mi Plan de Actividad',
      apoya: 'FitCasa – Apoya a FitCasa',
      'pausas-activas': 'FitCasa – Pausas Activas y Descansos Ergonómicos',
      escoliosis: 'FitCasa – Información sobre escoliosis y ejercicio',
      actualidad: 'FitCasa – Actualidad y Evidencia Científica sobre Escoliosis',
      privacidad: 'FitCasa – Política de Privacidad',
      terminos: 'Términos y Condiciones | FitCasa',
      'salud-indicadores': 'FitCasa – Cuerpo, movimiento y salud',
      'cuerpo-y-salud': 'FitCasa – Cuerpo y salud',
      'alimentacion': 'FitCasa – Alimentación y bienestar',
    };
    document.title = titles[currentPage] || titles.inicio;

    // Set meta tags using setMeta pattern
    const setMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); if (property) el.setAttribute('property', name); else el.name = name; document.head.appendChild(el); }
      el.content = content;
    };

    setMeta('description', DESCRIPTIONS[currentPage] || DESCRIPTIONS.inicio);
    setMeta('og:title', titles[currentPage] || titles.inicio, true);
    setMeta('og:description', DESCRIPTIONS[currentPage] || DESCRIPTIONS.inicio);

    // Add noindex for protected pages (quiz, plan, panel, guided-session)
    const isProtectedPage = ['quiz', 'plan', 'panel', 'guided-session'].includes(currentPage);
    if (isProtectedPage) {
      let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
      robots.content = 'noindex';
    }

    updateMetaTags(currentPage);
    if (ga4Initialized.current && hasAnalyticsConsent(registry)) {
      pageView(window.location.pathname + window.location.hash, document.title);
    }
  }, [currentPage, registry]);

  const handleNavigate = (page: PageRoute, sectionId?: string) => {
    setCurrentPage(page);
    refreshConsent();
    if (page === 'inicio') {
      window.history.pushState(null, '', sectionId ? `#${sectionId}` : '#inicio');
      if (sectionId) {
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.history.pushState(null, '', `#${page}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isProtected = PROTECTED_ROUTES.includes(currentPage as ProtectedRoute);
  const showGuard = isProtected && registry === null;

  /** Rechazar no escribe ni borra nada: solo devuelve al contenido público. */
  const handleDecline = () => handleNavigate('inicio');

  return (
    <div className="fitcasa-app min-h-screen flex flex-col">
      <TopDisclaimer />
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      <div className="flex-1">
        {currentPage === 'inicio' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'ejercicios' && <ExercisesPage />}
        {currentPage === 'guided-session' && <GuidedSessionPage onNavigate={handleNavigate} />}
        {currentPage === 'escoliosis' && <ScoliosisPage onNavigate={handleNavigate} />}
        {currentPage === 'actualidad' && <ActualidadPage onNavigate={handleNavigate} articulo={articulosNoticias[0]} />}
        {currentPage === 'salud-indicadores' && <SaludIndicadoresPage onNavigate={handleNavigate} />}
        {currentPage === 'cuerpo-y-salud' && <CuerpoYSaludPage onNavigate={handleNavigate} />}
        {currentPage === 'alimentacion' && <AlimentacionPage onNavigate={handleNavigate} />}
        {currentPage === 'plan' && !showGuard && (
          <PlanPage onNavigate={handleNavigate} onStorageCleared={refreshConsent} />
        )}
        {currentPage === 'apoya' && <ApoyaPage onNavigate={handleNavigate} />}
        {currentPage === 'pausas-activas' && <PausasActivasPage onNavigate={handleNavigate} />}
        {currentPage === 'privacidad' && <PrivacidadPage onNavigate={handleNavigate} />}
        {currentPage === 'terminos' && <TerminosPage onNavigate={handleNavigate} />}
        {currentPage === 'quiz' && !showGuard && (
          <QuizPage onStorageCleared={refreshConsent} />
        )}
        {currentPage === 'panel' && !showGuard && (
          <PanelPage onStorageCleared={refreshConsent} />
        )}
        {showGuard && (
          <ConsentGuard
            route={currentPage as ProtectedRoute}
            onAccept={setRegistry}
            onDecline={handleDecline}
          />
        )}
      </div>

      <Footer onNavigate={handleNavigate} />
      <NavigationAssistant onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
