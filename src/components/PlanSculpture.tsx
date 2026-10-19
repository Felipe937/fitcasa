import React from 'react';

/** Decorative route sculpture. It represents continuity, not clinical data. */
const PlanSculpture: React.FC = () => (
  <figure className="plan-sculpture" aria-hidden="true">
    <svg className="plan-sculpture__svg" viewBox="0 0 420 320" role="presentation">
      <ellipse className="plan-sculpture__orbit plan-sculpture__orbit--one" cx="214" cy="156" rx="150" ry="84" />
      <ellipse className="plan-sculpture__orbit plan-sculpture__orbit--two" cx="214" cy="156" rx="120" ry="142" />
      <path className="plan-sculpture__shadow" d="M82 260c31-20 91-30 143-30 59 0 112 12 135 31-25 18-78 28-137 28-54 0-112-10-141-29Z" />
      <path className="plan-sculpture__route plan-sculpture__route--deep" d="M98 189c21-74 95-122 163-105 57 14 92 72 72 121-18 44-79 58-133 39-50-18-77-60-61-96 17-38 68-54 113-38 38 13 61 47 51 77-11 32-54 46-92 32" />
      <path className="plan-sculpture__route plan-sculpture__route--sage" d="M92 163c21-60 83-108 143-101 65 8 107 67 89 119-17 48-79 73-136 57-55-15-86-61-68-101 17-38 68-60 119-48 44 11 72 48 63 82-9 33-52 51-92 39" />
      <path className="plan-sculpture__route plan-sculpture__route--clay" d="M121 85c42-25 101-24 136 5 36 30 42 83 11 112-29 28-82 27-115 2-31-23-38-66-15-91 24-26 69-31 101-10 27 18 35 53 18 75" />
      <path className="plan-sculpture__route plan-sculpture__route--light" d="M170 58c44 5 82 32 94 67 12 36-7 71-41 83-35 12-78-5-96-38-17-31-5-69 27-87" />
      <circle className="plan-sculpture__node plan-sculpture__node--one" cx="98" cy="189" r="8" />
      <circle className="plan-sculpture__node plan-sculpture__node--two" cx="328" cy="204" r="6" />
      <circle className="plan-sculpture__node plan-sculpture__node--three" cx="170" cy="58" r="7" />
      <path className="plan-sculpture__spark" d="M335 90v24m-12-12h24" />
    </svg>
    <figcaption>Cuatro semanas, una trayectoria que se construye sesión a sesión.</figcaption>
  </figure>
);

export default PlanSculpture;
