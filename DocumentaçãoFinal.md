# 📋 TeamFlow - Documentação da API
## 🚀 Visão Geral

TeamFlow é um sistema completo para gerenciamento de equipes, setores e projetos com controle de acesso baseado em papéis (Diretor, Coordenador, Membro). Esta API RESTful fornece todas as operações necessárias para gestão organizacional.

- URL Base: http://localhost:3000/swagger# (ou conforme configuração)
### Exemplo de usuario com role diretor pra login auth

```json
 POST http://localhost:3000/login/auth
 Content-Type: application/json

 {
   "email": "euzebio.cruz@example.com",
   "password": "senhatopzin123"
 }
 ```

### 🔐 Autenticação
- Todas as rotas (exceto /login/auth) requerem autenticação via Bearer Token JWT.

Estrutura do Token:
```json
{
  "userId": "string",
  "role": "DIRETOR|COORDENADOR|MEMBRO",
  "iat": number,
  "exp": number
}
```

## 📊 Resumo das Rotas

### Método	Rota	Descrição	Permissão

### POST /api/login/auth	
    - Autenticação de usuário   Público

### POST /api/users	
    - Criar novo usuário	Diretor
### GET	/api/users
    - Listar todos os usuários	Diretor
### GET	/api/users/pagination	
    - Listar usuários com paginação	   Diretor
### GET	/api/users/:id	
    - Buscar usuário por ID	    Diretor
### PUT	/api/user/me
	- Atualizar próprio perfil	Autenticado
### PUT	/api/users/:id
	- Atualizar usuário	Diretor
### DELETE /api/users/:id
	- Desativar usuário (soft delete)	Diretor
### PATCH /api/users/:id/restore
	- Restaurar usuário	Diretor
### POST	/api/sectors
	- Criar setor	Diretor
### GET	/api/sectors
	- Listar todos os setores	Diretor
### GET	/api/sectors/:id
	- Buscar setor por ID	Diretor
### PUT	/api/sectors/:id	
    - Atualizar setor	Diretor
### PATCH /api/sectors/:id	
    - Restaurar setor	Diretor
### DELETE /api/sectors/:id
	- Desativar setor	Diretor
### POST /api/projects	
    - Criar projeto	Diretor
### GET	/api/projects
	- Listar todos os projetos	Diretor
### GET	/api/projects/pagination
	- Listar projetos com paginação	Diretor
### GET	/api/projects/:id
	- Buscar projeto por ID	Diretor
### GET	/api/projects/sector/:sectorId
	- Buscar projetos por setor	Diretor
### PUT	/api/projects/:id
	- Atualizar projeto	Diretor
### DELETE	/api/projects/:id
	- Desativar projeto	Diretor
### PATCH	/api/projects/:id/restore
	- Restaurar projeto	Diretor
### POST	/api/memberships/join
	- Adicionar usuário a projeto	Diretor
### GET	/api/memberships
	- Listar todas as membership	Diretor
### GET	/api/memberships/pagination
	- Listar membership com paginação	Autenticado
### GET	/api/memberships/:id
	- Buscar membership por ID	Diretor
### GET	/api/memberships/project/:projectId
	- Buscar membros por projeto	Autenticado
### GET	/api/memberships/me
	- Buscar meus projetos	Autenticado
### POST	/api/memberships/leave
	- Sair de um projeto	Autenticado
### POST	/api/memberships/rejoin
	- Retornar a um projeto	Diretor
### POST	/api/projects/:projectId/coordenador/:coordenadorId/add/:userIdToAdd
	- Coordenador adiciona membro	Coordenador/Diretor
### PUT	/api/project/:projectId/coordenador/:coordenadorId/edit/:projectIdToEdit
    - Coordenador edita projeto	Coordenador/Diretor
### DELETE	/api/project/:projectId/coordenador/:coordenadorId/remove/:userIdToRemove
	- Coordenador remove membro	Coordenador/Diretor

## 👥 Modelos de Dados
### Usuário (User)
```typescript
{
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  role: "DIRETOR" | "COORDENADOR" | "MEMBRO";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
```
### Setor (Sector)
```typescript
{
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
```
### Projeto (Project)
```typescript
{
  id: string;
  name: string;
  description: string;
  goals: string;
  status: "PLANEJADO" | "EM_ANDAMENTO" | "PAUSADO" | "CONCLUIDO";
  sectorId: number;
  userId: string; // criador
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
```
### Membership (Vínculo Usuário-Projeto)
```typescript
{
  id: string;
  userId: string;
  projectId: string;
  joinedAt: Date;
  leftAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```
## 🔧 Permissões por Papel

### 🎯 Diretor
- Acesso completo ao sistema

- Gerenciar usuários, setores, projetos

- Definir papéis de usuários

- Adicionar/remover membros de qualquer projeto

### 📋 Coordenador
- Gerenciar projetos dos quais participa

- Adicionar/remover membros (exceto Diretores)

- Editar dados dos projetos que coordena

- Não pode alterar papéis de usuários

### 👤 Membro
- Visualizar projetos dos quais participa

- Atualizar próprio perfil

- Sair de projetos

- Não pode gerenciar estrutura organizacional

## 📝 Endpoints Detalhados

### 🔐 Autenticação

#### POST /api/login/auth
- Descrição: Autenticar usuário e obter token JWT

#### Body:

```json
{
  "email": "usuario@empresa.com",
  "password": "senha123"
}
Resposta (200):
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@empresa.com",
    "role": "DIRETOR"
  }
}
Resposta (401):
```

```json
{
  "message": "Credenciais inválidas"
}
```
### 👥 Usuários
#### POST /api/users
- Permissão: Diretor
- Descrição: Criar novo usuário


```json
{
  "name": "Novo Usuário",
  "email": "novo@empresa.com",
  "password": "Senha@123",
  "role": "MEMBRO"
}
```
- Validações:

- Email único no sistema

- Senha mínimo 6 caracteres

- Role deve ser DIRETOR, COORDENADOR ou MEMBRO

### GET /api/users/pagination
- Permissão: Diretor
- Descrição: Listar usuários com paginação

- Query Parameters:

```text
?page=0&pageSize=10&role=DIRETOR&search=joao
```
### Resposta:

```json
{
  "data": [...],
  "pagination": {
    "page": 0,
    "pageSize": 10,
    "total": 45,
    "totalPages": 5
  }
}
```
### PUT /api/user/me
- Permissão: Autenticado
- Descrição: Atualizar próprio perfil


```json
{
  "name": "Nome Atualizado",
  "email": "novoemail@empresa.com",
  "password": "NovaSenha@123"
}
```

### 🏢 Setores

### POST /api/sectors

- Permissão: Diretor
- Descrição: Criar novo setor

```json
{
  "name": "Tecnologia da Informação",
  "description": "Setor responsável por TI"
}
```
- Validações:

- Nome único no sistema

- Descrição opcional

### DELETE /api/sectors/:id
- Permissão: Diretor
- Descrição: Desativar setor (soft delete)

- Restrições:

- Não pode desativar setor com projetos ativos

- Operação reversível (soft delete)

### 📁 Projetos

### POST /api/projects
- Permissão: Diretor
- Descrição: Criar novo projeto vinculado a um setor

```json
{
  "name": "Sistema de Gestão",
  "description": "Desenvolvimento do sistema interno",
  "goals": "Entregar MVP em 3 meses",
  "status": "PLANEJADO",
  "sectorId": 1
}
```
- Validações:

- Nome único dentro do setor

- Status deve ser: PLANEJADO, EM_ANDAMENTO, PAUSADO, CONCLUIDO

- SectorId deve existir

### GET /api/projects/sector/:sectorId
- Permissão: Diretor
- Descrição: Buscar projetos por setor

Query Parameters:

```text
?status=EM_ANDAMENTO&page=0&pageSize=10
```
### 🤝 Membership (Vínculos)

### POST /api/memberships/join
- Permissão: Diretor
- Descrição: Adicionar usuário a um projeto


```json
{
  "userId": "user-uuid",
  "projectId": "project-uuid"
}
```
- Regras de Negócio:

- Um projeto só pode ter 1 Diretor

- Um projeto só pode ter 1 Coordenador

- Usuário não pode estar duplicado no mesmo projeto

# GET /api/memberships/me
- Permissão: Autenticado
- Descrição: Listar projetos do usuário autenticado

### Resposta:

```json
[
  {
    "project": {
      "id": "uuid",
      "name": "Projeto A",
      "status": "EM_ANDAMENTO",
      "sector": {
        "name": "TI"
      }
    },
    "joinedAt": "2024-01-15T10:00:00Z"
  }
]
```
### POST /api/memberships/leave
- Permissão: Autenticado
- Descrição: Sair de um projeto

```json
{
  "userId": "user-uuid",
  "projectId": "project-uuid"
}
```
### Regras:

- Diretor não pode sair se for o único diretor do projeto

- Coordenador não pode sair se for o único coordenador

## 🎮 Funcionalidades do Coordenador
### POST /api/projects/:projectId/coordenador/:coordenadorId/add/:userIdToAdd
- Permissão: Coordenador/Diretor
- Descrição: Coordenador adiciona membro ao projeto

- Parâmetros de Rota:

- projectId: ID do projeto

- coordenadorId: ID do coordenador que está executando a ação

- userIdToAdd: ID do usuário a ser adicionado

### Restrições:

- Coordenador só pode gerenciar projetos dos quais participa

- Não pode adicionar Diretores ao projeto

- Não pode adicionar usuários já presentes no projeto

### PUT /api/project/:projectId/coordenador/:coordenadorId/edit/:projectIdToEdit
- Permissão: Coordenador/Diretor
- Descrição: Coordenador edita dados do projeto

```json
{
  "name": "Novo Nome do Projeto",
  "description": "Nova descrição",
  "goals": "Novas metas",
  "status": "EM_ANDAMENTO"
}
```
### Restrições:

- Só pode editar projetos que coordena

- Não pode alterar setor do projeto

- Não pode alterar criador do projeto

# ⚙️ Configuração do Ambiente
Variáveis de Ambiente (.env)
env
DATABASE_URL="postgresql://user:password@localhost:5432/teamflow"
JWT_SECRET="sua-chave-secreta-aqui"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV="development"
Instalação e Execução
```bash
# 1. Clonar repositório
git clone <repo-url>
cd fastify-clean-arch

# 2. Instalar dependências
npm install

# 3. Configurar banco de dados
npx prisma migrate dev

# 4. Executar em desenvolvimento
npx ts-node src/server.ts

#5. Acesse a documentação 
http://localhost:3000/docs

# 6. Executar testes
npm test
```
```yml
Docker Compose
yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: teamflow
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://admin:secret@postgres:5432/teamflow"
      JWT_SECRET: "sua-chave-secreta"
    depends_on:
      - postgres

volumes:
  postgres_data:
```
# 🧪 Testes
- Tipos de Testes Implementados
    - ✅ Testes unitários para Use Cases

    - ✅ Testes de integração para repositórios

    - ✅ Testes de middleware (autenticação/autorização)

    - ✅ Testes de validação de dados

### Executar Testes
```bash
# Todos os testes
npm test

# Testes específicos
npm test -- --testPathPattern=User

# Testes com cobertura
npm test -- --coverage
```
# 📊 Códigos de Status
## Código :	Descrição
- 200	:  Sucesso
- 201   : Criado com sucesso
- 400	: Requisição inválida
- 401	: Não autenticado
- 403   : Permissão negada
- 404	: Recurso não encontrado
- 409	: Conflito (duplicação, regra de negócio)
- 500	: Erro interno do servidor

## 🔍 Exemplos de Uso

### 1. Fluxo de Autenticação
```bash
# 1. Login
curl -X POST http://localhost:3000/api/login/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@empresa.com","password":"Senha@123"}'

# 2. Usar token em requisições subsequentes
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <token-jwt>"
2. Criar Estrutura Organizacional
bash
# 1. Criar setor (como Diretor)
curl -X POST http://localhost:3000/api/sectors \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"TI","description":"Tecnologia da Informação"}'

# 2. Criar projeto no setor
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Sistema Interno","sectorId":1,"status":"PLANEJADO"}'

# 3. Adicionar membros ao projeto
curl -X POST http://localhost:3000/api/memberships/join \
  -H "Authorization: Bearer <token>" \
  -d '{"userId":"uuid-usuario","projectId":"uuid-projeto"}'
  ```
# 🐛 Troubleshooting

## Problemas Comuns

### Erro de conexão com banco de dados

- Verificar DATABASE_URL no .env

- Confirmar se PostgreSQL está rodando

### Erro "Token inválido"

- Verificar se token não expirou

- Confirmar se JWT_SECRET está configurado

### Erro de permissão

- Verificar role do usuário no token

- Confirmar se usuário tem acesso ao recurso

### Erro de validação

- Verificar schema Zod nas rotas

- Confirmar tipos e formatos dos dados

- Logs

```bash
# Modo desenvolvimento (logs detalhados)
npm run dev

# Modo produção
npm start

# Verificar logs do banco (Prisma)
npx prisma studio
```
# 📞 Suporte
Para questões sobre a API:

- Documentação Swagger: Acessar /api/docs 

- Repositório: [GitHub do Projeto](https://github.com/RuanPereiradev/Trainee-Back-End-Loading)

- Issues: Reportar problemas no repositório

- Email: ruanpereira@alu.ufc.br

### Versão: 1.0.0
### Última Atualização: Dezembro 2024
### Time de Desenvolvimento: Loading Jr - UFC

