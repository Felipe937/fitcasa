import React, { useState, useEffect, useCallback } from 'react';
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
import { AlimentacionPage } from './pages/AlimentacionPage';
import { articulosNoticias } from './data/noticias';
import { NavigationAssistant } from './components/NavigationAssistant';

/**
 * Rutas cuyo uso guarda datos introducidos por la persona. Requieren una
 * decisión registrada y vigente; el resto del sitio es público.
 */
const PROTECTED_ROUTES: ProtectedRoute[] = ['panel', 'quiz', 'plan'];

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
  }, [currentPage]);

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
        {currentPage === 'cuerpo-y-salud' && <SaludIndicadoresPage onNavigate={handleNavigate} />}
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
