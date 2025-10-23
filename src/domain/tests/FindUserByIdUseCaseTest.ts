import { UserRepository } from "../../repositories/prisma/UserRepository";
import { FindUserByIdUseCase } from "../../useCases/user/FindUserByIdUseCase";
import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";
import { UserRole } from "../enums/UserRole";
import { RoleType } from "../enums/RoleType";

async function runTests() {
    const userRepo = new UserRepository();
    const findUserByIdUseCase = new FindUserByIdUseCase(userRepo);

    // Criando usuário de teste
    const email = new Email("ruan@teste.com");
    const password = new Password("SenhaSegura123");
    const user = new User("Ruan", email, password, new UserRole(RoleType.MEMBRO));
 
    await userRepo.save(user);

    // Buscar usuário existente
    const result = await findUserByIdUseCase.execute({ id: user.id });

    if (result.isSuccess) {
        console.log("✅ Usuário encontrado:", result.getValue().name);
    } else {
        console.log("❌ Erro:", result.getError());
    }

    // Buscar usuário inexistente
    const notFound = await findUserByIdUseCase.execute({ id: "id-inexistente" });
    console.log("🔍 Resultado busca inexistente:", notFound.isFailure ? notFound.getError() : "Encontrado");
}

runTests();
