---
version: 1.0
name: FitCasa-design-specification
description: >
  Identidad clínica serena: verde bosque, marfil cálido y un único acento arcilla.
  Tipografía de sistema, sin dependencias, con jerarquía editorial y honestidad
  clínica: el esquema explica, nunca promete una corrección.
colors:
  canvas: "#fbfbf9"
  canvas-subtle: "#f3f5f1"
  canvas-elevated: "#ffffff"
  field-blue: "#edf2f0"
  field-green: "#eef3f0"
  field-warning: "#fff4d6"
  field-alert: "#fff0ed"
  ink: "#1f2927"
  ink-secondary: "#55605c"
  primary: "#15433b"
  primary-dark: "#0e2f29"
  primary-on: "#ffffff"
  secondary: "#5c8276"
  secondary-dark: "#44685d"
  secondary-light: "#a8c4b8"
  accent: "#c86d51"
  accent-dark: "#a0523a"
  border: "#e6e9e4"
  focus: "#8a4b00"
  focus-inverted: "#ffffff"
  danger: "#a43d2f"
typography:
  body-font: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  scale:
    xs: "0.8125rem"
    sm: "0.9375rem"
    base: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)"
    lg: "clamp(1.125rem, 1.03rem + 0.45vw, 1.35rem)"
    xl: "clamp(1.35rem, 1.1rem + 0.8vw, 1.8rem)"
    2xl: "clamp(1.75rem, 1.35rem + 1.8vw, 2.75rem)"
    3xl: "clamp(2.25rem, 1.7rem + 3vw, 4.25rem)"
  line-height:
    body: "1.65"
    heading: "1.08"
  tracking:
    heading: "-0.025em"
layout:
  max-width: "74rem"
  max-width-narrow: "62rem"
  reading-width: "65ch"
  spacing:
    1: "0.25rem"
    2: "0.5rem"
    3: "0.75rem"
    4: "1rem"
    5: "1.5rem"
    6: "2rem"
    7: "3rem"
    8: "4rem"
    9: "6rem"
  radius:
    sm: "0.5rem"
    md: "1rem"
    lg: "1.5rem"
    pill: "999px"
  shadows:
    floating: "0 12px 30px -10px rgba(31, 41, 39, 0.16)"
    floating-high: "0 24px 48px -18px rgba(31, 41, 39, 0.24)"
    menu: "0 1.5rem 3rem -1.5rem rgba(31, 41, 39, 0.3)"
  touch-target: "2.75rem"
motion:
  duration-short: "160ms"
  duration-medium: "240ms"
  duration-entrance: "480ms"
  easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
  stagger-step: "70ms"
---

# FitCasa — especificación visual

## 1. Identidad y atmósfera

Sitio divulgativo de salud postural. La interfaz debe leerse como **una guía
clínica cuidada**, no como una tienda ni como una landing de marketing. Tres
reglas gobiernan todo lo demás:

1. **El contenido manda.** La retícula existe para que la ficha de un ejercicio
   se lea con calma, no para poblar el espacio con tarjetas idénticas.
2. **Un paso de tono, no una sombra.** Los superficies se separan por tono
   (`--color-fondo` / `--color-superficie` / `--color-superficie-suave`); la
   sombra solo aparece donde algo flota de verdad: menú y diálogo.
3. **Sin promesas.** El esquema ilustrativo explica anatomía; nunca insinúa que
   un ejercicio corrige, endereza o «aprueba» una escoliosis.

## 2. Color

- **Lienzo y superficies.** Marfil cálido `#fbfbf9`; superficie blanca
  `#ffffff`; superficie suave `#f3f5f1` para bandas y estados apagados.
- **Tinta.** `#1f2927` para el cuerpo de texto (nunca gris suave para el
  cuerpo), `#55605c` para texto secundario, descripciones y rótulos.
- **Verde bosque** `#15433b` (oscuro `#0e2f29`): identidad, titulares, botón
  principal, fondo del hero de escoliosis.
- **Salvia mineral** `#5c8276` / `#a8c4b8`: insignias, iconos, líneas de apoyo.
  Sobre verde bosque se usa siempre la variante clara `#a8c4b8` (5.9:1).
- **Arcilla** `#c86d51`: único acento, máximo 5 % de la página. Nunca en
  títulos ni en bloques grandes.
- **Foco** `#8a4b00` con anillo de 3 px: sobre fondos oscuros se invierte a
  blanco (`.site-footer :focus-visible`).

Regla dura: **no hay degradados decorativos, ni glass, ni brillo de neón**.
Un degradado solo puede existir dentro de una ilustración SVG que simule
materia (la columna vertebral), nunca como fondo de bloque.

Contraste mínimo verificado: 4.5:1 para texto normal, 3:1 para texto grande.

## 3. Tipografía

- Una sola familia: la pila de sistema (`--fuente-base`). Sin fuentes
  descargadas, sin pesos sintéticos, sin mayúsculas diminutas espaciadas.
- Escala fluida `--texto-xs` … `--texto-3xl`; los titulares usan
  `line-height: 1.08` y `letter-spacing: -0.025em`.
- El cuerpo va a 1.65 de interlineado y se limita a `--ancho-texto` (65ch).
- El titular ocupa como máximo dos líneas a todo el ancho.

## 4. Retícula y componentes

### 4.1 Tarjeta de ejercicio (`.exercise-card`)

- Retícula de producto, no una fila de marketing: todas las tarjetas del
  catálogo pesan lo mismo. **No hay tarjeta destacada** (eliminado
  `.exercise-card--destacada`): una variación visual se leía como
  recomendación y el catálogo no recomienda.
- Profundidad ligera y honesta: `perspective` en la retícula y un `transform`
  compuesto en la tarjeta (`--px/--py` del puntero, `--fx/--fy/--fz` del
  foco). Solo se animan `transform` y `opacity`; nunca `transition: all`.
- Entrada con escalonado: la animación va en `.exercise-media` y
  `.exercise-card__contenido`, nunca en la tarjeta, para no pelearse con el
  `transform` 3D.

### 4.2 Póster (`.exercise-media__arte`)

- **Arte abstracto en capas, sin figura humana.** El póster no muestra la
  técnica ni un cuerpo en movimiento: así no se puede leer como
  demostración.
- Composición **determinista**: la semilla sale del `id` de la ficha, de modo
  que las 20 imágenes son distintas y estables entre recargas.
- Los identificadores SVG llevan el id de la ficha (`puntos-{id}`,
  `halo-{id}`): **cero identificadores duplicados en el documento**.
- Cada tarjeta muestra el rótulo visible **«Esquema abstracto, no muestra la
  técnica»**.

### 4.3 Estados de la tarjeta

| Estado | Señal visible | Texto |
|---|---|---|
| Con demostración | Distintivo sobre el póster | «Con vídeo» |
| Sin demostración | Banda inferior del póster | «Demostración en preparación» |

El estado es informativo, nunca una valoración. El único control de cada
tarjeta es su botón **«Ver detalle y ejercicio: {nombre}»**
(`aria-haspopup="dialog"`), con foco devuelto a la tarjeta al cerrar.

### 4.4 Columna explorable (`.scoliosis-columna-exp`)

- `touch-action: pan-y`: el gesto vertical es de la página; el horizontal gira
  la vista. El giro se escribe en variables CSS (`--giro-x/--giro-y`), sin
  estado de React y sin re-render por `pointermove`.
- El esquema es `role="img"` con etiqueta larga y `tabindex="0"`: se alcanza
  con teclado y las flechas lo giran. Hay además cuatro botones de giro
  (44 × 44 px) y las tres vistas (frontal, lateral, rotación axial).
- Rótulo del grupo de vistas: **«Vista del esquema»** (no «Vista anatómica»:
  el dibujo es esquemático, no anatómico).

### 4.5 Página de Actualidad (`.actualidad-page`)

Editorial de evidencia científica: una lectura larga, sin tarjetas ni
paralaje decorativo.

- **Retícula.** Contenedor único `min(100% - 2rem, 70rem)`. El bloque de lectura
  es `minmax(0, 40rem)` y el rail `minmax(16rem, 18rem)`, con `space-between`:
  el rail no debe competir con el texto. En `< 64rem` el rail pasa debajo y
  sus datos se leen en dos columnas.
- **Jerarquía.** `h1` (título de la página) → `h2` (título del artículo) →
  `h3` (secciones). Escala propia y fluida: `--ac-h1` 2.15–4.4rem, `--ac-h2`
  1.75–3rem, `--ac-h3` 1.35–1.85rem, `--ac-deck`, `--ac-cuerpo`, `--ac-meta`,
  `--ac-mini`. Medida de lectura 56–62ch (≈66–68 caracteres por línea
  verificados).
- **Banda de límites.** El bloque «Lo que este estudio **NO** demuestra» va en
  verde bosque oscuro (`--color-primario-oscuro`) con texto claro: es la
  afirmación más importante de la página y por eso pesa más que el titular del
  artículo. Se imprime en blanco y negro con filete negro.
- **Visual conceptual (`.visual-asociacion`).** Ilustración SVG en tres capas
  con `perspective` y `translateZ` (penumbra, eje/guía, marcador). Es una
  **forma ilustrativa, no un dato**: el pie lo dice y las alturas no son datos.
  Terracota no aparece en el marcador (bajaba el contraste del anillo a
  2.61:1); el anillo usa `--color-salvia-claro`.
- **Rail editorial.** `position: sticky` solo a partir de `64rem`, con
  `top: 5.5rem` (88 px), por encima de la cabecera pegajosa (73 px). Si el
  rail es más alto que el viewport pasa a `position: static`
  (`.actualidad-rail--larga`), para que nunca tape el texto ni el foco.
- **Revelado progresivo.** `IntersectionObserver` + `data-revealed`; la
  `transition` se declara **solo** en el estado revelado y el `will-change`
  vive únicamente en `.is-revelando`, para que la página no se desplace al
  cargar (CLS = 0). Con `prefers-reduced-motion` no hay animación alguna.
- **Impresión.** Se ocultan cabecera, pie, barra de controles y sellos; todo
  `[data-reveal]` es visible, el texto es negro sobre blanco, el SVG se dibuja
  a una tinta y las URL externas se escriben tras el enlace.

### 4.6 Página de Pausas Activas (`.pausas-activas-page`)

Herramienta de pausa guiada: no es una landing ni una ficha clínica.

- **Composición.** Hero asimétrico con titular de dos líneas y escultura
  abstracta de cuatro capas (`orbita-a`, `orbita-b`, `banda`, `nucleo`) en
  `.movement-sculpture`; el pie y el sello explican que es una forma, no
  anatomía. Configuración en dos fieldsets; reproductor en una superficie
  propia.
- **Estados.** `preparacion`, `en-curso`, `en-pausa` y `finalizada` cambian
  tokens de superficie (`--pausa-*`), no la estructura. El verde profundo
  envuelve el anillo durante el curso; la pausa usa azul frío; la finalizada
  vuelve al marfil. La retícula móvil no se colapsa al arrancar: el botón
  pulsado no cambia de posición de forma perceptible.
- **Retícula móvil.** El reproductor permanece en el flujo; no se ocultan el
  hero ni la configuración durante el curso. En `finalizada`, los tres botones
  pasan a una retícula de dos columnas con el último a ancho completo. A
  320 px, la etiqueta de estado ocupa una fila propia y el aviso de estado
  reserva dos líneas para no mover el anillo.
- **Configuración.** Dos columnas desde `80rem`; una columna en tablet y móvil.
  Tarjetas de opción con 44 px de alto táctil, selección por color y marca; el
  filete de 1 px es el límite real de la tarjeta, no decoración.
- **Tiempo.** Anillo SVG con `stroke-dashoffset`; cifras `tabular-nums`;
  `role="timer"` con `aria-live="off"`. El estado se anuncia por el chip y por
  `.pausa-player__announcer` (ver hallazgos en 9.2).
- **Movimiento.** Solo `transform` y `opacity` en la escultura;
  `stroke-dashoffset` en el anillo. La deriva de las capas solo existe en
  `en-curso`; `prefers-reduced-motion` la detiene sin detener el temporizador.
- **Tipografía.** Titular `clamp(3rem, 7.1vw, 6.4rem)`; h2
  `clamp(1.8rem, 3.1vw, 2.75rem)`; cuerpo 15/16 px y etiquetas del sistema en
  13 px. Las mayúsculas espaciadas son etiquetas editoriales existentes, no
  titulares.

### 4.7 Cuestionario de Sugerencias (`.quiz-page`)

Formulario de tres etapas que produce una propuesta educativa. Su hoja es
`src/styles/quiz-page.css`; en `fitcasa-app.css` solo quedan los componentes
compartidos con Panel (`.app-card`, `.notice`, `.app-main`, `.panel-actions`).

- **Recorrido.** Tres etapas —Actividad, Seguridad, Revisión— unidas por un
  tramo SVG que se dibuja de izquierda a derecha con el paso real. Los estados
  se distinguen **por forma, no solo por color**: la etapa pendiente es un
  círculo hueco de trazo discontinuo, la actual un aro doble con la etiqueta
  subrayada, la completada un disco lleno con check.
- **Barra de avance.** `role="progressbar"` con nombre accesible
  («Avance del cuestionario») y `aria-valuetext` del tipo
  «Etapa 2 de 3: Seguridad». Mide **cuatro hitos** —las tres etapas y la
  propuesta generada—: el relleno es 25 %, 50 % y 75 %, y solo llega al 100 %
  cuando la propuesta existe. `aria-valuenow` refleja el mismo hito.
- **Escultura (`QuizSculpture`).** Cuatro placas SVG apiladas en Z dentro de
  una escena con `perspective: 900px` y `transform-style: preserve-3d`. La
  composición depende **solo del paso** (`.quiz-page--step-N`): el paso 1
  muestra una placa, el 2 suma otra y el 3 completa la pila con el núcleo.
  Nunca depende de las respuestas, y en particular de las de seguridad. Es
  decorativa (`aria-hidden`), abstracta y sin figuras humanas ni anatómicas.
  En móvil se simplifica: 112 px, tres placas y sin núcleo.
- **Controles.** Los `radio` y `checkbox` nativos **permanecen visibles**
  (1.35rem, con `accent-color` de marca): son el estado real para el teclado y
  los lectores de pantalla. La marca de selección es un check dibujado
  (`clip-path`), legible sin depender del color. La composición cambia según
  el tipo de pregunta: objetivo en tarjetas grandes y editoriales, días en una
  escala segmentada de siete tramos, equipamiento en fichas compactas (chips)
  y contexto de escoliosis en filas de formulario. Todos los objetivos
  táctiles miden 44 px o más.
- **Etapa de seguridad.** Superficie neutra con filete de arcilla: el tono de
  aviso queda reservado para los avisos reales —el recordatorio clínico y el
  aviso de salud—, que se leen mejor sobre fondo claro que antes. Sin
  movimiento repetitivo y sin cambio de texto.
- **Revisión.** Ficha editorial en una sola superficie: los campos se separan
  por filetes de 1 px, no por tarjetas anidadas. Las cifras llevan
  `font-variant-numeric: tabular-nums`.
- **Movimiento.** Solo `transform` y `opacity`; el tramo del stepper se dibuja
  con `scaleX`. Con `prefers-reduced-motion: reduce` no queda ninguna
  animación: la entrada del paso, el check y la inclinación por puntero se
  desactivan, pero la escultura conserva su estado por etapa.

## 5. Movimiento

- Solo `transform` y `opacity`. El resto de propiedades no se anima.
- `prefers-reduced-motion: reduce` desactiva la respiración automática de la
  columna, la entrada de las tarjetas y la inclinación por puntero, pero
  **mantiene** la orientación que la persona eligió con los botones o con las
  flechas: quitar el movimiento no debe borrar la información.
- Duraciones: `--duracion-corta` 160 ms, `--duracion-media` 240 ms,
  entrada 480 ms, escalonado 70 ms.

## 6. Accesibilidad

- Anillo de foco visible en todo elemento interactivo: `outline: 3px solid
  var(--color-foco)` con desplazamiento de 2–3 px.
- Objetivo táctil mínimo: `--alto-objetivo-tactil` = 2.75rem (44 px). El
  estilo global lo aplica a `a, button, input, select, textarea`.
- El diálogo es un `<dialog>` nativo con `showModal()`: foco atrapado, cierre
  con Escape y devolución del foco a la tarjeta de origen.
- Impresión: se ocultan los controles interactivos y el texto se fuerza a
  negro sobre blanco (`CanvasText` / `Canvas`), incluidos los rótulos dentro
  del SVG de la columna.
- Modo de contraste forzado: los bordes de las fichas pasan a `CanvasText`.

## 7. Lenguaje clínico

- Se dice **«estado de la ficha»**, **«revisión documental completada»** o
  **«pendiente de revisión documental»**. Nunca «revisado», «apto»,
  «corrige» ni «endereza».
- Toda ficha conserva su aviso: no sustituye la supervisión de un
  fisioterapeuta o un médico.
- Las fuentes NHS, SOSORT, OMS, SRS y el resto de citas se citan tal cual,
  con su fecha de revisión original.

## 8. Registro de excepciones

| # | Excepción | Por qué | Dónde |
|---|---|---|---|
| 1 | El catálogo usa retícula de producto (tarjetas iguales, sin destacado) | Es un catálogo, no una landing; el orden lo fija el usuario (filtros, búsqueda, orden) | `ejercicios.css` |
| 2 | Los pósters son abstractos y llevan el rótulo «Esquema abstracto, no muestra la técnica» | Un póster con figura humana se leería como demostración de la técnica | `ExercisesPage.tsx` |
| 3 | El estado «sin vídeo» se declara con una banda «Demostración en preparación» | Los 13 ejercicios sin vídeo son un estado deliberado, no un error ni un hueco vacío | `ExercisesPage.tsx` |
| 4 | La columna explorable usa `touch-action: pan-y` | El scroll vertical pertenece a la página; el giro se queda con el eje horizontal y con los botones | `scoliosis-page.css` |
| 5 | El SVG de la columna se imprime en negro sobre blanco | En papel el color de marca pierde contraste y las etiquetas deben leerse | `scoliosis-page.css` |
| 6 | La insignia del hero de escoliosis usa `--color-salvia-claro` sin opacidad | Con `opacity: 0.85` bajaba a 5.9:1; sin opacidad llega a 7.7:1 | `scoliosis-page.css` |
| 7 | El enlace «Inicio» de la cabecera mide 39 × 44 px | Es un elemento compartido con Home, Apoya y Panel: cambiarlo tocaría páginas fuera de este encargo. Cumple 24 × 24 de WCAG 2.2 AA y los 44 px de alto | `style.css` (sin tocar) |
| 8 | El checkbox del checklist mide 24 × 44 px | La etiqueta asociada amplía la zona pulsable; el alto de 44 px lo fija la regla global de inputs | `style.css` (sin tocar) |
| 9 | La paleta de Actualidad es la de marca (verde bosque, salvia, marfil) y no una paleta nueva por página | El encargo fija el color como identidad del sitio; el acento arcilla queda reservado a detalles | `actualidad-page.css` |
| 10 | El `h1` de Actualidad fluye en 3 líneas a 390 px y 4 a 320 px | Son 52 caracteres: se puede leer en dos líneas a partir de 768 px, pero forzarlo en móvil rompería el tamaño mínimo de 34 px | `actualidad-page.css` |
| 11 | Los filetes de 1 px separan hallazgos, campos de la ficha y fuentes | En un registro bibliográfico el separador **es** la estructura; una retícula sin filetes lo dejaría en una columna de texto | `actualidad-page.css` |
| 12 | Actualidad no lleva fotografía | El encargo la excluye: la página es un texto editorial con una ilustración conceptual | `ActualidadPage.tsx` |
| 13 | La banda «Lo que este estudio NO demuestra» usa el título más grande después del `h1` (2.6rem) | Es la afirmación que protege de la sobreinterpretación; debe pesar más que los titulares de sección | `actualidad-page.css` |
| 14 | El anillo del marcador del visual usa `--color-salvia-claro` en vez de arcilla | Con el pulso del anillo, el trazo arcilla bajaba a 2.61:1; salvia clara llega al mínimo exigido | `actualidad-page.css` |
| 15 | El enlace «Inicio» del pie mide 39 × 44 px | Elemento compartido con el resto del sitio (igual que el de la cabecera, excepción 7): cambiarlo tocaría páginas fuera del encargo. Cumple 24 × 24 de WCAG 2.2 AA y 44 px de alto | `Footer.tsx` (sin tocar) |
| 16 | Pausas conserva tres kickers y etiquetas en mayúsculas espaciadas («DESCANSOS DE MOVIMIENTO», «Antes de empezar», «Tu pausa», «PAUSA / PRESENCIA») | Son etiquetas estructurales del sistema editorial de FitCasa, no decoración: identifican la sección y el sello de la escultura. Eliminarlas cambiaría la jerarquía y el texto existente | `PausasActivasPage.tsx`, `pausas-activas-page.css` |
| 17 | El marco de la escultura, las tarjetas de opción, el panel del reproductor y el chip conservan filetes de 1 px | Son límites de superficie y de controles de formulario; el relleno por sí solo no separa el campo del fondo en los cuatro estados | `pausas-activas-page.css` |
| 18 | El indicador del radio usa `radial-gradient` | Es el aro/punto de un control nativo de formulario, no un fondo decorativo; se mantiene con `taste-skill-ignore` | `pausas-activas-page.css` |
| 19 | No hay fotografías ni vídeo; la escultura SVG es la única imagen | El encargo pide una forma abstracta y no una figura humana; añadir fotos de movimiento cambiaría el contenido y el registro clínico | `PausasActivasPage.tsx` |
| 20 | La página no tiene animación de entrada al hacer scroll | El movimiento es de estado (escultura, anillo y controles); el inspector en carga ve 0 animaciones, pero el temporizador y la pausa sí tienen respuesta | `pausas-activas-page.css` |
| 21 | El fondo marfil, el cuerpo de 15 px y el filete de la cabecera vienen de `style.css` | Son reglas globales del sitio; modificarlas afectaría a todas las páginas fuera del encargo | `style.css` (sin tocar) |
| 22 | La sección de beneficios usa tilt 3D en las tarjetas y animación de entrada al viewport | Es una interacción decorativa que mejora la percepción sin afectar la funcionalidad; se desactiva con prefers-reduced-motion y puntero grueso | `HomePage.tsx`, `style.css` |
| 23 | La escultura de beneficios tiene 6 paths de trazo que se dibujan al revelar | Es decoración SVG pura, sin figuras humanas; se desactiva con prefers-reduced-motion | `HomePage.tsx` |
| 24 | La tarjeta Seguridad tiene patrón SVG de fondo y borde terracota de 2px | Es tratamiento editorial para destacar el aviso clínico sin usar sellos ni promesas; el patrón es muy sutil (5% opacidad) | `style.css` |
| 22 | La barra de progreso del cuestionario mide cuatro hitos (tres etapas y la propuesta generada) y su `aria-valuetext` dice «Etapa 2 de 3: Seguridad» | El relleno nunca debe llegar al 100 % antes de que exista la propuesta; el texto anuncia la etapa del cuestionario, que es la información que la persona necesita | `QuizPage.tsx`, `quiz-page.css` |
| 23 | El estado del paso (`.progress-text`) queda visualmente oculto | Repite literalmente el título del paso (`h3`), que es el destino del foco al cambiar de etapa: mostrarlo dos veces era duplicación visual. El texto sigue en el árbol de accesibilidad y en la región viva `aria-live` | `quiz-page.css` |
| 24 | Los `radio` del paso de seguridad son visibles (antes `display: none`) | Con `display: none` quedaban fuera del orden de tabulación: el paso no era operable con teclado. Ahora miden 1.35rem y conservan el estado real para los lectores de pantalla | `quiz-page.css` |
| 25 | La tarjeta del paso 2 pasa de campo rosa a superficie neutra con filete de arcilla | Tratamiento sobrio: el tono de aviso queda para los avisos reales, que sobre fondo claro se leen mejor que antes (antes era rosa sobre rosa) | `quiz-page.css` |
| 26 | El aviso de salud baja a 15 px en móvil (≤ 47.99rem) y a 16 px en escritorio | Con 16 px la primera pregunta caía a 1439 px en 390 × 844; a 15 px entra en el primer pliegue. Conserva su campo de aviso, su filete de arcilla y su titular en negrita | `quiz-page.css` |
| 27 | La escultura del cuestionario no muestra el núcleo en móvil | Es la versión simplificada y pequeña que pide el encargo: 112 px y tres placas ya no admiten una cuarta | `quiz-page.css`, `QuizSculpture.tsx` |
| 28 | Las utilidades tipo Tailwind (`my-6`, `m-0`, `mt-4`, `font-semibold`, `text-sm`, `font-bold`, `flex`, `gap-2`, `text-gray-*`, `text-[#245a73]`…) no existían en el CSS del proyecto | Eran clases muertas: el espaciado y el color no dependían de nada. Se han sustituido por clases propias o por reglas del proyecto, y los colores literales por tokens de `style.css` | `QuizPage.tsx`, `quiz-page.css` |
| 29 | La revisión del cuestionario separa los campos con filetes de 1 px y no con cajas | Una ficha editorial en una sola superficie; las tarjetas anidadas duplicaban superficie y castigo visual | `quiz-page.css` |
| 30 | El título del paso muestra un anillo de foco al recibir el foco programático | El foco debe ser visible: es la única señal de que la pantalla ha cambiado de etapa | `quiz-page.css` |
| 31 | La etapa de seguridad no lleva movimiento propio y la escultura no deriva | Sin movimiento repetitivo en una etapa clínica; la deriva infinita anterior se ha eliminado | `quiz-page.css` |
| 32 | La constelación del Panel usa 30 puntos SVG en 3D con `translateZ` y deriva por `requestAnimationFrame` | Requisito del encargo: pieza visual con profundidad real, inclinación por puntero, botón pausa para animación >5s | `PanelPage.tsx`, `Constellation.tsx`, `panel-page.css` |
| 33 | El anillo del Panel conserva `stroke-dashoffset` animado y botón pausa | Mismo dato que la constelación; accesibilidad WCAG 2.2.2 para animación continua | `PanelPage.tsx`, `panel-page.css` |
| 34 | La línea temporal usa `ol` con pseudo-elemento `::before` para la línea conectora | Reemplaza tabla y tarjetas; no es "tarjetas idénticas"; nodo por registro con fecha, actividad, dolor (número + etiqueta), nota | `PanelPage.tsx`, `panel-page.css` |
| 35 | El slider de dolor mantiene `aria-valuenow/min/max` y `aria-valuetext` con etiqueta textual | Requisito del encargo: el dolor nunca se comunica solo con color | `PanelPage.tsx` |
| 36 | La alerta de dolor alto usa `role="alert"` y animación de entrada | Visibilidad reforzada sin depender solo de color; `prefers-reduced-motion` la desactiva | `PanelPage.tsx`, `panel-page.css` |
| 37 | Microinteracción `scale(0.98)` al guardar el formulario | Feedback táctil breve sin mostrar éxito antes de completar; `prefers-reduced-motion` la desactiva | `PanelPage.tsx`, `panel-page.css` |
| 38 | IDs de pre-llenado (`panel-form`, `entry-date`, `entry-activity`, `exercise-quick-select`, `entry-heading`) preservados exactamente | Acoplamiento innegociable con Plan y Pausas activas | `PanelPage.tsx` |
| 39 | La constelación y el anillo usan `window.matchMedia('(prefers-reduced-motion: reduce)')` sincrónico | Sin destello en primer render; desactivan deriva, inclinación, transiciones y animaciones | `Constellation.tsx`, `PanelPage.tsx` |

## 9. Comprobaciones

- `npx tsc --noEmit` sin errores.
- `npm run build` correcto, sin dependencias nuevas.
- Páginas verificadas en 320, 390, 768, 1024, 1440 y 1920 px: sin scroll
  horizontal y con CLS = 0.
- Consola del navegador sin errores ni advertencias.
- Contraste medido sobre los elementos reales de ambas páginas: mínimo
  6.53:1 en texto secundario.
- Teclado: la columna gira con las flechas, el detalle se abre con Enter y el
  foco vuelve a la tarjeta al cerrar.
- `prefers-reduced-motion: reduce`: sin animaciones automáticas y sin
  inclinación por puntero.

### 9.1 Actualidad

- `npx tsc --noEmit` sin errores y `npm run build` correcto (CSS 292.28 kB ·
  gzip 42.82 kB; JS 513.62 kB · gzip 138.94 kB; sin dependencias nuevas).
- 320, 390, 768, 1024, 1440 y 1920 px: sin scroll horizontal, CLS = 0, consola
  sin errores ni avisos, 21 elementos `[data-reveal]` y ninguno oculto.
- Contraste medido sobre los elementos reales (incluido el SVG por `fill` y
  `stroke`): mínimo 5.99:1 en texto de menos de 24 px, 38 muestras, 0 fallos.
- Foco: 39 elementos alcanzables, ninguno tapado por la cabecera ni sin anillo
  visible.
- Rail: pegajoso a 88 px en 1440 × 900 sin tapar cabecera ni cuerpo; en
  1440 × 600 pasa a `static` (584 px de alto).
- Táctil y teclado: el scroll vertical sobre el visual sigue desplazando la
  página (135 px) y las flechas giran la escena.
- Impresión: ningún `[data-reveal]` oculto, texto negro sobre blanco, cabecera
  y controles ausentes, rail estático, URLs visibles.
- `prefers-reduced-motion: reduce`: 0 animaciones activas y 0 bloques ocultos.
- Los 5 enlaces externos abren en pestaña nueva con
  `rel="noopener noreferrer"`.
- Ritmo: ninguna línea de texto por debajo de 13 px; 8 tamaños en uso dentro de
  la página (13, 15, 18, 21, 30, 42, 48, 70 px).

### 9.2 Cuestionario de Sugerencias

- `npx tsc --noEmit` sin errores y `npm run build` correcto (CSS 307.03 kB ·
  gzip 44.75 kB, antes 299.94 kB · 43.86 kB; JS 512.55 kB · gzip 137.81 kB,
  antes 512.60 kB · 138.43 kB; sin dependencias nuevas).
- 320, 390, 768, 1024, 1440 y 1920 px: sin scroll horizontal y CLS = 0 en
  los tres pasos, en los errores y en los resultados.
- Contraste medido sobre los elementos reales de los cuatro estados: **0
  fallos** frente al mínimo 4.5:1 (3:1 en texto grande).
- Objetivo táctil: 39 controles medidos, **ninguno** con área pulsable por
  debajo de 44 px (la etiqueta que envuelve al input es la zona real).
- Teclado: el `radio` del paso de seguridad es alcanzable y visible
  (`display: block`, 22 × 44 px); el foco pasa al título del paso
  (`step-two-heading`, `step-three-heading`) y el anillo de foco es visible.
- `prefers-reduced-motion: reduce`: **0 animaciones** activas
  (`document.getAnimations()` vacío), sin inclinación de la escena y sin
  deriva; la escultura conserva su estado por etapa (opacidades 1/0/0/0 en el
  paso 1).
- La escultura **no** cambia al cambiar las respuestas de seguridad: la
  comparación de las cuatro capas antes y después de marcar «Sí» en las tres
  preguntas de seguridad da exactamente el mismo resultado.
- Barra de progreso: 25 % / 50 % / 75 % en los pasos 1–3 y 100 % solo con la
  propuesta generada; `aria-valuetext` = «Etapa 2 de 3: Seguridad» en el paso
  2 y «Propuesta educativa generada» al final.
- Salida visible idéntica antes/después en las cinco combinaciones de
  respuestas (A–E): revisión, resultados y contenido guardado en
  `localStorage` coinciden texto a texto. El volcado del texto visible de los
  cuatro estados no muestra ni una diferencia.
- Páginas ajenas al encargo sin cambios: Inicio, Ejercicios, Plan, Escoliosis,
  Actualidad, Pausas activas, Privacidad y Términos con capturas de página
  completa byte-idénticas. En Apoya, la captura de página completa difiere
  porque el botón de PayPal lo inyecta su SDK de forma asíncrona; la
  comparación nodo a nodo (279 nodos × 28 propiedades) da **0 diferencias** y
  las siete bandas de viewport son byte-idénticas.

### 9.3 Panel de Seguimiento (`PanelPage.tsx`, `panel-page.css`)

- `npx tsc --noEmit` sin errores y `npm run build` correcto (CSS 322.12 kB ·
  gzip 46.56 kB; JS 525.81 kB · gzip 140.93 kB; sin dependencias nuevas).
- 320, 390, 768, 1024, 1440 y 1920 px: sin scroll horizontal y CLS = 0.
- Contraste medido: **0 fallos** (mínimo 6.53:1 en texto secundario).
- Objetivo táctil: 34 controles medidos, **ninguno** por debajo de 44 px.
- Foco visible en todos los elementos interactivos (anillo 3 px, offset 2 px).
- Teclado: toda la navegación operable (constelación, anillo, formulario, línea temporal, diálogos).
- `prefers-reduced-motion: reduce`: **0 animaciones decorativas** activas; constelación estática, anillo sin transición, alertas sin animación de entrada.
- Constelación: 30 puntos en 3D (`perspective: 800px`, `translateZ`), uno por día últimos 30; punto se ilumina si hay registro (misma lógica que anillo); inclinación por puntero (máx 6°/8°); botón pausa/reanudar accesible (`aria-pressed`).
- Anillo: mantiene lógica original (días con registro últimos 30), `role="img"` en contenedor, SVG decorativo (`aria-hidden`), botón pausa.
- Resumen editorial: cifra principal grande (`clamp(2.5rem, 4vw + 1rem, 4rem)`), constelación como pieza central, datos secundarios en `dl` con composición variada.
- Línea temporal: `ol` con nodos, fecha destacada, actividad, dolor como número + etiqueta textual (`painLabel`), nota; filtros (rango/búsqueda) y acciones (editar/eliminar) preservadas; tabla y tarjetas legacy eliminadas.
- Formulario: grupos «Actividad» y «Sensaciones» con mejor jerarquía/espaciado; foco mejorado (box-shadow + outline); microinteracción `scale(0.98)` al guardar; `aria-valuenow/min/max` en slider de dolor.
- Alertas: `panel-alerta--seguridad` (azul), `panel-alerta--dolor` (rojo, animación entrada, `role="alert"`); `panel-estado--info` para avisos de almacenamiento/consentimiento.
- Privacidad: grupos con tratamiento editorial; grupo aviso con fondo amarillo/borde arcilla; botón «Retirar aceptación» preservado.
- IDs de pre-llenado preservados: `panel-form`, `entry-date`, `entry-activity`, `exercise-quick-select`, `entry-heading`.
- Dolor nunca solo por color: línea temporal usa `.panel-dolor-texto` con número + etiqueta + color; chips legacy eliminados.
