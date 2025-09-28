import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DashboardAluno from './components/DashboardAluno';
import DashboardProfessor from './components/DashboardProfessor';
import DashboardEscola from './components/DashboardEscola';
import GlobalClickSparkFinal from './components/GlobalClickSparkFinal';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/aluno" element={<DashboardAluno />} />
          <Route path="/dashboard/professor" element={<DashboardProfessor />} />
          <Route path="/dashboard/escola" element={<DashboardEscola />} />
        </Routes>
        
        <GlobalClickSparkFinal />
      </div>
    </Router>
  );
}

export default App;
