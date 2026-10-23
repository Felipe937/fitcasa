# Hallazgos funcionales — Panel de seguimiento (FitCasa)

> **NOTA**: Estos hallazgos se documentan según el requisito del encargo. NO se ha modificado ningún archivo para corregirlos. Se propone la corrección mínima y se espera decisión.

---

## (a) Mecanismo de pre-llenado desde Plan y Pausas activas

**Evidencia:**
- `src/pages/PanelPage.tsx`: IDs requeridos preservados:
  - `panel-form` (form, línea 630)
  - `entry-date` (input[type=date], línea 641)
  - `entry-activity` (input[type=text], línea 699)
  - `exercise-quick-select` (select, línea 674)
  - `entry-heading` (h2, línea 621)
- `src/pages/PlanPage.tsx` y `src/pages/PausasActivasPage.tsx`: Escriben en estos inputs por DOM tras `setTimeout` (ej. `document.getElementById('entry-date').value = ...`)
- `src/components/ConsentGuard.tsx`: Muestra diálogo de consentimiento ANTES de renderizar PanelPage

**Problema:**
1. **Inputs controlados**: PanelPage usa `value` + `onChange` en todos los campos del formulario. Escribir `input.value` directamente en el DOM **no actualiza el estado de React** (`date`, `activity`, `exerciseId`). El formulario muestra el valor escrito visualmente, pero al guardar se envía el estado anterior (vacío o valor previo).
2. **ConsentGuard bloquea**: Si el usuario no tiene consentimiento guardado, ConsentGuard muestra su diálogo y **no renderiza PanelPage**. Plan/Pausas escriben en inputs que no existen en el DOM aún.
3. **Race condition**: El `setTimeout` en Plan/Pausas es arbitrario (ej. 100ms). Si PanelPage tarda más en hidratar, la escritura falla silenciosamente.

**Corrección mínima propuesta:**
1. Añadir en `PanelPage` un `useEffect` que lea `window.__panelPrefill` (objeto con `date`, `activity`, `exerciseId`) y actualice el estado React correspondiente. Plan/Pausas escribirían en `window.__panelPrefill` en lugar de en el DOM.
2. O bien: Exponer una función global `window.prefillPanel({ date, activity, exerciseId })` que PanelPage registre al montarse vía `useEffect`.
3. ConsentGuard: Si viene de Plan/Pausas con intención de pre-llenar, guardar la intención en `sessionStorage` y aplicarla tras el consentimiento.

---

## (b) Comunicación del dolor solo por color en el historial

**Evidencia:**
- `src/pages/PanelPage.tsx` líneas 1050-1052 (tabla desktop) y 1095-1097 (tarjetas móvil):
  ```tsx
  <span className={`panel-dolor-chip panel-dolor-chip--${painTone(record.pain)}`}>
    {record.pain} / {PAIN_MAX} · {painLabel(record.pain)}
  </span>
  ```
- `src/styles/panel-page.css` líneas 1140-1154:
  ```css
  .panel-dolor-chip--bajo  { color: var(--color-primario-oscuro); background: var(--color-fondo-verde); }
  .panel-dolor-chip--medio { color: var(--color-primario-oscuro); background: var(--color-fondo-aviso); }
  .panel-dolor-chip--alto  { color: var(--color-peligro); background: var(--color-fondo-alerta); border-color: var(--color-peligro); }
  ```

**Problema:**
- En la vista de **historial** (tabla y tarjetas), el nivel de dolor se comunica **solo por color de fondo/borde** del chip. El texto `{record.pain} / {PAIN_MAX} · {painLabel(record.pain)}` SÍ incluye la etiqueta textual, pero:
  - En modo de alto contraste forzado (`forced-colors: active`), los colores de fondo/borde se pierden.
  - Usuarios con daltonismo pueden no distinguir verde/amarillo/rojo.
  - El requisito del encargo: "El dolor nunca se comunica solo con color".

**Estado actual en el rediseño:**
- La nueva **línea temporal** usa `.panel-dolor-texto` que SIEMPRE incluye:
  - Número: `{record.pain} / {PAIN_MAX}`
  - Etiqueta textual: `{painLabel(record.pain)}` ("Molestia leve", "Dolor intenso", etc.)
  - Clases `--bajo/--medio/--alto` solo añaden color **adicional**, no son el único medio.
- **Pendiente**: La tabla y tarjetas antiguas fueron eliminadas y reemplazadas por la línea temporal, por lo que este hallazgo ya no aplica al código nuevo. Pero si se mantuvieran vistas legacy, habría que añadir `aria-label` o texto visible obligatorio.

**Corrección mínima propuesta (si se mantuvieran vistas legacy):**
- Añadir `aria-label` al chip: `aria-label="Dolor percibido: 7 de 10, Dolor intenso"`
- O forzar que el texto completo sea siempre visible (no solo en tooltip).

---

## Resumen de correcciones mínimas propuestas

| Hallazgo | Archivo(s) | Acción mínima |
|----------|------------|---------------|
| (a) Pre-llenado roto | `src/pages/PanelPage.tsx`, `src/pages/PlanPage.tsx`, `src/pages/PausasActivasPage.tsx`, `src/components/ConsentGuard.tsx` | Añadir `window.__panelPrefill` o función global + `useEffect` en PanelPage; `sessionStorage` en ConsentGuard |
| (b) Dolor solo color (historial legacy) | `src/pages/PanelPage.tsx` (vistas antiguas), `src/styles/panel-page.css` | Añadir `aria-label` con texto completo a `.panel-dolor-chip`; la nueva línea temporal ya cumple |

---

**Estado:** Pendiente de decisión para cada hallazgo. No se ha aplicado ninguna corrección.