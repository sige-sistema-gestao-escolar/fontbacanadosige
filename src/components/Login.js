// importando as dependencias que a gente precisa
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// componente principal da tela de login
const Login = () => {
  // estado para guardar os dados do formulario, bem simples mesmo
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // funcao que atualiza os campos quando o usuario digita algo
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value // se for checkbox usa checked, senao usa value
    }));
  };

  // funcao que roda quando o usuario clica em entrar
  const handleSubmit = (e) => {
    e.preventDefault(); // evita que a pagina recarregue
    console.log('Dados do formulário:', formData); // so pra debugar mesmo
    // aqui voce pode adicionar a logica de autenticacao bacana
  };

  // useEffect que roda quando o componente monta
  useEffect(() => {
    // inicializando os icones feather pra ficar bonitinho
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  return (
    // div principal com fundo gradiente bem bonito
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      {/* card principal do login */}
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl border border-gray-100">
        {/* cabecalho com logo e titulo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            {/* logo do projeto, bem grande pra chamar atencao */}
            <img 
              src="/logo projeto.png" 
              alt="SIGE - Sistema de Gestão Educacional" 
              className="h-32 w-auto"
            />
          </div>
          {/* titulo principal */}
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            SIGE
          </h2>
          {/* subtitulo explicativo */}
          <p className="text-sm text-blue-700 font-medium mb-1">
            Sistema de Gestão Educacional
          </p>
          {/* texto de boas vindas */}
          <p className="text-sm text-gray-600">
            Acesse sua conta para continuar
          </p>
        </div>
        
        {/* formulario de login */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* container dos campos de entrada */}
          <div className="rounded-md shadow-sm space-y-4">
            {/* campo de email */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                {/* icone de email dentro do campo */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i data-feather="mail" className="h-5 w-5 text-gray-400"></i>
                </div>
                {/* input do email com estilos bonitos */}
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm" 
                  placeholder="Email"
                />
              </div>
            </div>
            
            {/* campo de senha */}
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <div className="relative">
                {/* icone de cadeado dentro do campo */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i data-feather="lock" className="h-5 w-5 text-gray-400"></i>
                </div>
                {/* input da senha com estilos bonitos */}
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm" 
                  placeholder="Senha"
                />
              </div>
            </div>
          </div>

          {/* area com checkbox e link de esqueci senha */}
          <div className="flex items-center justify-between">
            {/* checkbox de lembrar-me */}
            <div className="flex items-center">
              <input 
                id="remember-me" 
                name="rememberMe" 
                type="checkbox" 
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Lembrar-me
              </label>
            </div>

            {/* area do link de esqueci senha (vazio por enquanto) */}
            <div className="text-sm">
            </div>
          </div>

          {/* botao de entrar */}
          <div>
            <button 
              type="submit" 
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Entrar
            </button>
          </div>
        </form>
        
        {/* link para pagina de cadastro */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta? 
            <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800 transition-colors duration-200">
              Cadastre-se
            </Link>
          </p>
        </div>
       </div>
    </div>
  );
};

export default Login;
