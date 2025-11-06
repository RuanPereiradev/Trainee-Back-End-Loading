<h1 style="color:#2c3e50; text-align:center;">🚀 AgendaPro - Documentação do Projeto</h1>

<p style="text-align:center; color:#7f8c8d;">Sistema de agendamento profissional usando Fastify, TypeScript e Prisma com PostgreSQL.</p>

---

<h2 style="color:#2980b9;">📦 Estrutura do Projeto</h2>
<ul>
  <li><strong>src/</strong> - Código fonte do projeto</li>
  <li><strong>src/domain/</strong> - Entidades, casos de uso e testes</li>
  <li><strong>src/repositories/</strong> - Repositórios para persistência de dados</li>
  <li><strong>prisma/</strong> - Schema do Prisma e scripts de migração</li>
  <li><strong>generated/prisma/</strong> - Cliente Prisma gerado automaticamente</li>
</ul>

---

<h2 style="color:#27ae60;">🐳 Docker</h2>
<p>O banco PostgreSQL roda dentro de um container Docker:</p>

<pre style="padding:10px; border-radius:5px;">
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: fastify_postgres
    restart: always
    environment:
      POSTGRES_USER: ruan
      POSTGRES_PASSWORD: 123456
      POSTGRES_DB: agenda_db
    ports:
      - "5654:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
</pre>

<p style="color:#e67e22;">💡 Dica:</p>
<p>O banco fica acessível na porta <strong>5654</strong> do host, e o usuário padrão é <strong>ruan</strong>.</p>

---

<h2 style="color:#8e44ad;">⚡ Prisma</h2>
<p>O Prisma conecta o projeto ao banco e gera o cliente para consultas:</p>

<pre style="background-color:; padding:10px; border-radius:5px;">
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}
</pre>

<p style="color:#e74c3c;">Passos para gerar o cliente Prisma:</p>
<ol>
  <li>Rodar <code>npx prisma generate</code> para gerar o client.</li>
  <li>Rodar <code>npx prisma migrate dev --name init</code> para aplicar migrações.</li>
  <li>Conectar ao banco no código com <code>import { PrismaClient } from "@prisma/client"</code>.</li>
</ol>

---

<h2 style="color:#16a085;">🧩 Conexão no TypeScript</h2>
<pre style="background-color:#; padding:10px; border-radius:5px;">
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('🔗 Conectando ao banco...');
  const users = await prisma.user.findMany();
  console.log('✅ Conectado com sucesso!');
  console.log('Usuários no banco:', users);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Erro ao acessar o banco:', e);
    prisma.$disconnect();
  });
</pre>

---

<h2 style="color:#d35400;">🎨 Estilo e cores</h2>
<p>Este README usa HTML inline para:</p>
<ul>
  <li>Títulos coloridos</li>
  <li>Destaques de código com <code>&lt;pre&gt;</code></li>
  <li>Listas coloridas e bem organizadas</li>
</ul>

---

<p style="text-align:center; color:#34495e;">Made with ❤️ by Ruan Pereira</p>
