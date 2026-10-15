# FitCasa (React + Vite + TypeScript)

Aplicación web interactiva y accesible de ejercicio en casa con biblioteca de ejercicios, sugerencias de actividad deterministas, guía educativa sobre escoliosis y panel de seguimiento personal.

Reescrita como Single Page Application (SPA) en React con TypeScript y Vite a partir del proyecto original de FitCasa, preservando toda la identidad visual, contenido clínico, algoritmos y almacenamiento local.

## Características principales

- **Página de Inicio**: Navegación responsive, valores de la plataforma, beneficios del ejercicio en casa, resumen de programas y flujo de trabajo en 3 pasos (Explora, Orienta, Registra).
- **Biblioteca de Ejercicios**: Colección de 20 ejercicios ejecutados con peso corporal. Incluye buscador por texto (insensible a acentos), filtros combinados (duración, dificultad, equipamiento, zona corporal), ordenación, etiquetas activas y modal de detalle accesible con notas de adaptación y revisión clínica.
- **Sugerencias de Actividad (Cuestionario)**: Motor determinista en 3 pasos que evalúa objetivos, disponibilidad y preguntas de seguridad clínica para organizar propuestas educativas sin diagnósticos erróneos ni duplicados.
- **Panel de Seguimiento Personal**: Registro voluntario de actividad diaria, nivel subjetivo de dolor (escala 0-10) y notas de bienestar. Historial cronológico editable y eliminable, guardado exclusivamente en el navegador (`localStorage`) sin envío de datos a servidores.
- **Guía Educativa de Escoliosis**: Información con base en evidencia médica (SOSORT, NHS, OMS, Zhu et al. 2025, Lee & Tak 2026), tabla comparativa de estudios, señales de alarma (ordinaria vs urgencia médica), preguntas frecuentes y referencias bibliográficas.

## Pila Tecnológica

- **Framework**: React 18
- **Lenguaje**: TypeScript
- **Entorno de desarrollo y empaquetador**: Vite
- **Estilos**: Sistema CSS nativo de FitCasa con variables de diseño, tipografía fluida y respeto estricto a accesibilidad WCAG y movimiento reducido (`prefers-reduced-motion`).

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación se ejecutará en `http://localhost:3000`.

## Compilación para producción

```bash
npm run build
```

Genera la versión optimizada en la carpeta `dist/`.
