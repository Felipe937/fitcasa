# FitCasa

Página web profesional de ejercicio en casa con rutinas adaptadas para personas con escoliosis.

## Propósito

Crear una web estática que ofrezca rutinas de ejercicio adaptadas a personas con escoliosis, con énfasis en información segura y progresiva. Sin frameworks ni dependencias externas.

## Estructura del proyecto

```
fitcasa/
├── public/                  ← Directorio de assets publicables
│   ├── index.html           ← Página principal
│   ├── style.css            ← Estilos globales y variables
│   ├── script.js            ← Gestión del menú móvil
│   ├── robots.txt           ← Política de rastreo
│   ├── sitemap.xml          ← Sitemap para buscadores
│   ├── 404.html             ← Página de error personalizada
│   ├── _headers             ← Cabeceras HTTP de seguridad
│   └── .assetsignore        ← Exclusiones para Wrangler
├── .editorconfig            ← Configuración de estilo de código
├── .gitignore               ← Archivos excluidos del repositorio
├── .github/
│   └── dependabot.yml       ← Configuración de Dependabot
├── contrast_check.py        ← Script de verificación de contraste WCAG
├── quiz.html / quiz.js      ← Cuestionario de sugerencias educativas
├── panel.html / panel.js    ← Panel local de seguimiento
├── fitcasa-app.css          ← Componentes visuales compartidos
├── fitcasa-storage.js       ← Persistencia local versionada y tolerante a fallos
├── wrangler.jsonc           ← Configuración de Workers Static Assets / Wrangler
└── README.md                ← Este archivo
```

**`public/`** es la fuente de verdad del sitio: todo lo que se publica está ahí. La raíz del repositorio conserva una copia heredada e idéntica de esos mismos archivos para poder servir el sitio con GitHub Pages; tras cualquier cambio en `public/`, hay que copiar los archivos a la raíz. Solo la configuración, los scripts de desarrollo y la documentación viven únicamente en la raíz y nunca se suben al servidor.

## Visualización local

Abrir `public/index.html` directamente en el navegador, o servir con un servidor estático:

```sh
# Opción 1: servidor Python desde la carpeta public
cd public
python -m http.server 8000
```

Acceder a `http://localhost:8000`.

Las rutas nuevas son `/quiz.html` y `/panel.html`. El despliegue de `public/` incluye también las copias publicables de estas páginas, de sus scripts, de la hoja de componentes y de `ejercicios.json`.

> **Nota sobre rutas:** en local la ruta base es `/`; en Workers se sirve desde la raíz del dominio/subdominio asignado. Las páginas usan rutas relativas (por ejemplo `style.css`, `ejercicios.html`) para funcionar en ambos entornos.

## Despliegue en Cloudflare Workers con Wrangler

### Requisitos previos

- [Node.js](https://nodejs.org/) (v18+)
- Wrangler instalado: `npm install -g wrangler`
- Autenticación: `wrangler login`

### Desplegar

```sh
wrangler deploy
```

Wrangler solo subirá los archivos dentro de `public/`, excluyendo los patrones definidos en `public/.assetsignore`.

### Archivo `.assetsignore`

El archivo `public/.assetsignore` indica a Wrangler qué archivos o carpetas **no** debe incluir en el despliegue. Existe para evitar:

- **Riesgo de seguridad**: sin él, Wrangler subía la carpeta `.git` completa al sitio público, exponiendo el historial del repositorio.
- **Timeouts (504)**: el exceso de archivos innecesarios causaba que la API de Cloudflare agotara el tiempo de respuesta.

## Despliegue alternativo en GitHub Pages

1. Ir a **Settings → Pages** del repositorio.
2. Seleccionar **Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Nota: GitHub Pages servirá desde la raíz del repo, no desde `public/`. La raíz conserva copias idénticas de los archivos de `public/`, así que no hay que mover nada.

## Requisitos de calidad

- **Accesibilidad**: WCAG 2.1 AA (contraste ≥ 4.5:1, foco visible, navegación por teclado).
- **Rendimiento**: Core Web Vitals — LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
- Sin dependencias externas, sin imágenes ni fuentes externas.

## Aviso legal

FitCasa ofrece contenido informativo y educativo. No sustituye el diagnóstico, tratamiento ni consejo de un médico o fisioterapeuta. Si tienes escoliosis u otra condición, consulta con un profesional antes de hacer cualquier ejercicio y detén la actividad si sientes dolor intenso, entumecimiento u otros síntomas inusuales.

## Código de Conducta

Este proyecto se rige por su [Código de Conducta](CODE_OF_CONDUCT.md), basado en el Contributor Covenant v2.1 y adaptado a un proyecto sobre salud y escoliosis: exige respeto hacia las personas con esta condición y prohíbe dar consejos médicos sin respaldo profesional o difundir información sanitaria sin sustento científico.

## Pendiente

- `og:image` (meta para redes sociales).
- Licencia (código y contenido pueden requerir licencias distintas; decisión del autor).
- Revisión clínica por un fisioterapeuta antes de publicar contenido específico sobre escoliosis.
