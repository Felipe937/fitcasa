import React, { useCallback, useEffect, useState } from 'react';
import { PageRoute } from '../components/Header';

interface SaludIndicadoresPageProps {
  onNavigate?: (page: PageRoute, sectionId?: string) => void;
}

interface Seccion {
  id: string;
  titulo: string;
}

const SECCIONES: Seccion[] = [
  { id: 'imc', titulo: 'Los indicadores no cuentan toda la historia' },
  { id: 'mas-alla', titulo: 'Más allá de una cifra' },
  { id: 'movimiento', titulo: 'Movimiento sin comparaciones' },
  { id: 'profesional', titulo: 'Cuándo buscar orientación profesional' },
];

const Icono = ({ pathos }: { pathos: string[] }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
    {pathos.map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

const ICONO_INFO = ['M12 3.6 2.6 20h18.8L12 3.6Z', 'M12 10v4.5', 'M12 17.6h.01'];
const ICONO_ACTIVIDAD = [
  'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
];
const ICONO_CUIDADO = [
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
];

export const SaludIndicadoresPage: React.FC<SaludIndicadoresPageProps> = () => {
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const irASeccion = useCallback((event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const destino = document.getElementById(id);
    if (!destino) return;
    destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    destino.focus();
  }, []);

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
    <main id="contenido" tabIndex={-1} className="salud-indicadores">
      <header className="salud-indicadores__cabecera" aria-labelledby="salud-titulo">
        <h1 id="salud-titulo" className="salud-indicadores__titulo">
          Cuerpo, movimiento y salud
        </h1>
        <p className="salud-indicadores__intro">
          Comprender los indicadores de salud, reconocer sus limitaciones y promover una relación
          respetuosa con el movimiento.
        </p>
        <div className="salud-indicadores__principios">
          <div className="salud-indicadores__principio">
            <span className="salud-indicadores__principio-titulo">Educación, no diagnóstico</span>
            <p className="salud-indicadores__principio-texto">
              El contenido es informativo y no sustituye una evaluación profesional.
            </p>
          </div>
          <div className="salud-indicadores__principio">
            <span className="salud-indicadores__principio-titulo">Respeto al cuerpo</span>
            <p className="salud-indicadores__principio-texto">
              Sin clasificaciones, sin objetivos de peso, sin juicios sobre el cuerpo.
            </p>
          </div>
          <div className="salud-indicadores__principio">
            <span className="salud-indicadores__principio-titulo">Movimiento consciente</span>
            <p className="salud-indicadores__principio-texto">
              Actividad física como herramienta de bienestar, adaptada a cada persona.
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        <nav
          className={`salud-indicadores__indice ${tocOpen ? 'salud-indicadores__indice--abierto' : ''}`}
          aria-labelledby="salud-indice-titulo"
        >
          <div className="salud-indicadores__indice__header">
            <h2 id="salud-indice-titulo">Índice de contenidos</h2>
            <button
              type="button"
              id="salud-toc-toggle"
              className="salud-indicadores__indice__toggle"
              aria-expanded={tocOpen}
              aria-controls="salud-indice-lista"
              onClick={() => setTocOpen(!tocOpen)}
            >
              {tocOpen ? 'Ocultar índice' : 'Mostrar índice'}
            </button>
          </div>
          <ol id="salud-indice-lista" className="salud-indicadores__indice__lista">
            {SECCIONES.map((seccion) => (
              <li key={seccion.id}>
                <a
                  href={`#${seccion.id}`}
                  className={activeSectionId === seccion.id ? 'salud-indicadores__indice__activo' : ''}
                  onClick={(e) => irASeccion(e, seccion.id)}
                >
                  {seccion.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section className="salud-indicadores__seccion" aria-labelledby="sec-imc" id="imc" tabIndex={-1}>
          <h2 id="sec-imc">Los indicadores no cuentan toda la historia</h2>
          <p>
            El índice de masa corporal (IMC) es una medida de peso ajustado por estatura. Se calcula
            dividiendo el peso en kilogramos por el cuadrado de la estatura en metros (kg/m²). La
            Organización Mundial de la Salud lo utiliza como <strong>indicador de referencia
            poblacional</strong> para estimar la prevalencia de sobrepeso y obesidad en grupos
            humanos.
          </p>
          <div className="salud-indicadores__destacado salud-indicadores__destacado--info">
            <Icono pathos={ICONO_INFO} />
            <div>
              <h3 className="salud-indicadores__destacado-titulo">IMC: indicador poblacional, no diagnóstico individual</h3>
              <p className="salud-indicadores__destacado-texto">
                El IMC es una medida de exceso de peso, no de grasa corporal. No distingue entre
                masa muscular, masa ósea y tejido adiposo. Tampoco indica cómo se distribuye la grasa
                en el cuerpo. Factores como la edad, el sexo, la etnia y el nivel de actividad física
                influyen en la relación entre IMC y composición corporal.
              </p>
            </div>
          </div>
          <p>
            Según los Centros para el Control y la Prevención de Enfermedades (CDC) de Estados
            Unidos, el IMC es <strong>útil como herramienta de cribado</strong> en salud pública,
            pero <strong>no es una medida diagnóstica</strong> de obesidad ni de adiposidad. La
            evaluación clínica completa requiere considerar otros factores, como la circunferencia de
            cintura, presión arterial, glucosa en sangre y antecedentes médicos.
          </p>
          <h3>Limitaciones del IMC</h3>
          <ul>
            <li>
              <strong>No distingue composición corporal:</strong> Una persona con mucha masa muscular
              puede tener un IMC elevado sin tener exceso de grasa. Por el contrario, una persona con
              baja masa muscular puede tener un IMC normal pero con porcentaje de grasa elevado.
            </li>
            <li>
              <strong>No indica distribución de grasa:</strong> La grasa abdominal (visceral) se
              asocia con mayor riesgo metabólico que la grasa subcutánea. El IMC no distingue entre
              ambas.
            </li>
            <li>
              <strong>Varía por edad y sexo:</strong> Los adultos mayores tienden a tener mayor
              porcentaje de grasa corporal para un mismo IMC que los adultos jóvenes. Las mujeres
              suelen tener mayor porcentaje de grasa que los hombres con el mismo IMC.
            </li>
            <li>
              <strong>Varía por etnia:</strong> Las poblaciones asiáticas pueden tener mayor riesgo
              de enfermedades metabólicas con IMC más bajos que los umbrales establecidos para
              poblaciones caucásicas.
            </li>
            <li>
              <strong>No evalúa funcionalidad:</strong> El IMC no informa sobre la capacidad física,
              la movilidad, la fuerza ni la calidad de vida.
            </li>
          </ul>
          <div className="salud-indicadores__nota">
            <p>
              <strong>En menores de edad:</strong> El IMC no se interpreta con las mismas categorías
              que en adultos. En niños y adolescentes se utiliza el IMC para la edad y el sexo,
              comparado con patrones de crecimiento específicos. Los criterios son distintos y
              dependen de factores como la edad, el sexo y la maduración sexual. No se deben aplicar
              las categorías adultas a menores.
            </p>
          </div>
          <div className="salud-indicadores__fuentes">
            <p className="salud-indicadores__fuentes-titulo">Fuentes:</p>
            <ul className="salud-indicadores__fuentes-lista">
              <li>
                Organización Mundial de la Salud.{' '}
                <em>Nutrition Landscape Information System: Body Mass Index (BMI)</em>. Disponible en:{' '}
                <a
                  href="https://apps.who.int/nutrition/landscape/help.aspx?helpid=392&menu=0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  apps.who.int
                </a>
              </li>
              <li>
                Centers for Disease Control and Prevention (CDC).{' '}
                <em>Body Mass Index: Considerations for Practitioners</em>. Disponible en:{' '}
                <a
                  href="https://www.cdc.gov/obesity/downloads/BMIforpactitioners.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cdc.gov
                </a>
              </li>
              <li>
                National Center for Biotechnology Information (NCBI).{' '}
                <em>The Science, Strengths, and Limitations of Body Mass Index</em>. Disponible en:{' '}
                <a
                  href="https://www.ncbi.nlm.nih.gov/books/NBK594362/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ncbi.nlm.nih.gov
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="salud-indicadores__seccion" aria-labelledby="sec-mas-alla" id="mas-alla" tabIndex={-1}>
          <h2 id="sec-mas-alla">Más allá de una cifra</h2>
          <p>
            El bienestar es multidimensional. Un solo número no puede capturar la complejidad de la
            salud ni la experiencia de vivir en un cuerpo. Más allá de los indicadores
            antropométricos, el bienestar se manifiesta en aspectos cotidianos que cada persona puede
            observar en su propia vida.
          </p>
          <div className="salud-indicadores__tarjetas">
            <div className="salud-indicadores__tarjeta">
              <div className="salud-indicadores__tarjeta-icono">
                <Icono pathos={ICONO_ACTIVIDAD} />
              </div>
              <h3 className="salud-indicadores__tarjeta-titulo">Capacidad funcional</h3>
              <p className="salud-indicadores__tarjeta-texto">
                La facilidad para realizar actividades cotidianas: subir escaleras, cargar compras,
                caminar distancias moderadas, levantarse de una silla sin dificultad. Esta capacidad
                refleja fuerza, resistencia y movilidad.
              </p>
            </div>
            <div className="salud-indicadores__tarjeta">
              <div className="salud-indicadores__tarjeta-icono">
                <Icono pathos={ICONO_CUIDADO} />
              </div>
              <h3 className="salud-indicadores__tarjeta-titulo">Movilidad y comodidad</h3>
              <p className="salud-indicadores__tarjeta-texto">
                La libertad de movimiento sin dolor ni rigidez excesiva. La capacidad de adoptar
                diferentes posturas, girar el tronco, mover las articulaciones en su rango completo.
                La comodidad durante la actividad física regular.
              </p>
            </div>
            <div className="salud-indicadores__tarjeta">
              <div className="salud-indicadores__tarjeta-icono">
                <Icono pathos={ICONO_CUIDADO} />
              </div>
              <h3 className="salud-indicadores__tarjeta-titulo">Descanso y energía</h3>
              <p className="salud-indicadores__tarjeta-texto">
                La calidad del sueño, la sensación de energía al despertar, la capacidad de mantener
                la atención durante el día, la recuperación tras el esfuerzo. Un descanso reparador
                es fundamental para el bienestar general.
              </p>
            </div>
            <div className="salud-indicadores__tarjeta">
              <div className="salud-indicadores__tarjeta-icono">
                <Icono pathos={ICONO_ACTIVIDAD} />
              </div>
              <h3 className="salud-indicadores__tarjeta-titulo">Hábitos sostenibles</h3>
              <p className="salud-indicadores__tarjeta-texto">
                La regularidad de la actividad física adaptada a las circunstancias individuales,
                la capacidad de mantener hábitos a lo largo del tiempo, la flexibilidad para ajustar
                la intensidad según el estado de cada día.
              </p>
            </div>
          </div>
          <div className="salud-indicadores__nota salud-indicadores__nota--importante">
            <p>
              <strong>Nota importante:</strong> Estos aspectos son indicadores perceptivos que
              complementan, pero no sustituyen, una evaluación profesional de salud. No constituyen
              diagnóstico ni permiten por sí mismos determinar el estado de salud de una persona.
            </p>
          </div>
        </section>

        <section className="salud-indicadores__seccion" aria-labelledby="sec-movimiento" id="movimiento" tabIndex={-1}>
          <h2 id="sec-movimiento">Movimiento sin comparaciones</h2>
          <p>
            El ejercicio físico no necesita estar asociado a cambiar el peso o la apariencia. La
            actividad física es una herramienta para el bienestar general, con beneficios que van
            más allá de la composición corporal.
          </p>
          <div className="salud-indicadores__beneficios">
            <h3>Beneficios del movimiento regular</h3>
            <ul>
              <li>
                <strong>Salud cardiovascular:</strong> Mejora la circulación, ayuda a mantener la
                presión arterial dentro de rangos saludables y fortalece el corazón.
              </li>
              <li>
                <strong>Salud musculoesquelética:</strong> Mantiene la fuerza muscular, la densidad
                ósea y la flexibilidad articular. Reduce el riesgo de caídas en adultos mayores.
              </li>
              <li>
                <strong>Salud mental:</strong> La actividad física regular se asocia con mejor
                estado de ánimo, reducción de ansiedad y mejor manejo del estrés.
              </li>
              <li>
                <strong>Mejora del sueño:</strong> Contribuye a un descanso más reparador y
                regulación de los ciclos de sueño-vigilia.
              </li>
              <li>
                <strong>Mantenimiento de la funcionalidad:</strong> Permite mantener la autonomía
                para realizar actividades de la vida diaria a lo largo de los años.
              </li>
            </ul>
          </div>
          <div className="salud-indicadores__destacado salud-indicadores__destacado--alerta">
            <Icono pathos={ICONO_INFO} />
            <div>
              <h3 className="salud-indicadores__destacado-titulo">El movimiento se adapta a cada persona</h3>
              <p className="salud-indicadores__destacado-texto">
                No existe una rutina universalmente adecuada para todas las personas. La actividad
                física debe adaptarse a las capacidades, circunstancias, limitaciones y preferencias
                individuales. Lo que funciona para una persona puede no ser apropiado para otra.
              </p>
            </div>
          </div>
          <p>
            FitCasa ofrece ejercicios generales y cuidado postural que pueden realizarse en casa, sin
            equipamiento especializado. Estos ejercicios están diseñados para promover movimiento
                consciente y bienestar general, no para tratar condiciones médicas específicas ni para
                cambiar la apariencia corporal.
          </p>
          <div className="salud-indicadores__nota">
            <p>
              <strong>Importante:</strong> La actividad física descrita en FitCasa no promete corregir
              la escoliosis, eliminar el dolor ni tratar enfermedades. Para condiciones médicas
              específicas, consulta con un profesional sanitario.
            </p>
          </div>
        </section>

        <section className="salud-indicadores__seccion" aria-labelledby="sec-profesional" id="profesional" tabIndex={-1}>
          <h2 id="sec-profesional">Cuándo buscar orientación profesional</h2>
          <p>
            Un profesional de salud puede interpretar los indicadores teniendo en cuenta el contexto
            individual: historial médico, circunstancias personales, capacidad funcional y otros
                factores que un número aislado no refleja.
          </p>
          <div className="salud-indicadores__lista-check">
            <h3>Situaciones en las que es recomendable consultar</h3>
            <ul>
              <li>
                Si tienes dudas sobre tu estado de salud, cambios bruscos de peso, dolor persistente
                o síntomas que te preocupan.
              </li>
              <li>
                Si planeas iniciar un programa de actividad física y tienes condiciones médicas
                previas, intervenciones quirúrgicas, restricciones clínicas o antecedentes de
                problemas de columna.
              </li>
              <li>
                Si notas dolor durante el ejercicio, especialmente si es agudo, persistente o se
                acompaña de otros síntomas como adormecimiento, pérdida de fuerza o mareo.
              </li>
              <li>
                Si deseas una evaluación completa de tu estado de salud, incluyendo pruebas de
                laboratorio, medición de presión arterial u otros exámenes clínicos.
              </li>
              <li>
                Si tienes preguntas específicas sobre tu composición corporal, distribución de grasa
                u otros indicadores antropométricos.
              </li>
            </ul>
          </div>
          <div className="salud-indicadores__destacado salud-indicadores__destacado--cuidado">
            <Icono pathos={ICONO_CUIDADO} />
            <div>
              <h3 className="salud-indicadores__destacado-titulo">Ante síntomas de alarma</h3>
              <p className="salud-indicadores__destacado-texto">
                Si notas dolor persistente o creciente, síntomas neurológicos (adormecimiento,
                pérdida de fuerza, mareo) o cualquier otro síntoma que te preocupe, suspende la
                actividad física y busca atención profesional. No autodiagnostiques ni demores la
                consulta médica.
              </p>
            </div>
          </div>
        </section>

        <section className="salud-indicadores__disclaimer" aria-labelledby="disclaimer-titulo">
          <h2 id="disclaimer-titulo" className="salud-indicadores__disclaimer-titulo">
            Aviso educativo
          </h2>
          <p>
            Este contenido es <strong>exclusivamente educativo</strong>. No constituye asesoría
            médica, diagnóstico ni tratamiento. La información sobre indicadores de salud tiene
            carácter divulgativo y está basada en fuentes de salud pública reconocidas (Organización
            Mundial de la Salud, CDC, NCBI). No sustituye la evaluación, el diagnóstico ni el
            tratamiento por un profesional sanitario.
          </p>
          <p>
            FitCasa no es un servicio de salud. No diagnostica, no prescribe, no trata y no sustituye
            la valoración médica. Si tienes dudas sobre tu salud, consulta con un profesional
            sanitario cualificado.
          </p>
        </section>
      </div>
    </main>
  );
};
