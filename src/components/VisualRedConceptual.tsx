const escribir = useCallback(() => {
    const escena = escenaRef.current;
    if (!escena) return;
    const { actual } = estado.current;
    escena.style.setProperty('--tx', `${actual.x.toFixed(2)}deg`);
    escena.style.setProperty('--ty', `${actual.y.toFixed(2)}deg`);
  }, []);

  const animar = useCallback(() => {
    const e = estado.current;
    e.frame = 0;
    const { actual, objetivo } = e;
    const nx = actual.x + (objetivo.x - actual.x) * SUAVIZADO;
    const ny = actual.y + (objetivo.y - actual.y) * SUAVIZADO;
    actual.x = Math.abs(objetivo.x - nx) < 0.05 ? objetivo.x : nx;
    actual.y = Math.abs(objetivo.y - ny) < 0.05 ? objetivo.y : ny;
    escribir();
    if (actual.x !== objetivo.x || actual.y !== objetivo.y) {
      e.frame = requestAnimationFrame(animar);
    }
  }, [escribir]);

  const fijarObjetivo = useCallback((x: number, y: number) => {
    const e = estado.current;
    e.objetivo = {
      x: Math.max(-LIMITE_INCLINACION, Math.min(LIMITE_INCLINACION, x)),
      y: Math.max(-LIMITE_GIRO, Math.min(LIMITE_GIRO, y)),
    };
    if (!e.frame) e.frame = requestAnimationFrame(animar);
  }, [animar]);

  useEffect(() => {
    const escena = escenaRef.current;
    if (!escena) return undefined;
    const marco = escena.closest('.visual-asociacion__marco');
    if (!(marco instanceof HTMLElement)) return undefined;

    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducir.matches || reducedMotion) {
      escena.style.setProperty('--tx', '0deg');
      escena.style.setProperty('--ty', '0deg');
      return undefined;
    }

    const punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!punteroFino.matches) return undefined;

    const alMover = (evento: PointerEvent) => {
      const caja = marco.getBoundingClientRect();
      if (caja.width === 0 || caja.height === 0) return;
      const dx = (evento.clientX - caja.left) / caja.width - 0.5;
      const dy = (evento.clientY - caja.top) / caja.height - 0.5;
      fijarObjetivo(-dy * LIMITE_INCLINACION * 2, dx * LIMITE_GIRO * 2);
    };

    const alSalir = () => fijarObjetivo(0, 0);

    marco.addEventListener('pointermove', alMover, { passive: true });
    marco.addEventListener('pointerleave', alSalir);

    return () => {
      marco.removeEventListener('pointermove', alMover);
      marco.removeEventListener('pointerleave', alSalir);
    };
  }, [fijarObjetivo]);