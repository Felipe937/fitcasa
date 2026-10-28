/**
 * Utilidad de Google Analytics 4 para FitCasa.
 *
 * Se carga únicamente cuando la persona ha otorgado consentimiento explícito
 * de analítica. No envía respuestas de cuestionarios, registros del panel,
 * datos de salud ni información personal. Solo vistas de página (ruta y título)
 * y eventos genéricos sin parámetros sensibles.
 *
 * El ID de medición es proporcionado por el propietario del proyecto.
 */

export const GA4_MEASUREMENT_ID = 'G-1MD0K19D1V';

let gtagReady = false;
let scriptLoading = false;
let scriptLoaded = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Carga de forma dinámica el script de gtag.js si aún no está cargado.
 * Devuelve una promesa que se resuelve cuando el script está listo.
 */
function ensureGtagScript(): Promise<void> {
  return new Promise((resolve) => {
    const existing = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}"]`
    );
    if (existing) {
      scriptLoaded = true;
      resolve();
      return;
    }

    if (scriptLoading) {
      const check = setInterval(() => {
        if (scriptLoaded) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      return;
    }

    scriptLoading = true;
    window.dataLayer = window.dataLayer || [];
    const gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag = gtag;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
    };
    script.onerror = () => {
      scriptLoading = false;
      resolve();
    };
    document.head.appendChild(script);
  });
}

/**
 * Inicializa GA4 con el ID de medición. Solo debe llamarse tras haber
 * confirmado que existe consentimiento de analítica.
 */
export async function initGA4(): Promise<void> {
  if (gtagReady) return;
  await ensureGtagScript();
  if (!scriptLoaded) return;
  const gtag = window.gtag;
  if (typeof gtag !== 'function') return;
  gtag('js', new Date());
  gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: false, // enviamos page_view manualmente en los cambios de ruta
  });
  gtagReady = true;
}

/**
 * Envía una vista de página a GA4. Debe llamarse tras initGA4().
 * `path` y `title` son valores públicos; nunca incluir datos personales.
 */
export function pageView(path: string, title: string): void {
  const gtag = window.gtag;
  if (!gtagReady || typeof gtag !== 'function') return;
  gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
  });
}

/**
 * Envía un evento genérico a GA4. `params` no debe contener datos personales,
 * respuestas de cuestionario, registros del panel ni datos de salud.
 */
export function event(name: string, params?: Record<string, string | number | boolean>): void {
  const gtag = window.gtag;
  if (!gtagReady || typeof gtag !== 'function') return;
  gtag('event', name, params ?? {});
}

/**
 * Comprueba si el registro de consentimiento incluye consentimiento de analítica.
 */
export function hasAnalyticsConsent(registry: { analytics?: { accepted: boolean } | null } | null): boolean {
  return !!registry?.analytics?.accepted;
}

/**
 * Desactiva el envío de eventos a GA4. Se usa cuando se revoca el consentimiento.
 * El script ya cargado no se descarga (no es posible limpiamente), pero se deja
 * de llamar a gtag() para que no se envíen más datos.
 */
export function disableGA4(): void {
  gtagReady = false;
  try {
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA4_MEASUREMENT_ID}`] = true;
  } catch {
    // no crítico
  }
}
