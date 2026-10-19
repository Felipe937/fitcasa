import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PageRoute } from '../components/Header';

interface ScoliosisPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

/**
 * Ilustración esquemática de la columna vertebral con profundidad multicapa.
 *
 * Arquitectura de capas 3D (SVG + CSS transform):
 *  1. Capa fondo: malla nanométrica de puntos y halo de dispersión lumínica.
 *  2. Capa profunda: escala métrica anatómica, plomada gravitacional y sombra de contacto.
 *  3. Capa costillas: silueta torácica bilateral con transparencia orgánica.
 *  4. Capa columna: canal medular, discos intervertebrales y cuerpos vertebrales
 *     con sombreado volumétrico, facetas articulares y luz de borde.
 *  5. Capa clínica: arco de ángulo de Cobb (curvatura angular), flecha directriz,
 *     ejes de inclinación y marcadores de regiones (Cervical, Torácica, Lumbar).
 *
 * Seguridad clínica: la curvatura representa fielmente una condición escoliótica
 * estructural tridimensional con fines educativos. NUNCA se anima a una rectificación
 * terapéutica milagrosa.
 */
const IlustracionColumna: React.FC = () => (
  <figure className="scoliosis-columna" aria-hidden="true">
    <div className="scoliosis-columna__viewport">
      <svg
        className="scoliosis-columna__svg"
        viewBox="0 0 420 580"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
        role="presentation"
      >
        <defs>
          {/* Gradiente volumétrico para el cuerpo vertebral (convexidad lumínica) */}
          <linearGradient id="vert-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-salvia-claro)" />
            <stop offset="42%" stopColor="var(--color-secundario)" />
            <stop offset="100%" stopColor="var(--color-secundario-oscuro)" />
          </linearGradient>

          {/* Sombra de oclusión facetaria lateral */}
          <linearGradient id="vert-sombra" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#000" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.38" />
          </linearGradient>

          {/* Gradiente de disco intervertebral con viscoelasticidad aparente */}
          <linearGradient id="disco-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primario-oscuro)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#051412" stopOpacity="0.9" />
          </linearGradient>

          {/* Resplandor ambiental biofísico */}
          <radialGradient id="spine-glow" cx="50%" cy="45%" r="62%">
            <stop offset="0%" stopColor="var(--color-salvia-claro)" stopOpacity="0.2" />
            <stop offset="60%" stopColor="var(--color-salvia-claro)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--color-salvia-claro)" stopOpacity="0" />
          </radialGradient>

          {/* Cuadrícula de referencia métrica médica */}
          <pattern id="spine-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.1" fill="var(--color-salvia-claro)" opacity="0.16" />
          </pattern>

          {/* Filtros para sombras profundas */}
          <filter id="spine-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="spine-blur-subtle" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* Unidad vertebral tipo con volumen, endplates, apófisis y facetas */}
          <g id="vert">
            {/* Apófisis transversas bilaterales */}
            <rect x="-45" y="-7" width="18" height="10" rx="5" fill="var(--color-secundario)" />
            <rect x="27" y="-7" width="18" height="10" rx="5" fill="var(--color-secundario)" />
            {/* Apófisis espinosa posterior */}
            <path d="M 22 -4 L 54 4 L 22 12 Z" fill="var(--color-secundario-oscuro)" />
            {/* Sombra de proyección apofisaria */}
            <path d="M 22 0 L 48 5 L 22 10 Z" fill="#000" opacity="0.25" />

            {/* Cuerpo vertebral anterior */}
            <rect x="-29" y="-15" width="58" height="30" rx="13" fill="url(#vert-grad)" />
            {/* Modulación de luz y sombra volumétrica */}
            <rect x="-29" y="-15" width="58" height="30" rx="13" fill="url(#vert-sombra)" />

            {/* Endplate cartilaginoso superior (cresta de luz) */}
            <rect x="-25" y="-15" width="50" height="4.5" rx="2.25" fill="var(--color-superficie)" opacity="0.5" />
            {/* Endplate inferior con sombra de oclusión sobre disco */}
            <rect x="-25" y="10.5" width="50" height="4.5" rx="2.25" fill="var(--color-primario-oscuro)" opacity="0.25" />

            {/* Línea de contorno técnico */}
            <rect
              x="-29"
              y="-15"
              width="58"
              height="30"
              rx="13"
              fill="none"
              stroke="var(--color-salvia-claro)"
              strokeWidth="0.75"
              opacity="0.35"
            />
          </g>
        </defs>

        {/* ── Capa 1: Fondo y luminiscencia ── */}
        <g className="scoliosis-columna__capa scoliosis-columna__capa--fondo">
          <rect width="420" height="580" fill="url(#spine-grid)" />
          <circle cx="210" cy="290" r="215" fill="url(#spine-glow)" />
        </g>

        {/* ── Capa 2: Eje gravitacional, escala milimétrica y sombra ── */}
        <g className="scoliosis-columna__capa scoliosis-columna__capa--profunda">
          {/* Sombra de contacto en la base pélvica */}
          <ellipse cx="210" cy="554" rx="124" ry="12" fill="#000" opacity="0.32" filter="url(#spine-blur)" />

          {/* Plomada de referencia ortostática (línea C7 - Sacro central) */}
          <line
            x1="210"
            y1="40"
            x2="210"
            y2="540"
            stroke="var(--color-salvia-claro)"
            strokeWidth="1.5"
            strokeDasharray="5 7"
            opacity="0.4"
          />

          {/* Regla milimétrica científica lateral */}
          <g stroke="var(--color-salvia-claro)" strokeWidth="0.75" opacity="0.28">
            <line x1="384" y1="70" x2="384" y2="520" />
            <line x1="378" y1="70" x2="388" y2="70" />
            <line x1="380" y1="120" x2="386" y2="120" />
            <line x1="378" y1="180" x2="388" y2="180" />
            <line x1="380" y1="240" x2="386" y2="240" />
            <line x1="378" y1="310" x2="388" y2="310" />
            <line x1="380" y1="380" x2="386" y2="380" />
            <line x1="378" y1="450" x2="388" y2="450" />
            <line x1="378" y1="520" x2="388" y2="520" />
          </g>
        </g>

        {/* ── Capa 3: Jaula torácica insinuada (arcos costales) ── */}
        <g className="scoliosis-columna__capa scoliosis-columna__capa--costillas" fill="none" stroke="var(--color-salvia-claro)" opacity="0.15" strokeLinecap="round">
          {/* Costillas lado izquierdo (concavidad/convexidad torácica) */}
          <path d="M 216 342 C 156 332 116 364 102 416" strokeWidth="2.8" />
          <path d="M 222 308 C 164 298 124 328 112 378" strokeWidth="2.8" />
          <path d="M 226 274 C 172 266 138 294 124 342" strokeWidth="2.6" />
          <path d="M 228 240 C 178 232 144 258 132 304" strokeWidth="2.4" />
          <path d="M 224 206 C 182 198 152 220 142 262" strokeWidth="2.2" />

          {/* Costillas lado derecho */}
          <path d="M 204 342 C 264 332 304 364 318 416" strokeWidth="2.8" />
          <path d="M 198 308 C 256 298 296 328 308 378" strokeWidth="2.8" />
          <path d="M 194 274 C 248 266 282 294 296 342" strokeWidth="2.6" />
          <path d="M 192 240 C 242 232 276 258 288 304" strokeWidth="2.4" />
          <path d="M 196 206 C 238 198 268 220 278 262" strokeWidth="2.2" />
        </g>

        {/* ── Capa 4: Columna vertebral estructurada (Canal, discos y vértebras) ── */}
        <g className="scoliosis-columna__capa scoliosis-columna__capa--columna">
          {/* Canal medular (trayectoria bioeléctrica discontinua) */}
          <path
            d="M 210 534 C 188 466 242 404 216 344 C 188 288 238 234 212 174 C 200 138 202 104 212 70"
            fill="none"
            stroke="var(--color-primario-oscuro)"
            strokeWidth="5"
            strokeDasharray="2 10"
            opacity="0.55"
          />

          {/* Discos intervertebrales adaptados a la curvatura biomecánica */}
          <g fill="url(#disco-grad)">
            <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(198 496) rotate(-2)" />
            <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(198 458) rotate(3)" />
            <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(202 420) rotate(8)" />
            <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(209 382) rotate(11)" />
            <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(217 344) rotate(10)" />
            <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(222 306) rotate(3)" />
            <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(220 268) rotate(-6)" />
            <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(213 230) rotate(-11)" />
            <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(205 192) rotate(-10)" />
            <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(199 154) rotate(-5)" />
            <rect x="-24" y="-5" width="48" height="10" rx="5" transform="translate(199 116) rotate(3)" />
          </g>

          {/* Vértebras apiladas conformando curva en S clínica realista */}
          <g className="scoliosis-columna__vertebras">
            {/* Lumbar */}
            <use href="#vert" transform="translate(198 514) rotate(-3)" />
            <use href="#vert" transform="translate(197 476) rotate(0)" />
            <use href="#vert" transform="translate(199 438) rotate(6)" />
            {/* Transición tóraco-lumbar */}
            <use href="#vert" transform="translate(205 400) rotate(10)" />
            <use href="#vert" transform="translate(213 362) rotate(12)" />
            {/* Vértice torácico (ápice de la curva) */}
            <use href="#vert" transform="translate(221 324) rotate(8)" />
            <use href="#vert" transform="translate(223 286) rotate(-3)" />
            <use href="#vert" transform="translate(217 248) rotate(-10)" />
            <use href="#vert" transform="translate(209 210) rotate(-12)" />
            {/* Cervico-torácico */}
            <use href="#vert" transform="translate(201 172) rotate(-9)" />
            <use href="#vert" transform="translate(197 134) rotate(0)" />
            <use href="#vert" transform="translate(201 96) rotate(6)" />
          </g>
        </g>

        {/* ── Capa 5: Anotaciones clínicas y vector de Cobb ── */}
        <g className="scoliosis-columna__capa scoliosis-columna__capa--clinica">
          {/* Ejes directrices de las vértebras límite de la curva (líneas de Cobb) */}
          <line x1="160" y1="210" x2="265" y2="188" stroke="var(--color-salvia-claro)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <line x1="165" y1="365" x2="275" y2="385" stroke="var(--color-salvia-claro)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Arco angular del Ángulo de Cobb en terracota de alto contraste */}
          <path
            d="M 210 314 L 276 314 A 66 66 0 0 0 256 374"
            fill="none"
            stroke="var(--color-terciario)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 256 374 L 261 364 M 256 374 L 249 367"
            fill="none"
            stroke="var(--color-terciario)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Placa tipográfica del Ángulo de Cobb */}
          <g transform="translate(284, 314)">
            <rect x="-4" y="-12" width="94" height="34" rx="6" fill="var(--color-primario-oscuro)" opacity="0.75" />
            <text x="0" y="3" fill="var(--color-salvia-claro)" fontSize="11" fontWeight="800" letterSpacing="0.06em">
              ÁNGULO COBB
            </text>
            <text x="0" y="17" fill="var(--color-terciario)" fontSize="10.5" fontWeight="700">
              Evaluación tridimensional
            </text>
          </g>

          {/* Rótulos de zonificación anatómica */}
          <g fill="var(--color-salvia-claro)" fontSize="10.5" fontWeight="800" letterSpacing="0.08em" opacity="0.8">
            <text x="32" y="104" textAnchor="start">C1–C7 CERVICAL</text>
            <text x="24" y="302" textAnchor="start">T1–T12 TORÁCICA</text>
            <text x="32" y="504" textAnchor="start">L1–L5 LUMBAR</text>
          </g>

          {/* Punteros de nivel hacia la columna vertebral */}
          <g stroke="var(--color-salvia-claro)" strokeWidth="1" opacity="0.4">
            <line x1="140" y1="100" x2="185" y2="100" />
            <line x1="142" y1="298" x2="188" y2="298" />
            <line x1="135" y1="500" x2="184" y2="500" />
          </g>

          {/* Marcadores fiduciales de precisión científica */}
          <g fill="var(--color-salvia-claro)" opacity="0.35">
            <circle cx="68" cy="68" r="2.2" />
            <circle cx="356" cy="130" r="2" />
            <circle cx="342" cy="488" r="2.2" />
            <circle cx="78" cy="530" r="2" />
          </g>
        </g>
      </svg>
    </div>
  </figure>
);

export const ScoliosisPage: React.FC<ScoliosisPageProps> = ({ onNavigate }) => {
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [copiadoUrl, setCopiadoUrl] = useState<boolean>(false);
  const [copiadoPreguntas, setCopiadoPreguntas] = useState<boolean>(false);

  // Estado para las casillas de la lista interactiva de preguntas
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    q5: false,
  });

  const heroRef = useRef<HTMLElement | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiadoUrl(true);
    setTimeout(() => setCopiadoUrl(false), 2400);
  };

  const handleCopyPreguntas = () => {
    const textoPreguntas = [
      'FitCasa — Preguntas para mi próxima consulta con el especialista en escoliosis:',
      '',
      '1. ¿Qué tipo de curva tengo y cómo puede evolucionar en mi caso?',
      '2. ¿Qué ejercicios y actividades son adecuados para mí y cuáles debo adaptar o evitar?',
      '3. ¿Necesito ejercicios específicos para escoliosis (PSSE/Schroth/SEAS) o basta con ejercicio general?',
      '4. ¿Qué señales de alarma deben hacerme detener la actividad física de inmediato y a quién consultar?',
      '5. ¿Cada cuánto tiempo es recomendable realizar un control o seguimiento clínico?',
    ].join('\n');

    navigator.clipboard.writeText(textoPreguntas);
    setCopiadoPreguntas(true);
    setTimeout(() => setCopiadoPreguntas(false), 2400);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToAnchor = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (typeof el.focus === 'function') {
        el.setAttribute('tabindex', '-1');
        el.focus();
      }
    }
  }, []);

  /* IntersectionObserver para el TOC dinámico y accesible */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleId: string | null = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleId = entry.target.id;
          }
        });
        if (visibleId) {
          setActiveSectionId(visibleId);
        }
      },
      { rootMargin: '-60px 0% -70% 0%', threshold: 0.1 },
    );

    const ids = [
      'que-es',
      'tipos',
      'ejercicio-papel',
      'ejercicios-fisioterapia',
      'adaptacion',
      'alertas',
      'faq',
      'siguientes-pasos',
      'fuentes',
    ];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* Entrada progresiva orquestada para cada sección */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.scoliosis-seccion[data-reveal]').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    );
    document.querySelectorAll('.scoliosis-seccion[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Parallax multicapa en el Hero + inclinación 3D (tilt) sutil al interactuar */
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const el = heroRef.current;
    if (!el) return;

    let top = 0;
    let height = 0;
    let rafScroll = 0;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      top = rect.top + window.scrollY;
      height = rect.height;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafScroll);
      rafScroll = requestAnimationFrame(() => {
        const vh = window.innerHeight;
        const y = window.scrollY;
        const progress = Math.min(1, Math.max(0, (y + vh - top) / (vh + height)));
        el.style.setProperty('--scoliosis-parallax', progress.toFixed(3));
      });
    };

    // Microinteracción 3D suave por cursor solo en dispositivos de puntero fino (escritorio)
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 a 0.5
      const yNorm = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 a 0.5
      // Ángulo de inclinación discreto: máximo 3.5 grados para mantener sutileza
      const tiltX = (-yNorm * 6).toFixed(2);
      const tiltY = (xNorm * 7).toFixed(2);
      el.style.setProperty('--tilt-x', `${tiltX}deg`);
      el.style.setProperty('--tilt-y', `${tiltY}deg`);
    };

    const handleMouseLeave = () => {
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    };

    measure();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      measure();
      onScroll();
    });

    if (canHover) {
      el.addEventListener('mousemove', handleMouseMove, { passive: true });
      el.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    return () => {
      cancelAnimationFrame(rafScroll);
      window.removeEventListener('scroll', onScroll);
      if (canHover) {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const tocLinks = [
    { id: 'que-es', label: 'Qué es' },
    { id: 'tipos', label: 'Tipos de escoliosis' },
    { id: 'ejercicio-papel', label: 'El ejercicio' },
    { id: 'ejercicios-fisioterapia', label: 'Ejercicios específicos' },
    { id: 'adaptacion', label: 'Adaptaciones' },
    { id: 'alertas', label: 'Señales de alerta' },
    { id: 'faq', label: 'Preguntas frecuentes' },
    { id: 'siguientes-pasos', label: 'Siguientes pasos' },
    { id: 'fuentes', label: 'Fuentes' },
  ];

  const handleNavigateSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToAnchor(id);
  };

  const iconoMovilidad = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="scoliosis-esencial__icono">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor" />
    </svg>
  );

  const iconoProfesional = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="scoliosis-esencial__icono">
      <path d="M9 11.5v3L5.5 17 11 19.5l5.5-2.5V17l-3.5-2.5zM16 4h-3V2.5C13 1.12 11.88 0 10.5 0S8 1.12 8 2.5V4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3zM10.5 2C11.6 2 12.5 2.9 12.5 4S11.6 6 10.5 6 8 5.1 8 4 9.4 2 10.5 2z" fill="currentColor" />
    </svg>
  );

  const iconoSeguridad = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="scoliosis-esencial__icono">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zM12 3c.45 0 .85.37 1 .8L13 5H11l1-1.2c.15-.43.55-.8 1-.8zM12 17.2c-3.2 0-6-2.2-6-5.2S8.8 7 12 7s6 2.2 6 5.2S15.2 17.2 12 17.2z" fill="currentColor" />
    </svg>
  );

  const iconoWarn = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="scoliosis-notice__icono">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2V7h2v7z" fill="var(--color-terciario-oscuro)" />
    </svg>
  );

  const iconoUrgent = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" className="scoliosis-notice__icono">
      <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v11.33C7 18.4 7.6 19 8.33 19h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" fill="var(--color-peligro)" />
      <path d="M11 18h2v-2h-2v2zm1-16C13 1.49 12.52 1 12 1s-1 .49-1 1v1h2V3z" fill="var(--color-peligro)" />
    </svg>
  );

  const svgImpresora = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M19 8H5c-1.6 0-3 1.3-3 3v6h0v2c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h0v-6c0-1.7-1.4-3-3-3zm-3 0V4H6v4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM7 10h2v5H7zm10 5h-2v-5h2v5z" fill="currentColor" />
    </svg>
  );

  const svgCopiar = (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h0V3h12V1zm3 4H8c-2.2 0-4 1.8-4 4v12c0 2.2 1.8 4 4 4h11c2.2 0 4-1.8 4-4V7c0-2.2-1.8-4-4-4zm0 2.5h-3v-2c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H6v12c0 2.2 1.8 4 4 4h11c2.2 0 4-1.8 4-4V7.5z" fill="currentColor" />
    </svg>
  );

  return (
    <main id="contenido" tabIndex={-1} className="scoliosis-page">
      {/* Hero editorial — composición asimétrica con profundidad 3D */}
      <section className="scoliosis-hero" aria-labelledby="titulo-hero" ref={heroRef}>
        <div className="scoliosis-hero__inner">
          <div className="scoliosis-hero__texto">
            <p className="scoliosis-hero__insignia">
              <span className="scoliosis-hero__insignia-punto" aria-hidden="true" />
              Guía clínica divulgativa · Actualizada 2026
            </p>
            <h1 id="titulo-hero" className="scoliosis-hero__titulo">
              Ejercicio y escoliosis: información para moverte con confianza
            </h1>
            <p className="scoliosis-hero__apertura">
              Una guía divulgativa sobre qué puede aportar —y qué no— el ejercicio en la escoliosis, con las fuentes citadas al final.
            </p>
            <div className="scoliosis-hero__meta">
              <span className="scoliosis-hero__meta-item">
                <span className="scoliosis-hero__etiqueta">Lectura estimada</span>
                <span className="scoliosis-hero__valor" id="tiempo-lectura">6 minutos</span>
              </span>
              <span className="scoliosis-hero__meta-item">
                <span className="scoliosis-hero__etiqueta">Evidencia</span>
                <span className="scoliosis-hero__valor">SOSORT 2016 · NHS 2023</span>
              </span>
            </div>
            <div className="scoliosis-hero__acciones">
              <button
                type="button"
                id="imprimir-guia"
                className="scoliosis-hero__btn scoliosis-hero__btn--primario"
                onClick={handlePrint}
              >
                {svgImpresora} Imprimir guía
              </button>
              <button
                type="button"
                id="copiar-enlace"
                className="scoliosis-hero__btn scoliosis-hero__btn--secundario"
                onClick={handleCopyLink}
                aria-label={copiadoUrl ? 'Enlace copiado al portapapeles' : 'Copiar enlace al portapapeles'}
              >
                {svgCopiar}
                {copiadoUrl ? '¡Enlace copiado!' : 'Copiar enlace'}
              </button>
            </div>
          </div>

          <div className="scoliosis-hero__visual">
            <IlustracionColumna />
          </div>
        </div>
      </section>

      <div className="scoliosis-cuerpo">
        {/* Lo esencial en 30 segundos */}
        <section className="scoliosis-esencial scoliosis-seccion" aria-labelledby="titulo-esencial" data-reveal>
          <header className="scoliosis-esencial__cabecera">
            <p className="scoliosis-etiqueta">Puntos clave</p>
            <h2 id="titulo-esencial">Lo esencial en 30 segundos</h2>
          </header>
          <ol className="scoliosis-esencial__lista">
            <li className="scoliosis-esencial__item scoliosis-esencial__item--a">
              <span className="scoliosis-esencial__icono" aria-hidden="true">{iconoMovilidad}</span>
              <div className="scoliosis-esencial__cuerpo">
                <h3>Movilidad y alivio sintomático</h3>
                <p>
                  No está demostrado que el ejercicio corrija la curva estructural; en adultos se orienta sobre todo a mantener la movilidad articular, la fuerza muscular y aliviar el dolor.
                </p>
              </div>
            </li>
            <li className="scoliosis-esencial__item scoliosis-esencial__item--b">
              <span className="scoliosis-esencial__icono" aria-hidden="true">{iconoProfesional}</span>
              <div className="scoliosis-esencial__cuerpo">
                <h3>Instrucción profesional individualizada</h3>
                <p>
                  Los ejercicios específicos para escoliosis (como Schroth o SEAS) requieren valoración y enseñanza individual por un fisioterapeuta formado, y la evidencia tiene limitaciones metodológicas.
                </p>
              </div>
            </li>
            <li className="scoliosis-esencial__item scoliosis-esencial__item--c">
              <span className="scoliosis-esencial__icono" aria-hidden="true">{iconoSeguridad}</span>
              <div className="scoliosis-esencial__cuerpo">
                <h3>Seguridad y escucha corporal</h3>
                <p>
                  Consulta a un profesional antes de empezar y detén la actividad ante dolor nuevo o intenso, debilidad motora, hormigueo o sensación de falta de aire.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* Botón índice móvil con estado accesible */}
        <button
          type="button"
          id="toc-toggle"
          className="scoliosis-toc-toggle"
          aria-expanded={tocOpen}
          aria-controls="toc-list"
          onClick={() => setTocOpen(!tocOpen)}
        >
          <span>Índice de contenidos</span>
          <svg
            className={`scoliosis-toc-toggle__icon ${tocOpen ? 'is-open' : ''}`}
            viewBox="0 0 24 24"
            focusable="false"
            aria-hidden="true"
            width="1.25rem"
            height="1.25rem"
          >
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </button>

        <div className="scoliosis-layout">
          {/* Navegación lateral persistente con feedback táctil */}
          <nav className={`scoliosis-toc ${tocOpen ? 'scoliosis-toc--abierto' : ''}`} aria-labelledby="toc-title">
            <p id="toc-title" className="scoliosis-toc__titulo">En esta página</p>
            <ul id="toc-list" className="scoliosis-toc__lista">
              {tocLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="scoliosis-toc__enlace"
                    aria-current={activeSectionId === link.id ? 'location' : undefined}
                    onClick={handleNavigateSection(link.id)}
                  >
                    <span className="scoliosis-toc__indicador" aria-hidden="true" />
                    <span className="scoliosis-toc__texto">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="scoliosis-contenido">
            {/* Qué es la escoliosis */}
            <section id="que-es" aria-labelledby="titulo-que-es" className="scoliosis-seccion" data-reveal>
              <article>
                <h2 id="titulo-que-es" className="scoliosis-h2">
                  ¿Qué es la escoliosis?{' '}
                  <a className="scoliosis-ancla" href="#titulo-que-es" aria-label="Enlace a este apartado: ¿Qué es la escoliosis?">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <p>
                  La escoliosis es una curvatura tridimensional de la columna vertebral que combina desviación lateral en el plano frontal y rotación axial de los cuerpos vertebrales. No es una enfermedad en sí, sino una condición estructural que puede variar en gravedad y progreso. Cada caso es individual y requiere una valoración profesional para determinar su relevancia clínica.
                </p>
              </article>
            </section>

            {/* Tipos de escoliosis */}
            <section id="tipos" aria-labelledby="titulo-tipos" className="scoliosis-seccion" data-reveal>
              <article>
                <h2 id="titulo-tipos" className="scoliosis-h2">
                  Tipos de escoliosis{' '}
                  <a className="scoliosis-ancla" href="#titulo-tipos" aria-label="Enlace a este apartado: Tipos de escoliosis">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <div className="scoliosis-tipos">
                  <div className="scoliosis-tipo scoliosis-tipo--a">
                    <span className="scoliosis-tipo__insignia">Más frecuente (~80%)</span>
                    <h3 className="scoliosis-tipo__titulo">Idiopática</h3>
                    <p className="scoliosis-tipo__texto">
                      La forma más frecuente, cuyo origen exacto es multifactorial/desconocido y se diagnostica típicamente en la adolescencia. Su estrategia de manejo se adapta a cada caso.
                    </p>
                  </div>
                  <div className="scoliosis-tipo scoliosis-tipo--b">
                    <span className="scoliosis-tipo__insignia">Estructural de nacimiento</span>
                    <h3 className="scoliosis-tipo__titulo">Congénita</h3>
                    <p className="scoliosis-tipo__texto">
                      Resulta de anomalías estructurales del desarrollo vertebral presentes al nacer. Requiere seguimiento pediátrico y, en edad adulta, valoración especializada.
                    </p>
                  </div>
                  <div className="scoliosis-tipo scoliosis-tipo--c">
                    <span className="scoliosis-tipo__insignia">Secundaria a afección</span>
                    <h3 className="scoliosis-tipo__titulo">Neuromuscular</h3>
                    <p className="scoliosis-tipo__texto">
                      Asociada a trastornos musculares o neurológicos que alteran el control postural. El enfoque se centra en el equilibrio postural, la funcionalidad y el tono muscular.
                    </p>
                  </div>
                </div>
                <p>
                  Estos tipos se diferencian en su causa y en la manera en que pueden evolucionar, por lo que la estrategia de manejo debe adaptarse a cada caso.
                </p>
              </article>
            </section>

            {/* Papel del ejercicio */}
            <section id="ejercicio-papel" aria-labelledby="titulo-ejercicio-papel" className="scoliosis-seccion" data-reveal>
              <article>
                <h2 id="titulo-ejercicio-papel" className="scoliosis-h2">
                  ¿Qué papel tiene el ejercicio?{' '}
                  <a className="scoliosis-ancla" href="#titulo-ejercicio-papel" aria-label="Enlace a este apartado: ¿Qué papel tiene el ejercicio?">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <p>
                  En adultos, el dolor de espalda es uno de los principales problemas asociados a la escoliosis, y el tratamiento conservador se orienta sobre todo a aliviarlo (NHS, 2023). Las actividades que fortalecen y estiran la espalda pueden ayudar a reducir el dolor y a mantener un peso saludable; el tipo concreto de ejercicio importa menos que mantener la espalda en movimiento con una actividad que se disfrute y se pueda mantener en el tiempo (NHS, 2023). Los ejercicios enseñados por un fisioterapeuta es poco probable que mejoren la curvatura estructural, pero pueden ayudar con el dolor (NHS, 2023). En personas con escoliosis, la actividad física puede:
                </p>
                <ul className="scoliosis-lista">
                  <li>Mantener la movilidad espinal y un estilo de vida activo y saludable.</li>
                  <li>Fortalecer y estirar la musculatura del tronco y la espalda, lo que puede ayudar a reducir el dolor, sin que esté demostrado que corrija la curva.</li>
                  <li>Complementar el seguimiento profesional: conviene consultar con un médico, especialista o fisioterapeuta antes de empezar un programa nuevo, para comprobar que sea seguro (NHS, 2023).</li>
                </ul>
                <p>
                  Los objetivos específicos (por ejemplo, prevención de la progresión, alivio del dolor) dependen de la evaluación individual hecha por un fisioterapeuta o médico especializado.
                </p>
                <blockquote className="scoliosis-cita">
                  <p>
                    El tipo de ejercicio importa menos que mantener la espalda en movimiento con una actividad que se disfrute y se pueda mantener en el tiempo.
                  </p>
                  <cite>— NHS, Tratamiento de la escoliosis en adultos (2023)</cite>
                </blockquote>
              </article>
            </section>

            {/* Ejercicios fisioterapéuticos específicos */}
            <section id="ejercicios-fisioterapia" aria-labelledby="titulo-ejercicios-fisioterapia" className="scoliosis-seccion" data-reveal>
              <article>
                <h2 id="titulo-ejercicios-fisioterapia" className="scoliosis-h2">
                  Ejercicios fisioterapéuticos específicos para escoliosis{' '}
                  <a className="scoliosis-ancla" href="#titulo-ejercicios-fisioterapia" aria-label="Enlace a este apartado: Ejercicios fisioterapéuticos específicos para escoliosis">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <p>
                  El ejercicio general (caminar, nadar, fortalecimiento simétrico) no es lo mismo que los ejercicios fisioterapéuticos específicos para escoliosis (PSSE, por sus siglas en inglés): estos últimos son intervenciones asimétricas e individualizadas según el patrón de curva y la deformidad tridimensional de cada paciente, e incluyen autocorrección activa, control postural tridimensional, respiración y estabilización del tronco (Lee y Tak, 2026). Las guías SOSORT 2016 dedican 12 recomendaciones a los PSSE para prevenir la progresión durante el crecimiento, con fuerza de recomendación mayoritariamente B y heterogeneidad entre estudios que limita su generalización (Negrini et al., 2018).
                </p>
                <p>
                  Entre los enfoques más estudiados están <em>Schroth</em> y <em>SEAS</em> (además de otros como BSPTS o Lyon). Estos métodos requieren valoración individual e instrucción directa por parte de profesionales formados; no se recomienda su auto‑aprendizaje a través de recursos genéricos. Una revisión reciente encontró que las intervenciones totalmente supervisadas por un terapeuta se asociaron a mejores efectos que las modalidades híbridas o domiciliarias, aunque los autores piden interpretar el hallazgo con cautela por la heterogeneidad y el riesgo de sesgo (Lee y Tak, 2026).
                </p>

                <aside className="scoliosis-metodos" aria-label="Enfoques de fisioterapia mencionados">
                  <p className="scoliosis-metodos__titulo">Enfoques citados en la evidencia científica</p>
                  <ul className="scoliosis-metodos__lista">
                    <li>Schroth</li>
                    <li>SEAS</li>
                    <li>BSPTS</li>
                    <li>Lyon</li>
                  </ul>
                  <p className="scoliosis-metodos__nota">
                    Requieren valoración individual e instrucción directa por fisioterapeutas certificados.
                  </p>
                </aside>

                <div className="table-wrapper scoliosis-tabla-wrapper" tabIndex={0} role="region" aria-label="Tabla de evidencia científica sobre ejercicios en escoliosis">
                  <table className="scoliosis-tabla-evidencia">
                    <caption>Qué dicen los estudios clínicos más recientes</caption>
                    <thead>
                      <tr>
                        <th scope="col">Población y estudio</th>
                        <th scope="col">Qué se estudió</th>
                        <th scope="col">Qué se observó</th>
                        <th scope="col">Límites y sesgo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td data-label="Población y estudio">Metaanálisis de 11 ensayos aleatorizados con 446 adolescentes (Zhu et al., 2025)</td>
                        <td data-label="Qué se estudió">Ejercicios de Schroth: ángulo de Cobb, rotación del tronco y calidad de vida</td>
                        <td data-label="Qué se observó">Reducción media del ángulo de Cobb de unos 3,2 grados, por debajo del umbral de 5 grados que suele considerarse clínicamente relevante, sin efecto significativo en la rotación del tronco y con mejora de la calidad de vida</td>
                        <td data-label="Límites y sesgo"><span className="scoliosis-etiqueta-sesgo">Evidencia moderada/baja · Riesgo de sesgo</span> La calidad de la evidencia era moderada a baja y la mayoría de los estudios tenía alto riesgo de sesgo</td>
                      </tr>
                      <tr>
                        <td data-label="Población y estudio">Revisión de 10 ensayos con 600 adolescentes (Lee y Tak, 2026)</td>
                        <td data-label="Qué se estudió">Ejercicios específicos para escoliosis con distintas intensidades de supervisión: ángulo de Cobb, rotación y cuestionario SRS‑22</td>
                        <td data-label="Qué se observó">Mejoras en el ángulo de Cobb y en la rotación con heterogeneidad alta, pero sin mejora significativa en el cuestionario de calidad de vida SRS‑22</td>
                        <td data-label="Límites y sesgo"><span className="scoliosis-etiqueta-sesgo">Heterogeneidad alta · Riesgo de sesgo</span> Los autores piden interpretar el hallazgo con cautela por la heterogeneidad y el riesgo de sesgo</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p>
                  Ambos trabajos estudiaron solo a adolescentes con escoliosis idiopática y seguimientos cortos, por lo que sus resultados no pueden generalizarse a adultos.
                </p>
              </article>
            </section>

            {/* Actividades que requieren adaptación */}
            <section id="adaptacion" aria-labelledby="titulo-adaptacion" className="scoliosis-seccion" data-reveal>
              <article>
                <h2 id="titulo-adaptacion" className="scoliosis-h2">
                  Actividades que pueden requerir adaptación{' '}
                  <a className="scoliosis-ancla" href="#titulo-adaptacion" aria-label="Enlace a este apartado: Actividades que pueden requerir adaptación">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <p>
                  Cualquier actividad física debe adaptarse a la curvatura y a la capacidad individual. No existe una lista única de ejercicios prohibidos. En su lugar, se sugiere:
                </p>
                <ul className="scoliosis-lista">
                  <li>Consultar con un fisioterapeuta antes de iniciar deportes de alto impacto o con movimientos de flexión/extensión intensos.</li>
                  <li>Ajustar la amplitud de movimiento según la tolerancia personal y el nivel de dolor.</li>
                  <li>Usar técnicas o equipamiento modificado solo con orientación profesional. Una órtesis o corsé debe estar indicado, ajustado y supervisado por el equipo sanitario; no se debe improvisar una faja o cinturón genérico como tratamiento.</li>
                </ul>
              </article>
            </section>

            {/* Señales de alerta */}
            <section id="alertas" aria-labelledby="titulo-alertas" className="scoliosis-seccion" data-reveal>
              <article>
                <h2 id="titulo-alertas" className="scoliosis-h2">
                  Señales para detener una actividad{' '}
                  <a className="scoliosis-ancla" href="#titulo-alertas" aria-label="Enlace a este apartado: Señales para detener una actividad">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>

                <div className="scoliosis-notice-warn">
                  <div className="scoliosis-notice__header">
                    {iconoWarn}
                    <h3 className="scoliosis-notice__titulo">Consulta sanitaria (pide cita)</h3>
                  </div>
                  <p className="scoliosis-notice__texto">
                    Interrumpe el ejercicio y consulta a un profesional de la salud si experimentas alguno de los siguientes síntomas:
                  </p>
                  <ul className="scoliosis-lista">
                    <li>Dolor nuevo, intenso o que aumenta progresivamente.</li>
                    <li>Debilidad o pérdida de fuerza en extremidades.</li>
                    <li>Entumecimiento, hormigueo o sensación persistente de adormecimiento.</li>
                    <li>Dificultad para respirar o sensación de falta de aire durante la actividad.</li>
                    <li>Sensación de inestabilidad o desmayo.</li>
                  </ul>
                </div>

                <aside className="scoliosis-notice-urgent" aria-labelledby="titulo-urgente">
                  <div className="scoliosis-notice__header">
                    {iconoUrgent}
                    <h3 id="titulo-urgente" className="scoliosis-notice__titulo">Atención médica urgente</h3>
                  </div>
                  <p className="scoliosis-notice__texto">
                    En caso de síntomas súbitos y graves (por ejemplo, dolor torácico agudo o pérdida de control de esfínteres), busca atención médica de urgencia sin esperar a una cita programada.
                  </p>
                </aside>
              </article>
            </section>

            {/* FAQ */}
            <section id="faq" aria-labelledby="titulo-faq" className="scoliosis-seccion" data-reveal>
              <article>
                <h2 id="titulo-faq" className="scoliosis-h2">
                  Preguntas frecuentes{' '}
                  <a className="scoliosis-ancla" href="#titulo-faq" aria-label="Enlace a este apartado: Preguntas frecuentes">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>

                <section className="scoliosis-faq">
                  <details className="scoliosis-faq__item">
                    <summary>¿Puedo hacer ejercicios de cardio si tengo escoliosis?</summary>
                    <p>
                      Según el NHS, el tipo de ejercicio importa menos que mantener la espalda en movimiento. En general, actividades como caminar, nadar o usar bicicleta estática son bien toleradas, pero la intensidad y la postura deben ajustarse a la comodidad individual y a la recomendación del profesional.
                    </p>
                  </details>

                  <details className="scoliosis-faq__item">
                    <summary>¿El método Schroth es adecuado para todos los pacientes?</summary>
                    <p>
                      No. Schroth es un enfoque especializado que necesita una valoración personalizada y la supervisión de un fisioterapeuta formado en el método. La evidencia disponible proviene de estudios en adolescentes, con resultados modestos y limitaciones metodológicas importantes, por lo que no debe generalizarse ni practicarse por cuenta propia (Zhu et al., 2025; Lee y Tak, 2026).
                    </p>
                  </details>

                  <details className="scoliosis-faq__item">
                    <summary>¿Cuánto tiempo debo dedicar al ejercicio cada semana?</summary>
                    <p>
                      No existe una frecuencia universal para las personas con escoliosis: depende de la edad, el tipo de curva, los síntomas, la condición física y la orientación profesional. Como referencia de salud general para adultos, la OMS recomienda acumular 150‑300 minutos semanales de actividad aeróbica moderada (o 75‑150 minutos vigorosa) y realizar fortalecimiento muscular al menos 2 días por semana. Esta referencia no es una prescripción para tratar la escoliosis; comienza de forma gradual y consulta con un profesional si tienes dolor, una cirugía reciente o restricciones.
                    </p>
                  </details>
                </section>
              </article>
            </section>

            {/* Siguientes pasos */}
            <section id="siguientes-pasos" aria-labelledby="titulo-siguientes-pasos" className="scoliosis-seccion" data-reveal>
              <article>
                <h2 id="titulo-siguientes-pasos" className="scoliosis-h2">
                  Siguientes pasos{' '}
                  <a className="scoliosis-ancla" href="#titulo-siguientes-pasos" aria-label="Enlace a este apartado: Siguientes pasos">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <ul className="scoliosis-pasos">
                  <li>
                    <a
                      href="#ejercicios"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('ejercicios');
                      }}
                    >
                      Explorar ejercicios generales
                    </a>
                    . Son ejercicios generales: no sustituyen los ejercicios específicos para escoliosis que pauta un fisioterapeuta.
                  </li>
                  <li>
                    <a
                      href="#panel"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate('panel');
                      }}
                    >
                      Registrar cómo me siento
                    </a>
                  </li>
                </ul>

                <div className="scoliosis-checklist">
                  <h3>
                    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true" width="1.5rem" height="1.5rem">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10l-5 5-3-3-1.41 1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" />
                    </svg>
                    Preguntas recomendadas para tu próxima visita al especialista
                  </h3>
                  <p className="scoliosis-checklist__subtexto">
                    Marca las preguntas que quieras abordar o cópialas directamente a tus notas:
                  </p>
                  <ul className="scoliosis-checklist__lista">
                    <li className={`scoliosis-checklist__item ${checklistState.q1 ? 'is-checked' : ''}`}>
                      <input
                        type="checkbox"
                        className="scoliosis-checklist__casilla"
                        id="q1"
                        checked={checklistState.q1}
                        onChange={() => toggleChecklistItem('q1')}
                      />
                      <label htmlFor="q1" className="scoliosis-checklist__texto">
                        ¿Qué tipo de curva tengo y cómo puede evolucionar en mi caso particular?
                      </label>
                    </li>
                    <li className={`scoliosis-checklist__item ${checklistState.q2 ? 'is-checked' : ''}`}>
                      <input
                        type="checkbox"
                        className="scoliosis-checklist__casilla"
                        id="q2"
                        checked={checklistState.q2}
                        onChange={() => toggleChecklistItem('q2')}
                      />
                      <label htmlFor="q2" className="scoliosis-checklist__texto">
                        ¿Qué ejercicios y actividades son recomendables para mí y cuáles debo adaptar o evitar?
                      </label>
                    </li>
                    <li className={`scoliosis-checklist__item ${checklistState.q3 ? 'is-checked' : ''}`}>
                      <input
                        type="checkbox"
                        className="scoliosis-checklist__casilla"
                        id="q3"
                        checked={checklistState.q3}
                        onChange={() => toggleChecklistItem('q3')}
                      />
                      <label htmlFor="q3" className="scoliosis-checklist__texto">
                        ¿Necesito ejercicios específicos para escoliosis (como Schroth o SEAS) o es suficiente con actividad física general?
                      </label>
                    </li>
                    <li className={`scoliosis-checklist__item ${checklistState.q4 ? 'is-checked' : ''}`}>
                      <input
                        type="checkbox"
                        className="scoliosis-checklist__casilla"
                        id="q4"
                        checked={checklistState.q4}
                        onChange={() => toggleChecklistItem('q4')}
                      />
                      <label htmlFor="q4" className="scoliosis-checklist__texto">
                        ¿Qué señales de alarma deben hacerme parar el ejercicio y a qué especialista debo acudir?
                      </label>
                    </li>
                    <li className={`scoliosis-checklist__item ${checklistState.q5 ? 'is-checked' : ''}`}>
                      <input
                        type="checkbox"
                        className="scoliosis-checklist__casilla"
                        id="q5"
                        checked={checklistState.q5}
                        onChange={() => toggleChecklistItem('q5')}
                      />
                      <label htmlFor="q5" className="scoliosis-checklist__texto">
                        ¿Con qué frecuencia conviene revisar mi curvatura y evaluar mi evolución?
                      </label>
                    </li>
                  </ul>
                  <div className="scoliosis-checklist__accion">
                    <button
                      type="button"
                      id="copiar-preguntas"
                      className="scoliosis-checklist__btn-copiar"
                      onClick={handleCopyPreguntas}
                      aria-label="Copiar lista de preguntas recomendadas al portapapeles"
                    >
                      {svgCopiar}
                      {copiadoPreguntas ? '¡Preguntas copiadas!' : 'Copiar preguntas al portapapeles'}
                    </button>
                  </div>
                  <p id="copiar-confirmacion" className="scoliosis-checklist__confirmacion" aria-live="polite" hidden={!copiadoPreguntas}>
                    Las preguntas se han copiado al portapapeles para que las lleves a tu consulta.
                  </p>
                </div>
              </article>
            </section>

            {/* Fuentes fiables */}
            <section id="fuentes" aria-labelledby="titulo-fuentes" className="scoliosis-seccion" data-reveal>
              <article>
                <h2 id="titulo-fuentes" className="scoliosis-h2">
                  Fuentes fiables{' '}
                  <a className="scoliosis-ancla" href="#titulo-fuentes" aria-label="Enlace a este apartado: Fuentes fiables">
                    <span aria-hidden="true">#</span>
                  </a>
                </h2>
                <ul className="scoliosis-enlaces">
                  <li>
                    <a href="https://sosort.org" target="_blank" rel="noopener noreferrer">
                      Guías SOSORT – Sociedad Internacional sobre el Tratamiento Ortopédico y Rehabilitador de la Escoliosis (SOSORT)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.srs.org" target="_blank" rel="noopener noreferrer">
                      Scoliosis Research Society (SRS)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.who.int/initiatives/behealthy/physical-activity" target="_blank" rel="noopener noreferrer">
                      OMS – Recomendaciones generales de actividad física
                    </a>
                  </li>
                  <li>
                    <a href="https://www.nhs.uk/conditions/scoliosis/treatment-in-adults/" target="_blank" rel="noopener noreferrer">
                      NHS – Tratamiento de la escoliosis en adultos
                    </a>
                  </li>
                  <li>
                    <a href="https://www.rnoh.nhs.uk/services/scoliosis/conservative-management-scoliosis/outpatient-scoliosis-physiotherapy" target="_blank" rel="noopener noreferrer">
                      Royal National Orthopaedic Hospital – Fisioterapia para escoliosis
                    </a>
                  </li>
                  <li>
                    <a href="https://www.mayoclinic.org/diseases-conditions/scoliosis/symptoms-causes/syc-20350716" target="_blank" rel="noopener noreferrer">
                      Mayo Clinic – Escoliosis
                    </a>
                  </li>
                </ul>

                <h3>Referencias citadas en esta página</h3>
                <ol className="scoliosis-refs">
                  <li id="ref-1">
                    Negrini, S., et al. (2018). Guías SOSORT 2016: tratamiento ortopédico y rehabilitador de la escoliosis idiopática durante el crecimiento.{' '}
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5795289/" target="_blank" rel="noopener noreferrer">
                      PMC5795289
                    </a>.
                  </li>
                  <li id="ref-2">
                    Zhu, Y., et al. (2025). Efectividad de los ejercicios de Schroth en la escoliosis idiopática adolescente: metaanálisis de 11 ensayos aleatorizados.{' '}
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12248227/" target="_blank" rel="noopener noreferrer">
                      PMC12248227
                    </a>.
                  </li>
                  <li id="ref-3">
                    Lee, S.-Y. y Tak, J.-Y. (2026). Efecto de la supervisión en los ejercicios específicos para escoliosis en adolescentes: revisión sistemática y metaanálisis de 10 ensayos aleatorizados.{' '}
                    <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC13117688/" target="_blank" rel="noopener noreferrer">
                      PMC13117688
                    </a>.
                  </li>
                  <li id="ref-4">
                    NHS (revisado en 2023). Tratamiento de la escoliosis en adultos.{' '}
                    <a href="https://www.nhs.uk/conditions/scoliosis/treatment-in-adults/" target="_blank" rel="noopener noreferrer">
                      nhs.uk
                    </a>.
                  </li>
                  <li id="ref-5">
                    OMS (2020). Directrices sobre actividad física y comportamiento sedentario (referencia de salud general, no guía de escoliosis).{' '}
                    <a href="https://www.who.int/publications/i/item/9789240015128" target="_blank" rel="noopener noreferrer">
                      who.int
                    </a>.
                  </li>
                </ol>
              </article>
            </section>

            {/* Aviso legal y delimitación de responsabilidad */}
            <section id="aviso-legal" aria-labelledby="titulo-aviso-legal" className="scoliosis-seccion scoliosis-seccion--legal" data-reveal>
              <article>
                <h2 id="titulo-aviso-legal" className="sr-only">Aviso legal y delimitación médica</h2>
                <div className="scoliosis-aviso-legal">
                  <p>
                    <strong>Aviso de salud y responsabilidad:</strong> La información provista en esta página tiene finalidad exclusivamente divulgativa y educativa. No constituye diagnóstico, pronóstico, prescripción terapéutica ni sustituye el criterio individual de un médico, fisioterapeuta u otro profesional sanitario colegiado. Consulte siempre a su equipo de salud antes de iniciar, modificar o interrumpir cualquier régimen de ejercicio físico, muy especialmente si tiene diagnóstico confirmado o sospecha de escoliosis, dolor vertebral recurrente o cualquier otra patología del aparato locomotor.
                  </p>
                </div>
              </article>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ScoliosisPage;
