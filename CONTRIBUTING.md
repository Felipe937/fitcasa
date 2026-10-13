# Cómo contribuir a FitCasa

Gracias por querer ayudar. FitCasa es un sitio web estático (HTML, CSS y JavaScript vanilla, sin dependencias) con contenido sobre ejercicio para personas con escoliosis. Es un proyecto académico en español y desplegado en Cloudflare Workers. Toda contribución debe cuidar tanto la calidad técnica como la responsabilidad sanitaria del contenido.

## 1. Cómo reportar un bug

Usa las [issues del repositorio](https://github.com/Felipe937/fitcasa/issues) y describe:

- Qué esperabas que pasara y qué pasó en realidad.
- Pasos para reproducir el problema, en orden.
- Navegador y versión (por ejemplo, Firefox 131, Chrome 129).
- Dispositivo y sistema operativo (por ejemplo, Android 14, Windows 11).
- Si puedes, una captura de pantalla o el mensaje exacto de la consola.

Revisa antes si ya existe una issue abierta sobre lo mismo para no duplicar.

## 2. Cómo sugerir una mejora

Abre primero una issue explicando la propuesta antes de ponerte a programar:

- Qué problema resuelve o qué beneficio aporta a las personas usuarias.
- Cómo imaginas la solución, sin entrar en código si no quieres.
- Si afecta a textos sobre salud o escoliosis, indica las fuentes que la respaldan.

Así evitamos trabajo desechado y nos aseguramos de que la mejora encaja con el proyecto.

## 3. Cómo enviar un pull request

1. Haz un fork del repositorio y crea una rama con nombre descriptivo (por ejemplo, `fix-menu-movil` o `docs-mejorar-readme`).
2. Haz commits claros y pequeños, con mensajes que expliquen el porqué del cambio.
3. No mezcles cambios no relacionados en el mismo pull request: una propuesta, un pull request.
4. Describe en el pull request qué cambia, por qué y cómo lo has probado.
5. Ten en cuenta que el sitio publicado se sirve desde `public/`; si tocas el sitio, edita allí y mantén la copia de la raíz sincronizada.

## 4. Estilo de código

- HTML semántico y accesible: encabezados en orden, landmarks (`header`, `main`, `footer`), textos alternativos donde correspondan y navegación usable por teclado.
- CSS con nombres de clase descriptivos y variables para colores, espacios y tipografías. Sin estilos en línea salvo casos justificados.
- JavaScript vanilla, sin dependencias externas ni herramientas de build. Código claro, comentado solo donde aporte y compatible con los navegadores actuales.
- Respeta el castellano correcto en textos visibles y mensajes.

## 5. Reglas clínicas obligatorias

FitCasa informa, no prescribe. Estas reglas no son negociables:

- No añadas consejos médicos, diagnósticos ni recomendaciones clínicas sin respaldo científico verificable.
- No prometas la corrección de la curva ni resultados terapéuticos.
- No elimines ni debilites los avisos de seguridad existentes (por ejemplo, que el contenido no sustituye la valoración profesional).
- Ante la duda sobre un contenido de salud, consúltalo en la issue antes de incluirlo.

## 6. Código de conducta

Toda participación en este proyecto se rige por nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Léelo antes de contribuir.

## 7. Contacto para dudas

Si tienes cualquier duda sobre cómo contribuir, abre una issue o escribe a través de [github.com/Felipe937](https://github.com/Felipe937). Respondemos en cuanto podemos.
