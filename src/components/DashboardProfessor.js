import React, { useState, useEffect } from 'react';

const DashboardProfessor = () => {
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
  const [filtroPresenca, setFiltroPresenca] = useState('todos'); // todos, presentes, ausentes
  const [notificacao, setNotificacao] = useState({ show: false, tipo: '', mensagem: '' });
  const [previewModal, setPreviewModal] = useState(false);

  const [notasData, setNotasData] = useState({
    disciplina: '',
    turma: '',
    bimestre: '',
    aluno: '',
    nota: ''
  });

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
      return;
    }
    
    console.log('Dados da aula:', aulaData);
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
    console.log('Lista de presença:', alunos);
    setPresencaModal(false);
    setAulaData({ disciplina: '', turma: '', data: '', horarioInicio: '', horarioFim: '', conteudo: '', observacoes: '' });
    mostrarNotificacao('success', 'Aula registrada com sucesso!');
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

  // filtro de alunos
  const alunosFiltrados = alunos.filter(aluno => {
    const matchBusca = aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase()) || 
                      aluno.ra.includes(buscaAluno);
    
    if (filtroPresenca === 'presentes') return matchBusca && aluno.presente;
    if (filtroPresenca === 'ausentes') return matchBusca && !aluno.presente;
    return matchBusca;
  });

  const handleNotasSubmit = (e) => {
    e.preventDefault();
    console.log('Dados das notas:', notasData);
    setRegistrarNotasModal(false);
    setNotasData({ disciplina: '', turma: '', bimestre: '', aluno: '', nota: '' });
  };

  useEffect(() => {
    // Inicializar os icones Feather
    if (window.feather) {
      window.feather.replace();
    }
  }, [registrarAulaModal, presencaModal, previewModal, notificacao.show]);

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
              <i data-feather="book-open" className="w-8 h-8"></i>
              <h1 className="text-2xl font-bold">SIGE - Área do Professor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:block">Bem-vindo, Professor</span>
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
          {/* Card 1: Registrar Aula */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <i data-feather="calendar" className="w-6 h-6"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Registrar Aula</h2>
              </div>
              <p className="text-gray-600 mb-6">Registre o conteúdo e observações da sua aula.</p>
              <button 
                onClick={() => setRegistrarAulaModal(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:shadow-md"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 2: Registrar Notas */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <i data-feather="edit-3" className="w-6 h-6"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Registrar Notas</h2>
              </div>
              <p className="text-gray-600 mb-6">Lance as notas dos alunos por disciplina e bimestre.</p>
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
              <p className="text-gray-600 mb-6">Visualize o quadro de horarios (somente leitura).</p>
              <button 
                onClick={() => setQuadroHorariosModal(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:shadow-md"
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
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Registro de Aula</h3>
                <button onClick={() => setRegistrarAulaModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <form onSubmit={handleAulaSubmit} className="space-y-6">
                {/* Primeira linha - Disciplina, Turma */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="disciplina" className="block text-sm font-medium text-gray-700 mb-2">Disciplina (*)</label>
                    <select 
                      id="disciplina" 
                      name="disciplina"
                      value={aulaData.disciplina}
                      onChange={handleAulaChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    <label htmlFor="turma" className="block text-sm font-medium text-gray-700 mb-2">Turma (*)</label>
                    <select 
                      id="turma" 
                      name="turma"
                      value={aulaData.turma}
                      onChange={handleAulaChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-2">Data (*)</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        id="data" 
                        name="data"
                        value={aulaData.data}
                        onChange={handleAulaChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="horarioInicio" className="block text-sm font-medium text-gray-700 mb-2">Horário Início (*)</label>
                    <select 
                      id="horarioInicio" 
                      name="horarioInicio"
                      value={aulaData.horarioInicio}
                      onChange={handleAulaChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    <label htmlFor="horarioFim" className="block text-sm font-medium text-gray-700 mb-2">Horário Fim (*)</label>
                    <select 
                      id="horarioFim" 
                      name="horarioFim"
                      value={aulaData.horarioFim}
                      onChange={handleAulaChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-2">Conteúdo Abordado (*)</label>
                  <textarea 
                    id="conteudo" 
                    name="conteudo"
                    value={aulaData.conteudo}
                    onChange={handleAulaChange}
                    rows="4"
                    placeholder="Informe o conteúdo abordado"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">Estratégia Metodológica (*)</label>
                  <textarea 
                    id="observacoes" 
                    name="observacoes"
                    value={aulaData.observacoes}
                    onChange={handleAulaChange}
                    rows="3"
                    placeholder="Informe as estratégias metodológicas"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
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
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300 font-medium"
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
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Lista de Presença</h3>
                <button onClick={() => setPresencaModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              {/* Informações da Aula */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Disciplina:</span>
                    <p className="text-gray-900">{aulaData.disciplina}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Turma:</span>
                    <p className="text-gray-900">{aulaData.turma}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Data:</span>
                    <p className="text-gray-900">{aulaData.data}</p>
                  </div>
                </div>
              </div>

              {/* Barra de Busca e Filtros */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Busca */}
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i data-feather="search" className="h-5 w-5 text-gray-400"></i>
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
                </div>
              </div>

              {/* Tabela de Alunos */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        R.A
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {aluno.ra}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Total de alunos:</span> {alunosFiltrados.length} | 
                  <span className="font-medium ml-2">Presentes:</span> {alunosFiltrados.filter(a => a.presente).length} | 
                  <span className="font-medium ml-2">Ausentes:</span> {alunosFiltrados.filter(a => !a.presente).length}
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setPresencaModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300 font-medium"
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
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Preview da Aula</h3>
                <button onClick={() => setPreviewModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Informações da Aula</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700">Disciplina:</span>
                      <p className="text-gray-900">{aulaData.disciplina || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Turma:</span>
                      <p className="text-gray-900">{aulaData.turma || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Data:</span>
                      <p className="text-gray-900">{aulaData.data || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Horário:</span>
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
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300 font-medium"
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
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Registrar Notas</h3>
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
                    Registrar Nota
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Relatorio de Conteudo */}
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

      {/* Modal Relatorio de Frequencia */}
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

      {/* Modal Quadro de Horarios */}
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
                <p className="text-gray-600 mb-6">Quadro de horarios sera exibido aqui (somente leitura)</p>
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

export default DashboardProfessor;
