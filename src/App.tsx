import React, { useState, useEffect } from 'react';
import { Header, PageRoute } from './components/Header';
import { Footer } from './components/Footer';
import { TopDisclaimer } from './components/TopDisclaimer';
import { HomePage } from './pages/HomePage';
import { ExercisesPage } from './pages/ExercisesPage';
import { QuizPage } from './pages/QuizPage';
import { PanelPage } from './pages/PanelPage';
import { ScoliosisPage } from './pages/ScoliosisPage';

function getRouteFromUrl(): { page: PageRoute; sectionId?: string } {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const path = window.location.pathname.toLowerCase();

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
  if (hash === 'beneficios' || hash === 'programas' || hash === 'como-funciona') {
    return { page: 'inicio', sectionId: hash };
  }
  return { page: 'inicio' };
}

export const App: React.FC = () => {
  const initial = getRouteFromUrl();
  const [currentPage, setCurrentPage] = useState<PageRoute>(initial.page);

  useEffect(() => {
    const handlePopState = () => {
      const next = getRouteFromUrl();
      setCurrentPage(next.page);
      if (next.sectionId) {
        setTimeout(() => {
          const el = document.getElementById(next.sectionId!);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  useEffect(() => {
    const titles: Record<PageRoute, string> = {
      inicio: 'FitCasa | Ejercicio en casa y rutinas guiadas',
      ejercicios: 'FitCasa – Biblioteca de ejercicios',
      quiz: 'FitCasa – Sugerencias de actividad',
      panel: 'FitCasa – Panel de seguimiento',
      escoliosis: 'FitCasa – Información sobre escoliosis y ejercicio',
    };
    document.title = titles[currentPage] || titles.inicio;
  }, [currentPage]);

  const handleNavigate = (page: PageRoute, sectionId?: string) => {
    setCurrentPage(page);
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

  return (
    <div className="fitcasa-app min-h-screen flex flex-col">
      <TopDisclaimer />
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      <div className="flex-1">
        {currentPage === 'inicio' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'ejercicios' && <ExercisesPage />}
        {currentPage === 'quiz' && <QuizPage />}
        {currentPage === 'panel' && <PanelPage />}
        {currentPage === 'escoliosis' && <ScoliosisPage onNavigate={handleNavigate} />}
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
