// src/domain/tests/UpdateUserUseCaseTest.ts
import { UserRepository } from "../../repositories/prisma/UserRepository";
import { UpdateUserUseCase } from "../../useCases/user/UpdateUserUseCase";
import { User } from "../entities/User";
import { RoleType } from "../enums/RoleType";
import { UserRole } from "../enums/UserRole";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";

async function runTests() {
    const userRepo = new UserRepository();
    const updateUserUseCase = new UpdateUserUseCase(userRepo);

    // Cria usuário inicial
    const initialEmail = new Email("teste@dominio.com");
    const initialPassword = new Password("Senha1234");
    const user = new User("Ruan", initialEmail, initialPassword, new UserRole(RoleType.MEMBRO));

    // Salva no repositório fake
    await userRepo.save(user);

    console.log("Usuário inicial:", user.name, user.email.value);

    // Atualiza usuário
    const updateRequest = {
        id: user.id,
        name: "Ruan Pereira",
        email: "ruanpereira@dominio.com",
        password: "NovaSenha1234",
        role: new UserRole(RoleType.MEMBRO)
    };

    const result = await updateUserUseCase.execute(updateRequest);

    if (result.isSuccess) {
        const updatedUser = result.getValue();
        console.log("Usuário atualizado com sucesso!");
        console.log("Nome:", updatedUser.name);
        console.log("Email:", updatedUser.email.value);
        console.log("Role:", updatedUser.role.role);
    } else {
        console.log("Erro ao atualizar usuário:", result.getError());
    }
}

runTests();
