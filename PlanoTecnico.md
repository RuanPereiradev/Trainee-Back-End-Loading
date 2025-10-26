# 🧭 Plano Técnico — Implementação dos Requisitos Faltantes (TeamFlow)

## 🏗️ Visão Geral das Fases

| Fase | Etapa | Objetivo Principal | Status Esperado |
|------|--------|--------------------|----------------|
| **1** | Integração Fastify e Base do Servidor | Criar `server.ts`, `app.ts`, rotas básicas | Sistema rodando em HTTP local |
| **2** | Controllers e Rotas de Usuário | Expor os casos de uso existentes via API | CRUD básico de usuários disponível |
| **3** | Autenticação e Segurança | Implementar login, JWT, bcrypt, autorização | Segurança e login funcionais |
| **4** | Setores e Projetos | Criar e gerenciar setores e projetos | CRUD completo funcionando |
| **5** | Vínculo de Membros e Permissões | Lógica de papéis e vínculos a projetos | Permissões reais implementadas |
| **6** | Documentação, Testes e Deploy | Swagger, Jest e Docker | Projeto pronto para entrega |

---

##  FASE 1 — Configuração do Servidor Fastify(parcial)

 **Objetivo:** Subir o servidor e preparar estrutura para as rotas.

### **Tarefas**
- [ ] Criar `src/app.ts` (configura e registra rotas, middlewares e plugins)
- [ ] Criar `src/server.ts` (ponto de entrada da aplicação)
- [ ] Configurar CORS, JSON, e variáveis de ambiente
- [ ] Conectar o Prisma ao app (em `lib/prisma.ts`)
- [ ] Criar rota inicial de teste `/ping`

 **Requisitos Cobertos:** Nenhum RF diretamente, mas prepara a base para todos os outros.

---

## 🧑‍💻 FASE 2 — Controllers e Rotas de Usuário(feito)

 **Objetivo:** Expor os *use cases* já criados (`CreateUser`, `FindAllUser`, `FindUserById`) via rotas Fastify.

### **Tarefas**
- [ ] Criar `UserController.ts` com métodos:
  - `createUser(req, reply)`
  - `findAll(req, reply)`
  - `findById(req, reply)`
- [ ] Criar `userRoutes.ts` com endpoints:
  - `POST /users`
  - `GET /users`
  - `GET /users/:id`
- [ ] Registrar `userRoutes` no `app.ts`

 **Requisitos Implementados:**
- RF-A03 (parcial — cadastro de usuários)(feito)
- RF-A05 (listar usuários)(feito)

📘 **Saída esperada:**  
Rotas de usuário acessíveis via Postman/Insomnia.

---

##  FASE 3 — Autenticação e Segurança

 **Objetivo:** Implementar login, hash de senha e controle de acesso por JWT.

### **Tarefas**
- [ ] Instalar `bcrypt` e `jsonwebtoken`
- [ ] Criar `AuthService.ts`:
  - `hashPassword`, `comparePassword`, `generateToken`, `verifyToken`
- [ ] Criar `AuthUseCase.ts` (login)
- [ ] Criar `AuthController.ts` e `authRoutes.ts`
- [ ] Criar middleware `auth.ts` (verifica JWT)
- [ ] Criar middleware `authorizeRole.ts` (valida role mínima)

 **Requisitos Implementados:**
- RF-A01 — Login
- RF-A02 — Geração de JWT
- RF-A04 — Controle de papéis
- RF-A07 — Bloqueio de usuários inativos

 **Saída esperada:**  
Usuário faz login, recebe JWT, e só acessa rotas protegidas se autenticado.

---

##  FASE 4 — Módulo de Setores e Projetos

 **Objetivo:** Adicionar entidades e lógica de `Sectors` e `Projects`.

### **Tarefas**
- [ ] Criar entidades `Sectors` e `Project`
- [ ] Criar repositórios `SectorRepository` e `ProjectRepository`
- [ ] Criar use cases:
  - `CreateSectorUseCase`, `FindAllSectorUseCase`, `UpdateSectorUseCase`, `DeleteSectorUseCase`
  - `CreateProjectUseCase`, `FindAllProjectUseCase`, `UpdateProjectUseCase`, `DeleteProjectUseCase`
- [ ] Criar controllers e rotas para ambos

 **Requisitos Implementados:**
- RF-B01 — CRUD de Setores (Feito)
- RF-B02 — CRUD de Projetos
- RF-C01 — Descrição e metas de Projeto
- RF-C02 — Status de Projeto (`enum`)

 **Saída esperada:**  
CRUD completo de Setor e Projeto funcionando via API.

---

##  FASE 5 — Vínculos de Membros e Permissões

**Objetivo:** Relacionar usuários a projetos e aplicar regras de permissão (Roles).

### **Tarefas**
- [ ] Criar entidade `ProjectMember` (tabela intermediária)
- [ ] Criar `ProjectMemberRepository` e `AddMemberToProjectUseCase`
- [ ] Implementar regras:
  - Coordenador só gerencia seus projetos
  - Membro só visualiza
  - Diretor tem acesso total
- [ ] Integrar validação no middleware de autorização

 **Requisitos Implementados:**
- RF-B03 — Vínculo Membro ↔ Projeto
- RF-B05 — Acesso de Coordenador
- RF-B06 — Acesso de Diretor
- RF-B07 — Acesso de Membro
- RF-B09 — Restrições de hierarquia

 **Saída esperada:**  
Permissões de acesso e vínculos ativos entre usuários e projetos.

---

##  FASE 6 — Documentação, Testes e Deploy

**Objetivo:** Garantir qualidade, documentação e entrega.

### **Tarefas**
- [ ] Instalar e configurar Swagger (`@fastify/swagger` e `@fastify/swagger-ui`)
- [ ] Criar documentação automática das rotas
- [ ] Criar testes Jest para:
  - Auth
  - User
  - Project
- [ ] Criar `Dockerfile` e `docker-compose.yml`
- [ ] Configurar scripts de build (`npm run dev`, `npm run test`)

 **Requisitos Implementados:**
- RNF-05 — Documentação
- RNF-06 — Testabilidade
- RNF-07 — Manutenibilidade

 **Saída esperada:**  
API documentada e testada, pronta para deploy.

---

##  Linha do Tempo Sugerida (para o projeto TeamFlow)

| Semana | Fase | Foco |
|---------|------|------|
| **1** | Fase 1 e 2 | Fastify + Rotas de Usuário |
| **2** | Fase 3 | Autenticação JWT + Middleware |
| **3** | Fase 4 | CRUD de Setor e Projeto |
| **4** | Fase 5 | Membros e Permissões |
| **5** | Fase 6 | Testes, Swagger e Docker |

---

##  Conclusão

Após a finalização das *use cases*, o projeto TeamFlow está pronto para avançar à etapa de integração com o **Fastify**.  
Seguindo este plano técnico, todas as funcionalidades previstas nos **Requisitos Funcionais (RF)** e **Requisitos Não Funcionais (RNF)** serão cobertas de forma progressiva, garantindo **segurança, organização e escalabilidade**.
