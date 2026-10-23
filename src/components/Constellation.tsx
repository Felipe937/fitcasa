import React, { useRef, useEffect, useState } from 'react';

interface ConstellationProps {
  daysWithRecord: Set<string>;
  today: string;
  isAnimationPaused: boolean;
  onToggleAnimation: () => void;
}

const DAYS_BACK = 30;

export const Constellation: React.FC<ConstellationProps> = ({
  daysWithRecord,
  today,
  isAnimationPaused,
  onToggleAnimation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const driftAngleRef = useRef(0);
  const tiltXRef = useRef(0);
  const tiltYRef = useRef(0);
  const targetTiltXRef = useRef(0);
  const targetTiltYRef = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isAnimationPaused) return;

    const animateDrift = () => {
      driftAngleRef.current += 0.0003;

      tiltXRef.current += (targetTiltXRef.current - tiltXRef.current) * 0.05;
      tiltYRef.current += (targetTiltYRef.current - tiltYRef.current) * 0.05;

      if (svgRef.current) {
        const driftRotation = Math.sin(driftAngleRef.current) * 2;
        svgRef.current.style.transform = `
          perspective(800px)
          rotateX(${tiltXRef.current + driftRotation}deg)
          rotateY(${tiltYRef.current + Math.cos(driftAngleRef.current) * 1.5}deg)
        `;
      }

      animationFrameRef.current = requestAnimationFrame(animateDrift);
    };

    animationFrameRef.current = requestAnimationFrame(animateDrift);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimationPaused, prefersReducedMotion]);

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isAnimationPaused) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    targetTiltXRef.current = -deltaY * 6;
    targetTiltYRef.current = deltaX * 8;
  };

  const handlePointerLeave = () => {
    targetTiltXRef.current = 0;
    targetTiltYRef.current = 0;
  };

  const points = Array.from({ length: DAYS_BACK }, (_, i) => {
    const date = new Date(`${today}T00:00:00`);
    date.setDate(date.getDate() - (DAYS_BACK - 1 - i));
    const iso = date.toISOString().slice(0, 10);
    const hasRecord = daysWithRecord.has(iso);
    const angle = (i / DAYS_BACK) * Math.PI * 2 - Math.PI / 2;
    const radius = 140;
    const x = 200 + Math.cos(angle) * radius;
    const y = 200 + Math.sin(angle) * radius;
    const z = (Math.sin(angle * 3) * 40) + (Math.cos(angle * 2) * 20);

    return { iso, hasRecord, x, y, z, angle, index: i };
  });

  return (
    <div
      ref={containerRef}
      className="panel-constelacion"
      aria-hidden="true"
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="panel-constelacion__svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="constelacion-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-fondo-verde)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--color-fondo)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="180" fill="url(#constelacion-glow)" />

        {points.map((point, i) => (
          <g key={point.iso} className="panel-constelacion__punto-grupo">
            <circle
              cx={point.x}
              cy={point.y}
              r={point.hasRecord ? 5 : 3}
              className={`panel-constelacion__punto ${point.hasRecord ? 'panel-constelacion__punto--activo' : ''}`}
              style={{
                transform: `translateZ(${point.z}px)`,
                transformOrigin: `${point.x}px ${point.y}px`,
                transitionDelay: `${i * 30}ms`,
              }}
            />
            {point.hasRecord && (
              <circle
                cx={point.x}
                cy={point.y}
                r={8}
                className="panel-constelacion__halo"
                style={{
                  transform: `translateZ(${point.z + 5}px)`,
                  transformOrigin: `${point.x}px ${point.y}px`,
                  animationDelay: `${i * 30}ms`,
                }}
              />
            )}
          </g>
        ))}
      </svg>

      <button
        type="button"
        className="panel-constelacion__pausa"
        onClick={onToggleAnimation}
        aria-label={isAnimationPaused ? 'Reanudar movimiento' : 'Pausar movimiento'}
        aria-pressed={isAnimationPaused}
      >
        {isAnimationPaused ? (
          <>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" width="18" height="18">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
            Reanudar
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" width="18" height="18">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor" />
            </svg>
            Pausar movimiento
          </>
        )}
      </button>

      <div className="panel-constelacion__leyenda" aria-hidden="true">
        <span className="panel-constelacion__leyenda-punto">
          <span className="panel-constelacion__leyenda-marcador panel-constelacion__leyenda-marcador--activo" aria-hidden="true" />
          Día con registro
        </span>
        <span className="panel-constelacion__leyenda-punto">
          <span className="panel-constelacion__leyenda-marcador" aria-hidden="true" />
          Día sin registro
        </span>
      </div>
    </div>
  );
};

export default Constellation;