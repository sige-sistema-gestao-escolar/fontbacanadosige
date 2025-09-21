import React, { useState, useEffect } from 'react';

const DashboardEscola = () => {
  const [registrarAulaModal, setRegistrarAulaModal] = useState(false);
  const [registrarNotasModal, setRegistrarNotasModal] = useState(false);
  const [relatorioConteudoModal, setRelatorioConteudoModal] = useState(false);
  const [relatorioFrequenciaModal, setRelatorioFrequenciaModal] = useState(false);
  const [quadroHorariosModal, setQuadroHorariosModal] = useState(false);
  const [gerenciarProfessoresModal, setGerenciarProfessoresModal] = useState(false);
  const [gerenciarAlunosModal, setGerenciarAlunosModal] = useState(false);
  const [presencaModal, setPresencaModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);

  // estados para melhorias de UX
  const [notificacao, setNotificacao] = useState({ show: false, tipo: '', mensagem: '' });
  const [buscaProfessores, setBuscaProfessores] = useState('');
  const [buscaAlunos, setBuscaAlunos] = useState('');
  const [filtroDisciplina, setFiltroDisciplina] = useState('todos');
  const [filtroTurma, setFiltroTurma] = useState('todos');

  const [aulaData, setAulaData] = useState({
    disciplina: '',
    turma: '',
    data: '',
    horarioInicio: '',
    horarioFim: '',
    conteudo: '',
    observacoes: ''
  });

  const [notasData, setNotasData] = useState({
    disciplina: '',
    turma: '',
    bimestre: '',
    aluno: '',
    nota: ''
  });

  const [professorData, setProfessorData] = useState({
    nome: '',
    cpf: '',
    email: '',
    disciplina: ''
  });

  const [alunoData, setAlunoData] = useState({
    nome: '',
    email: '',
    turma: '',
    escola: ''
  });

  // dados de exemplo
  const [professores] = useState([
    { id: 1, nome: 'João Silva', cpf: '123.456.789-00', email: 'joao@escola.com', disciplina: 'Matemática', status: 'ativo' },
    { id: 2, nome: 'Maria Santos', cpf: '987.654.321-00', email: 'maria@escola.com', disciplina: 'Português', status: 'ativo' },
    { id: 3, nome: 'Pedro Costa', cpf: '456.789.123-00', email: 'pedro@escola.com', disciplina: 'História', status: 'inativo' },
    { id: 4, nome: 'Ana Oliveira', cpf: '789.123.456-00', email: 'ana@escola.com', disciplina: 'Ciências', status: 'ativo' }
  ]);

  const [alunos] = useState([
    { id: 1, nome: 'Carlos Almeida', email: 'carlos@email.com', turma: '1º A', ra: '2024001', status: 'ativo' },
    { id: 2, nome: 'Julia Ferreira', email: 'julia@email.com', turma: '1º A', ra: '2024002', status: 'ativo' },
    { id: 3, nome: 'Lucas Souza', email: 'lucas@email.com', turma: '2º B', ra: '2024003', status: 'ativo' },
    { id: 4, nome: 'Mariana Lima', email: 'mariana@email.com', turma: '2º B', ra: '2024004', status: 'inativo' }
  ]);

  const [alunosPresenca] = useState([
    { id: 1, nome: 'ANA CLARA ALENCAR CÉSAR DE ARAÚJO', ra: '71519485182', presente: true },
    { id: 2, nome: 'ANA LUIZA MENESES DA SILVA', ra: '72350320855', presente: true },
    { id: 3, nome: 'ARTHUR ALMEIDA DOURADO', ra: '71583319581', presente: true },
    { id: 4, nome: 'BIANCA LORRANNY FIDALGO DE SOUSA', ra: '71541225562', presente: true },
    { id: 5, nome: 'BRENO RAFAEL LEMOS NUNES', ra: '71246141671', presente: true }
  ]);

  const handleAulaChange = (e) => {
    const { name, value } = e.target;
    setAulaData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotasChange = (e) => {
    const { name, value } = e.target;
    setNotasData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfessorChange = (e) => {
    const { name, value } = e.target;
    setProfessorData(prev => ({ ...prev, [name]: value }));
  };

  const handleAlunoChange = (e) => {
    const { name, value } = e.target;
    setAlunoData(prev => ({ ...prev, [name]: value }));
  };

  const handleAulaSubmit = (e) => {
    e.preventDefault();
    
    // validacao de horarios
    if (aulaData.horarioInicio && aulaData.horarioFim) {
      const inicio = new Date(`2000-01-01 ${aulaData.horarioInicio}`);
      const fim = new Date(`2000-01-01 ${aulaData.horarioFim}`);
      if (inicio >= fim) {
        mostrarNotificacao('error', 'Horário de início deve ser anterior ao horário de fim!');
        return;
      }
    }
    
    console.log('Dados da aula:', aulaData);
    setRegistrarAulaModal(false);
    setPresencaModal(true);
  };

  // funcao para mostrar notificacoes
  const mostrarNotificacao = (tipo, mensagem) => {
    setNotificacao({ show: true, tipo, mensagem });
    setTimeout(() => {
      setNotificacao({ show: false, tipo: '', mensagem: '' });
    }, 3000);
  };

  // funcoes para presenca
  const handlePresencaChange = (alunoId) => {
    // implementar logica de presenca se necessario
  };

  const handlePresencaSubmit = () => {
    console.log('Lista de presença:', alunosPresenca);
    setPresencaModal(false);
    setAulaData({ disciplina: '', turma: '', data: '', horarioInicio: '', horarioFim: '', conteudo: '', observacoes: '' });
    mostrarNotificacao('success', 'Aula registrada com sucesso!');
  };

  // filtros
  const professoresFiltrados = professores.filter(prof => {
    const matchBusca = prof.nome.toLowerCase().includes(buscaProfessores.toLowerCase()) || 
                      prof.email.toLowerCase().includes(buscaProfessores.toLowerCase());
    const matchDisciplina = filtroDisciplina === 'todos' || prof.disciplina === filtroDisciplina;
    return matchBusca && matchDisciplina;
  });

  const alunosFiltrados = alunos.filter(aluno => {
    const matchBusca = aluno.nome.toLowerCase().includes(buscaAlunos.toLowerCase()) || 
                      aluno.email.toLowerCase().includes(buscaAlunos.toLowerCase());
    const matchTurma = filtroTurma === 'todos' || aluno.turma === filtroTurma;
    return matchBusca && matchTurma;
  });

  const handleNotasSubmit = (e) => {
    e.preventDefault();
    console.log('Dados das notas:', notasData);
    setRegistrarNotasModal(false);
    setNotasData({ disciplina: '', turma: '', bimestre: '', aluno: '', nota: '' });
  };

  const handleProfessorSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do professor:', professorData);
    setGerenciarProfessoresModal(false);
    setProfessorData({ nome: '', cpf: '', email: '', disciplina: '' });
  };

  const handleAlunoSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do aluno:', alunoData);
    setGerenciarAlunosModal(false);
    setAlunoData({ nome: '', email: '', turma: '', escola: '' });
  };

  useEffect(() => {
    // Inicializar os icones Feather
    if (window.feather) {
      window.feather.replace();
    }
  }, [registrarAulaModal, presencaModal, previewModal, gerenciarProfessoresModal, gerenciarAlunosModal, notificacao.show]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notificacao */}
      {notificacao.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          notificacao.tipo === 'success' ? 'bg-green-500 text-white' : 
          notificacao.tipo === 'error' ? 'bg-red-500 text-white' : 
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            <i data-feather={notificacao.tipo === 'success' ? 'check-circle' : 'alert-circle'} className="w-5 h-5"></i>
            <span className="font-medium">{notificacao.mensagem}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <i data-feather="home" className="w-8 h-8"></i>
              <h1 className="text-2xl font-bold">SIGE - Área Administrativa</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:block">Bem-vindo, Administrador</span>
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center">
                <i data-feather="user" className="w-5 h-5"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Registrar/Alterar Aula */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <i data-feather="calendar" className="w-6 h-6"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Registrar/Alterar Aula</h2>
              </div>
              <p className="text-gray-600 mb-6">Registre ou altere o conteúdo e observações das aulas.</p>
              <button 
                onClick={() => setRegistrarAulaModal(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:shadow-md"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 2: Registrar/Alterar Notas */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <i data-feather="edit-3" className="w-6 h-6"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Registrar/Alterar Notas</h2>
              </div>
              <p className="text-gray-600 mb-6">Lance ou altere as notas dos alunos por disciplina e bimestre.</p>
              <button 
                onClick={() => setRegistrarNotasModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:shadow-md"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 3: Relatorio de Conteudo */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <i data-feather="file-text" className="w-6 h-6"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Relatório de Conteúdo</h2>
              </div>
              <p className="text-gray-600 mb-6">Gere relatórios do conteúdo ministrado.</p>
              <button 
                onClick={() => setRelatorioConteudoModal(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:shadow-md"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 4: Relatorio de Frequencia */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                  <i data-feather="users" className="w-6 h-6"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Relatório de Frequência</h2>
              </div>
              <p className="text-gray-600 mb-6">Gere relatórios de frequência dos alunos.</p>
              <button 
                onClick={() => setRelatorioFrequenciaModal(true)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:shadow-md"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 5: Quadro de Horarios */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                  <i data-feather="clock" className="w-6 h-6"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Quadro de Horarios</h2>
              </div>
              <p className="text-gray-600 mb-6">Registre ou altere o quadro de horarios da escola.</p>
              <button 
                onClick={() => setQuadroHorariosModal(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:shadow-md"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 6: Gerenciar Professores */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                  <i data-feather="user-plus" className="w-6 h-6"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Gerenciar Professores</h2>
              </div>
              <p className="text-gray-600 mb-6">Registre ou altere dados dos professores.</p>
              <button 
                onClick={() => setGerenciarProfessoresModal(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:shadow-md"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 7: Gerenciar Alunos */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
                  <i data-feather="users" className="w-6 h-6"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Gerenciar Alunos</h2>
              </div>
              <p className="text-gray-600 mb-6">Registre ou altere dados dos alunos.</p>
              <button 
                onClick={() => setGerenciarAlunosModal(true)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:shadow-md"
              >
                Acessar
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Registrar Aula */}
      {registrarAulaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Registrar/Alterar Aula</h3>
                <button onClick={() => setRegistrarAulaModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <form onSubmit={handleAulaSubmit} className="space-y-4">
                <div>
                  <label htmlFor="disciplina" className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                  <input 
                    type="text" 
                    id="disciplina" 
                    name="disciplina"
                    value={aulaData.disciplina}
                    onChange={handleAulaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="turma" className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                  <input 
                    type="text" 
                    id="turma" 
                    name="turma"
                    value={aulaData.turma}
                    onChange={handleAulaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">Data da Aula</label>
                  <input 
                    type="date" 
                    id="data" 
                    name="data"
                    value={aulaData.data}
                    onChange={handleAulaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-1">Conteúdo Ministrado</label>
                  <textarea 
                    id="conteudo" 
                    name="conteudo"
                    rows="3" 
                    value={aulaData.conteudo}
                    onChange={handleAulaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea 
                    id="observacoes" 
                    name="observacoes"
                    rows="2" 
                    value={aulaData.observacoes}
                    onChange={handleAulaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setRegistrarAulaModal(false)} 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 shadow-md"
                  >
                    Salvar Aula
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Notas */}
      {registrarNotasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Registrar/Alterar Notas</h3>
                <button onClick={() => setRegistrarNotasModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <form onSubmit={handleNotasSubmit} className="space-y-4">
                <div>
                  <label htmlFor="disciplina" className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                  <input 
                    type="text" 
                    id="disciplina" 
                    name="disciplina"
                    value={notasData.disciplina}
                    onChange={handleNotasChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="turma" className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                  <input 
                    type="text" 
                    id="turma" 
                    name="turma"
                    value={notasData.turma}
                    onChange={handleNotasChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="bimestre" className="block text-sm font-medium text-gray-700 mb-1">Bimestre</label>
                  <select 
                    id="bimestre" 
                    name="bimestre"
                    value={notasData.bimestre}
                    onChange={handleNotasChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione o bimestre</option>
                    <option value="1">1º Bimestre</option>
                    <option value="2">2º Bimestre</option>
                    <option value="3">3º Bimestre</option>
                    <option value="4">4º Bimestre</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="aluno" className="block text-sm font-medium text-gray-700 mb-1">Aluno</label>
                  <input 
                    type="text" 
                    id="aluno" 
                    name="aluno"
                    value={notasData.aluno}
                    onChange={handleNotasChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="nota" className="block text-sm font-medium text-gray-700 mb-1">Nota</label>
                  <input 
                    type="number" 
                    id="nota" 
                    name="nota"
                    min="0" 
                    max="10" 
                    step="0.1"
                    value={notasData.nota}
                    onChange={handleNotasChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setRegistrarNotasModal(false)} 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-md"
                  >
                    Salvar Nota
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gerenciar Professores */}
      {gerenciarProfessoresModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Gerenciar Professores</h3>
                <button onClick={() => setGerenciarProfessoresModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <form onSubmit={handleProfessorSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    id="nome" 
                    name="nome"
                    value={professorData.nome}
                    onChange={handleProfessorChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input 
                    type="text" 
                    id="cpf" 
                    name="cpf"
                    value={professorData.cpf}
                    onChange={handleProfessorChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={professorData.email}
                    onChange={handleProfessorChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="disciplina" className="block text-sm font-medium text-gray-700 mb-1">Disciplina</label>
                  <input 
                    type="text" 
                    id="disciplina" 
                    name="disciplina"
                    value={professorData.disciplina}
                    onChange={handleProfessorChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setGerenciarProfessoresModal(false)} 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 shadow-md"
                  >
                    Salvar Professor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gerenciar Alunos */}
      {gerenciarAlunosModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Gerenciar Alunos</h3>
                <button onClick={() => setGerenciarAlunosModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <form onSubmit={handleAlunoSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    id="nome" 
                    name="nome"
                    value={alunoData.nome}
                    onChange={handleAlunoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={alunoData.email}
                    onChange={handleAlunoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="turma" className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                  <input 
                    type="text" 
                    id="turma" 
                    name="turma"
                    value={alunoData.turma}
                    onChange={handleAlunoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="escola" className="block text-sm font-medium text-gray-700 mb-1">Escola</label>
                  <input 
                    type="text" 
                    id="escola" 
                    name="escola"
                    value={alunoData.escola}
                    onChange={handleAlunoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setGerenciarAlunosModal(false)} 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300 shadow-md"
                  >
                    Salvar Aluno
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modais de Relatorios */}
      {relatorioConteudoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Relatório de Conteúdo</h3>
                <button onClick={() => setRelatorioConteudoModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <div className="text-center py-8">
                <i data-feather="file-text" className="w-16 h-16 mx-auto text-purple-500 mb-4"></i>
                <p className="text-gray-600 mb-6">Relatório de conteúdo será gerado aqui</p>
                <button 
                  onClick={() => setRelatorioConteudoModal(false)} 
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300 shadow-md"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {relatorioFrequenciaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Relatório de Frequência</h3>
                <button onClick={() => setRelatorioFrequenciaModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <div className="text-center py-8">
                <i data-feather="users" className="w-16 h-16 mx-auto text-yellow-500 mb-4"></i>
                <p className="text-gray-600 mb-6">Relatório de frequência será gerado aqui</p>
                <button 
                  onClick={() => setRelatorioFrequenciaModal(false)} 
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors duration-300 shadow-md"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quadroHorariosModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Quadro de Horarios</h3>
                <button onClick={() => setQuadroHorariosModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <div className="text-center py-8">
                <i data-feather="clock" className="w-16 h-16 mx-auto text-indigo-500 mb-4"></i>
                <p className="text-gray-600 mb-6">Quadro de horarios sera exibido aqui (com permissao de edicao)</p>
                <button 
                  onClick={() => setQuadroHorariosModal(false)} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300 shadow-md"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardEscola;
