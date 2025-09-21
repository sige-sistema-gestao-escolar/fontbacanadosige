// importando as dependencias necessarias
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// importando todos os componentes da aplicacao
import Login from './components/Login';
import Register from './components/Register';
import DashboardAluno from './components/DashboardAluno';
import DashboardProfessor from './components/DashboardProfessor';
import DashboardEscola from './components/DashboardEscola';

// componente principal da aplicacao
function App() {
  return (
    // router que gerencia a navegacao entre paginas
    <Router>
      <div className="App">
        {/* definindo todas as rotas da aplicacao */}
        <Routes>
          {/* rota principal que leva pro login */}
          <Route path="/" element={<Login />} />
          {/* rota alternativa pro login */}
          <Route path="/login" element={<Login />} />
          {/* rota de cadastro */}
          <Route path="/register" element={<Register />} />
          {/* rotas dos dashboards especificos */}
          <Route path="/dashboard/aluno" element={<DashboardAluno />} />
          <Route path="/dashboard/professor" element={<DashboardProfessor />} />
          <Route path="/dashboard/escola" element={<DashboardEscola />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
