import React from 'react';
import { PageRoute } from '../components/Header';

interface AlimentacionPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

export const AlimentacionPage: React.FC<AlimentacionPageProps> = ({ onNavigate }) => {
  const navegar = (page: PageRoute) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(page);
  };

  return (
    <main id="contenido" tabIndex={-1} className="alimentacion-page">
      <section className="alimentacion-hero" aria-labelledby="hero-titulo">
        <div className="container alimentacion-hero__layout">
          <div className="alimentacion-hero__content">
            <span className="alimentacion-hero__insignia">Educación sobre alimentación</span>
            <h1 id="hero-titulo" className="alimentacion-hero__titulo">Alimentación y bienestar</h1>
            <p className="alimentacion-hero__subtitulo">
              Una alimentación variada y equilibrada contribuye al bienestar general.
            </p>
          </div>
        </div>
      </section>
      <div className="container alimentacion-contenido">
        <section className="alimentacion-section" aria-labelledby="sec-porque">
          <h2 id="sec-porque">Por qué importa lo que comes</h2>
          <p>
            La alimentación tiene una influencia determinante en la salud y el bienestar. Las dietas poco
            saludables son un factor de riesgo importante de enfermedades. Basado en la OMS.
          </p>
          <div className="alimentacion-sources">
            <h3>Fuente</h3>
            <ul>
              <li>
                OMS. <em>Alimentación saludable</em>.{' '}
                <a href="https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet" target="_blank" rel="noopener noreferrer">who.int</a>
              </li>
            </ul>
          </div>
        </section>

        <section className="alimentacion-section" aria-labelledby="sec-grupos">
          <h2 id="sec-grupos">Los grupos de alimentos</h2>
          <p>Guía visual orientativa basada en las guías colombianas.</p>
          <p className="alimentacion-nota">Guía orientativa, no una prescripción. Las necesidades varían según cada persona.</p>
          <div className="alimentacion-sources">
            <h3>Fuente</h3>
            <ul>
              <li>
                FAO / MinSalud Colombia. <em>Guías alimentarias</em> (2015).{' '}
                <a href="https://www.fao.org/nutrition/education/dietary-guidelines/regions/colombia/en/" target="_blank" rel="noopener noreferrer">fao.org</a>
              </li>
            </ul>
          </div>
        </section>
        <section className="alimentacion-section" aria-labelledby="sec-nutrientes">
          <h2 id="sec-nutrientes">Nutrientes y huesos</h2>
          <p><strong>Calcio.</strong> El calcio es un mineral esencial para la formación y el mantenimiento de los huesos y los dientes. Se encuentra en lácteos, pescados pequeños con espinas, legumbres y verduras de hoja verde. Fuente: NIH – Calcio.</p>
          <p><strong>Vitamina D.</strong> La vitamina D favorece la absorción del calcio y contribuye a la salud ósea. La principal fuente es la exposición solar prudente. Fuente: NIH – Vitamina D.</p>
          <p><strong>Proteínas.</strong> Las proteínas son necesarias para el crecimiento y la reparación de tejidos. Se encuentran en legumbres, huevos, lácteos, carnes, pescados y cereales. Fuente: OMS.</p>
          <div className="alimentacion-sources">
            <h3>Fuentes</h3>
            <ul>
              <li>NIH ODS. <em>Calcium – Fact Sheet</em>. <a href="https://ods.od.nih.gov/factsheets/Calcium-Consumer/" target="_blank" rel="noopener noreferrer">ods.od.nih.gov</a></li>
              <li>NIH ODS. <em>Vitamin D – Fact Sheet</em>. <a href="https://ods.od.nih.gov/factsheets/VitaminD-Consumer/" target="_blank" rel="noopener noreferrer">ods.od.nih.gov</a></li>
            </ul>
          </div>
        </section>

        <section className="alimentacion-section" aria-labelledby="sec-habitos">
          <h2 id="sec-habitos">Hábitos, no reglas</h2>
          <p>La variedad y la flexibilidad son más sostenibles que las reglas estrictas.</p>
          <div className="alimentacion-ctas">
            <a href="#ejercicios" className="alimentacion-cta" onClick={navegar('ejercicios')}>Explorar ejercicios</a>
            <a href="#escoliosis" className="alimentacion-cta secondary" onClick={navegar('escoliosis')}>Ver guía de escoliosis</a>
          </div>
        </section>

        <div className="alimentacion-disclaimer" role="note">
          <p><strong>Contenido educativo general elaborado por un estudiante.</strong> No sustituye la orientación de un profesional de nutrición o salud.</p>
        </div>

      </div>
    </main>
  );
};

