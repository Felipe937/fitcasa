import React, { useCallback, useEffect, useState } from 'react';
import { PageRoute } from '../components/Header';

/** Fecha de actualización de la política. Debe coincidir con PRIVACY.md. */
const FECHA_ACTUALIZACION = '15 de octubre de 2026';

/** Datos oficiales del responsable del tratamiento. */
const RESPONSABLE_NOMBRE = 'Felipe Andres Vargas';
const RESPONSABLE_CORREO = 'spaceyisusshop@gmail.com';
const RESPONSABLE_PAIS = 'República de Colombia';

interface PrivacidadPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

interface Seccion {
  id: string;
  titulo: string;
}

const SECCIONES: Seccion[] = [
  { id: 'quien', titulo: '1. Quién responde por FitCasa' },
  { id: 'alcance', titulo: '2. Qué es FitCasa y qué no es' },
  { id: 'datos', titulo: '3. Qué información guarda FitCasa' },
  { id: 'almacenamiento', titulo: '4. Dónde y cómo se guarda' },
  { id: 'limitaciones', titulo: '5. Qué significa el almacenamiento local' },
  { id: 'conservacion', titulo: '6. Conservación y eliminación' },
  { id: 'terceros', titulo: '7. Cookies, analítica y terceros' },
  { id: 'alojamiento', titulo: '8. Proveedor de alojamiento y datos técnicos' },
  { id: 'derechos', titulo: '9. Tus derechos y controles (Ley 1581)' },
  { id: 'menores', titulo: '10. Consideraciones para menores de edad' },
  { id: 'salud', titulo: '11. Aviso de salud y descargo de responsabilidad' },
  { id: 'normativa', titulo: '12. Marco normativo de referencia' },
  { id: 'contacto', titulo: '13. Cómo contactar' },
];

/** Iconos decorativos: la información siempre está en el texto adyacente. */
const Icono = ({ pathos }: { pathos: string[] }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
    {pathos.map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

const ICONO_INFO = ['M12 3.6 2.6 20h18.8L12 3.6Z', 'M12 10v4.5', 'M12 17.6h.01'];
const ICONO_CALENDARIO = [
  'M5 5.5h14a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z',
  'M4 10h16',
  'M8 3.5v4',
  'M16 3.5v4',
];
const ICONO_ESCUDO = ['M12 3.2 5 6v6c0 4 3 7.4 7 8.8 4-1.4 7-4.8 7-8.8V6l-7-2.8Z', 'M9 12l2 2 4-4'];

export const PrivacidadPage: React.FC<PrivacidadPageProps> = ({ onNavigate }) => {
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  /**
   * Los enlaces internos no pueden usar href="#id" suelto: el enrutador por hash
   * interpretaría el ancla como una ruta desconocida y llevaría al inicio.
   */
  const irASeccion = useCallback((event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const destino = document.getElementById(id);
    if (!destino) return;
    destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    destino.focus();
  }, []);

  const volverAlInicio = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate('inicio', 'inicio');
  };

  /* Detecta la sección visible para resaltar el enlace activo del índice. */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let visibleId: string | null = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleId = entry.target.id;
          }
        });
        if (visibleId) setActiveSectionId(visibleId);
      },
      { rootMargin: '-80px 0% -70% 0%', threshold: 0.1 },
    );

    const ids = SECCIONES.map((s) => s.id);
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main id="contenido" tabIndex={-1} className="privacidad">
      {/* Cabecera editorial de transparencia */}
      <header className="privacidad__cabecera" aria-labelledby="privacidad-titulo">
        <span className="privacidad__chip">GOBERNANZA DE DATOS &amp; PRIVACIDAD</span>
        <h1 id="privacidad-titulo" className="privacidad__titulo">
          Política de Privacidad
        </h1>
        <p className="privacidad__intro">
          Privacidad por arquitectura: tus registros de bienestar pertenecen únicamente a
          este dispositivo. Esta página explica qué información guarda FitCasa, dónde la
          guarda y cómo puedes eliminarla.
        </p>
        <div className="privacidad__principios">
          <div className="privacidad__principio">
            <span className="privacidad__principio-numero">01</span>
            <span className="privacidad__principio-titulo">Almacenamiento 100% Local</span>
            <p className="privacidad__principio-texto">
              Sin cuentas, sin contraseñas, sin base de datos central.
            </p>
          </div>
          <div className="privacidad__principio">
            <span className="privacidad__principio-numero">02</span>
            <span className="privacidad__principio-titulo">Cero Rastreo Publicitario</span>
            <p className="privacidad__principio-texto">
              Sin Google Analytics, sin Meta Pixel, sin cookies comerciales.
            </p>
          </div>
          <div className="privacidad__principio">
            <span className="privacidad__principio-numero">03</span>
            <span className="privacidad__principio-titulo">Datos de Salud Facultativos</span>
            <p className="privacidad__principio-texto">
              Tú decides conscientemente si anotas tu percepción de dolor o solo tu actividad física.
            </p>
          </div>
        </div>
        <p className="privacidad__meta">
          <span className="privacidad__fecha">
            <Icono pathos={ICONO_CALENDARIO} />
            Última actualización: {FECHA_ACTUALIZACION}
          </span>
          <span>Versión completa en el repositorio: PRIVACY.md</span>
        </p>
      </header>

      <div className="container">
        {/* Índice de contenidos */}
        <nav className={`privacidad__indice ${tocOpen ? 'privacidad__indice--abierto' : ''}`} aria-labelledby="privacidad-indice-titulo">
          <div className="privacidad__indice__header">
            <h2 id="privacidad-indice-titulo">Índice de contenidos (13 apartados)</h2>
            <button
              type="button"
              id="privacidad-toc-toggle"
              className="privacidad__indice__toggle"
              aria-expanded={tocOpen}
              aria-controls="privacidad-indice-lista"
              onClick={() => setTocOpen(!tocOpen)}
            >
              {tocOpen ? 'Ocultar índice' : 'Mostrar índice'}
            </button>
          </div>
          <ol id="privacidad-indice-lista" className="privacidad__indice__lista">
            {SECCIONES.map((seccion) => (
              <li key={seccion.id}>
                <a
                  href={`#${seccion.id.replace(/^\d+\.\s*/, '')}`}
                  className={activeSectionId === seccion.id ? 'privacidad__indice__activo' : ''}
                  onClick={(e) => irASeccion(e, seccion.id.replace(/^\d+\.\s*/, ''))}
                >
                  {seccion.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* 1. Quién responde por FitCasa */}
        <section className="privacidad__seccion" aria-labelledby="sec-quien" id="quien" tabIndex={-1}>
          <h2 id="sec-quien">Quién responde por FitCasa</h2>
          <p>
            FitCasa es un proyecto educativo de código abierto sobre ejercicio físico general y ergonomía
            cotidiana. Quien lo publica y decide sobre su contenido es:
          </p>
          <ul>
            <li>
              <strong>Responsable del tratamiento:</strong> {RESPONSABLE_NOMBRE} (persona natural).
            </li>
            <li>
              <strong>Correo de contacto y ejercicio de derechos:</strong> {RESPONSABLE_CORREO}
            </li>
            <li>
              <strong>País y jurisdicción:</strong> {RESPONSABLE_PAIS}, bajo el ámbito de la
              Ley 1581 de 2012, Decreto 1074 de 2015 y vigilancia de la Superintendencia de
              Industria y Comercio (SIC).
            </li>
          </ul>
          <p>
            El código está en{' '}
            <a href="https://github.com/Felipe937/fitcasa" target="_blank" rel="noopener noreferrer">
              github.com/Felipe937/fitcasa
            </a>
            . El proyecto no registra cuentas de usuario ni implementa autenticación: nadie
            necesita crear un perfil para usar FitCasa.
          </p>
        </section>

        {/* 2. Qué es FitCasa y qué no es */}
        <section className="privacidad__seccion" aria-labelledby="sec-alcance" id="alcance" tabIndex={-1}>
          <h2 id="sec-alcance">Qué es FitCasa y qué no es</h2>
          <p>
            FitCasa ofrece material informativo: una biblioteca de ejercicios, un
            cuestionario que genera una propuesta educativa de actividad, una guía
            divulgativa sobre escoliosis y un panel de seguimiento personal.
          </p>
          <div className="privacidad__destacado privacidad__destacado--alerta">
            <p>
              <strong>FitCasa no es un servicio de salud.</strong> No diagnostica, no
              prescribe, no trata y no sustituye la valoración de un profesional sanitario.
              La propuesta del cuestionario se calcula en el navegador a partir de las
              respuestas que introduces y de la biblioteca de ejercicios incluida en el
              proyecto.
            </p>
            <p>
              Esta política cubre únicamente el tratamiento de datos que realiza{' '}
              <strong>la propia aplicación en tu navegador</strong>. Los datos técnicos
              que pueda tratar el proveedor de alojamiento se tratan en el apartado 8 y son
              una cosa distinta.
            </p>
          </div>
        </section>

        {/* 3. Qué información guarda FitCasa */}
        <section className="privacidad__seccion" aria-labelledby="sec-datos" id="datos" tabIndex={-1}>
          <h2 id="sec-datos">Qué información guarda FitCasa</h2>
          <p>
            FitCasa guarda en tu navegador <strong>solo lo que tú escribes o eliges</strong>.
            La aplicación no pide nombre, correo electrónico, teléfono, documento de
            identidad, dirección postal ni ubicación.
          </p>
          <p>El proyecto usa dos claves de almacenamiento local:</p>

          <h3>3.1 Cuestionario de sugerencias</h3>
          <p>
            Se guarda al generar una propuesta, bajo la clave{' '}
            <code className="privacidad__clave">fitcasa.quiz.v1</code>.
          </p>
          <table className="privacidad__datos">
            <caption>Contenido de la clave del cuestionario</caption>
            <thead className="privacidad__tope">
              <tr>
                <th scope="col">Dato</th>
                <th scope="col">Tipo</th>
                <th scope="col">Qué es</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" data-label="Dato">Objetivo de la actividad</th>
                <td data-label="Tipo">opción</td>
                <td data-label="Qué es">Movilidad, fuerza o bienestar</td>
              </tr>
              <tr>
                <th scope="row" data-label="Dato">Días por semana</th>
                <td data-label="Tipo">número</td>
                <td data-label="Qué es">Frecuencia elegida</td>
              </tr>
              <tr>
                <th scope="row" data-label="Dato">Tiempo por sesión</th>
                <td data-label="Tipo">opción</td>
                <td data-label="Qué es">Hasta 10, entre 10 y 20, o más de 20 minutos</td>
              </tr>
              <tr>
                <th scope="row" data-label="Dato">Nivel</th>
                <td data-label="Tipo">opción</td>
                <td data-label="Qué es">Principiante, intermedio o avanzado</td>
              </tr>
              <tr>
                <th scope="row" data-label="Dato">Equipamiento disponible</th>
                <td data-label="Tipo">lista de opciones</td>
                <td data-label="Qué es">Sin material, bandas, pesas o colchoneta</td>
              </tr>
              <tr>
                <th scope="row" data-label="Dato">Cirugía sin autorización</th>
                <td data-label="Tipo">sí / no</td>
                <td data-label="Qué es">
                  <strong>Pregunta de seguridad</strong>
                </td>
              </tr>
              <tr>
                <th scope="row" data-label="Dato">Restricción clínica</th>
                <td data-label="Tipo">sí / no</td>
                <td data-label="Qué es">
                  <strong>Pregunta de seguridad</strong>
                </td>
              </tr>
              <tr>
                <th scope="row" data-label="Dato">Síntomas preocupantes</th>
                <td data-label="Tipo">sí / no</td>
                <td data-label="Qué es">
                  <strong>Pregunta de seguridad</strong>
                </td>
              </tr>
              <tr>
                <th scope="row" data-label="Dato">Contexto de escoliosis</th>
                <td data-label="Tipo">opción</td>
                <td data-label="Qué es">Ninguna, leve o desconocido, moderada, severa, o no lo sé</td>
              </tr>
            </tbody>
          </table>
          <p>
            Las tres respuestas de seguridad y el contexto de escoliosis se usan para
            decidir si FitCasa propone una actividad o si, por prudencia, bloquea la
            propuesta y te remite a tu equipo sanitario. <strong>No se envían a ningún
            sitio</strong>: se leen y se aplican en tu navegador.
          </p>

          <h3>3.2 Panel de seguimiento</h3>
          <p>
            Guarda una lista de registros, bajo la clave{' '}
            <code className="privacidad__clave">fitcasa.panel.v1</code>.
          </p>
          <table className="privacidad__datos">
            <caption>Contenido de cada registro del panel</caption>
            <thead className="privacidad__tope">
              <tr>
                <th scope="col">Dato</th>
                <th scope="col">Tipo</th>
                <th scope="col">Qué es</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" data-label="Dato">Fecha</th>
                <td data-label="Tipo">texto <code>AAAA-MM-DD</code></td>
                <td data-label="Qué es">El día al que corresponde el registro</td>
              </tr>
              <tr>
                <th scope="row" data-label="Dato">Actividad realizada</th>
                <td data-label="Tipo">texto libre, hasta 120 caracteres</td>
                <td data-label="Qué es">La actividad que anotaste</td>
              </tr>
              <tr>
                <th scope="row" data-label="Dato">Dolor percibido</th>
                <td data-label="Tipo">entero de 0 a 10</td>
                <td data-label="Qué es">Tu percepción subjetiva del dolor</td>
              </tr>
              <tr>
                <th scope="row" data-label="Dato">Nota de bienestar</th>
                <td data-label="Tipo">texto libre, hasta 500 caracteres</td>
                <td data-label="Qué es">Tus sensaciones o notas</td>
              </tr>
              <tr>
                <th scope="row" data-label="Dato">Ejercicio vinculado</th>
                <td data-label="Tipo">identificador, opcional</td>
                <td data-label="Qué es">Referencia a un ejercicio de la biblioteca</td>
              </tr>
            </tbody>
          </table>
          <p>
            El dolor que anotas es una <strong>percepción subjetiva</strong>, no una
            medición diagnóstica.
          </p>
        </section>

        {/* 4. Dónde y cómo se guarda */}
        <section className="privacidad__seccion" aria-labelledby="sec-almacenamiento" id="almacenamiento" tabIndex={-1}>
          <h2 id="sec-almacenamiento">Dónde y cómo se guarda</h2>
          <p>
            Todo se guarda con la API de <strong>almacenamiento local del navegador</strong> (
            <code>localStorage</code>), bajo el origen desde el que abriste FitCasa.
            Cada clave guarda un objeto con una marca de versión (<code>version</code>)
            y los datos.
          </p>
          <ul>
            <li>
              Los datos <strong>nunca salen de tu dispositivo</strong>: el código de la
              aplicación no realiza ninguna petición de red para enviar lo que escribes.
            </li>
            <li>
              Los datos <strong>no se sincronizan</strong> entre navegador, dispositivo
              ni perfil.
            </li>
            <li>
              La aplicación funciona aunque el almacenamiento local esté deshabilitado.
              En ese caso te avisa en pantalla y todo funciona{' '}
              <strong>solo durante la sesión</strong>: al recargar, lo que escribiste se
              pierde.
            </li>
            <li>
              No hay copia de seguridad en ningún servidor. Si borras los datos del
              navegador o pierdes el dispositivo, no hay forma de recuperar lo que
              habías guardado.
            </li>
          </ul>
        </section>

        {/* 5. Qué significa realmente el almacenamiento local */}
        <section className="privacidad__seccion" aria-labelledby="sec-limitaciones" id="limitaciones" tabIndex={-1}>
          <h2 id="sec-limitaciones">Qué significa realmente el almacenamiento local</h2>
          <p>
            Conviene ser claro sobre lo que esta protección implica y lo que{' '}
            <strong>no</strong>:
          </p>
          <div className="privacidad__capsula privacidad__capsula--sensibles">
            <Icono pathos={ICONO_INFO} />
            <div>
              <h3 className="privacidad__capsula-titulo">Datos sensibles de salud (Ley 1581 de 2012)</h3>
              <p className="privacidad__capsula-texto">
                La Ley 1581 de 2012 clasifica como <strong>datos sensibles</strong> aquellos
                que se refieren al estado de salud de la persona. En FitCasa, el registro
                de tu percepción de dolor y tus notas de bienestar se consideran datos
                sensibles. Por eso su autorización es <strong>facultativa</strong>: puedes
                usar el cuestionario y el panel sin otorgarla, y en ese caso esos campos no
                se registran.
              </p>
            </div>
          </div>
          <div className="privacidad__capsula privacidad__capsula--almacenamiento">
            <Icono pathos={ICONO_ESCUDO} />
            <div>
              <h3 className="privacidad__capsula-titulo">El almacenamiento local no está cifrado</h3>
              <p className="privacidad__capsula-texto">
                El contenido se guarda como texto legible en el navegador. Cualquiera que
                tenga acceso al perfil del navegador o al dispositivo puede leerlo con las
                herramientas de desarrollo. En un ordenador compartido, dispositivo familiar
                o prestado, otra persona puede ver tus notas de bienestar. El modo privado
                (incógnito) usa un almacenamiento distinto y separado, y al cerrarse se
                borra.
              </p>
            </div>
          </div>
          <ul>
            <li>
              <strong>No está cifrado.</strong> El contenido se guarda como texto legible.
            </li>
            <li>
              <strong>Está atado al navegador y al origen.</strong> No se comparte ni se
              sincroniza entre navegadores ni entre equipos.
            </li>
            <li>
              <strong>Lo puede borrar el navegador sin avisar.</strong> Limpiar datos del
              sitio, usar modos con borrado automático o reinstalar el navegador puede
              eliminarlo.
            </li>
            <li>
              <strong>Tiene un límite de espacio</strong> (orden de unos pocos megabytes).
              Si se supera, el navegador rechaza la escritura y FitCasa te avisa de que los
              cambios no se guardaron.
            </li>
            <li>
              <strong>No hay control de acceso por usuario.</strong> El proyecto no
              implementa autenticación, así que el «usuario» del almacenamiento es el
              perfil del navegador, no tú.
            </li>
          </ul>
          <p>
            Por eso FitCasa pide entregar <strong>información no identificable</strong> en
            sus formularios y recuerda que el contenido no debe considerarse privado frente
            a otras personas que usen el mismo dispositivo.
          </p>
        </section>

        {/* 6. Conservación y eliminación de tus datos */}
        <section className="privacidad__seccion" aria-labelledby="sec-conservacion" id="conservacion" tabIndex={-1}>
          <h2 id="sec-conservacion">Conservación y eliminación de tus datos</h2>

          <h3>6.1 Plazo de conservación</h3>
          <p>
            <strong>No hay un plazo automático.</strong> FitCasa no programa borrados ni
            caducidades. Tus datos se conservan hasta que tú los elimines o hasta que el
            navegador los elimine por su cuenta (limpieza de datos, borrado del perfil o del
            dispositivo). En la práctica, permanecen el tiempo que quieras mantenerlos en
            tu dispositivo.
          </p>

          <h3>6.2 Cómo eliminarlos</h3>
          <p>FitCasa ofrece tres formas, todas locales e inmediatas:</p>
          <ul>
            <li>
              <strong>Borrar un registro concreto.</strong> En el panel de seguimiento,
              cada registro tiene su botón «Eliminar», que pide confirmación y lo quita de
              la lista.
            </li>
            <li>
              <strong>Borrar todo desde el panel de seguimiento.</strong> El botón «Borrar
              respuestas y registros guardados» pide una confirmación explícita en dos
              pasos y, al aceptarla, <strong>elimina las dos claves</strong>: los registros
              del panel y las respuestas del cuestionario.
            </li>
            <li>
              <strong>Borrar todo desde las sugerencias.</strong> El cuestionario tiene su
              propia opción de borrado general, que elimina igualmente las dos claves.
            </li>
          </ul>
          <p>
            <strong>No existe copia de los datos en ningún servidor</strong>, así que
            borrarlos aquí los elimina por completo. Si necesitas un borrado que no dependa
            de la aplicación, puedes borrar los datos del sitio desde los ajustes de tu
            navegador.
          </p>

          <h3>6.3 Exportación</h3>
          <div className="privacidad__destacado privacidad__destacado--alerta">
            <p>
              <strong>FitCasa no ofrece exportar tus datos.</strong> No hay ninguna
              función de descarga de archivos, copia de seguridad ni envío de tus registros
              por correo.
            </p>
            <p>
              Existe una función llamada «Exportar para consulta médica» en las sugerencias
              de actividad y un botón «Imprimir esta guía» en la guía de escoliosis, pero{' '}
              <strong>ninguno de los dos exporta tus datos</strong>: ambos abren el diálogo
              de impresión de tu navegador para que imprimas o guardes en PDF lo que ya está
              en pantalla. Lo que se imprime es el contenido de la página, no un archivo
              generado por FitCasa con tus registros.
            </p>
            <p>
              Tampoco hay forma de recuperar los registros del panel: si borras el
              almacenamiento local, desaparecen sin copia.
            </p>
          </div>
        </section>

        {/* 7. Cookies, analítica y servicios de terceros */}
        <section className="privacidad__seccion" aria-labelledby="sec-terceros" id="terceros" tabIndex={-1}>
          <h2 id="sec-terceros">Cookies, analítica y servicios de terceros</h2>

          <h3>7.1 Cookies</h3>
          <p>
            <strong>FitCasa no utiliza cookies.</strong> El código de la aplicación no
            escribe ni lee <code>document.cookie</code>, y el documento HTML del proyecto
            no declara ninguna. No hay cookies propias ni de terceros.
          </p>

          <h3>7.2 Analítica y publicidad</h3>
          <p>
            <strong>FitCasa no incorpora ninguna herramienta de analítica, publicidad ni
            seguimiento de comportamiento.</strong> No hay Google Analytics, Plausible,
            Umami, Matomo, Hotjar, Mixpanel, Segment ni Sentry, ni ningún servicio
            equivalente. Tampoco hay píxeles, mapas de calor ni etiquetas de terceros.
          </p>

          <h3>7.3 Servicios de terceros incrustados</h3>
          <p>
            <strong>No hay ni un solo script, estilo, imagen o tipografía de
            terceros.</strong> Todos los recursos que carga la página (código, hoja de
            estilos, icono) se sirven desde el mismo dominio que la aplicación.
          </p>

          <h3>7.4 Enlaces a sitios externos</h3>
          <p>
            La guía sobre escoliosis incluye enlaces a fuentes externas de referencia, y la
            biblioteca de ejercicios cita direcciones de evidencia parecidas.{' '}
            <strong>Estos enlaces solo se activan si tú pulsas</strong>, se abren en una
            pestaña nueva y se programan con <code>rel=&quot;noopener noreferrer&quot;</code>.
            Al pulsarlos sales del control de FitCasa y <strong>el sitio de destino aplica
            su propia política de privacidad</strong>. FitCasa no controla esos sitios y no
            recibe información de lo que hagas en ellos.
          </p>
        </section>

        {/* 8. Proveedor de alojamiento y datos técnicos */}
        <section className="privacidad__seccion" aria-labelledby="sec-alojamiento" id="alojamiento" tabIndex={-1}>
          <h2 id="sec-alojamiento">Proveedor de alojamiento y datos técnicos</h2>
          <p>
            La versión publicada de FitCasa se sirve desde un dominio{' '}
            <code>workers.dev</code> alojado por <strong>Cloudflare</strong>:{' '}
            <a href="https://fitcasa.fv143962.workers.dev" target="_blank" rel="noopener noreferrer">
              fitcasa.fv143962.workers.dev
            </a>
            .
          </p>
          <p>Es importante separar dos cosas:</p>
          <table className="privacidad__datos">
            <caption>Quién trata cada tipo de dato</caption>
            <thead className="privacidad__tope">
              <tr>
                <th scope="col">Tipo de dato</th>
                <th scope="col">Quién lo trata</th>
                <th scope="col">Qué incluye</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" data-label="Tipo de dato">Lo que escribes en la aplicación</th>
                <td data-label="Quién lo trata">Solo tu navegador</td>
                <td data-label="Qué es">
                  Respuestas del cuestionario y registros del panel. No se envían a nadie.
                </td>
              </tr>
              <tr>
                <th scope="row" data-label="Tipo de dato">Los datos técnicos de la visita</th>
                <td data-label="Quién lo trata">El proveedor de alojamiento</td>
                <td data-label="Qué es">
                  Dirección IP, agente del navegador, petición de recursos y registros
                  propios del servidor y de la red de Cloudflare.
                </td>
              </tr>
            </tbody>
          </table>
          <p>
            Los datos del primer grupo nunca salen de tu dispositivo. Los del segundo los
            trata Cloudflare <strong>como parte normal de servir una página web</strong>:
            aunque la aplicación no contenga analítica, un servidor web necesita registrar
            quién le pide cada archivo para entregarlo y proteger su infraestructura.
            FitCasa <strong>no recopila</strong> datos de tráfico; Cloudflare procesa
            metadatos transitorios de paquetes IP con fines de seguridad informática,
            mitigación de abusos y protección ante ataques DDoS, conforme a su propia
            política global.
          </p>
          <p>
            FitCasa <strong>no controla ni puede consultar</strong> esos registros
            técnicos. Si necesitas saber exactamente qué datos técnicos conserva el
            alojamiento, o ejercer control sobre ellos, consulta los términos y la política
            de privacidad de Cloudflare, que se aplican a la visita al sitio con
            independencia de esta política.
          </p>
        </section>

        {/* 9. Tus derechos y controles (Ley 1581) */}
        <section className="privacidad__seccion" aria-labelledby="sec-derechos" id="derechos" tabIndex={-1}>
          <h2 id="sec-derechos">Tus derechos y controles (Ley 1581 de 2012)</h2>
          <p>
            FitCasa no tiene un sistema de cuentas, así que la vía para ejercer tus
            derechos es directa sobre el almacenamiento local de tu navegador. Los plazos
            de atención siguen los artículos 14 y 15 de la Ley 1581 de 2012.
          </p>

          <h3>9.1 Lo que puedes hacer desde la aplicación</h3>
          <ul>
            <li>
              <strong>Consultar</strong> lo que has guardado: el cuestionario recupera tus
              respuestas cuando vuelves, y el panel muestra tus registros con los filtros
              de fecha y búsqueda.
            </li>
            <li>
              <strong>Rectificar o actualizar</strong> cualquier registro: puedes editar un
              registro del panel y corregir su fecha, actividad, dolor o nota.
            </li>
            <li>
              <strong>Suprimir</strong> tus datos: con las tres vías de borrado del
              apartado 6.2, o borrando los datos del sitio en tu navegador.
            </li>
          </ul>

          <h3>9.2 Plazos de atención (artículos 14 y 15, Ley 1581 de 2012)</h3>
          <table className="privacidad__datos">
            <caption>Plazos máximos de respuesta del Responsable</caption>
            <thead className="privacidad__tope">
              <tr>
                <th scope="col">Tipo de solicitud</th>
                <th scope="col">Plazo principal</th>
                <th scope="col">Plazo adicional si hay demora</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" data-label="Tipo de solicitud">Consulta</th>
                <td data-label="Plazo principal">Diez (10) días hábiles desde el recibo</td>
                <td data-label="Plazo adicional">Hasta cinco (5) días hábiles adicionales, informando los motivos</td>
              </tr>
              <tr>
                <th scope="row" data-label="Tipo de solicitud">Reclamo</th>
                <td data-label="Plazo principal">Quince (15) días hábiles desde el día siguiente al recibo</td>
                <td data-label="Plazo adicional">Hasta ocho (8) días hábiles adicionales, informando los motivos</td>
              </tr>
            </tbody>
          </table>
          <p>
            Si no es posible responder dentro del plazo principal, se te informará antes
            del vencimiento expresando los motivos de la demora y fijando una fecha de
            respuesta dentro del plazo adicional correspondiente.
          </p>
          <p>
            Solo podrás elevar una queja ante la Superintendencia de Industria y Comercio
            (SIC) una vez hayas agotado el trámite de consulta o reclamo ante el
            Responsable.
          </p>

          <h3>9.3 Lo que FitCasa no puede hacer</h3>
          <ul>
            <li>
              <strong>No puede</strong> entregarte una copia de tus datos en un archivo,
              porque no existe función de exportación (véase el apartado 6.3).
            </li>
            <li>
              <strong>No puede</strong> encontrar ni recuperar tus datos si borras el
              almacenamiento local, porque no existe copia en ningún servidor.
            </li>
            <li>
              <strong>No puede</strong> saber quién eres, porque no hay registro de
              usuarios.
            </li>
          </ul>

          <h3>9.4 Datos técnicos</h3>
          <p>
            Para cualquier cuestión relativa a los datos técnicos de la visita — dirección
            IP, registros del servidor —, dirígete al proveedor de alojamiento. FitCasa no
            es la entidad adecuada para responder por ellos.
          </p>
        </section>

        {/* 10. Consideraciones para menores de edad */}
        <section className="privacidad__seccion" aria-labelledby="sec-menores" id="menores" tabIndex={-1}>
          <h2 id="sec-menores">Consideraciones para menores de edad</h2>
          <div className="privacidad__capsula privacidad__capsula--nna">
            <Icono pathos={ICONO_ESCUDO} />
            <div>
              <h3 className="privacidad__capsula-titulo">Mayores de 18 años y supervisión parental</h3>
              <p className="privacidad__capsula-texto">
                FitCasa está concebida para mayores de edad (18 años). En caso de que un
                menor utilice los recursos de higiene postural, deberá hacerlo siempre bajo
                la supervisión directa y autorización de sus padres o representantes
                legales, respetando el interés superior del menor y sus derechos
                fundamentales.
              </p>
            </div>
          </div>
          <p>
            <strong>FitCasa no implementa ninguna verificación de edad.</strong> La
            aplicación es pública y puede abrirse sin registro ni comprobación. Un menor de
            edad que la use escribirá en su propio navegador respuestas de seguridad,
            contexto de escoliosis y, si usa el panel, sus notas de bienestar y dolor
            percibido.
          </p>
          <p>Recomendamos, sin que esto sustituya a una decisión del responsable:</p>
          <ul>
            <li>
              Que una persona adulta acompañe al menor y le explique el contenido antes de
              que anote dolor o las notas de bienestar.
            </li>
            <li>
              Que el menor use un perfil de navegador propio, o al menos que sepa que lo
              que escribe queda guardado en ese dispositivo y puede ser leído por quien use
              el mismo perfil.
            </li>
            <li>
              Que un adulto revise y borre los registros cuando deje de usar la aplicación,
              con la opción de borrado total del apartado 6.2.
            </li>
          </ul>
        </section>

        {/* 11. Aviso de salud y descargo de responsabilidad */}
        <section className="privacidad__seccion" aria-labelledby="sec-salud" id="salud" tabIndex={-1}>
          <h2 id="sec-salud">Aviso de salud y descargo de responsabilidad</h2>
          <div className="privacidad__aviso privacidad__aviso--legal" role="note">
            <Icono pathos={ICONO_ESCUDO} />
            <div>
              <p>
                FitCasa ofrece <strong>recursos informativos</strong> sobre ejercicio
                físico general, ergonomía cotidiana y escoliosis. El contenido{' '}
                <strong>
                  no reemplaza el criterio médico, el diagnóstico ni la rehabilitación
                  clínica
                </strong>
                , y no constituye una prescripción de ejercicio.
              </p>
            </div>
          </div>
          <ul>
            <li>
              La <strong>propuesta del cuestionario es educativa y determinista</strong>:
              se calcula con las respuestas que introduces y con la biblioteca incluida en
              el proyecto. Una etiqueta de la biblioteca{' '}
              <strong>no equivale a autorización clínica individual</strong>.
            </li>
            <li>
              El <strong>dolor que registras es una percepción subjetiva</strong>, no una
              medición diagnóstica.
            </li>
            <li>Ninguna rutina es universalmente adecuada para todas las personas.</li>
          </ul>
          <p>
            <strong>
              Consulta con tu médico o profesional sanitario antes de adoptar cualquier
              programa
            </strong>
            , especialmente si tienes condiciones de columna, intervención previa,
            restricciones clínicas o molestias crónicas. Si notas dolor persistente o
            creciente, o síntomas neurológicos como adormecimiento, pérdida de fuerza o
            mareo, <strong>detén la actividad y busca atención profesional</strong>.
          </p>
        </section>

        {/* 12. Marco normativo de referencia */}
        <section className="privacidad__seccion" aria-labelledby="sec-normativa" id="normativa" tabIndex={-1}>
          <h2 id="sec-normativa">Marco normativo de referencia</h2>
          <p>
            El responsable del tratamiento está establecido en Colombia, por lo que el marco
            aplicable es, entre otros:
          </p>
          <ul>
            <li>
              <strong>Ley 1581 de 2012</strong> («Ley Estatutaria», del 17 de octubre de
              2012, Diario Oficial 48.587), por la cual se dictan disposiciones generales
              para la protección de datos personales. En el artículo 5 define como
              <strong>datos sensibles</strong> aquellos que se refieren a la sensibilidad
              de la persona, incluido su <strong>estado de salud</strong>.
            </li>
            <li>
              En el <strong>artículo 2, literal a</strong>, la ley excluye de su ámbito de
              aplicación «las bases de datos o archivos mantenidos en un ámbito
              exclusivamente personal o doméstico», aunque mantiene aplicables los
              principios de protección con los límites que la propia ley dispone.
            </li>
            <li>
              <strong>Decreto 1074 de 2015</strong>, que reglamenta parcialmente la Ley
              1581 de 2012.
            </li>
            <li>
              La <strong>Superintendencia de Industria y Comercio</strong> como autoridad
              de control y titular del <strong>Registro Nacional de Bases de Datos
              Personales</strong>.
            </li>
          </ul>
          <div className="privacidad__aviso privacidad__aviso--legal" role="note">
            <Icono pathos={ICONO_INFO} />
            <div>
              <p>
                <strong>Aviso.</strong> Este apartado es una referencia informativa y no
                constituye una certificación de cumplimiento legal. Publicar esta política
                <strong>no acredita</strong> que FitCasa cumpla la normativa aplicable.
              </p>
            </div>
          </div>
        </section>

        {/* 13. Cómo contactar */}
        <section className="privacidad__seccion" aria-labelledby="sec-contacto" id="contacto" tabIndex={-1}>
          <h2 id="sec-contacto">Cómo contactar</h2>
          <p>Para cualquier cuestión sobre esta política o sobre el proyecto:</p>
          <ul>
            <li>
              <strong>Correo electrónico:</strong>{' '}
              <a href={`mailto:${RESPONSABLE_CORREO}?subject=FitCasa%20-%20Consulta%20o%20Reclamo%20Ley%201581`}>
                {RESPONSABLE_CORREO}
              </a>
            </li>
            <li>
              <strong>Asunto sugerido:</strong> «FitCasa – Consulta o Reclamo Ley 1581»
            </li>
            <li>
              <strong>Código fuente:</strong>{' '}
              <a href="https://github.com/Felipe937/fitcasa" target="_blank" rel="noopener noreferrer">
                github.com/Felipe937/fitcasa
              </a>
            </li>
            <li>
              <strong>Reporte de incidencias de privacidad en el código:</strong> abre un{' '}
              <em>issue</em> en el repositorio anterior.
            </li>
          </ul>
          <p>
            Para ejercer tus derechos sobre los datos que guardó FitCasa en tu navegador,
            recuerda que el control efectivo es tuyo: revisa, edita y borra los datos desde
            la propia aplicación o desde los ajustes de tu navegador, según el apartado 9.
          </p>
          <div className="privacidad__cierre">
            <a href="#inicio" className="btn privacidad__volver" onClick={volverAlInicio}>
              Volver al inicio
            </a>
            <p className="privacidad__cambios">
              Registro de cambios: 15 de octubre de 2026 — primera versión de la política
              de privacidad.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PrivacidadPage;
