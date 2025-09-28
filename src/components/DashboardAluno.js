import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Acessibilidade from './Acessibilidade';
import ConfiguracoesGlobais from './ConfiguracoesGlobais';
import PopupConfirmacao from './PopupConfirmacao';

// componente principal do dashboard do aluno
const DashboardAluno = () => {
  const navigate = useNavigate();
  
  // estados para controlar os modais
  const [atestadoModal, setAtestadoModal] = useState(false);
  const [notasModal, setNotasModal] = useState(false);
  const [previewAtestadoModal, setPreviewAtestadoModal] = useState(false);
  
  const [formData, setFormData] = useState({
    data: '',
    motivo: '',
    observacoes: '',
    arquivo: null
  });

  // estados para melhorias de UX
  const [notificacao, setNotificacao] = useState({ show: false, tipo: '', mensagem: '' });
  const [buscaNotas, setBuscaNotas] = useState('');
  
  // estados para pop-ups de confirmação
  const [popupConfirmacao, setPopupConfirmacao] = useState({
    show: false,
    title: '',
    message: '',
    type: 'default',
    onConfirm: null
  });
  const [filtroBimestre, setFiltroBimestre] = useState('todos');
  const [filtroDisciplina, setFiltroDisciplina] = useState('todos');
  const [perfilMenu, setPerfilMenu] = useState(false);
  const [configuracoesOpen, setConfiguracoesOpen] = useState(false);

  // dados de exemplo das notas
  const [notasData] = useState([
    { id: 1, disciplina: 'Matemática', bimestre: 1, nota: 8.5, status: 'aprovado' },
    { id: 2, disciplina: 'Matemática', bimestre: 2, nota: 7.2, status: 'aprovado' },
    { id: 3, disciplina: 'Matemática', bimestre: 3, nota: 9.0, status: 'aprovado' },
    { id: 4, disciplina: 'Matemática', bimestre: 4, nota: null, status: 'pendente' },
    { id: 5, disciplina: 'Português', bimestre: 1, nota: 7.8, status: 'aprovado' },
    { id: 6, disciplina: 'Português', bimestre: 2, nota: 8.5, status: 'aprovado' },
    { id: 7, disciplina: 'Português', bimestre: 3, nota: null, status: 'pendente' },
    { id: 8, disciplina: 'Português', bimestre: 4, nota: null, status: 'pendente' },
    { id: 9, disciplina: 'História', bimestre: 1, nota: 9.2, status: 'aprovado' },
    { id: 10, disciplina: 'História', bimestre: 2, nota: 8.7, status: 'aprovado' },
    { id: 11, disciplina: 'História', bimestre: 3, nota: 9.5, status: 'aprovado' },
    { id: 12, disciplina: 'História', bimestre: 4, nota: null, status: 'pendente' },
    { id: 13, disciplina: 'Ciências', bimestre: 1, nota: 6.5, status: 'reprovado' },
    { id: 14, disciplina: 'Ciências', bimestre: 2, nota: 7.8, status: 'aprovado' },
    { id: 15, disciplina: 'Ciências', bimestre: 3, nota: null, status: 'pendente' },
    { id: 16, disciplina: 'Ciências', bimestre: 4, nota: null, status: 'pendente' }
  ]);

  // funcao que atualiza os campos do formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value // se for arquivo pega o primeiro, senao pega o valor
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // evita reload
    
    // validacoes
    if (!formData.data) {
      mostrarNotificacao('error', 'Por favor, selecione a data do atestado!');
      
      // toca som de erro
      if (window.playErrorSound) {
        window.playErrorSound();
      }
      return;
    }
    
    if (!formData.motivo) {
      mostrarNotificacao('error', 'Por favor, selecione o motivo do atestado!');
      
      // toca som de erro
      if (window.playErrorSound) {
        window.playErrorSound();
      }
      return;
    }
    
    if (!formData.arquivo) {
      mostrarNotificacao('error', 'Por favor, anexe o arquivo do atestado!');
      
      // toca som de erro
      if (window.playErrorSound) {
        window.playErrorSound();
      }
      return;
    }
    
    // verifica se deve mostrar pop-up de confirmação
    if (window.shouldShowPopups && window.shouldShowPopups()) {
      setPopupConfirmacao({
        show: true,
        title: 'Confirmar Envio de Atestado',
        message: `Deseja confirmar o envio do atestado médico com data ${formData.data}?`,
        type: 'success',
        onConfirm: () => {
          confirmarEnvioAtestado();
          setPopupConfirmacao({ show: false, title: '', message: '', type: 'default', onConfirm: null });
        }
      });
    } else {
      confirmarEnvioAtestado();
    }
  };

  const confirmarEnvioAtestado = () => {
    setAtestadoModal(false); // fecha o modal
    setFormData({ data: '', motivo: '', observacoes: '', arquivo: null }); // limpa o form
    mostrarNotificacao('success', 'Atestado enviado com sucesso!');
    
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

  const handlePreviewAtestado = () => {
    if (!formData.data || !formData.motivo) {
      mostrarNotificacao('error', 'Preencha pelo menos a data e o motivo para visualizar o preview!');
      return;
    }
    setPreviewAtestadoModal(true);
  };


  // filtro de notas
  const notasFiltradas = notasData.filter(nota => {
    const matchBusca = nota.disciplina.toLowerCase().includes(buscaNotas.toLowerCase());
    const matchBimestre = filtroBimestre === 'todos' || nota.bimestre.toString() === filtroBimestre;
    const matchDisciplina = filtroDisciplina === 'todos' || nota.disciplina === filtroDisciplina;
    
    return matchBusca && matchBimestre && matchDisciplina;
  });

  // calcular medias por disciplina
  const calcularMediaDisciplina = (disciplina) => {
    const notasDisciplina = notasData.filter(n => n.disciplina === disciplina && n.nota !== null);
    if (notasDisciplina.length === 0) return null;
    
    const soma = notasDisciplina.reduce((acc, nota) => acc + nota.nota, 0);
    return (soma / notasDisciplina.length).toFixed(1);
  };

  // useEffect que roda quando o componente monta
  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, [atestadoModal, notasModal, previewAtestadoModal, notificacao.show, perfilMenu]);


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
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl transition-all duration-300 notification ${
          notificacao.tipo === 'success' ? 'status-success' : 
          notificacao.tipo === 'error' ? 'status-error' : 
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center space-x-3">
            <i data-feather={notificacao.tipo === 'success' ? 'check-circle' : 'alert-circle'} className="w-5 h-5"></i>
            <span className="font-semibold">{notificacao.mensagem}</span>
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
                <p className="header-subtitle">Área do Aluno</p>
              </div>
            </div>
            
            <div className="header-user">
              <div className="user-info">
                <span className="user-name">Bem-vindo, Aluno</span>
                <span className="user-role">Estudante</span>
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
          {/* Card 1: Subir Atestado */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon accent">
                <i data-feather="file-text"></i>
              </div>
              
              <h2 className="card-title">Apresentar Atestado Médico</h2>
              <p className="card-description">Envie seu atestado médico para justificar faltas ou atrasos de forma rápida e segura.</p>
              
              <button 
                onClick={() => setAtestadoModal(true)}
                className="w-full btn-primary py-3 px-6"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 2: Ver Notas */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon primary">
                <i data-feather="bar-chart-2"></i>
              </div>
              
              <h2 className="card-title">Consultar Notas</h2>
              <p className="card-description">Visualize suas notas e acompanhe seu desempenho acadêmico em tempo real.</p>
              
              <button 
                onClick={() => setNotasModal(true)}
                className="w-full btn-primary py-3 px-6"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 3: Materiais Didáticos (futuro) */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon secondary">
                <i data-feather="book"></i>
              </div>
              
              <h2 className="card-title">Materiais Didáticos</h2>
              <p className="card-description">Acesse PDFs, apostilas e materiais de estudo compartilhados pelos professores.</p>
              
              <button className="w-full btn-secondary py-3 px-6" disabled>
                Em breve
              </button>
            </div>
          </div>

          {/* Card 4: Quadro de Avisos (futuro) */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon neutral">
                <i data-feather="bell"></i>
              </div>
              
              <h2 className="card-title">Quadro de Avisos</h2>
              <p className="card-description">Fique por dentro dos recados e avisos importantes da escola e professores.</p>
              
              <button className="w-full btn-secondary py-3 px-6" disabled>
                Em breve
              </button>
            </div>
          </div>

          {/* Card 5: Desempenho (futuro) */}
          <div className="modern-card cursor-pointer group">
            <div className="flex flex-col items-center text-center">
              <div className="card-icon primary">
                <i data-feather="trending-up"></i>
              </div>
              
              <h2 className="card-title">Meu Desempenho</h2>
              <p className="card-description">Visualize gráficos detalhados do seu progresso acadêmico e frequência.</p>
              
              <button className="w-full btn-secondary py-3 px-6" disabled>
                Em breve
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Subir Atestado */}
      {atestadoModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
          <div className="modern-card w-full max-w-lg mx-4">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold gradient-text">Enviar Atestado Médico</h3>
                <button onClick={() => setAtestadoModal(false)} className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <div className="file-upload p-8 mb-8 text-center">
                <i data-feather="upload" className="w-16 h-16 mx-auto text-slate-400 mb-6"></i>
                <p className="text-slate-300 mb-3 text-lg">Arraste e solte seu arquivo aqui</p>
                <p className="text-sm text-slate-500 mb-6">ou</p>
                <label className="cursor-pointer modern-button py-3 px-6 inline-block">
                  Selecione um arquivo
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.pdf" 
                    name="arquivo"
                    onChange={handleChange}
                  />
                </label>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="data" className="block text-sm font-semibold text-slate-200 mb-3">Data do Atestado</label>
                  <input 
                    type="date" 
                    id="data" 
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    className="w-full modern-input px-4 py-3"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="motivo" className="block text-sm font-semibold text-slate-200 mb-3">Motivo</label>
                  <select 
                    id="motivo" 
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleChange}
                    className="w-full modern-input px-4 py-3"
                    required
                  >
                    <option value="">Selecione um motivo</option>
                    <option value="consulta">Consulta médica</option>
                    <option value="doenca">Doença</option>
                    <option value="acidente">Acidente</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="observacoes" className="block text-sm font-semibold text-slate-200 mb-3">Observações</label>
                  <textarea 
                    id="observacoes" 
                    name="observacoes"
                    rows="4" 
                    value={formData.observacoes}
                    onChange={handleChange}
                    className="w-full modern-input px-4 py-3 resize-none" 
                    placeholder="Detalhes adicionais..."
                  />
                </div>
                
                <div className="flex justify-between pt-6">
                  <button 
                    type="button" 
                    onClick={handlePreviewAtestado}
                    className="px-6 py-3 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/10 transition-all duration-200 flex items-center space-x-2"
                  >
                    <i data-feather="eye" className="w-4 h-4"></i>
                    <span>Preview</span>
                  </button>
                  <div className="flex space-x-4">
                    <button 
                      type="button" 
                      onClick={() => setAtestadoModal(false)}
                      className="px-6 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700 transition-all duration-200"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-3 modern-button"
                    >
                      Enviar Atestado
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Notas */}
      {notasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 flex-shrink-0">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Minhas Notas</h3>
                <button onClick={() => setNotasModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              {/* Barra de Busca e Filtros */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Busca */}
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i data-feather="search" className="h-5 w-5 text-gray-800"></i>
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar por disciplina..."
                        value={buscaNotas}
                        onChange={(e) => setBuscaNotas(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
                      />
                    </div>
                  </div>
                  
                  {/* Filtro de Bimestre */}
                  <div className="md:w-32">
                    <select
                      value={filtroBimestre}
                      onChange={(e) => setFiltroBimestre(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
                    >
                      <option value="todos">Todos</option>
                      <option value="1">1º Bim.</option>
                      <option value="2">2º Bim.</option>
                      <option value="3">3º Bim.</option>
                      <option value="4">4º Bim.</option>
                    </select>
                  </div>

                  {/* Filtro de Disciplina */}
                  <div className="md:w-48">
                    <select
                      value={filtroDisciplina}
                      onChange={(e) => setFiltroDisciplina(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900"
                    >
                      <option value="todos">Todas as disciplinas</option>
                      <option value="Matemática">Matemática</option>
                      <option value="Português">Português</option>
                      <option value="História">História</option>
                      <option value="Ciências">Ciências</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Resumo das Notas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {notasData.filter(n => n.status === 'aprovado').length}
                  </div>
                  <div className="text-sm text-green-700">Aprovados</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {notasData.filter(n => n.status === 'reprovado').length}
                  </div>
                  <div className="text-sm text-red-700">Reprovados</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {notasData.filter(n => n.status === 'pendente').length}
                  </div>
                  <div className="text-sm text-yellow-700">Pendentes</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {notasData.filter(n => n.nota !== null).length}
                  </div>
                  <div className="text-sm text-blue-700">Total Lançadas</div>
                </div>
              </div>
            </div>
            
            {/* Área com scroll */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Disciplina</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Bimestre</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Nota</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Média da Disciplina</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {notasFiltradas.map((nota) => (
                      <tr key={nota.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {nota.disciplina}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {nota.bimestre}º Bimestre
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {nota.nota ? nota.nota : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            nota.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                            nota.status === 'reprovado' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {nota.status === 'aprovado' ? 'Aprovado' :
                             nota.status === 'reprovado' ? 'Reprovado' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                          {calcularMediaDisciplina(nota.disciplina) || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Botões de ação */}
            <div className="flex-shrink-0 px-6 pb-6">
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button 
                  onClick={() => {
                    mostrarNotificacao('success', 'PDF das notas será gerado!');
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-md font-medium flex items-center space-x-2"
                >
                  <i data-feather="download" className="w-4 h-4"></i>
                  <span>Gerar PDF</span>
                </button>
                <button 
                  onClick={() => setNotasModal(false)} 
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-300 shadow-md font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview do Atestado */}
      {previewAtestadoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Preview do Atestado</h3>
                <button onClick={() => setPreviewAtestadoModal(false)} className="text-gray-800 hover:text-gray-900">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Informações do Atestado */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Dados do Atestado</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-900">Data:</span>
                      <p className="text-gray-900">{formData.data || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Motivo:</span>
                      <p className="text-gray-900">{formData.motivo || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                {formData.observacoes && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Observações</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">{formData.observacoes}</p>
                    </div>
                  </div>
                )}

                {/* Arquivo */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Arquivo Anexado</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {formData.arquivo ? (
                      <div className="flex items-center space-x-3">
                        <i data-feather="file" className="w-5 h-5 text-gray-800"></i>
                        <span className="text-gray-900">{formData.arquivo.name}</span>
                        <span className="text-sm text-gray-800">
                          ({(formData.arquivo.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-800">Nenhum arquivo selecionado</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setPreviewAtestadoModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors duration-300 font-medium"
                >
                  Fechar
                </button>
                <button 
                  onClick={() => {
                    setPreviewAtestadoModal(false);
                    setAtestadoModal(true);
                  }}
                  className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors duration-300 shadow-md font-medium"
                >
                  Voltar para Edição
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
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <i data-feather="user" className="w-6 h-6 text-white"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Aluno</p>
                    <p className="text-sm text-gray-800">aluno@escola.com</p>
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

export default DashboardAluno;
