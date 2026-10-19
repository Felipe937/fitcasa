import React from 'react';
import { UserPlan } from '../types';
import { getPlanProgress, getWeekProgress } from '../utils/planGenerator';

interface PlanJourneyMapProps {
  plan: UserPlan;
  activeWeek: number;
}

const ROUTE_PATH = 'M28 100 C94 30 154 164 216 92 S326 48 392 100';

const PlanJourneyMap: React.FC<PlanJourneyMapProps> = ({ plan, activeWeek }) => {
  const progress = getPlanProgress(plan);
  const progressOffset = 100 - progress.percentage;

  return (
    <div
      className="plan-page__mapa"
      role="img"
      aria-label={`Recorrido de cuatro semanas: ${progress.completed} de ${progress.total} sesiones completadas.`}
    >
      <svg className="plan-page__mapa-svg" viewBox="0 0 420 150" aria-hidden="true" focusable="false">
        <path className="plan-page__mapa-trazo" d={ROUTE_PATH} pathLength="100" />
        <path
          className="plan-page__mapa-avance"
          d={ROUTE_PATH}
          pathLength="100"
          style={{ strokeDashoffset: `${progressOffset}` }}
        />
        {plan.weeks.map((week, index) => {
          const weekProgress = getWeekProgress(plan, week.weekNumber);
          const completed = weekProgress.total > 0 && weekProgress.completed === weekProgress.total;
          const partial = weekProgress.completed > 0 && !completed;
          const state = completed ? 'completada' : activeWeek === week.weekNumber ? 'activa' : partial ? 'en-progreso' : 'pendiente';
          const positions = [28, 148, 272, 392];
          const heights = [100, 89, 89, 100];

          return (
            <g key={week.weekNumber} className={`plan-page__mapa-nodo plan-page__mapa-nodo--${state}`} transform={`translate(${positions[index]}, ${heights[index]})`}>
              <circle className="plan-page__mapa-nodo-anillo" r="15" />
              <circle className="plan-page__mapa-nodo-centro" r="8" />
              <text className="plan-page__mapa-nodo-numero" y="4">{week.weekNumber}</text>
            </g>
          );
        })}
      </svg>
      <div className="plan-page__mapa-leyenda" aria-hidden="true">
        <span>Ruta del plan</span>
        <span>{progress.completed}/{progress.total} sesiones</span>
      </div>
    </div>
  );
};

export default PlanJourneyMap;
