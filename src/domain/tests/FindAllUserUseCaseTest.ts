// import { UserRepository } from "../../repositories/prisma/UserRepository"; // teu repo em memória
// import { CreateUserUseCase } from "../../userCases/user/CreateUserUseCase";
// import { FindAllUserUseCase } from "../../userCases/user/FindAllUsersUseCase";
// import { RoleType } from "../enums/RoleType";
// import { UserRole } from "../enums/UserRole";

import { UserRepository } from "../../repositories/prisma/UserRepository";
import { FindAllUserUseCase } from "../../useCases/user/FindAllUsersUseCase";
import { RoleType } from "../enums/RoleType";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";

// async function testFindAllUserUseCase() {
//   const userRepository = new UserRepository();
//   const createUserUseCase = new CreateUserUseCase(userRepository);
//   const findAllUserUseCase = new FindAllUserUseCase(userRepository);

//   // 1️⃣ Testa caso sem usuários
//   const emptyResult = await findAllUserUseCase.execute();
//   if (emptyResult.isFailure) {
//     console.log("🔍 Resultado esperado (sem usuários):", emptyResult.getError());
//   } else {
//     console.error("❌ Erro: deveria ter retornado falha (nenhum usuário encontrado)");
//   }

//   // 2️⃣ Cria alguns usuários
//   await createUserUseCase.execute({
//     name: "Ruan Pereira",
//     email: "ruan@example.com",
//     password: "123456",
//     role: new UserRole(RoleType.COORDENADOR),
//   });

//   await createUserUseCase.execute({
//     name: "Maria Silva",
//     email: "maria@example.com",
//     password: "654321",
//     role: new UserRole(RoleType.DIRETOR),
//   });

//   // 3️⃣ Testa busca com usuários existentes
//   const result = await findAllUserUseCase.execute();

//   if (result.isSuccess) {
//     const users = result.getValue();
//     console.log(`✅ ${users.length} usuários encontrados:`);
//     users.forEach((u) =>
//       console.log(`👤 ${u.name} | ${u.email.value} | ${u.role.role}`)
//     );
//   } else {
//     console.error("❌ Erro ao buscar usuários:", result.getError());
//   }
// }

// testFindAllUserUseCase();
import { User } from "../entities/User";
import { UserRole } from "../enums/UserRole";

async function runTests(){
    const userRepo = new UserRepository();
    const findAllUserUseCase = new FindAllUserUseCase(userRepo);

    //criando usuários
    const email = new Email ("ruan@teste.com");
    const password = new Password("SenhaSegura123");
    const user = new User("Ruan", email, password, new UserRole(RoleType.COORDENADOR));

    await userRepo.save(user);

    const email2 = new Email ("jao@pereira.com");
    const password2 = new Password("SenhaSegura123");
    const user2 = new User("Joao", email2, password2, new UserRole(RoleType.DIRETOR));

    await userRepo.save(user2);

    const email3 = new Email ("maria@rodrigues.com");
    const password3 = new Password("SenhaSegura123");
    const user3 = new User("Maria", email3, password3, new UserRole(RoleType.DIRETOR));

    await userRepo.save(user3);

    const result = await findAllUserUseCase.execute();

      if (result.isSuccess) {
          console.log("✅ Usuários encontrados:", result.getValue());
      } else {
          console.log("❌ Erro:", result.getError());
      }
}

runTests();