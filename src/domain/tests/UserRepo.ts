import { UserRepository } from "../../repositories/prisma/UserRepository";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";
import { User } from "../../domain/entities/User";
import { UserRole } from "../../domain/enums/UserRole";
import { RoleType } from "../enums/RoleType";

async function runTests() {
  const userRepo = new UserRepository();

  // 1️⃣ Criar usuários
  const email1 = new Email("ruan@teste.com");
  const password1 = new Password("Senha1234!");
  const user1 = new User("Ruan", email1, password1, new UserRole(RoleType.DIRETOR));

  const resultSave = await userRepo.save(user1);
  console.log("Salvar usuário:", resultSave.isSuccess ? "OK" : resultSave.getError());

  // 2️⃣ Buscar por ID
  const foundById = await userRepo.findById(user1.id);
  console.log("Busca por id:", foundById ? foundById.name : "Não encontrado");

  // 3️⃣ Buscar por email
  const foundByEmail = await userRepo.findByEmail("ruan@teste.com");
  console.log("Busca por email:", foundByEmail.isSuccess ? foundByEmail.getValue().name : foundByEmail.getError());

  // 4️⃣ Atualizar nome
  user1.changeName("Ruan Pereira");
  const resultUpdate = await userRepo.update(user1);
  console.log("Atualizar usuário:", resultUpdate.isSuccess ? "OK" : resultUpdate.getError());

  // 5️⃣ Listar todos usuários
  const allUsers = await userRepo.findAll();
  console.log("Todos usuários:", allUsers.isSuccess ? allUsers.getValue().map(u => u.name) : allUsers.getError());

  // 6️⃣ Deletar usuário
  const resultDelete = await userRepo.delete(user1.id);
  console.log("Deletar usuário:", resultDelete.isSuccess ? "OK" : resultDelete.getError());

  // 7️⃣ Listar após deletar
  const afterDelete = await userRepo.findAll();
  console.log("Após deletar:", afterDelete.isFailure ? afterDelete.getError() : afterDelete.getValue().length);
}

runTests();
