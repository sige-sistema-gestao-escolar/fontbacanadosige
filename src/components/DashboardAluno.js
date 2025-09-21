// importando as dependencias do react
import React, { useState, useEffect } from 'react';

// componente principal do dashboard do aluno
const DashboardAluno = () => {
  // estados para controlar os modais
  const [atestadoModal, setAtestadoModal] = useState(false);
  const [notasModal, setNotasModal] = useState(false);
  const [previewAtestadoModal, setPreviewAtestadoModal] = useState(false);
  
  // estado para guardar os dados do formulario de atestado
  const [formData, setFormData] = useState({
    data: '',
    motivo: '',
    observacoes: '',
    arquivo: null
  });

  // estados para melhorias de UX
  const [notificacao, setNotificacao] = useState({ show: false, tipo: '', mensagem: '' });
  const [buscaNotas, setBuscaNotas] = useState('');
  const [filtroBimestre, setFiltroBimestre] = useState('todos');
  const [filtroDisciplina, setFiltroDisciplina] = useState('todos');

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

  // funcao que roda quando o usuario envia o atestado
  const handleSubmit = (e) => {
    e.preventDefault(); // evita reload
    
    // validacoes
    if (!formData.data) {
      mostrarNotificacao('error', 'Por favor, selecione a data do atestado!');
      return;
    }
    
    if (!formData.motivo) {
      mostrarNotificacao('error', 'Por favor, selecione o motivo do atestado!');
      return;
    }
    
    if (!formData.arquivo) {
      mostrarNotificacao('error', 'Por favor, anexe o arquivo do atestado!');
      return;
    }
    
    console.log('Dados do atestado:', formData); // debug
    // aqui voce pode adicionar a logica de envio do atestado bacana
    setAtestadoModal(false); // fecha o modal
    setFormData({ data: '', motivo: '', observacoes: '', arquivo: null }); // limpa o form
    mostrarNotificacao('success', 'Atestado enviado com sucesso!');
  };

  // funcao para mostrar notificacoes
  const mostrarNotificacao = (tipo, mensagem) => {
    setNotificacao({ show: true, tipo, mensagem });
    setTimeout(() => {
      setNotificacao({ show: false, tipo: '', mensagem: '' });
    }, 3000);
  };

  // funcao para preview do atestado
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
    // inicializando os icones feather pra ficar bonito
    if (window.feather) {
      window.feather.replace();
    }
  }, [atestadoModal, notasModal, previewAtestadoModal, notificacao.show]);

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
              <h1 className="text-2xl font-bold">SIGE - Área do Aluno</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:block">Bem-vindo, Aluno</span>
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center">
                <i data-feather="user" className="w-5 h-5"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Subir Atestado */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                  <i data-feather="file-text" className="w-6 h-6"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Apresentar Atestado Médico</h2>
              </div>
              <p className="text-gray-600 mb-6">Envie seu atestado médico para justificar faltas ou atrasos.</p>
              <button 
                onClick={() => setAtestadoModal(true)}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:shadow-md"
              >
                Acessar
              </button>
            </div>
          </div>

          {/* Card 2: Ver Notas */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all duration-300 cursor-pointer">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-900 mr-4">
                  <i data-feather="bar-chart-2" className="w-6 h-6"></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Consultar Notas</h2>
              </div>
              <p className="text-gray-600 mb-6">Visualize suas notas e desempenho academico.</p>
              <button 
                onClick={() => setNotasModal(true)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 hover:shadow-md"
              >
                Acessar
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Subir Atestado */}
      {atestadoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Enviar Atestado Médico</h3>
                <button onClick={() => setAtestadoModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <div className="file-upload rounded-lg p-8 mb-6 text-center">
                <i data-feather="upload" className="w-12 h-12 mx-auto text-gray-400 mb-4"></i>
                <p className="text-gray-600 mb-2">Arraste e solte seu arquivo aqui</p>
                <p className="text-sm text-gray-500 mb-4">ou</p>
                <label className="cursor-pointer bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-300 shadow-md">
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
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">Data do Atestado</label>
                  <input 
                    type="date" 
                    id="data" 
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                  <select 
                    id="motivo" 
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea 
                    id="observacoes" 
                    name="observacoes"
                    rows="3" 
                    value={formData.observacoes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="Detalhes adicionais..."
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <button 
                    type="button" 
                    onClick={handlePreviewAtestado}
                    className="px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors duration-300"
                  >
                    <i data-feather="eye" className="w-4 h-4 inline mr-2"></i>
                    Preview
                  </button>
                  <div className="flex space-x-3">
                    <button 
                      type="button" 
                      onClick={() => setAtestadoModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors duration-300 shadow-md"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Minhas Notas</h3>
                <button onClick={() => setNotasModal(false)} className="text-gray-500 hover:text-gray-700">
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
                        <i data-feather="search" className="h-5 w-5 text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar por disciplina..."
                        value={buscaNotas}
                        onChange={(e) => setBuscaNotas(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  
                  {/* Filtro de Bimestre */}
                  <div className="md:w-32">
                    <select
                      value={filtroBimestre}
                      onChange={(e) => setFiltroBimestre(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disciplina</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bimestre</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média da Disciplina</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {notasFiltradas.map((nota) => (
                      <tr key={nota.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {nota.disciplina}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {nota.bimestre}º Bimestre
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
              
              <div className="mt-6 flex justify-end">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Preview do Atestado</h3>
                <button onClick={() => setPreviewAtestadoModal(false)} className="text-gray-500 hover:text-gray-700">
                  <i data-feather="x" className="w-6 h-6"></i>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Informações do Atestado */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Dados do Atestado</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700">Data:</span>
                      <p className="text-gray-900">{formData.data || 'Não informado'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Motivo:</span>
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
                        <i data-feather="file" className="w-5 h-5 text-gray-500"></i>
                        <span className="text-gray-900">{formData.arquivo.name}</span>
                        <span className="text-sm text-gray-500">
                          ({(formData.arquivo.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-500">Nenhum arquivo selecionado</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setPreviewAtestadoModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300 font-medium"
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
    </div>
  );
};

export default DashboardAluno;
