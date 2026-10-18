# Cómo contribuir a FitCasa

Gracias por tu interés en colaborar con FitCasa. FitCasa es una aplicación web comunitaria y educativa orientada al ejercicio físico adaptado y la divulgación sobre escoliosis, desarrollada con React, TypeScript y Vite.

Este documento establece las normas de gobernanza, el flujo de trabajo y los criterios técnicos y clínicos que rigen este repositorio.

---

## 1. Modelo de gobernanza y toma de decisiones

FitCasa es un proyecto de código abierto con gobernanza centralizada:

1. **Responsable único:** El único administrador, revisor y responsable de tomar decisiones sobre el proyecto es el propietario del repositorio, **[@Felipe937](https://github.com/Felipe937)**.
2. **Sin garantías de aceptación:** Proponer una idea o enviar un Pull Request no garantiza su aceptación o integración en el código oficial. Toda contribución se evalúa según su pertinencia técnica, accesibilidad, rigor sanitario y alineación con la visión del proyecto.
3. **Decisión exclusiva del propietario:** Solo `@Felipe937` tiene autoridad para aprobar, solicitar modificaciones o rechazar propuestas. Los colaboradores externos no reciben permisos de escritura (`write`) ni de administración (`admin`) en el repositorio.
4. **Rama `main` protegida:** Nadie debe enviar cambios directos a la rama `main`. Toda modificación debe canalizarse a través de una propuesta de cambio (Pull Request) evaluada previamente.

---

## 2. Cómo proponer mejoras o reportar errores (Issues)

Cualquier persona es bienvenida a abrir una propuesta o reportar incidencias usando las [Issues del repositorio](https://github.com/Felipe937/fitcasa/issues). Por favor, utiliza la plantilla adecuada:

- **Reporte de bug (`[Bug]`):** Describe los pasos exactos para reproducirlo, el comportamiento esperado frente al observado, el navegador, dispositivo y capturas si aportan claridad.
- **Sugerencia de mejora (`[Feature]`):** Explica qué necesidad de las personas usuarias resuelve y cómo imaginas la solución. Abrir la Issue antes de programar ahorra esfuerzo en caso de que la propuesta no encaje con los objetivos del proyecto.
- **Revisión clínica (`[Revisión clínica]`):** Si detectas un texto, ejercicio o recomendación que deba actualizarse o precisarse según la evidencia médica disponible.

Antes de abrir una nueva Issue, busca en las ya existentes (abiertas o cerradas) para evitar duplicados.

---

## 3. Flujo para enviar un Pull Request (PR)

Si deseas proponer cambios de código o documentación:

1. **Haz un Fork** del repositorio a tu cuenta de GitHub y crea una rama específica con un nombre descriptivo (por ejemplo, `fix/aria-labels-filtro` o `docs/aclarar-fuentes-sosort`).
2. **Un solo propósito por Pull Request:** No mezcles refactorizaciones, correcciones de errores y nuevas funciones en una misma solicitud.
3. **Commits claros y atómicos:** Redacta mensajes explicativos en español que resuman el motivo de cada cambio.
4. **Usa la plantilla de Pull Request:** Completa todos los campos requeridos (propósito, problema que soluciona, archivos afectados, pruebas realizadas y fuentes clínicas si aplica).
5. **No compartas credenciales ni información sensible:** Jamás incluyas contraseñas, claves de API, tokens de acceso ni datos personales en el código, comentarios, capturas ni descripción del PR.

---

## 4. Reglas clínicas y de salud obligatorias

FitCasa es un recurso estrictamente informativo y no prescribe tratamientos. Estas reglas son innegociables:

- **Fuentes obligatorias y contrastables:** Cualquier cambio que afecte a textos sobre salud, pautas de ejercicio, advertencias o información de escoliosis debe citar fuentes científicas de referencia (por ejemplo: guías SOSORT, SRS, revisiones Cochrane o consensos de sociedades de columna).
- **Prohibición de afirmaciones de cura:** No se admitirán textos que prometan «corregir», «enderezar» o «curar» la curvatura mediante ejercicio en casa.
- **Conservación íntegra de avisos de seguridad:** Bajo ninguna circunstancia se debilitarán, ocultarán ni eliminarán los avisos de responsabilidad (*disclaimers*) ni las advertencias de contraindicación.
- **Sin diagnóstico ni asesoramiento individualizado:** FitCasa no formula diagnósticos clínicos ni reemplaza la consulta con fisioterapeutas o médicos especialistas.

---

## 5. Estándares técnicos y de calidad

Antes de enviar tu Pull Request, asegúrate de que el proyecto compile y pase todas las comprobaciones automáticas del repositorio:

```bash
# 1. Comprobación estricta de tipos de TypeScript
npm run lint

# 2. Compilación del proyecto React + Vite
npm run build

# 3. Comprobación de ratios de contraste WCAG 2.1 AA
python3 contrast_check.py
```

Criterios de código:
- **TypeScript estricto:** Tipado claro, sin uso de `any` injustificado y respetando la arquitectura de componentes.
- **Accesibilidad (A11y):** Cumplimiento de WCAG 2.1 AA, navegación completa por teclado, atributos ARIA cuando proceda y foco visible.
- **Estilos y coherencia visual:** Usar las variables y tokens de color/espaciado de `src/styles/style.css` (marfil, verde bosque, salvia, acento arcilla). No añadir dependencias CSS externas.
- **Privacidad desde el diseño:** FitCasa no utiliza cookies de rastreo, analíticas de terceros ni almacenamiento remoto de datos personales.

---

## 6. Seguridad y confidencialidad

- No publiques vulnerabilidades de seguridad en Issues públicas. Sigue las instrucciones de [SECURITY.md](SECURITY.md) para emitir un aviso privado (*Security Advisory*).
- Los colaboradores deben garantizar que ningún archivo contenga secretos, credenciales o datos protegidos por leyes de privacidad.

---

## 7. Código de conducta

Toda interacción en las Issues, Pull Requests y discusiones del proyecto está sujeta a nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Se exige un trato respetuoso, constructivo e inclusivo en todo momento.

---

## 8. Dudas y contacto

Para resolver inquietudes sobre el proceso de contribución o plantear preguntas previas, abre una Issue de discusión o escribe a través del perfil oficial de GitHub de **[@Felipe937](https://github.com/Felipe937)**.
