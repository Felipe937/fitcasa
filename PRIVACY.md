# Política de Privacidad de FitCasa

**Última actualización: 15 de octubre de 2026**

> **Estado de este documento.** Este texto describe el funcionamiento técnico
> verificable del proyecto. **No constituye una certificación de cumplimiento
> normativo ni asesoría jurídica.** Los datos del responsable del tratamiento
> están marcados como `[Pendiente: …]` y deben completarse antes de publicar la
> política como definitiva.

---

## Índice

1. [Quién responde por FitCasa](#quien)
2. [Qué es FitCasa y qué no es](#alcance)
3. [Qué información guarda FitCasa](#datos)
4. [Dónde y cómo se guarda](#almacenamiento)
5. [Qué significa realmente el almacenamiento local](#limitaciones)
6. [Conservación y eliminación de tus datos](#conservacion)
7. [Cookies, analítica y servicios de terceros](#terceros)
8. [Proveedor de alojamiento y datos técnicos](#alojamiento)
9. [Tus derechos y controles](#derechos)
10. [Consideraciones para menores](#menores)
11. [Aviso de salud y descargo de responsabilidad](#salud)
12. [Marco normativo de referencia](#normativa)
13. [Cómo contactar](#contacto)

---

<a id="quien"></a>
## 1. Quién responde por FitCasa

FitCasa es un proyecto educativo de código abierto sobre ejercicio físico general
y ergonomía cotidiana. Quien lo publica y decide sobre su contenido es:

- **Responsable del proyecto:** `[Pendiente: nombre o razón social del responsable del tratamiento]`
- **Correo de contacto:** `[Pendiente: correo de contacto del responsable]`
- **Jurisdicción / país de constitución:** `[Pendiente: país del responsable del proyecto]`
- **Repositorio público del código:** <https://github.com/Felipe937/fitcasa>

El proyecto no registra cuentas de usuario ni implements autenticación. Nadie
necesita crear un perfil para usar FitCasa.

---

<a id="alcance"></a>
## 2. Qué es FitCasa y qué no es

FitCasa ofrece material informativo: una biblioteca de ejercicios, un cuestionario
que genera una propuesta educativa de actividad, una guía divulgativa sobre
escoliosis y un panel de seguimiento personal.

**FitCasa no es un servicio de salud.** No diagnostica, no prescribe, no trata y no
sustituye la valoración de un profesional sanitario. La propuesta que genera el
cuestionario se calcula en el navegador a partir de las respuestas que tú mismo
introduces y de la biblioteca de ejercicios incluida en el proyecto.

Esta política cubre únicamente el tratamiento de datos que realiza **la propia
aplicación en tu navegador**. Los datos técnicos que pueda tratar el proveedor de
alojamiento se tratan en el [apartado 8](#alojamiento) y son una cosa distinta.

---

<a id="datos"></a>
## 3. Qué información guarda FitCasa

FitCasa guarda en tu navegador **solo lo que tú escribes o eliges**. La aplicación
no pide nombre, correo electrónico, teléfono, documento de identidad, dirección
postal ni ubicación.

El proyecto usa tres claves de almacenamiento local:

### 3.1 Cuestionario de sugerencias — clave `fitcasa.quiz.v1`

Se guarda al generar una propuesta. Contiene:

| Dato | Tipo | Qué es |
| --- | --- | --- |
| Objetivo de la actividad | opción | Movilidad, fuerza o bienestar |
| Días por semana | número | Frecuencia elegida |
| Tiempo por sesión | opción | Hasta 10, entre 10 y 20, o más de 20 minutos |
| Nivel | opción | Principiante, intermedio o avanzado |
| Equipamiento disponible | lista de opciones | Sin material, bandas, pesas o colchoneta |
| **Cirugía sin autorización** | sí / no | **Pregunta de seguridad** |
| **Restricción clínica** | sí / no | **Pregunta de seguridad** |
| **Síntomas preocupantes** | sí / no | **Pregunta de seguridad** |
| **Contexto de escoliosis** | opción | Ninguna, leve o desconocido, moderada, severa, o no lo sé |

Las tres respuestas de seguridad y el contexto de escoliosis se usan para decidir
si FitCasa propone una actividad o si, por prudencia, bloquea la propuesta y te
remite a tu equipo sanitario. **No se envían a ningún sitio**: se leen y se
aplican en tu navegador.

### 3.2 Panel de seguimiento — clave `fitcasa.panel.v1`

Guarda una lista de registros. Cada registro contiene:

| Dato | Tipo | Qué es |
| --- | --- | --- |
| Fecha | texto `AAAA-MM-DD` | El día al que corresponde el registro |
| Actividad realizada | texto libre, hasta 120 caracteres | La actividad que anotaste |
| Dolor percibido | entero de 0 a 10 | Tu percepción subjetiva del dolor |
| Nota de bienestar | texto libre, hasta 500 caracteres | Tus sensaciones o notas |
| Ejercicio vinculado | identificador, opcional | Referencia a un ejercicio de la biblioteca |

El dolor que anotas es una **percepción subjetiva**, no una medición diagnóstica.

### 3.3 Registro de decisiones legales — clave `fitcasa.consent.v2`

Guarda las decisiones que tomas al acceder a funciones protegidas (cuestionario
de sugerencias, panel de seguimiento y plan de actividad). Contiene:

| Dato | Tipo | Qué es |
| --- | --- | --- |
| Términos de Uso | decisión | Si aceptaste los Términos, con versión y fecha |
| Política de Privacidad | decisión | Si aceptaste la política, con versión y fecha |
| Datos de salud | decisión | Si autorizas guardar tu percepción de dolor y notas de bienestar (opcional) |
| Analítica (GA4) | decisión | Si consientes medición anónima de uso con Google Analytics 4 (opcional) |
| Fecha y hora | texto ISO | Cuándo se tomó cada decisión |

Esta decisión se registra en el almacenamiento local de tu navegador, que no está
cifrado y que puedes editar o borrar cuando quieras. Es una trazabilidad personal;
no es un documento firmado ni una prueba fehaciente frente a un tercero.

---

<a id="almacenamiento"></a>
## 4. Dónde y cómo se guarda

Todo se guarda con la API de **almacenamiento local del navegador**
(`localStorage`), bajo el origen desde el que abriste FitCasa. Cada clave guarda
un objeto con una marca de versión (`version`) y los datos.

Consecuencias prácticas:

- Los datos **nunca salen de tu dispositivo**: el código de la aplicación no
  realiza ninguna petición de red para enviar lo que escribes.
- Los datos **no se sincronizan** entre navegador, dispositivo ni perfil.
- La aplicación funciona aunque el almacenamiento local esté deshabilitado. En ese
  caso te avisa en pantalla y todo funciona **solo durante la sesión**: al recargar,
  lo que escribiste se pierde.
- No hay copia de seguridad en ningún servidor. Si borras los datos del navegador o
  pierdes el dispositivo, no hay forma de recuperar lo que habías guardado.

---

<a id="limitaciones"></a>
## 5. Qué significa realmente el almacenamiento local

Conviene ser claro sobre lo que esta protección implica y lo que **no**:

**El almacenamiento local ofrece cierto aislamiento, no confidencialidad.**

- **No está cifrado.** El contenido se guarda como texto legible. Cualquiera que
  tenga acceso al perfil del navegador o al dispositivo puede leerlo con las
  herramientas de desarrollo del navegador. En un ordenador compartido, en un
  dispositivo familiar o en uno prestable, eso significa que otra persona puede
  ver tus notas de bienestar.
- **Está atado al navegador y al origen.** No se comparte ni se sincroniza entre
  navegadores ni entre equipos. Abrir FitCasa en modo privado usa un
  almacenamiento distinto y separado.
- **Lo puede borrar el navegador sin avisar.** Limpiar datos del sitio, usar
 Modos con borrado automático o reinstalar el navegador puede eliminarlo.
- **Tiene un límite de espacio** (orden de unos pocos megabytes). Si se supera,
  el navegador rechaza la escritura y FitCasa te avisa de que los cambios no se
  guardaron.
- **No hay control de acceso por usuario.** El proyecto no implementa
  autenticación, así que el «usuario» del almacenamiento es el perfil del
  navegador, no tú.

Por eso FitCasa pide entregar **información no identificable** en sus formularios y
recuerda que el contenido no debe considerarse privado frente a otras personas
que usen el mismo dispositivo.

---

<a id="conservacion"></a>
## 6. Conservación y eliminación de tus datos

### 6.1 Plazo de conservación

**No hay un plazo automático.** FitCasa no programa borrados ni caducidades. Tus
datos se conservan hasta que tú los elimines o hasta que el navegador los elimine
por su cuenta (limpieza de datos, borrado del perfil o del dispositivo).

En la práctica, esto significa que los datos permanecen el tiempo que quieras
mantenerlos en tu dispositivo.

### 6.2 Cómo eliminarlos

FitCasa ofrece tres formas, todas locales e inmediatas:

1. **Borrar un registro concreto.** En el panel de seguimiento, cada registro tiene
   su botón «Eliminar», que pide confirmación y lo quita de la lista.
2. **Borrar todo desde el panel de seguimiento.** El botón «Borrar respuestas y
   registros guardados» pide una confirmación explícita en dos pasos y, al
   aceptarla, **elimina las dos claves**: los registros del panel y las respuestas
   del cuestionario.
3. **Borrar todo desde las sugerencias.** El cuestionario tiene su propia opción de
   borrado general, que elimina igualmente las dos claves.

**No existe copia de los datos en ningún servidor**, así que borrarlos aquí los
elimina por completo. Si necesitas un borrado que no dependa de la aplicación,
puedes borrar los datos del sitio desde los ajustes de tu navegador.

### 6.3 Exportación

**FitCasa no ofrece exportar tus datos.** No hay ninguna función de descarga de
archivos, copia de seguridad ni envío de tus registros por correo.

Existe una función llamada «Exportar para consulta médica» en las sugerencias de
actividad y un botón «Imprimir esta guía» en la guía de escoliosis, pero **ninguno de
los dos exporta tus datos**: ambos abren el diálogo de impresión de tu navegador
para que imprimas o guardes en PDF lo que ya está en pantalla. Lo que se imprime es
el contenido de la página, no un archivo generado por FitCasa con tus registros.

Tampoco hay forma de recuperar los registros del panel: si borras el almacenamiento
local, desaparecen sin copia.

---

<a id="terceros"></a>
## 7. Cookies, analítica y servicios de terceros

### 7.1 Cookies

**FitCasa no utiliza cookies.** El código de la aplicación no escribe ni lee
`document.cookie`, y el documento HTML del proyecto no declara ninguna. No hay
cookies propias ni de terceros.

### 7.2 Analítica y publicidad

FitCasa puede utilizar **Google Analytics 4 (GA4)** para medir de forma agregada
y anónima qué páginas visitan las personas. El uso de Google Analytics requiere
tu consentimiento explícito: no se activa hasta que marcas la casilla de
consentimiento de analítica. Si no lo das, no se envía ningún dato a Google
Analytics.

FitCasa no incorpora publicidad, píxeles de redes sociales, mapas de calor ni
etiquetas de seguimiento de comportamiento. Los únicos datos que se envían a
Google Analytics son la ruta de la página visitada y su título; nunca se envían
respuestas de cuestionarios, registros del panel, datos de salud ni información
personal.

### 7.3 Servicios de terceros incrustados

**No hay ni un solo script, estilo, imagen o tipografía de terceros.** Todos los
recursos que carga la página (código, hoja de estilos, icono) se sirven desde el
mismo dominio que la aplicación.

### 7.4 Enlaces a sitios externos

La guía sobre escoliosis incluye enlaces a fuentes externas de referencia
(`sosort.org`, `srs.org`, `who.int`, `nhs.uk`, `rnooh.nhs.uk`, `mayoclinic.org`,
`pmc.ncbi.nlm.nih.gov`), y la biblioteca de ejercicios cita direcciones de
evidencia parecidas.

Estos enlaces **solo seactivated si tú pulsas**, se abren en una pestaña nueva y se
programan con `rel="noopener noreferrer"`. Al pulsarlos, sales del control de
FitCasa y **el sitio de destino aplica su propia política de privacidad**. FitCasa
no controla esos sitios y no recibe información de lo que hagas en ellos.

---

<a id="alojamiento"></a>
## 8. Proveedor de alojamiento y datos técnicos

La versión publicada de FitCasa se sirve desde un dominio **`workers.dev`**
alojado por **Cloudflare**: <https://fitcasa.fv143962.workers.dev>.

Es importante separar dos cosas:

| | Quién lo trata | Qué incluye |
| --- | --- | --- |
| **Lo que escribes en la aplicación** | Solo tu navegador | Respuestas del cuestionario y registros del panel. No se envían a nadie. |
| **Los datos técnicos de la visita** | El proveedor de alojamiento | Dirección IP, agente del navegador, petición de recursos y registros propios del servidor y de la red de Cloudflare. |

Los datos del primer grupo nunca salen de tu dispositivo. Los del segundo los
trata Cloudflare **como parte normal de servir una página web**: aunque la
aplicación no contenga analítica, un servidor web necesita registrar quién le pide
cada archivo para entregarlo y proteger su infraestructura.

FitCasa **no controla ni puede consultar** esos registros técnicos. Si necesitas
saber exactamente qué datos técnicos conserva el alojamiento, o ejercer control sobre ellos,
consulta los términos y la política de privacidad de Cloudflare, que se aplican a
la visita al sitio con independencia de esta política.

`[Pendiente: confirmar con el propietario qué producto exacto de Cloudflare usa el
proyecto y si tiene habilitada alguna función adicional (por ejemplo, análisis de
tráfico, Rules, Workers Analytics) que deba mencionarse aquí.]`

---

<a id="derechos"></a>
## 9. Tus derechos y controles

FitCasa no tiene un sistema de cuentas, así que la vía para ejercer tus derechos es
directa sobre el almacenamiento local de tu navegador.

### 9.1 Lo que puedes hacer desde la aplicación

- **Consultar** lo que has guardado: el cuestionario recupera tus respuestas
  cuando vuelves, y el panel muestra tus registros con los filtros de fecha y
  búsqueda.
- **Rectificar o actualizar** cualquier registro: puedes editar un registro del
  panel y corregir su fecha, actividad, dolor o nota.
- **Suprimir** tus datos: con las tres vías de borrado del
  [apartado 6.2](#conservacion), o borrando los datos del sitio en tu navegador.

### 9.2 Lo que FitCasa no puede hacer

- **No puede** entregarte una copia de tus datos en un archivo, porque no existe
  función de exportación (véase el [apartado 6.3](#conservacion)).
- **No puede** encontrar ni recuperar tus datos si borras el almacenamiento local,
  porque no existe copia en ningún servidor.
- **No puede** saber quién eres, porque no hay registro de usuarios.

### 9.3 Datos técnicos

Para cualquier cuestión relativa a los datos técnicos de la visita —dirección IP,
registros del servidor—, dirígete al proveedor de alojamiento. FitCasa no es la
entidad adecuada para responder por ellos.

---

<a id="menores"></a>
## 10. Consideraciones para menores

**FitCasa no implementa ninguna verificación de edad.** La aplicación es pública y
puede abrirse sin registro ni comprobación. Un menor de edad que la use escribirá
en su propio navegador respuestas de seguridad, contexto de escoliosis y, si usa el
panel, sus notas de bienestar y dolor percibido.

Recomendamos, sin que esto sustituya a una decisión del responsable:

- Que una persona adulta acompañe al menor y le explique el contenido antes de que
  anote dolor o las notas de bienestar.
- Que el menor use un perfil de navegador propio, o al menos que sepa que lo que
  escribe queda guardado en ese dispositivo y puede ser leído por quien use el
  mismo perfil.
- Que un adulto revise y borre los registros cuando deje de usar la aplicación,
  con la opción de borrado total del
  [apartado 6.2](#conservacion).

`[Pendiente: el propietario del proyecto debe decidir y documentar la política de
edad mínima de acceso, si establece alguna, y los mecanismos para hacerla cumplir.
Este texto no inventa una restricción que el proyecto no aplica.]`

---

<a id="salud"></a>
## 11. Aviso de salud y descargo de responsabilidad

FitCasa ofrece **recursos informativos** sobre ejercicio físico general, ergonomía
cotidiana y escoliosis. El contenido **no reemplaza el criterio médico, el
diagnóstico ni la rehabilitación clínica**, y no constituye una prescripción de
ejercicio.

En particular:

- La **propuesta del cuestionario es educativa y determinista**: se calcula con las
  respuestas que introduces y con la biblioteca incluida en el proyecto. Una
  etiqueta de la biblioteca **no equivale a autorización clínica individual**.
- El **dolor que registras es una percepción subjetiva**, no una medición
  diagnóstica.
- Ninguna rutina es universalmente adecuada para todas las personas.

**Consulta con tu médico o profesional sanitario antes de adoptar cualquier
programa**, especialmente si tienes condiciones de columna, intervención previa,
restricciones clínicas o molestias crónicas. Si notas dolor
persistente o creciente, o síntomas neurológicos como adormecimiento, pérdida de
fuerza o mareo, **detén la actividad y busca atención profesional**.

---

<a id="normativa"></a>
## 12. Marco normativo de referencia

Si el responsable del proyecto está establecido en Colombia, o le resulta aplicable
la legislación colombiana, el marco aplicable es, entre otros:

- **Ley 1581 de 2012** («Ley Estatutaria», del 17 de octubre de 2012, Diario Oficial
  48.587), por la cual se dictan disposiciones generales para la protección de
  datos personales. En el artículo 5 define como **datos sensibles** aquellos que se
  refieren a la sensibilidad de la persona, incluido su **estado de salud**.
- En el **artículo 2, literal a**, la ley excluye de su ámbito de aplicación «las
  bases de datos o archivos mantenidos en un ámbito exclusivamente personal o
  doméstico», aunque mantiene aplicables los principios de protección con los límites
  que la propia ley dispone.
- **Decreto 1074 de 2015**, que reglamenta parcialmente la Ley 1581 de 2012.
- La **Superintendencia de Industria y Comercio** como autoridad de control y
  titular del **Registro Nacional de Bases de Datos Personales**.

`[Pendiente: el propietario del proyecto debe confirmar con un profesional del
derecho (a) si su responsable está o queda sujeto a la legislación colombiana, (b)
la clasificación aplicable al almacenamiento local del navegador en su caso
concreto, y (c) si existe alguna obligación de registro o trámite que deba
cumplirse.]`

> **Aviso.** Este apartado es una referencia informativa y no constituye una
> certificación de cumplimiento legal. Publicar esta política **no acredita** que
> FitCasa cumpla la normativa aplicable.

---

<a id="contacto"></a>
## 13. Cómo contactar

Para cualquier cuestión sobre esta política o sobre el proyecto:

- **Correo:** `[Pendiente: correo de contacto del responsable]`
- **Código fuente:** <https://github.com/Felipe937/fitcasa>
- **Reporte de incidencias de privacidad en el código:** abre un *issue* en el
  repositorio anterior.

Para ejercer tus derechos sobre los datos que guardó FitCasa en tu navegador,
recuerda que el control efectivo es tuyo: revisa, edita y borra los datos desde la
propia aplicación o desde los ajustes de tu navegador, según el
[apartado 9](#derechos).

---

## Registro de cambios

| Fecha | Cambio |
| --- | --- |
| 15 de octubre de 2026 | Primera versión de la política de privacidad. |