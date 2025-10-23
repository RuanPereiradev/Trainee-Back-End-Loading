// src/domain/tests/CreateMembershipUseCaseTest.ts
import { User } from "../../domain/entities/User";
import { Project } from "../../domain/entities/Projects";
import { Sectors } from "../../domain/entities/Sectors";
import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { CreateMembershipUseCase } from "../../useCases/membership/CreateMembershipUseCase";
import { Result } from "../../env/Result";
import { UserRole } from "../enums/UserRole";
import { RoleType } from "../enums/RoleType";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";

async function runCreateMembershipTest() {
  const membershipRepo = new MembershipRepository();
  const createMembershipUseCase = new CreateMembershipUseCase(membershipRepo);

  // Criando usuário e projeto
  const user = new User("Ruan", new Email("ruan@example.com"), new Password("Hello123456"), new UserRole(RoleType.DIRETOR));
  const setor = new Sectors("TI", "Setor de tecnologia");
  const projectResult = Project.create("Projeto Alpha", setor, "Descrição do projeto");

  if (projectResult.isFailure) {
    console.error("❌ Erro ao criar projeto:", projectResult.getError());
    return;
  }

  const project = projectResult.getValue();

  // 1️⃣ Testar sem usuário
  const resultNoUser = await createMembershipUseCase.execute({ user: null as any, project });
  console.log("🔹 Teste sem usuário:", resultNoUser.isFailure ? resultNoUser.getError() : "Falhou!");

  // 2️⃣ Testar sem projeto
  const resultNoProject = await createMembershipUseCase.execute({ user, project: null as any });
  console.log("🔹 Teste sem projeto:", resultNoProject.isFailure ? resultNoProject.getError() : "Falhou!");

  // 3️⃣ Criar Membership válido
  const validResult = await createMembershipUseCase.execute({ user, project });
  if (validResult.isSuccess) {
    const membership = validResult.getValue();
    console.log(`✅ Membership criada: User=${membership.user.name} | Project=${membership.project.name}`);
  } else {
    console.error("❌ Erro ao criar Membership válida:", validResult.getError());
  }

  // 4️⃣ Tentar criar Membership duplicada (mesmo user e projeto)
  const duplicateResult = await createMembershipUseCase.execute({ user, project });
  console.log(
    "🔹 Teste duplicado:",
    duplicateResult.isFailure ? duplicateResult.getError() : "Deveria falhar!"
  );
}

runCreateMembershipTest();
