import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log('🔗 Conectando ao banco...')

  const users = await prisma.user.findMany()
  console.log('✅ Conectado com sucesso!')
  console.log('Usuários no banco:', users)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Erro ao acessar o banco:', e)
    prisma.$disconnect()
  })
