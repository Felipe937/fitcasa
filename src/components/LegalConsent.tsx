import React from 'react';
import { LegalConsentState } from '../types';

/**
 * Acuse de lectura de los documentos legales.
 *
 * Dos casillas independientes y nunca premarcadas. Bloquear el guardado hasta
 * que ambas estén marcadas es una medida de transparencia, no un mecanismo de
 * autorización de la Ley 1581 de 2012: ese régimen excluye las bases de datos
 * mantenidas en un ámbito personal o doméstico (art. 2 literal a de la ley, y
 * art. 2 del Decreto 1377 de 2013), que es el caso de FitCasa. Véase
 * TERMINOS.md, cláusula 3.2.
 *
 * Los enlaces se abren en pestaña nueva para no perder lo que el usuario ya
 * haya escrito en el formulario.
 */

export interface LegalConsentProps {
  /**
   * Estado de las dos casillas. El componente es **controlado**: el padre es la
   * única fuente de verdad. Con estado interno la prop `initial` solo se leía en
   * el primer render, y al abrir un registro distinto para editar las casillas
   * seguían mostrando lo anterior.
   */
  value: LegalConsentState;
  /** Se emite en cada cambio con el estado completo de ambas casillas. */
  onConsentChange: (state: LegalConsentState) => void;
  /** Indica si ambas casillas son necesarias. Por defecto, true. */
  required?: boolean;
  /** Prefijo de los `id`, para no colisionar si se monta más de una vez. */
  idPrefix?: string;
}

const TERM_LABEL = 'He leído y acepto los Términos y Condiciones de Uso';
const PRIV_LABEL = 'He leído y acepto la Política de Privacidad y Tratamiento de Datos';
const EXPLAIN =
  'Entiendo que el dolor y las notas de bienestar que anoto se guardan únicamente en este navegador y en este dispositivo, que FitCasa no los envía a ningún servidor y que no existe copia en ninguna parte.';

export const LegalConsent: React.FC<LegalConsentProps> = ({
  value,
  onConsentChange,
  required = true,
  idPrefix = 'legal',
}) => {
  const terms = value?.terms === true;
  const privacy = value?.privacy === true;

  const termsId = `${idPrefix}-terms`;
  const privacyId = `${idPrefix}-privacy`;
  const noteId = `${idPrefix}-nota`;

  // Cada casilla se mueve por separado; la otra no se toca.
  const toggle = (key: keyof LegalConsentState, next: boolean) => {
    onConsentChange(
      key === 'terms'
        ? { terms: next, privacy: value.privacy }
        : { terms: value.terms, privacy: next }
    );
  };

  return (
    <fieldset className="legal-consent" data-required={required ? 'true' : undefined}>
      <legend className="legal-consent__leyenda">
        Documentos legales
        {required && (
          <span className="legal-consent__obligatorio">
            {' '}
            * <span className="small-print">(obligatorio)</span>
          </span>
        )}
      </legend>

      <p id={noteId} className="legal-consent__explicacion">
        {EXPLAIN}
      </p>

      <div className="legal-consent__item">
        <input
          type="checkbox"
          id={termsId}
          name={termsId}
          checked={terms}
          required={required}
          aria-describedby={noteId}
          onChange={(e) => toggle('terms', e.target.checked)}
        />
        <label htmlFor={termsId}>
          {TERM_LABEL}
          {required && <span className="legal-consent__asterisco"> *</span>}{' '}
          <a href="#terminos" target="_blank" rel="noopener noreferrer">
            Abrir los Términos
          </a>
        </label>
      </div>

      <div className="legal-consent__item">
        <input
          type="checkbox"
          id={privacyId}
          name={privacyId}
          checked={privacy}
          required={required}
          aria-describedby={noteId}
          onChange={(e) => toggle('privacy', e.target.checked)}
        />
        <label htmlFor={privacyId}>
          {PRIV_LABEL}
          {required && <span className="legal-consent__asterisco"> *</span>}{' '}
          <a href="#privacidad" target="_blank" rel="noopener noreferrer">
            Abrir la Política de Privacidad
          </a>
        </label>
      </div>
    </fieldset>
  );
};