import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/style.css';
import './styles/fitcasa-app.css';
import './styles/quiz-page.css';
import './styles/ejercicios.css';
import './styles/scoliosis-page.css';
import './styles/panel-page.css';
import './styles/privacidad-page.css';
import './styles/plan-page.css';
import './styles/apoya-page.css';
import './styles/pausas-activas-page.css';
import './styles/terminos-page.css';
import './styles/actualidad-page.css';
import './styles/consent-guard.css';
import './styles/como-funciona.css';
import './styles/guided-session.css';
import './styles/salud-indicadores.css';
import './styles/alimentacion-page.css';

// Add js class to html documentElement for progressive enhancement matching original script
document.documentElement.classList.add('js');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
