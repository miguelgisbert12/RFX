import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/styles.css';
import App from './components/App';

const root = createRoot(document.getElementById('root'));

// Renderización de la aplicación en root
root.render(
  // StrictMode detecta errores y problemas potenciales
  <React.StrictMode> 
    {/* Renderización del componente principal App */}
    <App />
  </React.StrictMode>
);