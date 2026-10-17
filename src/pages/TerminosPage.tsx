import React, { useCallback } from 'react';
import { PageRoute } from '../components/Header';

/** Fecha de actualización. Debe coincidir con TERMINOS.md. */
const FECHA_ACTUALIZACION = '16 de octubre de 2026';
const JURISDICCION = 'República de Colombia';

interface TerminosPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

interface Clausula {
  id: string;
  titulo: string;
}

const CLAUSULAS: Clausula[] = [
  { id: 'aceptacion', titulo: 'Aceptación de los Términos' },
  { id: 'naturaleza', titulo: 'Naturaleza del Servicio y Exención de Responsabilidad Médica' },
  { id: 'datos', titulo: 'Tratamiento de Datos Sensibles de Salud' },
  { id: 'menores', titulo: 'Protección de Menores de Edad' },
  { id: 'propiedad', titulo: 'Propiedad Intelectual y Licenciamiento' },
  { id: 'ley', titulo: 'Limitación de Responsabilidad y Ley Aplicable' },
  { id: 'contacto', titulo: 'Canal de Contacto y Repositorio Oficial' },
];

const ICONO_INFO = ['M12 3.6 2.6 20h18.8L12 3.6Z', 'M12 10v4.5', 'M12 17.6h.01'];
const ICONO_CALENDARIO = [
  'M5 5.5h14a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z',
  'M4 10h16',
  'M8 3.5v4',
  'M16 3.5v4',
];
const ICONO_GLOBO = [
  'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z',
  'M3.5 12h17',
  'M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z',
];
const ICONO_DOC = [
  'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z',
  'M14 3v5h5',
  'M9 13h6',
  'M9 17h4',
];
const ICONO_LAPIZ = ['M4 20h4l10-10-4-4L4 16v4Z', 'M14 6l4 4'];
const ICONO_ESCUDO = ['M12 3.2 5 6v6c0 4 3 7.4 7 8.8 4-1.4 7-4.8 7-8.8V6l-7-2.8Z', 'M9 12l2 2 4-4'];

const Icono = ({ pathos }: { pathos: string[] }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
    {pathos.map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

const Pendiente = ({ children }: { children: React.ReactNode }) => (
  <div className="terminos__pendiente">
    <Icono pathos={ICONO_LAPIZ} />
    <p>
      <strong>Pendiente de completar por el propietario:</strong> {children}
    </p>
  </div>
);

export const TerminosPage: React.FC<TerminosPageProps> = ({ onNavigate }) => {
  /**
   * Los enlaces internos no pueden usar href="#id" suelto: el enrutador por hash
   * interpretaría el ancla como ruta desconocida y llevaría al inicio.
   */
  const irAClausula = useCallback((event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
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

  const irAPrivacidad = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate('privacidad');
  };

  return (
    <main id="contenido" tabIndex={-1} className="terminos">
      <section className="terminos__cabecera" aria-labelledby="terminos-titulo">
        <p className="eyebrow">Aviso legal</p>
        <h1 id="terminos-titulo" className="terminos__titulo">
          Términos y Condiciones de Uso
        </h1>
        <p className="terminos__intro">
          Las condiciones que rigen el uso de FitCasa, un recurso educativo sobre
          ejercicio físico general, ergonomía cotidiana y escoliosis. Léelas antes de
          usar la plataforma: hacen parte de la decisión de hacerlo.
        </p>
        <p className="terminos__meta">
          <span className="terminos__insignia">
            <Icono pathos={ICONO_CALENDARIO} />
            Última actualización: {FECHA_ACTUALIZACION}
          </span>
          <span className="terminos__insignia">
            <Icono pathos={ICONO_GLOBO} />
            Jurisdicción: {JURISDICCION}
          </span>
        </p>
      </section>

      <div className="container">
        <section className="terminos__aviso terminos__aviso--grave" role="note">
          <Icono pathos={ICONO_INFO} />
          <div>
            <p>
              <strong>FitCasa no es un servicio de salud.</strong> No diagnostica, no
              prescribe y no reemplaza la valoración de un profesional sanitario.{' '}
              <strong>No constituye asesoría jurídica ni una certificación de
              cumplimiento normativo.</strong> Las referencias legales son
              informativas y las determinaciones marcadas como{' '}
              <code>[Pendiente: …]</code> deben confirmarse antes de publicar este
              documento como definitivo.
            </p>
          </div>
        </section>

        <nav className="terminos__indice" aria-labelledby="terminos-indice-titulo">
          <h2 id="terminos-indice-titulo">Cláusulas</h2>
          <ol>
            {CLAUSULAS.map((clausula) => (
              <li key={clausula.id}>
                <a href={`#${clausula.id}`} onClick={(e) => irAClausula(e, clausula.id)}>
                  {clausula.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article aria-labelledby="terminos-titulo">
          <section
            className="terminos__clausula"
            aria-labelledby="clausula-aceptacion"
            id="aceptacion"
            tabIndex={-1}
          >
            <h2 id="clausula-aceptacion">1. Aceptación de los Términos</h2>
            <p>
              Estos Términos y Condiciones (<strong>«los Términos»</strong>) regulan el
              acceso y uso del sitio web FitCasa (<strong>«la Plataforma»</strong>), un
              recurso educativo sobre ejercicio físico general, ergonomía cotidiana y
              escoliosis.
            </p>
            <p>
              <strong>
                La navegación, lectura o cualquier interacción con la Plataforma
                constituye aceptación expresa de estos Términos
              </strong>
              , sin necesidad de un clic de confirmación, a los efectos del artículo 1 de la
              Ley 1480 de 2011 respecto de la información al consumidor.
            </p>
            <p>
              Si <strong>no está de acuerdo</strong> con alguno de estos Términos, debe
              dejar de usar la Plataforma. Su uso implica que ha leído, comprendido y
              aceptado la totalidad de las cláusulas, incluidas la <strong>exención de
              responsabilidad médica</strong> de la cláusula 2 y las{' '}
              <strong>limitaciones de responsabilidad</strong> de la cláusula 6.
            </p>
            <p>
              Estos Términos se aplican únicamente a la Plataforma. El uso de sitios de
              terceros enlazados desde ella se rige por los términos y la política de
              privacidad de esos sitios, sobre los cuales FitCasa no tiene control.
            </p>
            <p>
              FitCasa puede modificar estos Términos. La versión vigente es siempre la
              que está publicada en esta página y en el archivo{' '}
              <code>TERMINOS.md</code> del repositorio.
            </p>
            <Pendiente>
              indicar el medio de notificación de cambios que el propietario considera
              suficiente y la fecha de entrada en vigencia de cada modificación.
            </Pendiente>
          </section>

          <section
            className="terminos__clausula"
            aria-labelledby="clausula-naturaleza"
            id="naturaleza"
            tabIndex={-1}
          >
            <h2 id="clausula-naturaleza">
              2. Naturaleza del Servicio y Exención de Responsabilidad Médica
            </h2>

            <h3>2.1. Naturaleza educativa e informativa</h3>
            <p>
              <strong>FitCasa es un recurso educativo e informativo.</strong> La
              Plataforma ofrece una biblioteca de ejercicios, un cuestionario que
              genera una propuesta educativa determinista calculada en el navegador,
              una guía divulgativa sobre escoliosis y un panel de seguimiento personal.
            </p>
            <div className="terminos__destacado">
              <p>
                <strong>FitCasa no es un servicio de salud.</strong> La Plataforma{' '}
                <strong>no constituye</strong>: consulta médica ni atención en salud,
                prescripción o formulación de planes de ejercicio, diagnóstico,
                pronóstico, tratamiento o rehabilitación clínica, ni ejercicio
                profesional de la fisioterapia o de cualquier otra profesión regulada.
              </p>
              <p>
                Una etiqueta o categoría en la biblioteca de ejercicios{' '}
                <strong>no equivale a autorización clínica individual</strong> para
                ninguna persona.
              </p>
            </div>

            <h3>2.2. Ley 528 de 1999: la fisioterapia es profesión regulada</h3>
            <p>
              <span className="terminos__norma">Ley 528 de 1999</span> (Diario Oficial
              43.711 del 20 de septiembre de 1999) reglamenta{' '}
              <strong>el ejercicio de la profesión de fisioterapia</strong> y dicta
              normas de ética profesional. Su artículo 1 enuncia que las actividades
              inherentes a ese ejercicio profesional se fundamentan en principios
              científicos sobre el movimiento corporal humano y que el deber de atender
              a las personas no comporta el compromiso de garantizar resultados
              exitosos.
            </p>
            <p>
              FitCasa <strong>no es un proveedor de fisioterapia</strong>. El uso de la
              Plataforma <strong>no constituye ni sustituye</strong> una intervención
              profesional de fisioterapia y no genera relación alguna de médico-paciente,
              fisioterapeuta-paciente o prestador de salud-usuario.
            </p>
            <Pendiente>
              confirmar con un abogado si la publicación de material sobre
              autoejercicio en el contexto colombiano requiere habilitación sanitaria,
              registro ante la Secretaría de Salud o alguna autorización equivalente.
            </Pendiente>

            <h3>2.3. Ejecución autónoma: responsabilidad del usuario</h3>
            <p>
              <strong>
                La decisión de realizar cualquier ejercicio, y su ejecución, es
                responsabilidad exclusiva de la persona que lo realiza
              </strong>
              . FitCasa no dirige, supervisa ni controla la práctica.
            </p>
            <p>Antes de empezar, cada persona usuaria debe evaluar por su cuenta:</p>
            <ul>
              <li>Si la actividad es apropiada para su estado de salud y sus antecedentes.</li>
              <li>Si existe contraindicación o restricción para su caso particular.</li>
              <li>Las condiciones del espacio donde realizará la actividad.</li>
            </ul>
            <p>
              <strong>Debe suspender inmediatamente la actividad</strong> ante dolor
              intenso o creciente, palpitaciones, mareo, desvanecimiento o cualquier
              síntoma anormal, y ante síntomas neurológicos como adormecimiento,
              pérdida de fuerza o pérdida de sensibilidad. Ante síntomas graves o
              repentinos debe buscar atención urgente.
            </p>
            <p>
              FitCasa <strong>no responde</strong> por lesiones, daños o
              empeoramientos de salud derivados de la práctica de actividad física
              basada en el contenido de la Plataforma. El uso del contenido es por
              cuenta y riesgo de quien lo utiliza.
            </p>
          </section>

          <section
            className="terminos__clausula"
            aria-labelledby="clausula-datos"
            id="datos"
            tabIndex={-1}
          >
            <h2 id="clausula-datos">3. Tratamiento de Datos Sensibles de Salud</h2>

            <div className="terminos__aviso" role="note">
              <Icono pathos={ICONO_DOC} />
              <div>
                <p>
                  <strong>Alcance normativo.</strong> La información del panel es{' '}
                  <strong>sensible por su contenido</strong>, pero la{' '}
                  <strong>Ley 1581 de 2012 contiene una exclusión expresa que
                  probablemente alcanza a este caso</strong>. Este texto recoge ambas
                  realidades en lugar de simplificar una u otra.
                </p>
              </div>
            </div>

            <h3>3.1. Clasificación de la información por su contenido</h3>
            <p>
              El <strong>artículo 5 de la Ley 1581 de 2012</strong> define como{' '}
              <strong>datos sensibles</strong> aquellos que se refieren a la
              sensibilidad de la persona, entre ellos{' '}
              <em>«los datos que recaigan sobre su estado de salud»</em>. Por su
              contenido, la información del Panel de Seguimiento es de esa naturaleza:
            </p>
            <ul>
              <li>
                <strong>Dolor percibido</strong> (escala 0 a 10): referencia a estado de
                salud.
              </li>
              <li>
                <strong>Nota de bienestar</strong>: referencia a estado de salud.
              </li>
              <li>
                <strong>Actividad realizada</strong>: hábito y condición física.
              </li>
              <li>
                <strong>Respuestas de seguridad del cuestionario</strong>: referencia a
                restricciones clínicas.
              </li>
              <li>
                <strong>Contexto de escoliosis</strong>: referencia a condición de salud.
              </li>
            </ul>
            <p>
              <strong>El dolor registrado es una percepción subjetiva y no una medición
              diagnóstica.</strong>
            </p>

            <h3>3.2. La exclusión del ámbito personal o doméstico</h3>
            <p>
              El <strong>artículo 2, literal a, de la Ley 1581 de 2012</strong>{' '}
              establece que el régimen de protección de datos personales{' '}
              <em>«no será de aplicación a las bases de datos o archivos mantenidos en un
              ámbito exclusivamente personal o doméstico»</em>.
            </p>
            <p>
              El <strong>artículo 2 del Decreto 1377 de 2013</strong>, que
              reglamenta parcialmente esa ley, <strong>reitera la exclusión</strong> de
              las bases de datos mantenidas en un ámbito exclusivamente personal o
              doméstico.
            </p>
            <p>
              El almacenamiento de la Plataforma es{' '}
              <strong>local, único y exclusivo en el navegador del propio usuario</strong>,
              sin base de datos compartida, sin servidor de backend y sin transferencia a
              los autores del proyecto. En esa medida, y conforme a la determinación
              que el propietario realice con asesoría jurídica, estos datos se encuentran{' '}
              <strong>prescindidos del ámbito de aplicación</strong> de la Ley 1581 de
              2012 y del Decreto 1377 de 2013.
            </p>
            <Pendiente>
              el propietario debe confirmar con un profesional del derecho (a) si el
              almacenamiento en <code>localStorage</code> de FitCasa se considera
              efectivamente un «ámbito exclusivamente personal o doméstico» a los fines
              del artículo 2 literal a de la Ley 1581 de 2012, (b) si la clasificación
              de estos datos como sensibles obliga a la aplicación de los artículos 6 y
              siguientes de esa ley, y (c) si existe algún deber de registro o trámite
              ante la Superintendencia de Industria y Comercio.
            </Pendiente>

            <h3>3.3. Arquitectura local-first: lo que no ocurre</h3>
            <div className="terminos__destacado">
              <p>
                FitCasa <strong>no tiene servidor de backend</strong> que reciba datos:
                la aplicación no realiza peticiones de red para transmitir lo que el
                usuario escribe.
              </p>
              <p>
                FitCasa <strong>no incorpora telemetría, analítica, publicidad ni
                scripts de terceros</strong>: ni Google Analytics, Plausible, Umami,
                Matomo, Hotjar, Mixpanel, Segment, Sentry ni servicios equivalentes.
              </p>
              <p>
                FitCasa <strong>no traslada ningún dato a los autores del proyecto</strong>.
                Quien mantiene FitCasa no tiene acceso a lo que el usuario registra.
              </p>
            </div>
            <p>
              La única excepción, ajena al control de la aplicación, es que el{' '}
              <strong>proveedor de alojamiento</strong> trata datos técnicos propios de
              servir una página web. Esos datos técnicos{' '}
              <strong>no contienen la información del panel</strong> y se rigen por el
              apartado 8 de la{' '}
              <a href="#privacidad" onClick={irAPrivacidad}>
                Política de Privacidad
              </a>
              .
            </p>

            <h3>3.4. Derechos de habeas data: cómo ejercerlos</h3>
            <p>
              Los <strong>artículos 15 a 18 de la Ley 1581 de 2012</strong> reconocen
              al titular los derechos a conocer, actualizar, rectificar, suprimir y
              revocar. Con independencia de su aplicabilidad formal al caso local,{' '}
              <strong>FitCasa permite ejercerlos de forma inmediata y autónoma</strong>,
              porque los datos están en el propio dispositivo:
            </p>
            <ul>
              <li>
                <strong>Conocer:</strong> el Panel de Seguimiento muestra la información
                guardada.
              </li>
              <li>
                <strong>Actualizar y rectificar:</strong> cualquier registro se edita
                (fecha, actividad, dolor y nota).
              </li>
              <li>
                <strong>Suprimir:</strong> botón «Eliminar» por registro, o borrado
                general en dos pasos que elimina las dos claves de almacenamiento.
              </li>
              <li>
                <strong>Revocar:</strong> borrando los datos del sitio en los ajustes del
                navegador.
              </li>
            </ul>
            <p>
              <strong>No hay copia de los datos en ningún servidor</strong> y{' '}
              <strong>no existe función de exportación</strong>. Lo que se denomina
              «Exportar para consulta médica» abre el diálogo de impresión del
              navegador; no genera un archivo con los datos.
            </p>
            <Pendiente>
              si el propietario considera que un titular debe poder obtener copia
              portable de sus datos, debe implementar una función de exportación real,
              hoy inexistente, antes de afirmar lo contrario.
            </Pendiente>
          </section>

          <section
            className="terminos__clausula"
            aria-labelledby="clausula-menores"
            id="menores"
            tabIndex={-1}
          >
            <h2 id="clausula-menores">4. Protección de Menores de Edad</h2>
            <div className="terminos__aviso" role="note">
              <Icono pathos={ICONO_INFO} />
              <div>
                <p>
                  <strong>La Plataforma no implementa ninguna verificación de edad.</strong>{' '}
                  Este apartado describe recomendaciones y el marco aplicable; no
                  establece una restricción que el producto no aplica.
                </p>
              </div>
            </div>

            <h3>4.1. Marco aplicable</h3>
            <p>
              <span className="terminos__norma">Ley 1098 de 2006</span> (Diario Oficial
              46.446 del 8 de noviembre de 2006) expide el{' '}
              <strong>Código de la Infancia y la Adolescencia</strong>. Su artículo 1
              fija como finalidad garantizar el pleno y armonioso desarrollo de los
              niños, niñas y adolescentes, y el artículo 2 establece que su objeto es
              garantizar el ejercicio de sus derechos y libertades.
            </p>
            <p>
              El artículo 1 de la <span className="terminos__norma">Ley 1480 de 2011</span>{' '}
              incluye, entre los principios del Estatuto del Consumidor,{' '}
              <strong>
                la protección especial de los niños, niñas y adolescentes en su
                calidad de consumidores
              </strong>
              . El <span className="terminos__norma">Decreto 1377 de 2013</span>{' '}
              contempla obligaciones específicas para los encargados del tratamiento de
              datos personales de menores de edad.
            </p>

            <h3>4.2. Consentimiento y supervisión adulta</h3>
            <div className="terminos__destacado">
              <p>
                <strong>
                  Los menores de edad no pueden consentir por sí mismos el tratamiento
                  de sus datos personales sensibles
                </strong>
                , ni asumir por su cuenta el uso de esta Plataforma. El tratamiento de
                datos sensibles de menores debe efectuarse con la{' '}
                <strong>autorización del representante legal</strong> y en el mejor
                interés del menor.
              </p>
            </div>
            <p>Recomendaciones para el uso de la Plataforma por personas menores de edad:</p>
            <ul>
              <li>
                Debe intervenir un <strong>padre, madre, representante legal o adulto
                responsable</strong>, que lea estos Términos con el menor y acepte de
                forma explícita el uso.
              </li>
              <li>
                Debe existir <strong>supervisión adulta durante toda la práctica</strong> de
                actividad física.
              </li>
              <li>
                Un menor de edad{' '}
                <strong>
                  no debe registrar dolor percibido, notas de bienestar ni contexto de
                  escoliosis
                </strong>{' '}
                sin acompañamiento y autorización de su representante.
              </li>
              <li>
                Debe usarse un <strong>perfil de navegador propio del menor</strong>, bajo
                supervisión del adulto responsable.
              </li>
            </ul>
            <p>
              FitCasa <strong>no tiene conocimiento de la edad de quienes lo usan</strong>,
              porque no recoge datos identificativos ni implementa cuentas. La
              responsabilidad de verificar la edad y obtener la autorización recae
              íntegramente en quien supervisa el uso.
            </p>
            <Pendiente>
              el propietario debe decidir la edad mínima de acceso, si establece alguna,
              y el mecanismo para hacerla cumplir. Este documento no inventa una
              restricción que la aplicación todavía no aplica.
            </Pendiente>
          </section>

          <section
            className="terminos__clausula"
            aria-labelledby="clausula-propiedad"
            id="propiedad"
            tabIndex={-1}
          >
            <h2 id="clausula-propiedad">5. Propiedad Intelectual y Licenciamiento</h2>
            <div className="terminos__aviso terminos__aviso--grave" role="note">
              <Icono pathos={ICONO_ESCUDO} />
              <div>
                <p>
                  <strong>Hallazgo crítico.</strong> El repositorio{' '}
                  <strong>no contiene ningún archivo <code>LICENSE</code></strong> ni
                  declara licencia alguna en <code>package.json</code>. Sin licencia
                  declarada, aplica la protección por defecto del derecho de autor y{' '}
                  <strong>nadie está legalmente facultado para copiar, modificar,
                  distribuir ni reutilizar el código</strong>. Este apartado{' '}
                  <strong>no</strong> afirma que exista una licencia abierta.
                </p>
              </div>
            </div>
            <p>
              El código de la Plataforma se encuentra en{' '}
              <a
                href="https://github.com/Felipe937/fitcasa"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/Felipe937/fitcasa
              </a>
              . A la fecha de esta actualización:{' '}
              <code>[Pendiente: licencia con la que el propietario decide publicar el código]</code>.
            </p>
            <p>
              Si el propietario opta por publicar el repositorio bajo una licencia
              abierta —por ejemplo MIT, GPL o Creative Commons— deberá añadir el archivo{' '}
              <code>LICENSE</code> en la raíz, declararla en{' '}
              <code>package.json</code> y verificar que sea compatible con las fuentes de
              datos y contenidos que incorpora.
            </p>
            <p>
              <strong>
                Contenido pedagógico e identidad gráfica
              </strong>
              : la biblioteca de ejercicios, las descripciones, la guía sobre escoliosis,
              el nombre «FitCasa» y su identidad visual —logotipo, paleta, tipografía y
              diseño de interfaz— pertenecen a su titular y{' '}
              <strong>no quedan cubiertos por la licencia del código</strong> mientras no
              se indique expresamente lo contrario.
            </p>
            <Pendiente>
              si el propietario desea aceptar contribuciones de terceros, debe declarar
              el procedimiento de contribución y la licencia bajo la que se reciben.
            </Pendiente>
          </section>

          <section
            className="terminos__clausula"
            aria-labelledby="clausula-ley"
            id="ley"
            tabIndex={-1}
          >
            <h2 id="clausula-ley">6. Limitación de Responsabilidad y Ley Aplicable</h2>

            <h3>6.1. Ley aplicable y jurisdicción</h3>
            <p>
              Estos Términos se rigen por las{' '}
              <strong>leyes de la República de Colombia</strong>. Las partes, en la
              medida en que exista relación susceptible de jurisdicción, someten la
              resolución de controversias a la{' '}
              <strong>jurisdicción ordinaria civil</strong> de la República de Colombia.
            </p>
            <Pendiente>
              domicilio o circunscripción judicial del responsable.
            </Pendiente>

            <h3>6.2. Estatuto del Consumidor</h3>
            <p>
              <span className="terminos__norma">Ley 1480 de 2011</span> (Diario Oficial
              48.220 del 12 de octubre de 2011, en vigor desde el 12 de abril de 2012)
              expide el Estatuto del Consumidor. Su artículo 1 enuncia, entre sus
              principios, la protección de los consumidores frente a los riesgos para su
              salud y seguridad, el acceso a información adecuada y la educación del
              consumidor.
            </p>
            <div className="terminos__destacado">
              <p>
                El <strong>artículo 29</strong> de esa ley establece que{' '}
                <em>
                  «las condiciones objetivas y específicas anunciadas en la publicidad
                  obligan al anunciante»
                </em>
                . En consecuencia, los avisos y descargos publicados en la Plataforma{' '}
                <strong>vinculan a FitCasa</strong> y no pueden contradecirse con el
                comportamiento del producto.
              </p>
            </div>
            <Pendiente>
              confirmar si FitCasa, por ser un recurso gratuito sin contraprestación,
              reviste la condición de proveedor o consumidor a los efectos de la Ley
              1480 de 2011, y qué obligaciones se derivan de ello.
            </Pendiente>

            <h3>6.3. Limitación de responsabilidad</h3>
            <p>
              Salvo los casos de responsabilidad que no puedan exonerarse por ley,
              FitCasa <strong>no responde</strong> por:
            </p>
            <ul>
              <li>
                Lesiones, daños o empeoramiento de salud derivados de la práctica de
                actividad física basada en el contenido de la Plataforma.
              </li>
              <li>
                Decisiones tomadas sobre la propia salud, ni por la omisión de consultar a
                un profesional sanitario.
              </li>
              <li>
                Pérdida de datos por cualquier causa, incluidos la limpieza del navegador,
                el modo privado, el agotamiento de espacio o la pérdida del dispositivo.
              </li>
              <li>Accesos no autorizados a un dispositivo compartido.</li>
            </ul>
            <p>
              FitCasa <strong>presta la Plataforma «tal como está»</strong>, sin
              garantía de que esté libre de errores, funcione sin interrupciones o que
              el contenido esté actualizado en todo momento.
            </p>
            <Pendiente>
              si el propietario ofrece garantías o soporte de algún tipo, debe
              precisarlo aquí.
            </Pendiente>
          </section>

          <section
            className="terminos__clausula"
            aria-labelledby="clausula-contacto"
            id="contacto"
            tabIndex={-1}
          >
            <h2 id="clausula-contacto">7. Canal de Contacto y Repositorio Oficial</h2>
            <p>
              <strong>Repositorio oficial:</strong>{' '}
              <a
                href="https://github.com/Felipe937/fitcasa"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/Felipe937/fitcasa
              </a>
              . Es la única fuente autorizada de FitCasa y la referencia de esta versión
              de los Términos.
            </p>
            <ul>
              <li>
                <strong>Responsable del proyecto:</strong>{' '}
                <code>[Pendiente: nombre o razón social del responsable del tratamiento]</code>
              </li>
              <li>
                <strong>Correo de contacto:</strong>{' '}
                <code>[Pendiente: correo de contacto del responsable]</code>
              </li>
              <li>
                <strong>Jurisdicción / domicilio:</strong>{' '}
                <code>[Pendiente: país y domicilio del responsable]</code>
              </li>
            </ul>
            <p>
              Para reportar un problema técnico, una vulneración o una inquietud sobre
              estos Términos, escriba a la dirección anterior o abra un <em>issue</em>{' '}
              en el repositorio. Para consultas sobre datos personales, consulte la{' '}
              <a href="#privacidad" onClick={irAPrivacidad}>
                Política de Privacidad
              </a>
              , que forma parte de estos Términos.
            </p>

            <div className="terminos__cierre">
              <a href="#inicio" className="btn terminos__accion" onClick={volverAlInicio}>
                ← Volver al inicio
              </a>
              <a
                href="#privacidad"
                className="btn secondary terminos__accion"
                onClick={irAPrivacidad}
              >
                Leer la Política de Privacidad
              </a>
            </div>
            <p className="terminos__cambios">
              Registro de cambios: 16 de octubre de 2026 — primera versión de los
              Términos y Condiciones de Uso.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
};