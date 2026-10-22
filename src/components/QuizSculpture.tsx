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
        </g>
      </svg>
    </div>
    <figcaption>Una propuesta que toma forma con tus respuestas.</figcaption>
  </figure>
);

export default QuizSculpture;
