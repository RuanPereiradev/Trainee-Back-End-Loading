import { User } from "../../domain/entities/User";
import { Project } from "../../domain/entities/Projects";
import { Sectors } from "../../domain/entities/Sectors";
import { Membership } from "../../domain/entities/Membership";
import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { FindProjectsByUserUseCase } from "../../useCases/membership/FindProjectsByUserUseCase";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";
import { UserRole } from "../enums/UserRole";
import { RoleType } from "../enums/RoleType";

async function runFindProjectsByUserTest() {
    const membershipRepo = new MembershipRepository();

    // Criar usuários
    const user = new User("Ruan", new Email("ruan@example.com"), new Password("12345678"), new UserRole(RoleType.DIRETOR));
    const user2 = new User("Ana", new Email("ana@example.com"), new Password("12345678"), new UserRole(RoleType.MEMBRO));

    // Criar setores e projetos
    const setor = new Sectors("Tecnologia", "Dev");
    
    const project1 = Project.create("Projeto Alpha", setor, "Descrição do projeto");

    if (project1.isFailure) {
        console.error("❌ Erro ao criar projeto:", project1.getError());
        return;
    }

    const projectUser1 = project1.getValue();

    const project2 = Project.create("Projeto Alpha", setor, "Descrição do projeto");

    if (project2.isFailure) {
        console.error("❌ Erro ao criar projeto:", project2.getError());
        return;
    }

    const projectUser2 = project2.getValue();

    // Criar memberships
    const membership1 = new Membership(user, projectUser1);
    const membership2 = new Membership(user, projectUser2);
    const membership3 = new Membership(user2, projectUser1);

    await membershipRepo.save(membership1);
    await membershipRepo.save(membership2);
    await membershipRepo.save(membership3);

    // Logs antes de alterações
    console.log("🔹 Projetos antes de alterações:");
    (await membershipRepo.findAll()).getValue().forEach(m => {
        console.log(`- ${m.user.name} | Projeto: ${m.project.name} | saiu? ${m.leftAt !== null}`);
    });

    // Teste FindProjectsByUserUseCase
    const findProjects = new FindProjectsByUserUseCase(membershipRepo);
    const projectsResult = await findProjects.execute(user.id);

    if (projectsResult.isSuccess) {
        console.log("✅ Projetos ativos do usuário Ruan:", projectsResult.getValue().map(p => p.name));
    }

    // Simular usuário saindo do projeto1
    membership1.leaveProject();
    await membershipRepo.update(membership1);

    // Logs depois da saída
    console.log("🔹 Projetos após saída de Ruan do Projeto Alpha:");
    (await membershipRepo.findAll()).getValue().forEach(m => {
        console.log(`- ${m.user.name} | Projeto: ${m.project.name} | saiu? ${m.leftAt !== null}`);
    });

    // Reexecutar consulta após saída
    const projectsAfterLeaveResult = await findProjects.execute(user.id);
    if (projectsAfterLeaveResult.isSuccess) {
        console.log("✅ Projetos ativos do usuário Ruan após saída:", projectsAfterLeaveResult.getValue().map(p => p.name));
    }
}

runFindProjectsByUserTest();
