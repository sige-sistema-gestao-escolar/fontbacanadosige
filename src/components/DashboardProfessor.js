import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Acessibilidade from './Acessibilidade';
import ConfiguracoesGlobais from './ConfiguracoesGlobais';
import PopupConfirmacao from './PopupConfirmacao';

const DashboardProfessor = () => {
  const navigate = useNavigate();
  
  const [registrarAulaModal, setRegistrarAulaModal] = useState(false);
  const [presencaModal, setPresencaModal] = useState(false);
  const [registrarNotasModal, setRegistrarNotasModal] = useState(false);
  const [relatorioConteudoModal, setRelatorioConteudoModal] = useState(false);
  const [relatorioFrequenciaModal, setRelatorioFrequenciaModal] = useState(false);
  const [quadroHorariosModal, setQuadroHorariosModal] = useState(false);

  const [aulaData, setAulaData] = useState({
    disciplina: '',
    turma: '',
    data: '',
    horarioInicio: '',
    horarioFim: '',
    conteudo: '',
    observacoes: ''
  });

  const [alunos, setAlunos] = useState([
    { id: 1, nome: 'ANA CLARA ALENCAR CÉSAR DE ARAÚJO', ra: '71519485182', presente: true },
    { id: 2, nome: 'ANA LUIZA MENESES DA SILVA', ra: '72350320855', presente: true },
    { id: 3, nome: 'ARTHUR ALMEIDA DOURADO', ra: '71583319581', presente: true },
    { id: 4, nome: 'BIANCA LORRANNY FIDALGO DE SOUSA', ra: '71541225562', presente: true },
    { id: 5, nome: 'BRENO RAFAEL LEMOS NUNES', ra: '71246141671', presente: true },
    { id: 6, nome: 'CARLOS BERNARDO MENEZES DE OLIVEIRA SILVA', ra: '72017980005', presente: true },
    { id: 7, nome: 'CLIVYA RAFAELLA VAZ SILVA', ra: '67496784109', presente: true },
    { id: 8, nome: 'EVERTON SOARES RODRIGUES', ra: '71537501208', presente: true },
    { id: 9, nome: 'FELYPE KAUÊ RODRIGUES MORAIS', ra: '70859807142', presente: true },
    { id: 10, nome: 'FRANCISCO DE ASSIS ALVES SILVA', ra: '64699172539', presente: true }
  ]);

  // estados para melhorias de UX
  const [buscaAluno, setBuscaAluno] = useState('');
  const [filtroPresenca, setFiltroPresenca] = useState('todos');
  const [notificacao, setNotificacao] = useState({ show: false, tipo: '', mensagem: '' });
  const [previewModal, setPreviewModal] = useState(false);
  const [perfilMenu, setPerfilMenu] = useState(false);
  const [configuracoesOpen, setConfiguracoesOpen] = useState(false);
  
  // estados para pop-ups de confirmação
  const [popupConfirmacao, setPopupConfirmacao] = useState({
    show: false,
    title: '',
    message: '',
    type: 'default',
    onConfirm: null
  });

  const [notasData, setNotasData] = useState({
    disciplina: '',
    turma: '',
    bimestre: '',
    aluno: '',
    nota: ''
  });

  const [previewNotasModal, setPreviewNotasModal] = useState(false);

  const handleAulaChange = (e) => {
    const { name, value } = e.target;
    setAulaData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotasChange = (e) => {
    const { name, value } = e.target;
    setNotasData(prev => ({ ...prev, [name]: value }));
  };

  const handleAulaSubmit = (e) => {
    e.preventDefault();
    
    // validacao de horarios
    if (!validarHorarios()) {
      mostrarNotificacao('error', 'Horário de início deve ser anterior ao horário de fim!');
      
      // toca som de erro
      if (window.playErrorSound) {
        window.playErrorSound();
      }
      return;
    }
    
    setRegistrarAulaModal(false);
    setPresencaModal(true); // vai pro modal de presenca
  };

  const handlePreviewAula = () => {
    if (!validarHorarios()) {
      mostrarNotificacao('error', 'Horário de início deve ser anterior ao horário de fim!');
      return;
    }
    setPreviewModal(true);
  };

  const handlePresencaChange = (alunoId) => {
    setAlunos(prev => prev.map(aluno => 
      aluno.id === alunoId ? { ...aluno, presente: !aluno.presente } : aluno
    ));
  };

  const handlePresencaSubmit = () => {
    // verifica se deve mostrar pop-up de confirmação
    if (window.shouldShowPopups && window.shouldShowPopups()) {
      setPopupConfirmacao({
        show: true,
        title: 'Confirmar Registro de Aula',
        message: `Deseja confirmar o registro da aula de ${aulaData.disciplina} para a turma ${aulaData.turma}?`,
        type: 'success',
        onConfirm: () => {
          confirmarRegistroAula();
          setPopupConfirmacao({ show: false, title: '', message: '', type: 'default', onConfirm: null });
        }
      });
    } else {
      confirmarRegistroAula();
    }
  };

  const confirmarRegistroAula = () => {
    setPresencaModal(false);
    setAulaData({ disciplina: '', turma: '', data: '', horarioInicio: '', horarioFim: '', conteudo: '', observacoes: '' });
    mostrarNotificacao('success', 'Aula registrada com sucesso!');
    
    // toca som de sucesso
    if (window.playSuccessSound) {
      window.playSuccessSound();
    }
  };

  // funcao para mostrar notificacoes
  const mostrarNotificacao = (tipo, mensagem) => {
    setNotificacao({ show: true, tipo, mensagem });
    setTimeout(() => {
      setNotificacao({ show: false, tipo: '', mensagem: '' });
    }, 3000);
  };

  // validacao de horarios
  const validarHorarios = () => {
    if (aulaData.horarioInicio && aulaData.horarioFim) {
      const inicio = new Date(`2000-01-01 ${aulaData.horarioInicio}`);
      const fim = new Date(`2000-01-01 ${aulaData.horarioFim}`);
      return inicio < fim;
    }
    return true;
  };

  // funcoes para selecao em massa
  const marcarTodosPresentes = () => {
    setAlunos(prev => prev.map(aluno => ({ ...aluno, presente: true })));
  };

  const marcarTodosAusentes = () => {
    setAlunos(prev => prev.map(aluno => ({ ...aluno, presente: false })));
  };

  // funcao para resetar filtros
  const resetarFiltros = () => {
    setBuscaAluno('');
    setFiltroPresenca('todos');
  };

  // filtro de alunos
  const alunosFiltrados = alunos.filter(aluno => {
    const matchBusca = aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase()) || 
                      aluno.ra.includes(buscaAluno);
    
    // primeiro filtra por busca
    if (!matchBusca) return false;
    
    // depois filtra por presenca
    if (filtroPresenca === 'presentes') return aluno.presente;
    if (filtroPresenca === 'ausentes') return !aluno.presente;
    
    return true;
  });

  const handleNotasSubmit = (e) => {
    e.preventDefault();
    setRegistrarNotasModal(false);
    setNotasData({ disciplina: '', turma: '', bimestre: '', aluno: '', nota: '' });
    mostrarNotificacao('success', 'Nota registrada com sucesso!');
    
    // toca som de sucesso
    if (window.playSuccessSound) {
      window.playSuccessSound();
    }
  };

  const handlePreviewNotas = () => {
    // validacao basica
    if (!notasData.disciplina || !notasData.turma || !notasData.bimestre || !notasData.aluno || !notasData.nota) {
      mostrarNotificacao('error', 'Preencha todos os campos obrigatórios!');
      
      // toca som de erro
      if (window.playErrorSound) {
        window.playErrorSound();
      }
      return;
    }
    setPreviewNotasModal(true);
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
            className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors"
            style={{pointerEvents: 'auto'}}
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')} 
            className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors"
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
            className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
            style={{pointerEvents: 'auto'}}
          >
            Professor
          </button>
          <button 
            onClick={() => navigate('/dashboard/escola')} 
            className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs transition-colors"
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
                <p className="header-subtitle">Área do Professor</p>
              </div>
            </div>
            
            <div className="header-user">
              <div className="user-info">
                <span className="user-name">Bem-vindo, Professor</span>
                <span className="user-role">Educador</span>
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
      <main className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Card 1: Registrar Aula */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon secondary">
                <i data-feather="calendar"></i>
              </div>
              
              <h2 className="card-title">Registrar Aula</h2>
              <p className="card-description">Registre o conteúdo e observações da sua aula de forma organizada.</p>
              
              <button 
                onClick={() => setRegistrarAulaModal(true)}
                className="w-full btn-primary py-3 px-6"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 2: Registrar Notas */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon primary">
                <i data-feather="edit-3"></i>
              </div>
              
              <h2 className="card-title">Registrar Notas</h2>
              <p className="card-description">Lance as notas dos alunos por disciplina e bimestre com facilidade.</p>
              
              <button 
                onClick={() => setRegistrarNotasModal(true)}
                className="w-full btn-primary py-3 px-6"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 3: Relatório de Conteúdo */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon neutral">
                <i data-feather="file-text"></i>
              </div>
              
              <h2 className="card-title">Relatório de Conteúdo</h2>
              <p className="card-description">Gere relatórios detalhados do conteúdo ministrado em suas aulas.</p>
              
              <button 
                onClick={() => setRelatorioConteudoModal(true)}
                className="w-full btn-primary py-3 px-6"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 4: Relatório de Frequência */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon neutral">
                <i data-feather="users"></i>
              </div>
              
              <h2 className="card-title">Relatório de Frequência</h2>
              <p className="card-description">Gere relatórios detalhados de frequência dos seus alunos.</p>
              
              <button 
                onClick={() => setRelatorioFrequenciaModal(true)}
                className="w-full btn-primary py-3 px-6"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 5: Quadro de Horários */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon neutral">
                <i data-feather="clock"></i>
              </div>
              
              <h2 className="card-title">Quadro de Horários</h2>
              <p className="card-description">Visualize o quadro de horários das suas aulas (somente leitura).</p>
              
              <button 
                onClick={() => setQuadroHorariosModal(true)}
                className="w-full btn-secondary py-3 px-6"
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-800">Registro de Aula</h3>
                <button onClick={() => setRegistrarAulaModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              <form onSubmit={handleAulaSubmit} className="space-y-6">
                {/* Primeira linha - Disciplina, Turma */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="disciplina" className="block text-sm font-medium text-gray-900 mb-2">Disciplina (*)</label>
                    <select 
                      id="disciplina" 
                      name="disciplina"
                      value={aulaData.disciplina}
                      onChange={handleAulaChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                      required
                    >
                      <option value="">Selecione a disciplina</option>
                      <option value="ADMINISTRAÇÃO DE BANCO DE DADOS">ADMINISTRAÇÃO DE BANCO DE DADOS</option>
                      <option value="MATEMÁTICA">MATEMÁTICA</option>
                      <option value="PORTUGUÊS">PORTUGUÊS</option>
                      <option value="HISTÓRIA">HISTÓRIA</option>
                      <option value="CIÊNCIAS">CIÊNCIAS</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="turma" className="block text-sm font-medium text-gray-900 mb-2">Turma (*)</label>
                    <select 
                      id="turma" 
                      name="turma"
                      value={aulaData.turma}
                      onChange={handleAulaChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                      required
                    >
                      <option value="">Selecione a turma</option>
                      <option value="EMI-INT CT DES SIST-1ª SÉRIE -I-B">EMI-INT CT DES SIST-1ª SÉRIE -I-B</option>
                      <option value="EMI-INT CT DES SIST-2ª SÉRIE -I-B">EMI-INT CT DES SIST-2ª SÉRIE -I-B</option>
                      <option value="EMI-INT CT DES SIST-3ª SÉRIE -I-B">EMI-INT CT DES SIST-3ª SÉRIE -I-B</option>
                    </select>
                  </div>
                </div>

                {/* Segunda linha - Data e Horários */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="data" className="block text-sm font-medium text-gray-900 mb-2">Data (*)</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        id="data" 
                        name="data"
                        value={aulaData.data}
                        onChange={handleAulaChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="horarioInicio" className="block text-sm font-medium text-gray-900 mb-2">Horário Início (*)</label>
                    <select 
                      id="horarioInicio" 
                      name="horarioInicio"
                      value={aulaData.horarioInicio}
                      onChange={handleAulaChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="07:00">07:00</option>
                      <option value="07:50">07:50</option>
                      <option value="08:40">08:40</option>
                      <option value="09:30">09:30</option>
                      <option value="10:20">10:20</option>
                      <option value="11:10">11:10</option>
                      <option value="13:00">13:00</option>
                      <option value="13:50">13:50</option>
                      <option value="14:40">14:40</option>
                      <option value="15:30">15:30</option>
                      <option value="16:20">16:20</option>
                      <option value="17:10">17:10</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="horarioFim" className="block text-sm font-medium text-gray-900 mb-2">Horário Fim (*)</label>
                    <select 
                      id="horarioFim" 
                      name="horarioFim"
                      value={aulaData.horarioFim}
                      onChange={handleAulaChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="07:50">07:50</option>
                      <option value="08:40">08:40</option>
                      <option value="09:30">09:30</option>
                      <option value="10:20">10:20</option>
                      <option value="11:10">11:10</option>
                      <option value="12:00">12:00</option>
                      <option value="13:50">13:50</option>
                      <option value="14:40">14:40</option>
                      <option value="15:30">15:30</option>
                      <option value="16:20">16:20</option>
                      <option value="17:10">17:10</option>
                      <option value="18:00">18:00</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="conteudo" className="block text-sm font-medium text-gray-900 mb-2">Conteúdo Abordado (*)</label>
                  <textarea 
                    id="conteudo" 
                    name="conteudo"
                    value={aulaData.conteudo}
                    onChange={handleAulaChange}
                    rows="4"
                    placeholder="Informe o conteúdo abordado"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-900 bg-white"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="observacoes" className="block text-sm font-medium text-gray-900 mb-2">Estratégia Metodológica (*)</label>
                  <textarea 
                    id="observacoes" 
                    name="observacoes"
                    value={aulaData.observacoes}
                    onChange={handleAulaChange}
                    rows="3"
                    placeholder="Informe as estratégias metodológicas"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-gray-900 bg-white"
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-between pt-4">
                  <button 
                    type="button" 
                    onClick={handlePreviewAula}
                    className="px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-medium"
                  >
                    <i data-feather="eye" className="w-4 h-4 inline mr-2"></i>
                    Preview
                  </button>
                  <div className="flex space-x-3">
                    <button 
                      type="button" 
                      onClick={() => setRegistrarAulaModal(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors duration-300 font-medium"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md font-medium"
                    >
                      Continuar para Presença
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lista de Presença */}
      {presencaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-800">Lista de Presença</h3>
                <button onClick={() => setPresencaModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              {/* Informações da Aula */}
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Disciplina:</span>
                    <p className="text-gray-900">{aulaData.disciplina}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Turma:</span>
                    <p className="text-gray-900">{aulaData.turma}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Data:</span>
                    <p className="text-gray-900">{aulaData.data}</p>
                  </div>
                </div>
              </div>

              {/* Barra de Busca e Filtros */}
              <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Busca */}
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i data-feather="search" className="h-5 w-5 text-gray-800"></i>
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar por nome ou R.A..."
                        value={buscaAluno}
                        onChange={(e) => setBuscaAluno(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                  
                  {/* Filtro de Presença */}
                  <div className="md:w-48">
                    <select
                      value={filtroPresenca}
                      onChange={(e) => setFiltroPresenca(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="todos">Todos os alunos</option>
                      <option value="presentes">Apenas presentes</option>
                      <option value="ausentes">Apenas ausentes</option>
                    </select>
                  </div>
                </div>

                {/* Botões de Seleção em Massa */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={marcarTodosPresentes}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium"
                  >
                    <i data-feather="check-circle" className="w-4 h-4 inline mr-1"></i>
                    Marcar Todos Presentes
                  </button>
                  <button
                    onClick={marcarTodosAusentes}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                  >
                    <i data-feather="x-circle" className="w-4 h-4 inline mr-1"></i>
                    Marcar Todos Ausentes
                  </button>
                  {(buscaAluno || filtroPresenca !== 'todos') && (
                    <button
                      onClick={resetarFiltros}
                      className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                    >
                      <i data-feather="refresh-cw" className="w-4 h-4 inline mr-1"></i>
                      Limpar Filtros
                    </button>
                  )}
                </div>
              </div>

              {/* Tabela de Alunos */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Nome
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        R.A
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Frequência
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alunosFiltrados.map((aluno) => (
                      <tr key={aluno.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {aluno.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {aluno.ra}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          <div className="flex items-center space-x-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={aluno.presente}
                                onChange={() => handlePresencaChange(aluno.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                            <span className={`text-sm font-medium ${aluno.presente ? 'text-green-600' : 'text-red-600'}`}>
                              {aluno.presente ? 'Presente' : 'Ausente'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-800">
                  <span className="font-medium">Total de alunos:</span> {alunos.length} | 
                  <span className="font-medium ml-2">Presentes:</span> {alunos.filter(a => a.presente).length} | 
                  <span className="font-medium ml-2">Ausentes:</span> {alunos.filter(a => !a.presente).length}
                  {alunosFiltrados.length !== alunos.length && (
                    <span className="ml-2 text-blue-600">
                      (Filtrados: {alunosFiltrados.length})
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setPresencaModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors duration-300 font-medium"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handlePresencaSubmit}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md font-medium"
                  >
                    Salvar Presença
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview da Aula */}
      {previewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-800">Preview da Aula</h3>
                <button onClick={() => setPreviewModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-8">Informações da Aula</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-900">Disciplina:</span>
                      <p className="text-gray-900">{aulaData.disciplina || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Turma:</span>
                      <p className="text-gray-900">{aulaData.turma || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Data:</span>
                      <p className="text-gray-900">{aulaData.data || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Horário:</span>
                      <p className="text-gray-900">
                        {aulaData.horarioInicio && aulaData.horarioFim 
                          ? `${aulaData.horarioInicio} - ${aulaData.horarioFim}`
                          : 'Não informado'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Conteúdo Abordado</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {aulaData.conteudo || 'Nenhum conteúdo informado'}
                    </p>
                  </div>
                </div>

                {/* Estratégia Metodológica */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Estratégia Metodológica</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {aulaData.observacoes || 'Nenhuma estratégia informada'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setPreviewModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors duration-300 font-medium"
                >
                  Fechar
                </button>
                <button 
                  onClick={() => {
                    setPreviewModal(false);
                    setPresencaModal(true);
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md font-medium"
                >
                  Continuar para Presença
                </button>
              </div>
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
                <h3 className="text-3xl font-bold text-slate-100">Registrar Notas</h3>
                <button onClick={() => setRegistrarNotasModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              <form onSubmit={handleNotasSubmit} className="space-y-4">
                <div>
                  <label htmlFor="disciplina" className="block text-sm font-medium text-gray-900 mb-1">Disciplina</label>
                  <input 
                    type="text" 
                    id="disciplina" 
                    name="disciplina"
                    value={notasData.disciplina}
                    onChange={handleNotasChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    required
                  />
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
                
                <div className="flex justify-between pt-4">
                  <button 
                    type="button" 
                    onClick={handlePreviewNotas}
                    className="px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-medium"
                  >
                    <i data-feather="eye" className="w-4 h-4 inline mr-2"></i>
                    Preview
                  </button>
                  <div className="flex space-x-3">
                    <button 
                      type="button" 
                      onClick={() => setRegistrarNotasModal(false)} 
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors duration-300 font-medium"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md font-medium"
                    >
                      Registrar Nota
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview das Notas */}
      {previewNotasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-semibold text-gray-800">Preview da Nota</h3>
                <button onClick={() => setPreviewNotasModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-8 h-8"></i>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-8">Informações da Nota</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-900">Disciplina:</span>
                      <p className="text-gray-900">{notasData.disciplina || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Turma:</span>
                      <p className="text-gray-900">{notasData.turma || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Bimestre:</span>
                      <p className="text-gray-900">{notasData.bimestre ? `${notasData.bimestre}º Bimestre` : 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Aluno:</span>
                      <p className="text-gray-900">{notasData.aluno || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                {/* Nota */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Nota</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl font-bold text-blue-600">
                        {notasData.nota || 'N/A'}
                      </div>
                      <div className="text-gray-800">
                        <p className="text-sm">Pontuação de 0 a 10</p>
                        <p className="text-sm">
                          {notasData.nota && parseFloat(notasData.nota) >= 6 ? 
                            '✅ Aprovado' : 
                            notasData.nota && parseFloat(notasData.nota) < 6 ? 
                            '❌ Reprovado' : 
                            'Status não definido'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setPreviewNotasModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors duration-300 font-medium"
                >
                  Fechar
                </button>
                <button 
                  onClick={() => {
                    setPreviewNotasModal(false);
                    handleNotasSubmit({ preventDefault: () => {} });
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md font-medium"
                >
                  Confirmar e Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Relatorio de Conteudo */}
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

      {/* Modal Relatorio de Frequencia */}
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

      {/* Modal Quadro de Horarios */}
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
                <p className="text-slate-400 mb-8 text-xl leading-relaxed">Quadro de horarios sera exibido aqui (somente leitura)</p>
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
      
      {/* Configurações Globais */}
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
                  <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center">
                    <i data-feather="user" className="w-6 h-6 text-white"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Professor</p>
                    <p className="text-sm text-gray-800">professor@escola.com</p>
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

      {/* Pop-up de Confirmação */}
      <PopupConfirmacao
        isOpen={popupConfirmacao.show}
        onClose={() => setPopupConfirmacao({ show: false, title: '', message: '', type: 'default', onConfirm: null })}
        onConfirm={popupConfirmacao.onConfirm}
        title={popupConfirmacao.title}
        message={popupConfirmacao.message}
        type={popupConfirmacao.type}
      />
    </div>
  );
};

export default DashboardProfessor;
