import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Acessibilidade from './Acessibilidade';

const DashboardEscola = () => {
  const navigate = useNavigate();
  
  const [disciplinaModal, setDisciplinaModal] = useState(false);
  const [registrarAulaModal, setRegistrarAulaModal] = useState(false);
  const [registrarNotasModal, setRegistrarNotasModal] = useState(false);
  const [relatorioConteudoModal, setRelatorioConteudoModal] = useState(false);
  const [relatorioFrequenciaModal, setRelatorioFrequenciaModal] = useState(false);
  const [quadroHorariosModal, setQuadroHorariosModal] = useState(false);
  const [gerenciarProfessoresModal, setGerenciarProfessoresModal] = useState(false);
  const [gerenciarAlunosModal, setGerenciarAlunosModal] = useState(false);
  const [presencaModal, setPresencaModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);

  const [perfilMenu, setPerfilMenu] = useState(false);
  const [configuracoesOpen, setConfiguracoesOpen] = useState(false);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('');
  const [acaoSelecionada, setAcaoSelecionada] = useState('');
  
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
    matricula: '',
    disciplina: ''
  });

  const [alunoData, setAlunoData] = useState({
    nome: '',
    email: '',
    matricula: '',
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

  // disciplinas disponiveis
  const disciplinas = [
    'Matemática', 'Português', 'História', 'Geografia', 'Ciências', 
    'Física', 'Química', 'Biologia', 'Educação Física', 'Artes', 
    'Inglês', 'Espanhol', 'Filosofia', 'Sociologia'
  ];

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
    setRegistrarNotasModal(false);
    setNotasData({ disciplina: '', turma: '', bimestre: '', aluno: '', nota: '' });
  };

  const handleProfessorSubmit = (e) => {
    e.preventDefault();
    setGerenciarProfessoresModal(false);
    setProfessorData({ nome: '', cpf: '', email: '', matricula: '', disciplina: '' });
  };

  const handleAlunoSubmit = (e) => {
    e.preventDefault();
    setGerenciarAlunosModal(false);
    setAlunoData({ nome: '', email: '', matricula: '', turma: '', escola: '' });
  };

  // funcoes para disciplina
  const handleDisciplinaAcao = (acao) => {
    setAcaoSelecionada(acao);
    setDisciplinaModal(true);
  };

  const handleDisciplinaSubmit = () => {
    if (!disciplinaSelecionada) {
      mostrarNotificacao('error', 'Selecione uma disciplina!');
      return;
    }

    // atualiza os dados com a disciplina selecionada
    setAulaData(prev => ({ ...prev, disciplina: disciplinaSelecionada }));
    setNotasData(prev => ({ ...prev, disciplina: disciplinaSelecionada }));

    setDisciplinaModal(false);

    // abre o modal correspondente
    if (acaoSelecionada === 'aula') {
      setRegistrarAulaModal(true);
    } else if (acaoSelecionada === 'nota') {
      setRegistrarNotasModal(true);
    }

    // limpa selecoes
    setDisciplinaSelecionada('');
    setAcaoSelecionada('');
  };

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, []);


  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--edu-dark-bg)'}}>
      {/* terminal de navegacao pra os bacana, abaixo depois retirar */}
      <div className="fixed bottom-4 left-4 z-50 bg-gray-800 text-white rounded-lg shadow-lg p-3" style={{pointerEvents: 'none'}}>
        <div className="text-xs text-gray-800 mb-2">DEV NAV</div>
        <div className="flex flex-wrap gap-1">
          <button 
            onClick={() => navigate('/')} 
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
            style={{pointerEvents: 'auto'}}
          >
            Home
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className="px-2 py-1 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded text-xs transition-colors"
            style={{pointerEvents: 'auto'}}
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="px-2 py-1 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded text-xs transition-colors"
            style={{pointerEvents: 'auto'}}
          >
            Register
          </button>
          <button 
            onClick={() => navigate('/dashboard/aluno')} 
            className="px-2 py-1 bg-orange-600 hover:bg-orange-700 rounded text-xs transition-colors"
            style={{pointerEvents: 'auto'}}
          >
            Aluno
          </button>
          <button 
            onClick={() => navigate('/dashboard/professor')} 
            className="px-2 py-1 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded text-xs transition-colors"
            style={{pointerEvents: 'auto'}}
          >
            Professor
          </button>
          <button 
            onClick={() => navigate('/dashboard/escola')} 
            className="px-2 py-1 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 rounded text-xs transition-colors"
            style={{pointerEvents: 'auto'}}
          >
            Escola
          </button>
        </div>
      </div>

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
      <header className="modern-header relative z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="header-content flex justify-between items-center">
            <div className="header-logo">
              <div className="logo-icon">
                <img src="/logo projeto.png" alt="SIGE Logo" />
              </div>
              <div>
                <p className="header-subtitle">Área Administrativa</p>
              </div>
            </div>
            
            <div className="header-user">
              <div className="user-info">
                <span className="user-name">Bem-vindo, Administrador</span>
                <span className="user-role">Gestão Escolar</span>
              </div>
              
              <button 
                onClick={() => setPerfilMenu(!perfilMenu)}
                className="user-avatar"
              >
                <i data-feather="user"></i>
              </button>
              
              <button 
                onClick={() => {
                  mostrarNotificacao('success', 'Logout realizado com sucesso!');
                  setTimeout(() => navigate('/login'), 1500);
                }}
                className="logout-button"
                title="Sair"
              >
                <i data-feather="log-out"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Menu do usuário */}
        {perfilMenu && (
          <div className="user-menu">
            <button className="user-menu-item">
              <i data-feather="user"></i>
              <span>Perfil</span>
            </button>
            <button className="user-menu-item">
              <i data-feather="settings"></i>
              <span>Configurações</span>
            </button>
            <button className="user-menu-item logout" onClick={() => {
              mostrarNotificacao('success', 'Logout realizado com sucesso!');
              setTimeout(() => navigate('/login'), 1500);
            }}>
              <i data-feather="log-out"></i>
              <span>Sair</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Card 1: Disciplinas */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon primary">
                <i data-feather="book-open"></i>
              </div>
              
              <h2 className="card-title">Disciplinas</h2>
              <p className="card-description">Gerencie aulas e notas por disciplina específica de forma organizada.</p>
              
              <div className="w-full space-y-3">
                <button 
                  onClick={() => handleDisciplinaAcao('aula')}
                  className="w-full btn-primary py-3 px-6 flex items-center justify-center space-x-2"
                >
                  <i data-feather="calendar" className="w-4 h-4"></i>
                  <span>Registrar Aula</span>
                </button>
                
                <button 
                  onClick={() => handleDisciplinaAcao('nota')}
                  className="w-full btn-primary py-3 px-6 flex items-center justify-center space-x-2"
                >
                  <i data-feather="edit-3" className="w-4 h-4"></i>
                  <span>Registrar Notas</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Relatório de Conteúdo */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon neutral">
                <i data-feather="file-text"></i>
              </div>
              
              <h2 className="card-title">Relatório de Conteúdo</h2>
              <p className="card-description">Gere relatórios detalhados do conteúdo ministrado pelos professores.</p>
              
              <button 
                onClick={() => setRelatorioConteudoModal(true)}
                className="w-full btn-primary py-3 px-6"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 3: Relatório de Frequência */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon neutral">
                <i data-feather="users"></i>
              </div>
              
              <h2 className="card-title">Relatório de Frequência</h2>
              <p className="card-description">Gere relatórios detalhados de frequência de todos os alunos.</p>
              
              <button 
                onClick={() => setRelatorioFrequenciaModal(true)}
                className="w-full btn-primary py-3 px-6"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 4: Quadro de Horários */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon secondary">
                <i data-feather="clock"></i>
              </div>
              
              <h2 className="card-title">Quadro de Horários</h2>
              <p className="card-description">Registre ou altere o quadro de horários da escola de forma organizada.</p>
              
              <button 
                onClick={() => setQuadroHorariosModal(true)}
                className="w-full btn-primary py-3 px-6"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 5: Gerenciar Professores */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon accent">
                <i data-feather="user-plus"></i>
              </div>
              
              <h2 className="card-title">Gerenciar Professores</h2>
              <p className="card-description">Registre ou altere dados dos professores da instituição.</p>
              
              <button 
                onClick={() => setGerenciarProfessoresModal(true)}
                className="w-full btn-primary py-3 px-6"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 6: Gerenciar Alunos */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon secondary">
                <i data-feather="users"></i>
              </div>
              
              <h2 className="card-title">Gerenciar Alunos</h2>
              <p className="card-description">Registre ou altere dados dos alunos da instituição.</p>
              
              <button 
                onClick={() => setGerenciarAlunosModal(true)}
                className="w-full btn-primary py-3 px-6"
              >
                Acessar
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Seleção de Disciplina */}
      {disciplinaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-slate-100">
                  {acaoSelecionada === 'aula' ? 'Registrar Aula' : 'Registrar Notas'} - Selecionar Disciplina
                </h3>
                <button onClick={() => setDisciplinaModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="disciplina" className="block text-sm font-medium text-gray-900 mb-2">
                    Escolha a Disciplina
                  </label>
                  <select 
                    id="disciplina" 
                    value={disciplinaSelecionada}
                    onChange={(e) => setDisciplinaSelecionada(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  >
                    <option value="">Selecione uma disciplina</option>
                    {disciplinas.map((disciplina, index) => (
                      <option key={index} value={disciplina}>{disciplina}</option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <i data-feather={acaoSelecionada === 'aula' ? 'calendar' : 'edit-3'} className="w-5 h-5 text-blue-600"></i>
                    <span className="text-sm text-blue-800 font-medium">
                      {acaoSelecionada === 'aula' 
                        ? 'Você irá registrar uma nova aula para a disciplina selecionada.' 
                        : 'Você irá registrar notas para a disciplina selecionada.'
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setDisciplinaModal(false)} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleDisciplinaSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-md"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Aula */}
      {registrarAulaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-slate-100">Registrar/Alterar Aula</h3>
                <button onClick={() => setRegistrarAulaModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              <form onSubmit={handleAulaSubmit} className="space-y-4">
                <div>
                  <label htmlFor="disciplina" className="block text-sm font-medium text-gray-900 mb-1">Disciplina</label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                    {aulaData.disciplina || 'Nenhuma disciplina selecionada'}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="turma" className="block text-sm font-medium text-gray-900 mb-1">Turma</label>
                  <input 
                    type="text" 
                    id="turma" 
                    name="turma"
                    value={aulaData.turma}
                    onChange={handleAulaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="data" className="block text-sm font-medium text-gray-900 mb-1">Data da Aula</label>
                  <input 
                    type="date" 
                    id="data" 
                    name="data"
                    value={aulaData.data}
                    onChange={handleAulaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="conteudo" className="block text-sm font-medium text-gray-900 mb-1">Conteúdo Ministrado</label>
                  <textarea 
                    id="conteudo" 
                    name="conteudo"
                    rows="3" 
                    value={aulaData.conteudo}
                    onChange={handleAulaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="observacoes" className="block text-sm font-medium text-gray-900 mb-1">Observações</label>
                  <textarea 
                    id="observacoes" 
                    name="observacoes"
                    rows="2" 
                    value={aulaData.observacoes}
                    onChange={handleAulaChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setRegistrarAulaModal(false)} 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 transition-colors duration-300"
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
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-slate-100">Registrar/Alterar Notas</h3>
                <button onClick={() => setRegistrarNotasModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              <form onSubmit={handleNotasSubmit} className="space-y-4">
                <div>
                  <label htmlFor="disciplina" className="block text-sm font-medium text-gray-900 mb-1">Disciplina</label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                    {notasData.disciplina || 'Nenhuma disciplina selecionada'}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="turma" className="block text-sm font-medium text-gray-900 mb-1">Turma</label>
                  <input 
                    type="text" 
                    id="turma" 
                    name="turma"
                    value={notasData.turma}
                    onChange={handleNotasChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="bimestre" className="block text-sm font-medium text-gray-900 mb-1">Bimestre</label>
                  <select 
                    id="bimestre" 
                    name="bimestre"
                    value={notasData.bimestre}
                    onChange={handleNotasChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
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
                  <label htmlFor="aluno" className="block text-sm font-medium text-gray-900 mb-1">Aluno</label>
                  <input 
                    type="text" 
                    id="aluno" 
                    name="aluno"
                    value={notasData.aluno}
                    onChange={handleNotasChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="nota" className="block text-sm font-medium text-gray-900 mb-1">Nota</label>
                  <input 
                    type="number" 
                    id="nota" 
                    name="nota"
                    min="0" 
                    max="10" 
                    step="0.1"
                    value={notasData.nota}
                    onChange={handleNotasChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setRegistrarNotasModal(false)} 
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 transition-colors duration-300"
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
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-slate-100">Gerenciar Professores</h3>
                <button onClick={() => setGerenciarProfessoresModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              <form onSubmit={handleProfessorSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-900 mb-1">Nome Completo</label>
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
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-900 mb-1">CPF</label>
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">Email</label>
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
                  <label htmlFor="matricula" className="block text-sm font-medium text-gray-900 mb-1">Matrícula</label>
                  <input 
                    type="text" 
                    id="matricula" 
                    name="matricula"
                    value={professorData.matricula}
                    onChange={handleProfessorChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="disciplina" className="block text-sm font-medium text-gray-900 mb-1">Disciplina</label>
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
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 transition-colors duration-300"
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
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-slate-100">Gerenciar Alunos</h3>
                <button onClick={() => setGerenciarAlunosModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              <form onSubmit={handleAlunoSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-900 mb-1">Nome Completo</label>
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">Email</label>
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
                  <label htmlFor="matricula" className="block text-sm font-medium text-gray-900 mb-1">Matrícula</label>
                  <input 
                    type="text" 
                    id="matricula" 
                    name="matricula"
                    value={alunoData.matricula}
                    onChange={handleAlunoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="turma" className="block text-sm font-medium text-gray-900 mb-1">Turma</label>
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
                  <label htmlFor="escola" className="block text-sm font-medium text-gray-900 mb-1">Escola</label>
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
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 transition-colors duration-300"
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
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-slate-100">Relatório de Conteúdo</h3>
                <button onClick={() => setRelatorioConteudoModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              <div className="text-center py-8">
                <i data-feather="file-text" className="w-16 h-16 mx-auto text-purple-500 mb-8"></i>
                <p className="text-slate-400 mb-8 text-xl leading-relaxed">Relatório de conteúdo será gerado aqui</p>
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
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-slate-100">Relatório de Frequência</h3>
                <button onClick={() => setRelatorioFrequenciaModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              <div className="text-center py-8">
                <i data-feather="users" className="w-16 h-16 mx-auto text-yellow-500 mb-8"></i>
                <p className="text-slate-400 mb-8 text-xl leading-relaxed">Relatório de frequência será gerado aqui</p>
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
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-slate-100">Quadro de Horarios</h3>
                <button onClick={() => setQuadroHorariosModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              <div className="text-center py-8">
                <i data-feather="clock" className="w-16 h-16 mx-auto text-indigo-500 mb-8"></i>
                <p className="text-slate-400 mb-8 text-xl leading-relaxed">Quadro de horarios sera exibido aqui (com permissao de edicao)</p>
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

      {/* componente de acessibilidade */}
      <Acessibilidade />

      {/* Painel de Configurações Integrado */}
      {configuracoesOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96 max-h-[80vh] overflow-y-auto border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Configurações</h2>
              <button
                onClick={() => setConfiguracoesOpen(false)}
                className="text-gray-800 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* sons */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 6.75v10.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Sons</p>
                    <p className="text-sm text-gray-800">Feedback sonoro</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.playSuccessSound && window.playSuccessSound()}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors"
                    title="Testar"
                  >
                    ▶
                  </button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={window.SIGE_SETTINGS?.sounds ?? true}
                      onChange={(e) => {
                        if (window.SIGE_SETTINGS) {
                          window.SIGE_SETTINGS.sounds = e.target.checked;
                          localStorage.setItem('sige-global-settings', JSON.stringify(window.SIGE_SETTINGS));
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* confirmações */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Confirmações</p>
                    <p className="text-sm text-gray-800">Pop-ups antes de ações</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={window.SIGE_SETTINGS?.popups ?? true}
                    onChange={(e) => {
                      if (window.SIGE_SETTINGS) {
                        window.SIGE_SETTINGS.popups = e.target.checked;
                        localStorage.setItem('sige-global-settings', JSON.stringify(window.SIGE_SETTINGS));
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* notificações */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19l5-5 5 5H4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Notificações</p>
                    <p className="text-sm text-gray-800">Mensagens na tela</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={window.SIGE_SETTINGS?.notifications ?? true}
                    onChange={(e) => {
                      if (window.SIGE_SETTINGS) {
                        window.SIGE_SETTINGS.notifications = e.target.checked;
                        localStorage.setItem('sige-global-settings', JSON.stringify(window.SIGE_SETTINGS));
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
            </div>

            {/* botão de reset */}
            <button
              onClick={() => {
                localStorage.removeItem('sige-global-settings');
                window.location.reload();
              }}
              className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
            >
              Restaurar Padrões
            </button>
          </div>
        </div>
      )}

      {/* Modal do Menu de Perfil */}
      {perfilMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={() => setPerfilMenu(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-80 max-w-[90vw] mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Meu Perfil</h2>
                <button
                  onClick={() => setPerfilMenu(false)}
                  className="text-gray-800 hover:text-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                    <i data-feather="user" className="w-6 h-6 text-white"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Administrador</p>
                    <p className="text-sm text-gray-800">admin@escola.com</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setPerfilMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <i data-feather="user" className="w-4 h-4"></i>
                  <span>Meu Perfil</span>
                </button>
                
                <button 
                  onClick={() => {
                    setConfiguracoesOpen(true);
                    setPerfilMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Configurações</span>
                </button>
                
                <button 
                  className="w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-3"
                >
                  <i data-feather="help-circle" className="w-4 h-4"></i>
                  <span>Ajuda</span>
                </button>
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <button 
                    onClick={() => {
                      setPerfilMenu(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-3"
                  >
                    <i data-feather="log-out" className="w-4 h-4"></i>
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardEscola;
