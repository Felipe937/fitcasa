# Política de seguridad de FitCasa

## Versiones soportadas

FitCasa es un sitio web estático sin versiones numeradas ni ramas de mantenimiento. Solo se mantiene la versión actual publicada desde la rama `main`. Si encuentras un problema de seguridad en una copia antigua o descargada del sitio, actualiza primero a la última versión y comprueba si el problema persiste.

| Versión        | Soporte           |
| -------------- | ----------------- |
| `main` actual  | ✅ Soportada      |
| Copias antiguas | ❌ No soportadas |

## Cómo reportar una vulnerabilidad

**No publiques vulnerabilidades en issues públicos.** Para dar tiempo a corregirlas antes de que sean conocidas:

1. Usa los [Security Advisories privados del repositorio](https://github.com/Felipe937/fitcasa/security/advisories/new) (pestaña *Security* → *Advisories* → *New draft advisory*), o
2. Si no puedes usar esa vía, escribe a través de [github.com/Felipe937](https://github.com/Felipe937) indicando que se trata de un reporte de seguridad.

Incluye en el reporte:

- Descripción del problema y qué impacto podría tener.
- Pasos para reproducirlo.
- Navegador, dispositivo y URL afectada.
- Si es posible, una propuesta de solución.

## Qué esperar tras el reporte

- **Confirmación de recepción** en un máximo de 7 días.
- **Evaluación** del alcance y la gravedad en los 14 días siguientes a la confirmación.
- **Resolución**: si se confirma la vulnerabilidad, se publicará una corrección en `main` lo antes posible y se te reconocerá en el aviso correspondiente, salvo que prefieras permanecer en el anonimato.
- Si el reporte no describe una vulnerabilidad real, se cerrará explicando el motivo.

## Alcance

FitCasa **no tiene backend, base de datos ni autenticación**, y no envía datos a ningún servidor: los registros del panel y las respuestas del cuestionario se guardan únicamente en el `localStorage` del propio navegador del usuario.

Por eso, los riesgos relevantes para este proyecto son principalmente:

- **XSS (cross-site scripting)**: inyección de scripts a través de cualquier dato que el sitio muestre sin sanitizar (por ejemplo, contenido guardado por el usuario y re-renderizado).
- **Inyección o manipulación en `localStorage`**: datos corruptos o maliciosos que rompan la aplicación o engañen al usuario al leerlos.
- **Dependencias de terceros**: actualmente el sitio no usa ninguna (sin frameworks, sin CDNs, sin librerías). Si en el futuro se añade alguna, sus vulnerabilidades conocidas también entran en el alcance.

Quedan fuera del alcance los problemas de la infraestructura de Cloudflare o del navegador del usuario, así como la ingeniería social.

## Datos personales

Este proyecto **no recoge, almacena ni transmite datos personales en ningún servidor**. Todos los datos (actividad registrada, respuestas del cuestionario) permanecen en el navegador y dispositivo de cada persona usuaria. Por tanto, un reporte de seguridad aquí nunca debería incluir datos personales de terceros.
