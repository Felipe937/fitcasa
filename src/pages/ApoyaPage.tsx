import React, { useState, useRef, useEffect } from 'react';
import { PageRoute } from '../components/Header';
import { CATALOGO_EQUIPAMIENTO } from '../data/productos';
import { ProductoRecomendado } from '../components/ProductoRecomendado';

interface ApoyaPageProps {
  onNavigate: (page: PageRoute, sectionId?: string) => void;
}

const DAVIPLATA_KEY = '@PLATA3213884340';
const DAVIPLATA_NAME = 'FELIPE ANDRES VARGAS SERRATO';
const QR_IMAGE_SRC = '/images/daviplata-bre-b-qr.png';

export const ApoyaPage: React.FC<ApoyaPageProps> = ({ onNavigate }) => {
  const [isQrExpanded, setIsQrExpanded] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const qrImageRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(DAVIPLATA_KEY);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 3000);
    } catch {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = QR_IMAGE_SRC;
    link.download = 'daviplata-bre-b-qr.png';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openModal = () => {
    previouslyFocusedRef.current = document.activeElement as HTMLElement;
    setIsQrExpanded(true);
    setTimeout(() => closeButtonRef.current?.focus(), 50);
  };

  const closeModal = () => {
    setIsQrExpanded(false);
    previouslyFocusedRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
    if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  useEffect(() => {
    if (isQrExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isQrExpanded]);

  return (
    <main id="contenido" tabIndex={-1} className="apoya-page container">
      <nav aria-label="Miga de pan" className="mb-4">
        <a
          href="#inicio"
          className="apoya-breadcrumb-link"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('inicio');
          }}
        >
          ← Volver al inicio
        </a>
      </nav>

      <header className="apoya-hero">
        <div className="apoya-hero__texto">
          <h1 className="apoya-titulo">Ayúdanos a llevar el movimiento más lejos</h1>
          <p className="apoya-intro">
            FitCasa es un proyecto educativo gratuito: guías, ejercicios, cuestionario y panel de seguimiento
            sin muros de pago, suscripciones obligatorias ni publicidad. Tu apoyo voluntario contribuye a
            su mantenimiento y evolución, y ayuda a que más personas puedan moverse y comprender mejor su
            bienestar desde casa.
          </p>
        </div>
        <div className="apoya-hero__escultura" aria-hidden="true">
          <svg viewBox="0 0 240 240" className="apoya-escultura__svg" focusable="false" role="presentation">
            <defs>
              <radialGradient id="apoya-escultura-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--color-fondo-verde)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--color-fondo)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="120" cy="120" r="108" fill="url(#apoya-escultura-glow)" />
            <g className="apoya-escultura__anello apoya-escultura__anello--1" fill="none" stroke="var(--color-primario)" strokeWidth="1.6">
              <ellipse cx="120" cy="120" rx="92" ry="34" />
            </g>
            <g className="apoya-escultura__anello apoya-escultura__anello--2" fill="none" stroke="var(--color-secundario)" strokeWidth="1.4">
              <ellipse cx="120" cy="120" rx="70" ry="86" />
            </g>
            <g className="apoya-escultura__anello apoya-escultura__anello--3" fill="none" stroke="var(--color-terciario)" strokeWidth="1.2" strokeDasharray="4 6">
              <ellipse cx="120" cy="120" rx="46" ry="46" />
            </g>
            <g className="apoya-escultura__nodo" fill="var(--color-primario-oscuro)">
              <circle cx="120" cy="36" r="5" />
              <circle cx="206" cy="120" r="4" />
              <circle cx="120" cy="204" r="5" />
              <circle cx="34" cy="120" r="4" />
            </g>
          </svg>
        </div>
      </header>

      <section className="apoya-qr-section" aria-labelledby="qr-heading">
        <h2 id="qr-heading" className="apoya-seccion-titulo">QR para apoyar vía DaviPlata / Bre-B</h2>

        <div className="apoya-qr-card">
          <figure className="apoya-qr-figura">
            <img
              ref={qrImageRef}
              src={QR_IMAGE_SRC}
              alt={`Código QR de DaviPlata/Bre-B a nombre de ${DAVIPLATA_NAME}. La llave es ${DAVIPLATA_KEY}`}
              className="apoya-qr-imagen"
              loading="lazy"
            />
            <figcaption className="sr-only">
              Código QR para transferir a ${DAVIPLATA_NAME}, llave ${DAVIPLATA_KEY}
            </figcaption>
          </figure>

          <div className="apoya-qr-acciones">
            <button
              type="button"
              className="btn secondary apoya-btn-ampliar"
              onClick={openModal}
              aria-label="Ampliar código QR para facilitar el escaneo"
            >
              <svg className="apoya-btn-icono" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                <path d="M10 15l5.5-5.5L14 8l-4 4 4 4 1.5-1.5z" />
              </svg>
              Ampliar QR
            </button>

            <button
              type="button"
              className="btn secondary apoya-btn-descargar"
              onClick={handleDownloadQr}
              aria-label="Descargar imagen del código QR"
            >
              <svg className="apoya-btn-icono" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              Descargar QR
            </button>
          </div>
        </div>

        <div className="apoya-instrucciones">
          <h3 className="apoya-instrucciones-titulo">Cómo realizar el apoyo</h3>
          <ol className="apoya-pasos">
            <li>Abre la aplicación de tu banco o billetera digital (DaviPlata, Nequi, Bancolombia, etc.).</li>
            <li>Busca la opción «Pasar plata», «Transferir» o «Pagar con QR».</li>
            <li>Escanea el código QR de arriba con la cámara de la aplicación.</li>
            <li>
              <strong>Verifica el destinatario</strong> ({DAVIPLATA_NAME}) y el monto antes de confirmar.
            </li>
            <li>Confirma la transferencia desde tu aplicación financiera.</li>
          </ol>
        </div>

        <div className="apoya-alternativa" role="region" aria-label="Alternativa textual para copiar la llave">
          <h3 className="apoya-instrucciones-titulo">¿No puedes escanear el QR?</h3>
          <p className="apoya-alternativa-texto">
            Copia la llave DaviPlata / Bre-B y pégala manualmente en tu aplicación bancaria:
          </p>
          <div className="apoya-llave-contenedor">
            <code className="apoya-llave" id="apoya-llave" aria-label="Llave DaviPlata">{DAVIPLATA_KEY}</code>
            <button
              type="button"
              className="btn apoya-btn-copiar"
              onClick={handleCopyKey}
              aria-describedby="copy-status"
              aria-label={copyStatus === 'success' ? 'Llave copiada al portapapeles' : 'Copiar llave al portapapeles'}
            >
              {copyStatus === 'success' ? (
                <>
                  <svg className="apoya-btn-icono" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  ¡Copiado!
                </>
              ) : copyStatus === 'error' ? (
                <>
                  <svg className="apoya-btn-icono" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  Error al copiar
                </>
              ) : (
                <>
                  <svg className="apoya-btn-icono" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                  Copiar llave
                </>
              )}
            </button>
            <p id="copy-status" className="sr-only" aria-live="polite" aria-atomic="true">
              {copyStatus === 'success' && 'Llave copiada al portapapeles'}
              {copyStatus === 'error' && 'Error al copiar la llave, inténtalo de nuevo'}
            </p>
          </div>
          <p className="apoya-nota-llave">
            Destinatario: <strong>{DAVIPLATA_NAME}</strong>.
          </p>
        </div>

        <div className="apoya-advertencia" role="note">
          <svg className="apoya-advertencia-icono" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M12 3.6 2.6 20h18.8L12 3.6Z" />
            <path d="M12 10v4.5" />
            <path d="M12 17.6h.01" />
          </svg>
          <div>
            <strong>Importante:</strong> FitCasa no verifica ni registra automáticamente los pagos.
            La transferencia se realiza desde tu propia aplicación financiera.
            Comprueba siempre el destinatario y el monto en la pantalla de confirmación de tu banco o billetera antes de autorizar la operación.
            Este apoyo no genera deducción fiscal ni constituye una donación benéfica oficialmente reconocida.
          </div>
        </div>
      </section>

      <section className="apoya-equipamiento-section" aria-labelledby="equipamiento-heading">
        <h2 id="equipamiento-heading" className="apoya-seccion-titulo">Herramientas para moverte en casa</h2>
        <p className="apoya-equipamiento-subtitulo">
          Material básico que puede hacer más cómodas tus sesiones de movilidad y fuerza.
        </p>

        <div className="apoya-divulgacion-amazon" role="note">
          <p className="apoya-divulgacion-texto-ingles">
            <strong>As an Amazon Associate I earn from qualifying purchases.</strong>
          </p>
          <p className="apoya-divulgacion-texto-espanol">
            FitCasa participa en el programa de afiliados de Amazon. Si compras a través de estos enlaces
            patrocinados, FitCasa recibe una pequeña comisión sin ningún coste extra para ti, lo que nos ayuda
            a mantener el proyecto gratuito y sin publicidad.
          </p>
        </div>

        <div className="apoya-equipamiento-grid">
          {CATALOGO_EQUIPAMIENTO.map((producto) => (
            <ProductoRecomendado key={producto.id} producto={producto} variant="card" />
          ))}
        </div>
      </section>

      <section className="apoya-gracias" aria-labelledby="gracias-heading">
        <h2 id="gracias-heading" className="apoya-seccion-titulo">Gracias por estar aquí</h2>
        <p className="apoya-gracias-texto">
          Ya sea que decidas apoyar o no, valoramos que formes parte de esta comunidad.
          FitCasa existe para ofrecer información útil y accesible sobre ejercicio y escoliosis,
          y tu presencia —leyendo, compartiendo o simplemente probando los ejercicios—
          ya es una forma de apoyo.
        </p>
      </section>

      {isQrExpanded && (
        <div
          ref={modalRef}
          className="apoya-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onKeyDown={handleKeyDown}
        >
          <div className="apoya-modal-contenido">
            <div className="apoya-modal-cabecera">
              <h2 id="modal-title" className="apoya-modal-titulo">Código QR ampliado</h2>
              <button
                ref={closeButtonRef}
                type="button"
                className="apoya-modal-cerrar"
                onClick={closeModal}
                aria-label="Cerrar vista ampliada"
              >
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
            <figure className="apoya-modal-qr">
              <img
                src={QR_IMAGE_SRC}
                alt={`Código QR de DaviPlata/Bre-B a nombre de ${DAVIPLATA_NAME}. La llave es ${DAVIPLATA_KEY}`}
                className="apoya-modal-qr-imagen"
              />
              <figcaption className="apoya-modal-qr-leyenda">
                Destinatario: {DAVIPLATA_NAME} · Llave: {DAVIPLATA_KEY}
              </figcaption>
            </figure>
          </div>
        </div>
      )}
    </main>
  );
};

export default ApoyaPage;