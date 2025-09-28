import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Acessibilidade from './Acessibilidade';

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('school');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    schoolAddress: '',
    schoolPhone: '',
    teacherCpf: '',
    studentId: '',
    studentGrade: '',
    studentSchool: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name' && /[0-9]/.test(value)) {
      return;
    }
    
    if ((name === 'phone' || name === 'schoolPhone') && /[a-zA-Z]/.test(value)) {
      return;
    }
    
    if (name === 'teacherCpf' && /[a-zA-Z]/.test(value)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    switch(userType) {
      case 'school':
        navigate('/dashboard/school');
        break;
      case 'teacher':
        navigate('/dashboard/teacher');
        break;
      case 'student':
        navigate('/dashboard/student');
        break;
      default:
        navigate('/dashboard/student');
    }
  };

  useEffect(() => {
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  const userTypes = [
    { id: 'school', label: 'Escola', icon: 'home' },
    { id: 'teacher', label: 'Professor', icon: 'book' },
    { id: 'student', label: 'Aluno', icon: 'users' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* terminal de navegacao pra os bacana, abaixo depois retirar */}
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

      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-2xl shadow-2xl border border-slate-200 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo projeto.png" 
              alt="SIGE - Sistema de Gestão Educacional" 
              className="h-80 w-80"
            />
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-4">
            Criar nova conta
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed">
            Selecione o tipo de cadastro e preencha os dados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => handleUserTypeChange(type.id)}
              className={`user-type-btn py-3 px-4 border rounded-lg flex flex-col items-center text-sm font-medium text-gray-700 hover:shadow-md ${
                userType === type.id ? 'active border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-300 hover:border-orange-300'
              }`}
            >
              <i data-feather={type.icon} className="w-5 h-5 mb-2"></i>
              {type.label}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {/* Default Fields (Common to all) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome completo</label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                required 
                value={formData.name}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm bg-white text-gray-900"
              />
            </div>
             <div>
               <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
               <input 
                 id="email" 
                 name="email" 
                 type="email" 
                 autoComplete="email" 
                 required 
                 value={formData.email}
                 onChange={handleChange}
                 className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm bg-white text-gray-900"
                 placeholder="Digite seu email"
               />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm bg-white text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar senha</label>
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                required 
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm bg-white text-gray-900"
              />
            </div>
          </div>

          {/* School Specific Fields */}
          {userType === 'school' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">Nome da escola</label>
                <input 
                  id="schoolName" 
                  name="schoolName" 
                  type="text" 
                  required
                  value={formData.schoolName}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm bg-white text-gray-900"
                  placeholder="Digite o nome da escola"
                />
              </div>
              <div>
                <label htmlFor="schoolAddress" className="block text-sm font-medium text-gray-700">Endereço (Rua)</label>
                <input 
                  id="schoolAddress" 
                  name="schoolAddress" 
                  type="text" 
                  required
                  value={formData.schoolAddress}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm bg-white text-gray-900"
                  placeholder="Digite o endereço da escola"
                />
              </div>
              <div>
                <label htmlFor="schoolPhone" className="block text-sm font-medium text-gray-700">Telefone</label>
                <input 
                  id="schoolPhone" 
                  name="schoolPhone" 
                  type="tel" 
                  required
                  value={formData.schoolPhone}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm bg-white text-gray-900"
                  placeholder="Apenas números"
                />
              </div>
            </div>
          )}

          {/* Teacher Specific Fields */}
          {userType === 'teacher' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="teacherCpf" className="block text-sm font-medium text-gray-700">CPF</label>
                <input 
                  id="teacherCpf" 
                  name="teacherCpf" 
                  type="text" 
                  required
                  value={formData.teacherCpf}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm bg-white text-gray-900"
                  placeholder="Apenas números"
                />
              </div>
            </div>
          )}

          {/* Student Specific Fields */}
          {userType === 'student' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Matrícula</label>
                <input 
                  id="studentId" 
                  name="studentId" 
                  type="text" 
                  value={formData.studentId}
                  onChange={handleChange}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm bg-white text-gray-900"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentGrade" className="block text-sm font-medium text-gray-700">Série/Turma</label>
                  <input 
                    id="studentGrade" 
                    name="studentGrade" 
                    type="text" 
                    value={formData.studentGrade}
                    onChange={handleChange}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="studentSchool" className="block text-sm font-medium text-gray-700">Escola</label>
                  <input 
                    id="studentSchool" 
                    name="studentSchool" 
                    type="text" 
                    value={formData.studentSchool}
                    onChange={handleChange}
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm bg-white text-gray-900"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <button 
              type="submit" 
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Criar conta
            </button>
          </div>
         </form>

         <div className="text-center">

         </div>
      </div>

      {/* componente de acessibilidade */}
      <Acessibilidade />
    </div>
  );
};

export default Register;
