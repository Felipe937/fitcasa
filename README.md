# fitcasa
Página web profesional de ejercicio en casa con rutinas adaptadas para personas con escoliosis.

## Propósito
Crear una web estática que ofrezca rutinas de ejercicio adaptadas a personas con escoliosis, con énfasis en información segura y progresiva.

## Estructura de archivos
- `index.html` – markup principal con landmarks y navegación.
- `style.css` – estilos globales, variables y layout.
- `script.js` – gestión del menú móvil.
- `sitemap.xml` – sitemap para motores de búsqueda.
- `robots.txt` – política básica de rastreo.
- `.editorconfig` – configuración de estilo de código.
- `.gitignore` – archivos y carpetas a excluir del repo.

## Visualización local
Abrir `index.html` directamente en el navegador **o** servir con un servidor estático:
```sh
python -m http.server 8000
```
Acceder a `http://localhost:8000`. En local la ruta base es `/`; en GitHub Pages se sirve bajo `/fitcasa/`, por eso todas las URL son relativas.

## Despliegue en GitHub Pages
1. Ir a **Settings → Pages** del repositorio.
2. Seleccionar **Source: Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. Guardar. El sitio quedará en `https://felipe937.github.io/fitcasa/`.

## Requisitos de calidad
- **Accesibilidad**: WCAG 2.1 AA (contraste, foco visible, navegación por teclado).
- **Rendimiento**: Core Web Vitals – LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
- Sin dependencias externas, sin imágenes ni fuentes externas.

## Aviso legal
FitCasa ofrece contenido informativo y educativo. No sustituye el diagnóstico, tratamiento ni consejo de un médico o fisioterapeuta. Si tienes escoliosis u otra condición, consulta con un profesional antes de hacer cualquier ejercicio y detén la actividad si sientes dolor intenso, entumecimiento u otros síntomas inusuales.

## Pendiente
- `og:image` (meta para redes sociales).
- Licencia (código y contenido pueden requerir licencias distintas; decisión del autor).
- Revisión clínica por un fisioterapeuta antes de publicar contenido específico sobre escoliosis.
