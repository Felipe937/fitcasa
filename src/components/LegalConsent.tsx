import React from 'react';
import { ConsentRecord } from '../types';

/**
 * Aceptación de los documentos legales, con registro local de aceptación.
 *
 * Dos casillas independientes y nunca premarcadas. El registro que emite
 * acredita que la persona marcó las casillas **en su propio navegador**: al
 * residir en el `localStorage` que la propia persona controla, no es una prueba
 * fehaciente frente a un tercero, sino trazabilidad propia.
 *
 * Los enlaces se abren en pestaña nueva para no perder lo ya escrito en el
 * formulario.
 */

export interface LegalConsentProps {
  /**
   * Emite el registro en cuanto ambas casillas quedan marcadas, y `null` en
   * cuanto se desmarca cualquiera.
   */
  onConsentRecordReady: (record: ConsentRecord | null) => void;
  /** Indica si ambas casillas son necesarias. Por defecto, true. */
  required?: boolean;
  /** Prefijo de los `id`, para no colisionar si se monta más de una vez. */
  idPrefix?: string;
  /** Registro ya guardado, con el que se reponen las casillas. */
  initialConsent?: ConsentRecord | null;
}

/** Versión de los documentos legales aceptados. */
export const CONSENT_DOCS_VERSION = '2026-10-16';
/** Cómo se obtuvo el acuse. */
export const CONSENT_METHOD = 'panel-checkbox-consent';

export const buildConsentRecord = (): ConsentRecord => ({
  terms: true,
  privacy: true,
  timestamp: new Date().toISOString(),
  version: CONSENT_DOCS_VERSION,
  method: CONSENT_METHOD,
});

/** Devuelve el registro solo si tiene las dos casillas y los metadatos completos. */
export function isValidConsentRecord(value: unknown): value is ConsentRecord {
  if (!value || typeof value !== 'object') return false;
  const r = value as Partial<ConsentRecord>;
  return (
    r.terms === true &&
    r.privacy === true &&
    typeof r.timestamp === 'string' &&
    !Number.isNaN(Date.parse(r.timestamp)) &&
    typeof r.version === 'string' &&
    typeof r.method === 'string'
  );
}

const TERM_LINK = 'Términos y Condiciones de Uso';
const PRIV_LINK = 'Política de Privacidad';
const EXPLAIN =
  'Entiendo que el dolor y las notas de bienestar que anoto se guardan únicamente en este navegador y en este dispositivo, que FitCasa no los envía a ningún servidor y que no existe copia en ninguna parte.';
const AUTH =
  'Autorizo el tratamiento local de mis datos sensibles de salud conforme a la Ley 1581 de 2012 (Colombia).';
const SCOPE =
  'Este registro se guarda solo en este dispositivo. No es un documento firmado ni una prueba fehaciente frente a un tercero: puedes borrarlo en cualquier momento desde «Privacidad y borrado».';
/** Centinela para «sin consentimiento», distinto de un timestamp. */
const SIN_CONSENTIMIENTO = 'sin-consentimiento';

export const LegalConsent: React.FC<LegalConsentProps> = ({
  onConsentRecordReady,
  required = true,
  idPrefix = 'legal',
  initialConsent = null,
}) => {
  const initialTerms = initialConsent?.terms === true;
  const initialPrivacy = initialConsent?.privacy === true;

  const [terms, setTerms] = React.useState<boolean>(initialTerms);
  const [privacy, setPrivacy] = React.useState<boolean>(initialPrivacy);

  const termsId = `${idPrefix}-terms`;
  const privacyId = `${idPrefix}-privacy`;
  const noteId = `${idPrefix}-nota`;
  const authId = `${idPrefix}-autoria`;

  // El padre puede cargar el registro guardado después del primer render (por
  // ejemplo al leerlo de localStorage), y también puede borrarlo.
  //
  // Ojo: el padre emite `null` en cuanto falta una casilla. Si el efecto
  // sincronizara con cualquier cambio de `initialConsent`, desmarcar una
  // casilla borraría la otra: el eco de nuestra propia emisión no debe
  // confundirse con un cambio externo. Se ignoran los valores que este
  // componente acaba de emitir.
  const emitted = React.useRef<string | null>(null);
  const seed = initialConsent?.timestamp ?? SIN_CONSENTIMIENTO;
  React.useEffect(() => {
    if (seed === emitted.current) return;
    emitted.current = seed;
    setTerms(initialConsent?.terms === true);
    setPrivacy(initialConsent?.privacy === true);
  }, [seed]);

  const toggle = (which: 'terms' | 'privacy', next: boolean) => {
    const t = which === 'terms' ? next : terms;
    const p = which === 'privacy' ? next : privacy;
    if (which === 'terms') setTerms(next);
    else setPrivacy(next);
    const record = t && p ? buildConsentRecord() : null;
    emitted.current = record?.timestamp ?? SIN_CONSENTIMIENTO;
    onConsentRecordReady(record);
  };

  return (
    <fieldset className="legal-consent legal-consent-box" data-required={required ? 'true' : undefined}>
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
      <p id={authId} className="legal-consent__autorizacion">
        {AUTH}
      </p>

      <div className="legal-consent__item">
        <input
          type="checkbox"
          id={termsId}
          name={termsId}
          checked={terms}
          required={required}
          aria-describedby={`${noteId} ${authId}`}
          onChange={(e) => toggle('terms', e.target.checked)}
        />
        <label htmlFor={termsId}>
          He leído y acepto los{' '}
          <a href="#terminos" target="_blank" rel="noopener noreferrer">
            {TERM_LINK}
          </a>
          {required && <span className="legal-consent__asterisco"> *</span>}
        </label>
      </div>

      <div className="legal-consent__item">
        <input
          type="checkbox"
          id={privacyId}
          name={privacyId}
          checked={privacy}
          required={required}
          aria-describedby={`${noteId} ${authId}`}
          onChange={(e) => toggle('privacy', e.target.checked)}
        />
        <label htmlFor={privacyId}>
          He leído y acepto la{' '}
          <a href="#privacidad" target="_blank" rel="noopener noreferrer">
            {PRIV_LINK}
          </a>
          {required && <span className="legal-consent__asterisco"> *</span>}
        </label>
      </div>

      <p className="legal-consent__alcance">{SCOPE}</p>
    </fieldset>
  );
};