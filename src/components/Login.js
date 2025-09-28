import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Acessibilidade from './Acessibilidade';
import GlareHover from './GlareHover';
import IntroStepper from './IntroStepper';
import AnimatedBackground from './AnimatedBackground';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleStepperComplete = () => {
  };

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedBackground variant="login" />
      <div className="fixed bottom-4 left-4 z-50 bg-gray-800 text-white rounded-lg shadow-lg p-3" style={{pointerEvents: 'none'}}>
        <div className="text-xs text-gray-300 mb-2">DEV NAV</div>
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

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl border border-slate-200 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo projeto.png" 
              alt="SIGE - Sistema de Gestão Educacional" 
              className="h-45"
            />
          </div>
          <h2 className="text-5xl font-bold text-slate-800 mb-4">SIGE</h2>
          <p className="text-slate-600 text-xl leading-relaxed">
            Acesse sua conta para continuar
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i data-feather="mail" className="h-5 w-5 text-slate-500"></i>
                </div>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-4 text-lg border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-slate-800" 
                  placeholder="Email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i data-feather="lock" className="h-5 w-5 text-slate-500"></i>
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-14 pr-4 py-4 text-lg border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-slate-800" 
                  placeholder="Senha"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input 
                id="remember-me" 
                name="rememberMe" 
                type="checkbox" 
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded bg-white"
              />
              <label htmlFor="remember-me" className="ml-3 block text-base text-slate-700 font-medium">
                Lembrar-me
              </label>
            </div>
            <div className="text-sm">
            </div>
          </div>

          <div>
            <GlareHover
              width="100%"
              height="48px"
              background="linear-gradient(to right, #f97316, #ea580c)"
              borderRadius="8px"
              borderColor="transparent"
              glareColor="#ffffff"
              glareOpacity={0.3}
              glareSize={200}
              transitionDuration={600}
            >
              <button 
                type="submit" 
                className="w-full h-full accessible-button bg-transparent text-white font-semibold text-lg"
              >
                Entrar
              </button>
            </GlareHover>
          </div>
        </form>
        
        <div className="text-center">
          
        </div>
       </div>

      <Acessibilidade />
      <IntroStepper onComplete={handleStepperComplete} />
    </div>
  );
};

export default Login;
