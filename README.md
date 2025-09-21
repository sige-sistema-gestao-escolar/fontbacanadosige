# SIGE - Sistema de Gestão Educacional

## 🚀 Tecnologias Utilizadas

- **React 19.1.1** - Biblioteca principal
- **React Router DOM 7.9.1** - Navegação entre páginas
- **Tailwind CSS** - Framework de estilos (via CDN)
- **Feather Icons** - Ícones (via CDN)
- **AOS** - Animações (via CDN)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** (gerenciador de pacotes)

Para verificar se estão instalados, execute no terminal:
```bash
node --version
npm --version
```

## 🛠️ Instalação e Configuração

### 1. Clone ou baixe o projeto
```bash
# Se estiver usando Git
git clone [URL_DO_REPOSITORIO]

# Ou baixe o arquivo ZIP e extraia
```

### 2. Navegue até a pasta do projeto
```bash
cd meu-novo-projeto
```

### 3. Instale as dependências
```bash
npm install
```

### 4. Inicie o servidor de desenvolvimento
```bash
npm start
```

O projeto será aberto automaticamente no navegador em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
meu-novo-projeto/
├── public/
│   ├── index.html
│   ├── logo projeto.png
│   └── ...
├── src/
│   ├── components/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── DashboardAluno.js
│   │   ├── DashboardProfessor.js
│   │   └── DashboardEscola.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🎯 Funcionalidades

### 🔐 Sistema de Login e Cadastro
- Página de login com validação
- Cadastro diferenciado por tipo de usuário:
  - **Escola**: Nome, endereço e telefone
  - **Professor**: Nome, CPF e email
  - **Aluno**: Nome, matrícula, série/turma e escola

### 👨‍🎓 Dashboard do Aluno
- Envio de atestado médico
- Consulta de notas por disciplina e bimestre
- Sistema de busca e filtros
- Preview de dados antes do envio

### 👨‍🏫 Dashboard do Professor
- Registro de aulas com disciplina, data e horários
- Lista de presença dos alunos
- Registro de notas
- Geração de relatórios de conteúdo e frequência
- Sistema de busca e filtros

### 🏫 Dashboard da Escola (Administrativo)
- Todas as funcionalidades do professor
- Gerenciamento de professores e alunos
- Controle total do sistema

## 🎨 Interface

- Design responsivo e moderno
- Cores personalizadas (azul e laranja)
- Animações suaves
- Ícones intuitivos
- Notificações de feedback

## 🔧 Scripts Disponíveis

```bash
# Inicia o servidor de desenvolvimento
npm start

# Cria build de produção
npm run build

# Executa os testes
npm test

# Ejecta as configurações (não recomendado)
npm run eject
```

## 🌐 Acesso às Páginas

- **Login**: `http://localhost:3000/` ou `http://localhost:3000/login`
- **Cadastro**: `http://localhost:3000/register`
- **Dashboard Aluno**: `http://localhost:3000/dashboard/aluno`
- **Dashboard Professor**: `http://localhost:3000/dashboard/professor`
- **Dashboard Escola**: `http://localhost:3000/dashboard/escola`

## ⚠️ Observações Importantes

1. **Logo**: O arquivo `logo projeto.png` deve estar na pasta `public/`
2. **Dependências**: Todas as dependências estão no `package.json`
3. **CDNs**: Tailwind CSS, Feather Icons e AOS são carregados via CDN
4. **Navegador**: Recomendado usar Chrome, Firefox ou Safari atualizados

## 🐛 Solução de Problemas

### Erro de porta ocupada
Se a porta 3000 estiver ocupada, o React perguntará se quer usar outra porta. Digite `Y` para confirmar.

### Erro de dependências
Se houver problemas com as dependências:
```bash
# Limpe o cache do npm
npm cache clean --force

# Delete node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstale as dependências
npm install
```

### Erro de ícones não aparecendo
Os ícones Feather são carregados via CDN. Verifique sua conexão com a internet.

## 📞 Suporte

Se encontrar algum problema, verifique:
1. Se o Node.js está instalado corretamente
2. Se todas as dependências foram instaladas
3. Se não há erros no console do navegador
4. Se a conexão com a internet está funcionando (para os CDNs)

---

**Desenvolvido com ❤️ para a gestão educacional**# fontbacanadosige
