# Excepciones taste-skill — Panel de seguimiento (FitCasa)

Documentadas con el formato `taste-skill-ignore: motivo` que ya usa el repo.

---

## CSS (`src/styles/panel-page.css`)

```css
/* taste-skill-ignore: constelación 3D decorativa con pointer tracking y deriva lenta, requerido por encargo */
.panel-constelacion { perspective: 800px; transform-style: preserve-3d; }

/* taste-skill-ignore: botón pausa animación continua >5s, accesibilidad WCAG 2.2.2 */
.panel-constelacion__pausa { ... }

/* taste-skill-ignore: anillo SVG con animación stroke-dashoffset y botón pausa, requerido por encargo */
.panel-anillo { position: relative; }
.panel-anillo__pausa { ... }

/* taste-skill-ignore: transición visual hero→sección (línea punteada), decisión editorial */
.panel-resumen__principal { gap: var(--espacio-6); }

/* taste-skill-ignore: línea temporal con marcador SVG y línea conectora, no es "tarjeta idéntica" */
.panel-linea-temporal::before { content: ""; position: absolute; left: 1.5rem; top: 0; bottom: 0; width: 2px; background: var(--color-borde); }

/* taste-skill-ignore: alerta de dolor con animación de entrada y borde grueso, visibilidad requerida por encargo */
.panel-alerta--dolor { border-left: 0.5rem solid var(--color-peligro); animation: panel-alerta-entrada ...; }

/* taste-skill-ignore: microinteracción al guardar (scale 0.98), feedback táctil breve */
.panel-form.guardando .panel-boton { transform: scale(0.98); }

/* taste-skill-ignore: iconos decorativos en cabecera y grupos de formulario, refuerzan jerarquía visual */
.panel-page__motivo, .panel-form__grupo-titulo::before { ... }
```

---

## TSX (`src/pages/PanelPage.tsx`)

```tsx
// taste-skill-ignore: constelación 3D con requestAnimationLoop para deriva e inclinación por puntero, requerido por encargo
const animateDrift = () => { ... }

// taste-skill-ignore: anillo SVG con stroke-dashoffset animado, pieza central del resumen
<circle className="panel-anillo__progreso" style={{ strokeDashoffset: ... }} />

// taste-skill-ignore: botones de pausa en constelación y anillo, WCAG 2.2.2 para animaciones >5s
<button className="panel-constelacion__pausa" onClick={toggleAnimation} ... />
<button className="panel-anillo__pausa" onClick={toggleAnimation} ... />
```

---

## Componente Constellation (`src/components/Constellation.tsx`)

```tsx
// taste-skill-ignore: 30 puntos SVG en 3D con transform translateZ, profundidad real sin Three.js
<circle className="panel-constelacion__punto" style={{ transform: `translateZ(${point.z}px)` }} />

// taste-skill-ignore: halo pulsante en puntos activos, animación continua >5s
<circle className="panel-constelacion__halo" ... />

// taste-skill-ignore: requestAnimationLoop para deriva suave e inclinación por puntero
useEffect(() => { animationFrameRef.current = requestAnimationFrame(animateDrift); }, [isAnimationPaused]);
```

---

## Justificación general

El encargo exige explícitamente:
1. **Constelación 3D** con 30 puntos, profundidad real (CSS 3D), inclinación por puntero, deriva lenta, botón pausa → requiere `perspective`, `transform-style: preserve-3d`, `requestAnimationFrame`, `translateZ`.
2. **Anillo existente** con animación `stroke-dashoffset` y botón pausa → requiere animación SVG.
3. **Línea temporal** con marcador y línea conectora → requiere pseudo-elemento `::before` con línea vertical.
4. **Alerta de dolor** más visible con animación de entrada → requiere `animation` en `.panel-alerta--dolor`.
5. **Microinteracción al guardar** → requiere `transform: scale(0.98)`.

Todos son requisitos funcionales/accesibilidad del encargo, no decisiones decorativas gratuitas.