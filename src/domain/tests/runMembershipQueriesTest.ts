// import { User } from "../../domain/entities/User";
// import { Project } from "../../domain/entities/Projects";
// import { Sectors } from "../../domain/entities/Sectors";
// import { Membership } from "../../domain/entities/Membership";
// import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
// import { FindMembersByProjectUseCase } from "../../useCases/membership/FindMembersByProjectUseCase";
// import { Email } from "../../domain/value-objects/Email";
// import { Password } from "../../domain/value-objects/Password";


// async function runFindMembersByProjectTest() {
//     const membershipRepo = new MembershipRepository();

//     // Criar usuários diretamente
//     const user = new User("Ruan", new Email("ruan@example.com"), new Password("12345678"), new UserRole(RoleType.DIRETOR));
//     const user2 = new User("Ana", new Email("ana@example.com"), new Password("12345678"), new UserRole(RoleType.MEMBRO));

//     // Criar projeto
//     const setor = new Sectors("Tecnologia", "Dev");
//   const projectResult = Project.create("Projeto Alpha", setor, "Descrição do projeto");

//   if (projectResult.isFailure) {
//     console.error("❌ Erro ao criar projeto:", projectResult.getError());
//     return;
//   }

// const project = projectResult.getValue();
//     // Criar memberships
//     const membership1 = new Membership(user, project);
//     const membership2 = new Membership(user2, project);

//     await membershipRepo.save(membership1);
//     await membershipRepo.save(membership2);

//     // Logs antes de alterações
//     console.log("🔹 Membros antes de alterações:");
//     (await membershipRepo.findAll()).getValue().forEach(m => {
//         console.log(`- ${m.user.name} | Projeto: ${m.project.name} | saiu? ${m.leftAt !== null}`);
//     });

//     // Teste FindMembersByProjectUseCase
//     const findMembers = new FindMembersByProjectUseCase(membershipRepo);
//     const membersResult = await findMembers.execute({ projectId: project.id });

//     if (membersResult.isSuccess) {
//         console.log("✅ Membros ativos do projeto:", membersResult.getValue().map(m => m.user.name));
//     }

//     // Simular usuário saindo do projeto
//     membership1.leaveProject();
//     await membershipRepo.update(membership1); // importante atualizar o repositório

//     // Logs depois da saída
//     console.log("🔹 Membros após saída de Ruan:");
//     (await membershipRepo.findAll()).getValue().forEach(m => {
//         console.log(`- ${m.user.name} | Projeto: ${m.project.name} | saiu? ${m.leftAt !== null}`);
//     });

//     // Reexecutar consulta após saída
//     const membersAfterLeaveResult = await findMembers.execute({ projectId: project.id });
//     if (membersAfterLeaveResult.isSuccess) {
//         console.log("✅ Membros ativos após saída:", membersAfterLeaveResult.getValue().map(m => m.user.name));
//     }
// }

// runFindMembersByProjectTest();
