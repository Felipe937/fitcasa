import React from 'react';

/**
 * A conceptual, decorative form for the quiz hero.
 * It suggests movement and balance without representing clinical data.
 */
const QuizSculpture: React.FC = () => (
  <figure className="quiz-sculpture" aria-hidden="true">
    <svg className="quiz-sculpture__svg" viewBox="0 0 420 360" role="presentation">
      <ellipse className="quiz-sculpture__orbit quiz-sculpture__orbit--back" cx="210" cy="180" rx="150" ry="92" />
      <ellipse className="quiz-sculpture__orbit quiz-sculpture__orbit--front" cx="210" cy="180" rx="150" ry="92" />

      <path
        className="quiz-sculpture__shadow"
        d="M112 286c24-18 70-29 119-29 55 0 101 12 117 31-14 18-63 31-119 31-54 0-101-12-117-33Z"
      />

      <path
        className="quiz-sculpture__ribbon quiz-sculpture__ribbon--deep"
        d="M146 87c28-30 82-43 124-25 30 13 49 42 44 69-5 26-34 38-67 43-34 6-62 14-71 34-9 20 7 43 33 52 31 11 77 5 103-17 24-21 25-56 7-83-18-27-50-43-85-49-37-7-75 0-88 21-13 21-3 54 26 70"
      />
      <path
        className="quiz-sculpture__ribbon quiz-sculpture__ribbon--sage"
        d="M139 73c28-26 74-39 116-31 39 7 71 31 79 60 8 28-12 54-42 65-32 12-72 11-94 29-21 17-19 45 4 60 27 18 77 17 111-3 34-20 49-55 37-86-12-33-48-56-81-63-38-8-76-1-97 19-21 20-18 52 9 70"
      />
      <path
        className="quiz-sculpture__ribbon quiz-sculpture__ribbon--clay"
        d="M174 62c37-18 86-13 113 8 28 22 35 60 14 82-20 22-62 22-89 34-26 12-32 40-11 59 23 21 75 28 112 9 37-19 56-60 39-94-17-35-61-58-99-59-39-1-74 18-81 44-7 26 16 54 47 62"
      />
      <path
        className="quiz-sculpture__ribbon quiz-sculpture__ribbon--light"
        d="M209 54c30-3 61 10 76 32 16 23 13 53-7 69-20 16-55 17-78 31-24 14-28 42-7 62 23 22 70 35 108 24"
      />

      <circle className="quiz-sculpture__node quiz-sculpture__node--one" cx="145" cy="73" r="7" />
      <circle className="quiz-sculpture__node quiz-sculpture__node--two" cx="322" cy="173" r="5" />
      <circle className="quiz-sculpture__node quiz-sculpture__node--three" cx="188" cy="290" r="6" />
      <path className="quiz-sculpture__spark" d="M331 104v22m-11-11h22" />
    </svg>
    <figcaption>Una propuesta que toma forma con tus respuestas.</figcaption>
  </figure>
);

export default QuizSculpture;
