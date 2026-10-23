import React, { useState, useEffect } from 'react';
import { PageRoute } from '../components/Header';
import { GuidedSession } from '../components/GuidedSession';
import { EXERCISES_DATA } from '../data/exercisesData';
import { Exercise } from '../types';
import { readPlanStorage, writePlanStorage } from '../utils/storage';
import { markSessionCompleted } from '../utils/planGenerator';

interface GuidedSessionPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export const GuidedSessionPage: React.FC<GuidedSessionPageProps> = ({ onNavigate }) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [planContext, setPlanContext] = useState<{ weekNumber: number; sessionNumber: number } | undefined>();
  const [error, setError] = useState<string>('');
  const [showMarkCompleteDialog, setShowMarkCompleteDialog] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const parts = hash.split(':');

    if (parts[0] === 'guided-session' && parts[1]) {
      const exerciseId = parts[1];
      const foundExercise = EXERCISES_DATA.find((ex) => ex.id === exerciseId);

      if (foundExercise) {
        setExercise(foundExercise);

        if (parts[2] && parts[3]) {
          setPlanContext({
            weekNumber: parseInt(parts[2], 10),
            sessionNumber: parseInt(parts[3], 10),
          });
        }
      } else {
        setError('Ejercicio no encontrado');
      }
    } else {
      setError('Ruta inválida');
    }
  }, []);

  const handleCancel = () => {
    if (planContext) {
      onNavigate('plan');
    } else {
      onNavigate('ejercicios');
    }
  };

  const handleReturnToPlan = () => {
    onNavigate('plan');
  };

  const handleReturnToLibrary = () => {
    onNavigate('ejercicios');
  };

  const handleNavigateToPanel = (exerciseId: string) => {
    onNavigate('panel');
    setTimeout(() => {
      const dateInput = document.getElementById('entry-date') as HTMLInputElement;
      const activityInput = document.getElementById('entry-activity') as HTMLInputElement;
      const exerciseSelect = document.getElementById('exercise-quick-select') as HTMLSelectElement;

      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (activityInput && exercise) {
        activityInput.value = exercise.name;
        activityInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      if (exerciseSelect) {
        exerciseSelect.value = exerciseId;
        exerciseSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 100);
  };

  /**
   * Se invoca cuando la persona confirma el cierre de la sesión desde el
   * componente de práctica. Solo abre el diálogo de confirmación de plan;
   * la navegación real la manejan los botones de ese diálogo, para no
   * saltarse la confirmación ni marcar dos veces el progreso.
   */
  const handleComplete = (_durationSeconds: number) => {
    if (planContext) {
      setShowMarkCompleteDialog(true);
    }
    // Sin planContext (biblioteca libre): no hay progreso que registrar,
    // la persona simplemente vuelve a la biblioteca desde el diálogo.
  };

  const handleMarkSessionComplete = () => {
    if (!planContext) return;

    const planRes = readPlanStorage();
    if (planRes.value) {
      const updatedPlan = markSessionCompleted(
        planRes.value,
        planContext.weekNumber,
        planContext.sessionNumber
      );
      writePlanStorage(updatedPlan);
    }

    setShowMarkCompleteDialog(false);
    onNavigate('plan');
  };

  const handleSkipMarkComplete = () => {
    setShowMarkCompleteDialog(false);
    if (planContext) {
      onNavigate('plan');
    } else {
      onNavigate('ejercicios');
    }
  };

  if (error) {
    return (
      <main className="container" style={{ padding: 'var(--espacio-6)' }}>
        <h1>Error</h1>
        <p>{error}</p>
        <button
          type="button"
          className="btn"
          onClick={() => onNavigate('ejercicios')}
        >
          Volver a la biblioteca
        </button>
      </main>
    );
  }

  if (!exercise) {
    return (
      <main className="container" style={{ padding: 'var(--espacio-6)' }}>
        <p>Cargando ejercicio...</p>
      </main>
    );
  }

  return (
    <>
      <GuidedSession
        exercise={exercise}
        planContext={planContext}
        onComplete={handleComplete}
        onCancel={handleCancel}
        onNavigateToPanel={handleNavigateToPanel}
        onReturnToPlan={planContext ? handleReturnToPlan : undefined}
        onReturnToLibrary={handleReturnToLibrary}
      />

      {showMarkCompleteDialog && (
        <div
          className="guided-session__dialog"
          role="alertdialog"
          aria-labelledby="mark-complete-heading"
          aria-describedby="mark-complete-body"
        >
          <h2 id="mark-complete-heading">¿Marcar sesión como completada en tu plan?</h2>
          <p id="mark-complete-body">
            Has finalizado la práctica de la semana {planContext?.weekNumber}, sesión {planContext?.sessionNumber}.
            ¿Quieres marcarla como realizada en tu plan de 4 semanas?
          </p>
          <div className="guided-session__dialog-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={handleSkipMarkComplete}
            >
              No marcar
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleMarkSessionComplete}
            >
              Marcar como completada
            </button>
          </div>
        </div>
      )}
    </>
  );
};
