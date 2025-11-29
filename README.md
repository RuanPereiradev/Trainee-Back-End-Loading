# Trainee-Back-End-Loading
## Documento de Requisitos: TeamFlow

**Versão:** 1.0
**Data:** 03 de Outubro de 2025

## Tecnologias

. Fastify
. TypeScript
. Prisma
. PostgreSQL
. Docker/Docker Compose
. JWT
. Bcrypt
. Jest
. Swagger (OpenAPI)
. Insomnia/Postman
. Git/GitHub
. ESLint/Prettier
. Zod

## 1. Introdução

Este documento descreve os requisitos funcionais, não funcionais e as regras de negócio do **TeamFlow**, um sistema simples para organização de equipes por Setor, com Projetos e Membros. Cada usuário possui uma Role fixa no sistema: **Diretor**, **Coordenador** ou **Membro**. O objetivo é facilitar o cadastro de estruturas (Setores e Projetos), o gerenciamento de pessoas e a definição de permissões de forma clara e prática.

---

## 2. Requisitos Funcionais (RF)

### RF-A: Gestão de Usuários e Autenticação

- **RF-A01:** Permitir login por e-mail e senha. -> ok
- **RF-A02:** Após login, gerar token de autenticação (JWT) para chamadas subsequentes. -> ok
- **RF-A03:** Usuários com perfil Diretor podem cadastrar novos usuários e definir seus acessos (Role). -> ok
- **RF-A04:** Controle de acesso baseado em papéis: **Diretor**, **Coordenador**, **Membro**. -> ok
- **RF-A05:** Diretores podem listar, atualizar e desativar (soft delete) contas de usuários. -> ok
- **RF-A06:** Usuário pode atualizar seu próprio perfil (nome, senha, avatar). -> ok
- **RF-A07:** Usuários desativados não conseguem autenticar. -> ok

### RF-B: Gestão de Setores, Projetos e Membros

- **RF-B01:** Cadastrar, listar, filtrar, atualizar e desativar (soft delete) Setores. -> ok
- **RF-B02:** Cadastrar, listar, filtrar, atualizar e desativar (soft delete) Projetos, vinculando-os a um Setor. -> ok
- **RF-B03:** Cadastrar Membros (usuários) e vinculá-los a um ou mais Projetos. -> ok
- **RF-B04:** Definir a Role fixa do usuário no momento do cadastro/edição: **Diretor**, **Coordenador** ou **Membro**. -> ok
- **RF-B05:** Coordenadores podem gerenciar Projetos dos quais participam (editar dados do projeto, adicionar/remover membros do projeto), sem alterar Roles globais e sem adicionar/remover usuários com Role Diretor dos projetos. -> falta
- **RF-B06:** Diretores podem gerenciar todos os Setores e Projetos. -> ok
- **RF-B07:** Membros podem visualizar os Projetos dos quais participam e editar apenas seus próprios dados (quando permitido). -> falta
- **RF-B08:** Listagens e filtros para Setores, Projetos e Membros com paginação (parâmetros: page, pageSize; padrão page=0, pageSize=10).-> ok
- **RF-B09:** Usuários com Role inferior não podem alterar dados de usuários com Role superior (ex.: Membro não pode alterar dados de Coordenador ou Diretor).-> parcial

### RF-C: Atividades básicas de Projeto

- **RF-C01:** Permitir registrar descrições e metas do Projeto. -> ok
- **RF-C02:** Permitir registrar status do Projeto como enum: {PLANEJADO, EM_ANDAMENTO, PAUSADO, CONCLUIDO}. -> ok

---

## 3. Requisitos Não Funcionais (RNF)

- **RNF-01 (Segurança):** Senhas armazenadas com hash forte (ex.: bcrypt).-> ok
- **RNF-02 (Segurança):** Autenticação via JWT e expiração configurável. -> ok
- **RNF-04 (Desempenho):** Listagens e filtros respondem em até 2 segundos em condições normais. -> ok
- **RNF-05 (Documentação):** API documentada de forma sucinta. -> falta
- **RNF-06 (Testabilidade):** Testes Unitários para autenticação, autorização e CRUDs principais. -> parcial
- **RNF-07 (Manutenibilidade):** Código seguindo boas práticas (camadas, validações). -> ok

---

## 4. Regras de Negócio (RN)

- **RN-01 (Papéis):**
  - **Diretor:** Acesso total ao sistema; pode criar/editar/desativar (soft delete) Setores, Projetos e Usuários; pode definir/alterar Roles globais -> ok.
  - **Coordenador:** Pode gerenciar Projetos dos quais participa (editar dados do projeto, gerenciar membros do projeto); não pode alterar Roles dos usuários nem excluir Setores. -> ok
  - **Membro:** Pode visualizar Projetos dos quais participa; não pode alterar estrutura nem Role. -> OK(criar uma usecase, parecido com o metodo de verificar projetos por setores, nesse caso preciso ver projetos por membership. -> PLANO: pegar o id membership, verificar se aquele id esta associado ao usuário que esta autenticado, possivelmente ate mesmo pelo token)-> OK
- **RN-02 (Escopo de Permissões):** A Role é global (nível de empresa/sistema) e não muda por Projeto.  -> ok
- **RN-03 (Unicidade):** E-mail do usuário é único no sistema. Nome do Setor é único. Nome do Projeto é único dentro do Setor. -> ok
- **RN-04 (Vínculos):** Um Projeto deve pertencer a um Setor obrigatório. Um Membro pode estar em vários Projetos. -> verificar
- **RN-05 (Exclusão Lógica):** Exclusões são lógicas (soft delete) para Setores, Projetos e Usuários, com marcação de inativo e data de exclusão. -> ok
- **RN-06 (Restrições de Exclusão):** Não é permitido excluir Setor com Projetos ativos; nem é possível excluir Projeto com Membros vinculados. -> ok
- **RN-07 (Senhas):** Senha deve atender ao mínimo: 8+ caracteres -> ok
- **RN-08 (Acesso):** Usuários desativados não acessam o sistema. -> verificar
- **RN-09 (Limites de Coordenação):** Coordenador não pode adicionar/remover usuários com Role Diretor de projetos; somente Diretor pode gerir a participação de Diretores em projetos. -> falta

---

## 5. Arquitetura (Opcional)

A estrutura do projeto segue uma organização em camadas, separando responsabilidades de forma clara:

### Estrutura de Diretórios

```
src/
├── env/
│   └── index.ts                    # Configurações de ambiente
├── lib/
│   └── prisma.ts                   # Cliente Prisma
├── middlewares/
│   ├── auth.ts                     # Middleware de autenticação JWT
│   └── errorHandler.ts             # Middleware de tratamento de erros
├── repositories/
│   ├── interfaces/                 # Interfaces dos repositórios
│   │   └── UserRepository.ts
│   └── prisma/
│       └── UserPrismaRepository.ts
├── services/
│   ├── AuthService.ts
│   └── UserService.ts
├── web/
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── routes.ts
│   └── controllers/
│       ├── AuthController.ts
│       └── UserController.ts
├── app.ts                          # Entrada da aplicação
└── server.ts                       # Configuração do servidor Fastify
```

### Descrição das Camadas

- **env/**: Gerenciamento de variáveis de ambiente e configurações
- **lib/**: Utilitários e configurações de bibliotecas externas (Prisma)
- **middlewares/**: Middlewares do Fastify para autenticação e tratamento de erros
- **repositories/**: Camada de acesso a dados com padrão Repository
- **services/**: Lógica de negócio e regras da aplicação
- **web/**: Camada de apresentação com controllers e rotas HTTP
- **app.ts**: Configuração principal da aplicação
- **server.ts**: Inicialização do servidor Fastify

## 6. Considerações Finais

O escopo proposto prioriza simplicidade e clareza na gestão de Setores, Projetos e Membros, com papéis bem definidos. Funcionalidades adicionais (ex.: tarefas, cronograma detalhado, dashboards) podem ser incluídas em versões futuras sem quebrar o modelo atual.
te