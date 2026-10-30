import React from 'react';

/**
 * Visual conceptual para la revisión sistemática sobre ejercicio y escoliosis.
 *
 * Diagrama de red: nodos = modalidades de intervención, líneas = comparaciones
 * inclusas en el metaanálisis en red. Solo muestra la estructura de la red,
 * no magnitudes estadísticas ni probabilidades.
 */
export const VisualEsferaEjercicio: React.FC = () => {
  const nodos = [
    { id: 'pss', etiqueta: 'PSSE', sub: 'Función postural' },
    { id: 'sch', etiqueta: 'Schroth', sub: 'Método 3D' },
    { id: 'schc', etiqueta: 'Schroth + Core', sub: 'Combinación' },
    { id: 'pil', etiqueta: 'Pilates', sub: 'Core y postural' },
    { id: 'sus', etiqueta: 'Suspensión', sub: 'Con cuerda' },
    { id: 'pnf', etiqueta: 'PNF', sub: 'Estimulación propioceptiva' },
  ];

  const conexiones = [
    ['pss', 'sch'],
    ['sch', 'schc'],
    ['schc', 'pil'],
    ['pil', 'sus'],
    ['sus', 'pnf'],
    ['sch', 'pnf'],
    ['pss', 'pil'],
  ];

  const centro = { x: 230, y: 150 };
  const radio = 130;
  const anguloInicial = -Math.PI / 2;
  const particiones = nodos.length;

  const pos = (i: number) => {
    const angulo = anguloInicial + (2 * Math.PI * i) / particiones;
    return {
      x: centro.x + radio * Math.cos(angulo),
      y: centro.y + radio * Math.sin(angulo),
    };
  };

  return (
    <div className="visual-esfera__marco">
      <div className="visual-esfera__escena" role="img" aria-label="Diagrama conceptual de modalidades de ejercicio en la red del metaanálisis">
        <svg
          viewBox="0 0 460 300"
          className="visual-esfera__svg"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <radialGradient id="visual-esfera-fondo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#15433b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0e2f29" stopOpacity="0.95" />
            </radialGradient>
            <radialGradient id="visual-esfera-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a8c4b8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#a8c4b8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="visual-esfera-nodo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5c8276" />
              <stop offset="100%" stopColor="#44685d" />
            </linearGradient>
          </defs>

          {/* Fondo */}
          <circle cx={centro.x} cy={centro.y} r={radio + 30} fill="url(#visual-esfera-fondo)" />

          {/* Halo de iluminación */}
          <circle cx={centro.x} cy={centro.y} r={radio} fill="url(#visual-esfera-halo)" />

          {/* Líneas de la red */}
          <g className="visual-esfera__conexiones" stroke="#a8c4b8" strokeOpacity="0.35" strokeWidth="1.2">
            {conexiones.map(([a, b], i) => (
              <line
                key={`${a}-${b}-${i}`}
                x1={pos(nodos.findIndex((n) => n.id === a)).x}
                y1={pos(nodos.findIndex((n) => n.id === a)).y}
                x2={pos(nodos.findIndex((n) => n.id === b)).x}
                y2={pos(nodos.findIndex((n) => n.id === b)).y}
              />
            ))}
          </g>

          {/* Nodos */}
          {nodos.map((nodo, i) => {
            const { x, y } = pos(i);
            return (
              <g
                key={nodo.id}
                className="visual-esfera__nodo"
                transform={`translate(${x - 12}, ${y - 12})`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <circle r={12} fill="url(#visual-esfera-nodo)" stroke="#44685d" strokeWidth={1.5} />
                <circle r={6} fill="#f3f5f1" />
                <title>{nodo.etiqueta} — {nodo.sub}</title>
              </g>
            );
          })}

          {/* Líneas invisibles de accesibilidad (non-interactive, just semantics) */}
          <g className="visual-esfera__legend" fill="none" stroke="#a8c4b8" strokeWidth={0.8} strokeDasharray="3 4">
            {nodos.map((n) => (
              <circle key={n.id} cx={centro.x} cy={centro.y} r={1} />
            ))}
          </g>
        </svg>
        <div className="visual-esfera__leyenda">
          <p className="visual-esfera__nota">Conexiones de comparación</p>
          <ul className="visual-esfera__lista">
            {nodos.map((n) => (
              <li key={n.id}>
                <span className="visual-esfera__chip">{n.etiqueta}</span>
                <span>— {n.sub}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <span className="visual-esfera__sello">Conceptual</span>
    </div>
  );
};

export default VisualEsferaEjercicio;