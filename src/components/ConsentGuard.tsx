import React from 'react';
import {
  ConsentRegistry,
  Decision,
  DOC_VERSIONS,
  HEALTH_DATA_PURPOSE,
} from '../types';
import {
  readStorage,
  writeStorage,
  STORAGE_KEYS,
  CONSENT_STORAGE_VERSION,
} from '../utils/storage';

/** Funciones cuyo uso guarda datos introducidos por la persona. */
export type ProtectedRoute = 'panel' | 'quiz' | 'plan';

export const PROTECTED_ROUTES: ProtectedRoute[] = ['panel', 'quiz', 'plan'];

const TITULOS: Record<ProtectedRoute, string> = {
  panel: 'el Panel de Seguimiento',
  quiz: 'el cuestionario de Sugerencias',
  plan: 'el Plan de Actividad de 4 Semanas',
};

const isDecision = (value: unknown, expected: string, requireAccepted = true): value is Decision =>
  !!value &&
  typeof value === 'object' &&
  (requireAccepted ? (value as Decision).accepted === true : typeof (value as Decision).accepted === 'boolean') &&
  typeof (value as Decision).at === 'string' &&
  !Number.isNaN(Date.parse((value as Decision).at)) &&
  (value as Decision).docVersion === expected;

/**
 * Valida el registro leído. Devuelve `null` si falta algo, si está corrupto o
 * si algún documento cambió de versión desde que se decidió: en ese caso hay
 * que volver a preguntar.
 */
export function parseRegistry(data: unknown): ConsentRegistry | null {
  if (!data || typeof data !== 'object') return null;
  const r = data as Partial<ConsentRegistry>;

  if (!isDecision(r.terms, DOC_VERSIONS.terminos, true)) return null;
  if (!isDecision(r.privacy, DOC_VERSIONS.privacidad, true)) return null;
  if (!isDecision(r.health, DOC_VERSIONS.terminos, false)) return null;
  if (typeof r.health?.purpose !== 'string' || r.health.purpose !== HEALTH_DATA_PURPOSE) return null;
  if (typeof r.updatedAt !== 'string' || Number.isNaN(Date.parse(r.updatedAt))) return null;
  // Analítica es opcional: si está presente, debe ser una decisión válida.
  if (r.analytics !== undefined && !isDecision(r.analytics, DOC_VERSIONS.analytics, false)) return null;

  return {
    terms: r.terms,
    privacy: r.privacy,
    health: { ...r.health, purpose: r.health.purpose },
    analytics: r.analytics,
    updatedAt: r.updatedAt,
  };
}

/** Lee el registro. `null` si no hay, está corrupto o quedó desactualizado. */
export function loadRegistry(): ConsentRegistry | null {
  const res = readStorage<ConsentRegistry>(
    STORAGE_KEYS.consent,
    CONSENT_STORAGE_VERSION,
    parseRegistry
  );
  return res.value;
}

/**
 * Igual que `loadRegistry`, pero distingue "nunca se decidió" de "había una
 * decisión y ya no sirve". `present` es true si la clave existe, incluso con
 * datos corruptos o de otra versión del esquema.
 */
export function loadRegistryState(): { present: boolean; registry: ConsentRegistry | null } {
  const registry = loadRegistry();
  if (registry) return { present: true, registry };
  const res = readStorage<unknown>(STORAGE_KEYS.consent, CONSENT_STORAGE_VERSION, (data) => data);
  return { present: res.reason !== 'missing' && res.reason !== 'unavailable', registry: null };
}

/** Documentos que necesitan una decisión nueva respecto a lo ya registrado. */
export function pendingDecisions(
  current: ConsentRegistry | null
): { terms: boolean; privacy: boolean; health: boolean; analytics: boolean } {
  return {
    terms: !current || !isDecision(current.terms, DOC_VERSIONS.terminos, true),
    privacy: !current || !isDecision(current.privacy, DOC_VERSIONS.privacidad, true),
    health: !current || !isDecision(current.health, DOC_VERSIONS.terminos, false),
    analytics: !current || !isDecision(current.analytics, DOC_VERSIONS.analytics, false),
  };
}

const IconoInfo = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
    <path d="M12 3.6 2.6 20h18.8L12 3.6Z" />
    <path d="M12 10v4.5" />
    <path d="M12 17.6h.01" />
  </svg>
);
const IconoEscudo = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
    <path d="M12 3.2 5 6v6c0 4 3 7.4 7 8.8 4-1.4 7-4.8 7-8.8V6l-7-2.8Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const IconoCandado = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
    <path d="M6 10.5h12V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-9.5Z" />
    <path d="M8.5 10.5V7.75a3.5 3.5 0 1 1 7 0v2.75" />
  </svg>
);

export interface ConsentGuardProps {
  /** Función protegida a la que se quiere entrar. */
  route: ProtectedRoute;
  /** Continuar hacia esa función una vez registrada la decisión. */
  onAccept: (registry: ConsentRegistry) => void;
  /** Volver al contenido público sin aceptar. */
  onDecline: () => void;
  /** Motivo por el que se vuelve a pedir, si ya había un registro anterior. */
  reason?: 'first-visit' | 'updated';
}

export const ConsentGuard: React.FC<ConsentGuardProps> = ({
  route,
  onAccept,
  onDecline,
  reason,
}) => {
  const [existing] = React.useState(() => loadRegistryState());
  const pending = pendingDecisions(existing.registry);

  // Siempre empiezan sin marcar: nunca hay aceptación implícita ni heredada.
  const [terms, setTerms] = React.useState<boolean>(false);
  const [privacy, setPrivacy] = React.useState<boolean>(false);
  const [health, setHealth] = React.useState<boolean>(false);
  const [analytics, setAnalytics] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const titulo = TITULOS[route];
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    headingRef.current?.focus();
  }, []);

  /**
   * Motivo por el que se vuelve a pedir. Si no lo impone quien lo usa, se
   * deduce: había un registro que ya no es válido (cambió el contenido, se
   * corrompió o es de otro esquema) frente a una visita sin ninguna decisión.
   */
  const motivo: 'first-visit' | 'updated' =
    reason ?? (existing.present && !existing.registry ? 'updated' : 'first-visit');

  // Con qué documentos hay que volver a decidir. Si solo cambió el fondo de uno,
  // el aviso lo dice en lugar de insinuar que todo quedó sin validez.
  const changed: string[] = [];
  if (pending.terms) changed.push('Términos de Uso');
  if (pending.privacy) changed.push('Política de Privacidad');
  if (pending.health) changed.push('autorización sobre tus datos de salud');
  if (pending.analytics) changed.push('consentimiento de analítica');

  const completo = terms && privacy;

  const aceptar = (event: React.FormEvent) => {
    event.preventDefault();
    if (!completo) {
      const faltan: string[] = [];
      if (!terms) faltan.push('los Términos de Uso');
      if (!privacy) faltan.push('la Política de Privacidad');
      setError(`Falta marcar: ${faltan.join(', ')}.`);
      const id = !terms ? 'guard-terms' : 'guard-privacy';
      document.getElementById(id)?.focus();
      return;
    }
    setError('');

    const ahora = new Date().toISOString();
    const registry: ConsentRegistry = {
      terms: { accepted: true, at: ahora, docVersion: DOC_VERSIONS.terminos },
      privacy: { accepted: true, at: ahora, docVersion: DOC_VERSIONS.privacidad },
      health: {
        accepted: health,
        at: ahora,
        docVersion: DOC_VERSIONS.terminos,
        purpose: HEALTH_DATA_PURPOSE,
      },
      analytics: {
        accepted: analytics,
        at: ahora,
        docVersion: DOC_VERSIONS.analytics,
      },
      updatedAt: ahora,
    };

    const res = writeStorage(STORAGE_KEYS.consent, CONSENT_STORAGE_VERSION, registry);
    if (!res.saved) {
      setError(
        'No se pudo guardar tu decisión en este navegador, así que no podemos continuar con esta función. Comprueba que el almacenamiento local esté permitido.'
      );
      document.getElementById('guard-terms')?.focus();
      return;
    }
    onAccept(registry);
  };

  return (
      <main id="contenido" tabIndex={-1} className="consent-guard container">
      <span className="consent-guard__insignia">Soberanía de datos y privacidad local</span>
      <h1 ref={headingRef} tabIndex={-1} className="consent-guard__titulo">
        Antes de continuar
      </h1>
      <p className="consent-guard__intro">
        Para usar <strong>{titulo}</strong> necesitamos que confirmes dos cosas:
        los Términos de Uso y la Política de Privacidad. La autorización para
        guardar tus datos de salud es opcional: si no la marcas, podrás usar la
        función pero no se guardarán tus notas de bienestar ni tu percepción de
        dolor. El consentimiento de analítica es opcional: si lo marcas, FitCasa
        enviará datos anónimos de uso (páginas visitadas) a Google Analytics;
        no se envían respuestas de cuestionario, ni registros del panel, ni
        datos de salud ni información personal. Todo lo que anotes se guarda en
        este navegador, no sale de tu dispositivo y FitCasa no lo envía a ningún
        servidor.
      </p>

      {motivo === 'updated' && (
        <div className="consent-guard__aviso" role="note">
          <IconoInfo />
          <p>
            {changed.length === 3
              ? 'Los documentos legales cambiaron desde tu última visita.'
              : `Desde tu última visita cambió el contenido de: ${changed.join(', ')}.`}{' '}
            Necesitamos volver a confirmarlos para registrar la versión que has leído.
          </p>
        </div>
      )}

      <form className="consent-guard__form" noValidate onSubmit={aceptar}>
        <div className={`consent-guard__bloque ${terms ? 'consent-guard__bloque--marcado' : ''}`}>
          <label className="consent-guard__casilla">
            <input
              type="checkbox"
              id="guard-terms"
              checked={terms}
              aria-describedby="guard-terms-note"
              onChange={(e) => {
                setTerms(e.target.checked);
                if (e.target.checked) setError('');
              }}
            />
            <span>
              He leído y acepto los{' '}
              <a href="#terminos" target="_blank" rel="noopener noreferrer">
                Términos de Uso
              </a>{' '}
              <span className="consent-guard__obligatorio">(obligatorio)</span>
            </span>
            {terms && (
              <svg className="consent-guard__estado" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" fill="none" stroke="var(--color-sobre-primario)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </label>
          <p id="guard-terms-note" className="consent-guard__nota">
            Versión {DOC_VERSIONS.terminos}. Se abre en una pestaña nueva para que no pierdas
            esta pantalla.
          </p>
        </div>

        <div className={`consent-guard__bloque ${privacy ? 'consent-guard__bloque--marcado' : ''}`}>
          <label className="consent-guard__casilla">
            <input
              type="checkbox"
              id="guard-privacy"
              checked={privacy}
              aria-describedby="guard-privacy-note"
              onChange={(e) => {
                setPrivacy(e.target.checked);
                if (e.target.checked) setError('');
              }}
            />
            <span>
              He leído la{' '}
              <a href="#privacidad" target="_blank" rel="noopener noreferrer">
                Política de Privacidad
              </a>{' '}
              <span className="consent-guard__obligatorio">(obligatorio)</span>
            </span>
            {privacy && (
              <svg className="consent-guard__estado" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" fill="none" stroke="var(--color-sobre-primario)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </label>
          <p id="guard-privacy-note" className="consent-guard__nota">
            Versión {DOC_VERSIONS.privacidad}. Explica qué datos se guardan, dónde y cómo
            borrarlos.
          </p>
        </div>

        <div className={`consent-guard__bloque consent-guard__bloque--autorizacion ${health ? 'consent-guard__bloque--marcado' : ''}`}>
          <p className="consent-guard__autorizacion-titulo">
            <IconoEscudo />
            Autorización para guardar tus datos de salud
          </p>
          <p className="consent-guard__proposito">
            <strong>Finalidad:</strong> {HEALTH_DATA_PURPOSE}
          </p>
          <label className="consent-guard__casilla">
            <input
              type="checkbox"
              id="guard-health"
              checked={health}
              aria-describedby="guard-health-note"
              onChange={(e) => {
                setHealth(e.target.checked);
                if (e.target.checked) setError('');
              }}
            />
            <span>
              Autorizo que FitCasa guarde en este dispositivo el dolor percibido y la nota
              de bienestar que anote <span className="consent-guard__obligatorio">(opcional)</span>
            </span>
            {health && (
              <svg className="consent-guard__estado" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" fill="none" stroke="var(--color-sobre-primario)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </label>
          <p id="guard-health-note" className="consent-guard__nota">
            Es una autorización separada de haber leído la Política. Puedes retirar tu
            aceptación en cualquier momento desde «Privacidad y borrado» del panel, y eso
            no borra por sí solo lo que ya habías escrito.
          </p>
        </div>

        <div className={`consent-guard__bloque consent-guard__bloque--analitica ${analytics ? 'consent-guard__bloque--marcado' : ''}`}>
          <p className="consent-guard__autorizacion-titulo">
            <IconoInfo />
            Medición anónima de uso con Google Analytics
          </p>
          <p className="consent-guard__proposito">
            <strong>Finalidad:</strong> entender qué páginas de FitCasa visitan las
            personas, de forma agregada y anónima, para mejorar el sitio. No se
            envían respuestas de cuestionarios, ni registros del panel, ni datos
            de salud, ni información personal.
          </p>
          <label className="consent-guard__casilla">
            <input
              type="checkbox"
              id="guard-analytics"
              checked={analytics}
              aria-describedby="guard-analytics-note"
              onChange={(e) => {
                setAnalytics(e.target.checked);
                if (e.target.checked) setError('');
              }}
            />
            <span>
              Permitir que FitCasa envíe datos anónimos de uso a Google Analytics
              <span className="consent-guard__obligatorio">(opcional)</span>
            </span>
            {analytics && (
              <svg className="consent-guard__estado" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" fill="none" stroke="var(--color-sobre-primario)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </label>
          <p id="guard-analytics-note" className="consent-guard__nota">
            Puedes retirar este consentimiento en cualquier momento borrando el
            almacenamiento local desde «Privacidad y borrado» del panel, o desde
            los ajustes de tu navegador.
          </p>
        </div>

        <div className="consent-guard__datos">
          <IconoCandado />
          <p>
            <strong>Qué se guarda de esta decisión:</strong> que aceptaste cada documento,
            con qué versión y en qué fecha y hora. Nada más: no se guarda tu nombre, ni
            correo, ni ubicación.
          </p>
        </div>

        <p className="consent-guard__alcance">
          Este registro vive en el almacenamiento local de tu navegador, que no está
          cifrado y que puedes editar o borrar cuando quieras. Es una trazabilidad
          personal, no un documento firmado. FitCasa no afirma cumplir ninguna
          legislación por tener esta pantalla: la aplicación de la normativa a este caso
          concreto requiere revisión jurídica.
        </p>

        <p className="consent-guard__error" id="guard-error" role="alert">
          {error}
        </p>

        <div className="consent-guard__acciones">
          <button type="submit" id="guard-accept" className="btn consent-guard__aceptar" disabled={!completo}>
            Aceptar y continuar
          </button>
          <button type="button" id="guard-decline" className="btn secondary consent-guard__volver" onClick={onDecline}>
            Volver al contenido público sin aceptar
          </button>
        </div>

        <p className="consent-guard__nota-fondo">
          <strong>No te pasa nada por leer los documentos:</strong> el contenido público de
          FitCasa —inicio, beneficios, ejercicios y guía de escoliosis— sigue disponible
          sin aceptar nada, y las páginas legales se pueden leer completas desde el pie.
        </p>
      </form>
    </main>
  );
};

export default ConsentGuard;