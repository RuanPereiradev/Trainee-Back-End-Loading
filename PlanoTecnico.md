# Plano Técnico Definitivo — Implementação Completa das RFs

## 🔵 ETAPA 1 — Criar Soft Delete Universal

### 📌 O que implementar
Adicionar `deletedAt: Date | null` nas entidades:

- User
- Sector
- Project

E ajustar:

- Repositórios → nunca retornar itens com `deletedAt ≠ null`
- Listagens → sempre filtrar por `deletedAt: null`

### 🎯 RF resolvidas
- RF-A05 — Desativar usuário  
- RF-B01 / RF-B02 — Soft delete em setor e projeto  
- RN-05 — Exclusão lógica obrigatória  

### 🧠 Por que começa por aqui?
Porque todo o sistema depende disso:  
CRUD, memberships, login, permissões, filtros.

### 🛠️ Exemplo técnico
```ts
async list() {
  return prisma.user.findMany({
    where: { deletedAt: null }
  });
}
```

---

## 🔵 ETAPA 2 — Restrições de Exclusão

### 📌 O que implementar
- Impedir excluir Setor com Projetos ativos
- Impedir excluir Projeto com Membership ativa (`leftAt = null`)

### 🎯 RF resolvidas
- RN-06

### 🛠️ Exemplo
```ts
const projectCount = await prisma.project.count({
  where: { sectorId, deletedAt: null }
});

if (projectCount > 0)
  throw new Error("Não é possível excluir setor com projetos ativos");
```

---

## 🔵 ETAPA 3 — Paginação e Filtros

### 📌 O que implementar
- `?page=X&pageSize=Y`
- Filtros: `name`, `status`, `sectorId`

### 🎯 RF resolvidas
- RF-B08

### 🛠️ Exemplo
```ts
const projects = await prisma.project.findMany({
  skip: page * pageSize,
  take: pageSize,
  where: {
    name: { contains: filterName ?? undefined }
  }
});
```

---

## 🔵 ETAPA 4 — Login e JWT

### 📌 O que implementar
- POST /auth/login
- POST /auth/register (somente diretoria)
- Hash de senha com bcrypt
- Token JWT contendo `userId` e `role`

### 🎯 RF resolvidas
- RF-A01
- RF-A02
- RF-A07

### 🛠️ Exemplo
```ts
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);
```

---

## 🔵 ETAPA 5 — Middleware de Autenticação

### 📌 O que implementar
- Middleware verifyToken
- Aplicar middleware nas rotas protegidas

### 🎯 RF resolvidas
- RF-A02

---

## 🔵 ETAPA 6 — Middleware de Autorização (Roles)

### 📌 O que implementar
- requireRole("DIRETOR")
- requireRoleOrSelf
- requireProjectCoordinator

### 🎯 RF resolvidas
- RF-A03  
- RF-A04  
- RF-B05  
- RF-B06  
- RF-B07  
- RF-B09  

---

## 🔵 ETAPA 7 — Regras dos Coordenadores

### 📌 O que implementar
Checar membership antes de permitir:

- editar projeto  
- adicionar membro  
- remover membro  

### 🎯 RF resolvidas
- RF-B05  
- RN-09  

---

## 🔵 ETAPA 8 — Atualização do Próprio Perfil

### 📌 O que implementar
Atualizar:

- nome  
- avatar  
- senha  

### 🎯 RF resolvidas
- RF-A06

---

## 🔵 ETAPA 9 — Listar Projetos do Próprio Usuário

### 📌 O que implementar
- GET /me/projects  

### 🎯 RF resolvidas
- RF-B07

---

## 🔵 ETAPA 10 — Atividades do Projeto

### 📌 O que implementar
Adicionar no Projeto:

- descrição  
- metas  
- status (enum)  

### 🎯 RF resolvidas
- RF-C01  
- RF-C02  

---

# 🟢 Resumo Final — Ordem Perfeita

1. Soft delete  
2. Restrições de exclusão  
3. Paginação e filtros  
4. Login + JWT + bcrypt  
5. Middleware de autenticação  
6. Middleware de autorização  
7. Regras de coordenador  
8. Atualização de perfil  
9. Projetos do usuário  
10. Campos/metas/status do projeto  