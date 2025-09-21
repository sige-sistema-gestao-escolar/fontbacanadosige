// importando as dependencias necessarias
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// componente principal da tela de cadastro
const Register = () => {
  const navigate = useNavigate(); // hook para navegacao entre paginas
  
  // estado para controlar qual tipo de usuario esta sendo cadastrado
  const [userType, setUserType] = useState('school');
  
  // estado gigante para guardar todos os dados do formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // campos especificos da escola
    schoolName: '',
    schoolAddress: '',
    schoolPhone: '',
    // campos especificos do professor
    teacherCpf: '',
    // campos especificos do aluno
    studentId: '',
    studentGrade: '',
    studentSchool: ''
  });

  // funcao que atualiza os campos quando o usuario digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value // atualiza o campo especifico
    }));
  };

  // funcao que muda o tipo de usuario selecionado
  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  // funcao que roda quando o usuario clica em criar conta
  const handleSubmit = (e) => {
    e.preventDefault(); // evita reload da pagina
    console.log('Tipo de usuário:', userType); // debug
    console.log('Dados do formulário:', formData); // debug
    // aqui voce pode adicionar a logica de registro bacana
    
    // redireciona baseado no tipo de usuario escolhido
    switch(userType) {
      case 'school':
        navigate('/dashboard/escola'); // vai pro dashboard da escola
        break;
      case 'teacher':
        navigate('/dashboard/professor'); // vai pro dashboard do professor
        break;
      case 'student':
        navigate('/dashboard/aluno'); // vai pro dashboard do aluno
        break;
      default:
        navigate('/dashboard/escola'); // fallback pra escola
    }
  };

  // useEffect que roda quando o componente monta
  useEffect(() => {
    // inicializando os icones feather pra ficar bonito
    if (window.feather) {
      window.feather.replace();
    }
  }, []);

  // array com os tipos de usuario disponiveis
  const userTypes = [
    { id: 'school', label: 'Escola', icon: 'home' },
    { id: 'teacher', label: 'Professor', icon: 'book' },
    { id: 'student', label: 'Aluno', icon: 'users' }
  ];

  return (
    // div principal com fundo gradiente
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      {/* card principal do cadastro */}
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-xl shadow-2xl border border-gray-100">
        {/* cabecalho com logo e titulo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            {/* logo do projeto */}
            <img 
              src="/logo projeto.png" 
              alt="SIGE - Sistema de Gestão Educacional" 
              className="h-32 w-auto"
            />
          </div>
          {/* titulo principal */}
          <h2 className="text-2xl font-bold text-blue-900 mb-2">
            Criar nova conta
          </h2>
          {/* subtitulo explicativo */}
          <p className="text-sm text-blue-700 font-medium mb-1">
            SIGE - Sistema de Gestão Educacional
          </p>
          {/* instrucoes para o usuario */}
          <p className="text-sm text-gray-600">
            Selecione o tipo de cadastro e preencha os dados
          </p>
        </div>

        {/* botoes para selecionar tipo de usuario */}
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
              {/* icone do tipo de usuario */}
              <i data-feather={type.icon} className="w-5 h-5 mb-2"></i>
              {/* label do tipo de usuario */}
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
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
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
                 className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
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
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
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
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
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
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
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
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
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
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
                  placeholder="Digite o telefone da escola"
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
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
                  placeholder="Digite o CPF do professor"
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
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
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
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
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
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 placeholder-gray-400 focus:outline-none transition-all duration-200 sm:text-sm"
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
           <p className="text-sm text-gray-600">
             Já tem uma conta? 
             <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800 transition-colors duration-200">
               Faça login
             </Link>
           </p>
         </div>
      </div>
    </div>
  );
};

export default Register;
