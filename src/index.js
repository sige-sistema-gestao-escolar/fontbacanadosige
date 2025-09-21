// importando as dependencias do react
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // estilos globais
import App from './App'; // componente principal

// criando a raiz da aplicacao
const root = ReactDOM.createRoot(document.getElementById('root'));

// renderizando a aplicacao na tela
root.render(
  <React.StrictMode>
    {/* strict mode ajuda a encontrar problemas no codigo */}
    <App />
  </React.StrictMode>
);
