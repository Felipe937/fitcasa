import React from 'react';

/**
 * Escultura abstracta del cuestionario: cuatro placas apiladas en Z dentro de
 * una escena con perspectiva. Sugiere una forma que se construye por capas,
 * sin representar datos clínicos ni figuras humanas.
 *
 * La composición depende únicamente del paso actual (la clase
 * `quiz-page--step-N` del contenedor), nunca de las respuestas: el paso 1
 * muestra una capa, el 2 suma otra y el 3 completa la forma.
 */
const QuizSculpture: React.FC = () => (
  <figure className="quiz-sculpture" aria-hidden="true">
    <div className="quiz-sculpture__escena">
      <svg
        className="quiz-sculpture__svg"
        viewBox="0 0 400 320"
        role="presentation"
        focusable="false"
      >
        <ellipse className="quiz-sculpture__sombra" cx="200" cy="212" rx="104" ry="11" />
        <g className="quiz-sculpture__orbitas" aria-hidden="true">
          <path d="M 40 150 Q 200 40 360 150" />
          <path d="M 55 175 Q 200 70 345 175" />
          <line x1="30" y1="150" x2="370" y2="150" />
          <path d="M 60 125 Q 200 230 340 125" />
          <path d="M 75 195 Q 200 95 325 195" />
          <line x1="50" y1="135" x2="350" y2="165" />
          <path d="M 85 110 Q 200 210 315 110" />
          <line x1="55" y1="185" x2="345" y2="115" />
        </g>
        <g className="quiz-sculpture__capa quiz-sculpture__capa--1">
          <ellipse className="quiz-sculpture__canto" cx="200" cy="158" rx="172" ry="64" />
          <ellipse className="quiz-sculpture__placa" cx="200" cy="150" rx="172" ry="64" />
        </g>
        <g className="quiz-sculpture__capa quiz-sculpture__capa--2">
          <ellipse className="quiz-sculpture__canto" cx="200" cy="157" rx="126" ry="47" />
          <ellipse className="quiz-sculpture__placa quiz-sculpture__placa--dos" cx="200" cy="150" rx="126" ry="47" />
        </g>
        <g className="quiz-sculpture__capa quiz-sculpture__capa--3">
          <ellipse className="quiz-sculpture__canto" cx="200" cy="156" rx="84" ry="31" />
          <ellipse className="quiz-sculpture__placa quiz-sculpture__placa--tres" cx="200" cy="150" rx="84" ry="31" />
        </g>
        <g className="quiz-sculpture__capa quiz-sculpture__capa--4">
          <circle className="quiz-sculpture__nucleo" cx="200" cy="150" r="15" />
          <circle className="quiz-sculpture__nucleo-halo" cx="200" cy="150" r="24" />
        </g>
      </svg>
    </div>
    <figcaption>Una propuesta que toma forma con tus respuestas.</figcaption>
  </figure>
);

export default QuizSculpture;
