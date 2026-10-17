import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/style.css';
import './styles/fitcasa-app.css';
import './styles/ejercicios.css';
import './styles/scoliosis-page.css';

// Add js class to html documentElement for progressive enhancement matching original script
document.documentElement.classList.add('js');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
