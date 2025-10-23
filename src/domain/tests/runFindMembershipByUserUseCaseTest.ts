import { User } from "../../domain/entities/User";
import { Project } from "../../domain/entities/Projects";
import { Membership } from "../../domain/entities/Membership";
import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { FindMembershipsByUserUseCase } from "../../useCases/membership/FindMembershipByUseCase";
import { Email } from "../../domain/value-objects/Email";
import { Password } from "../../domain/value-objects/Password";
import { UserRole } from "../../domain/enums/UserRole";
import { RoleType } from "../enums/RoleType";
import { Sectors } from "../entities/Sectors";
// Criando dados de teste
async function runTest() {
    console.log("🧪 Iniciando teste: FindMembershipsByUserUseCase");

    const membershipRepo = new MembershipRepository();

    const setorTech = new Sectors("Tecnologia", "Dev");

    // Criando usuários
    const ruan = new User("Ruan", new Email("ruan@example.com"), new Password("12345678"), new UserRole(RoleType.MEMBRO));
    const ana = new User("Ana", new Email("ana@example.com"), new Password("12345678"), new UserRole(RoleType.MEMBRO));

    // Criando projetos
    const projetoAlpha = Project.create("Projeto Alpha", setorTech, "Descrição Alpha").getValue();
    const projetoBeta = Project.create("Projeto Beta", setorTech, "Descrição Beta").getValue();

    // Criando memberships
    const membership1 = new Membership(ruan, projetoAlpha);
    const membership2 = new Membership(ruan, projetoBeta);
    const membership3 = new Membership(ana, projetoAlpha);

    // Salvando no repository
    await membershipRepo.save(membership1);
    await membershipRepo.save(membership2);
    await membershipRepo.save(membership3);

    console.log("\n📋 Memberships registradas:");
    (await membershipRepo.findAll()).getValue().forEach(m => {
        console.log(`- ${m.user.name} está em ${m.project.name}`);
    });

    // Executando a use case
    const findMembershipsUseCase = new FindMembershipsByUserUseCase(membershipRepo);
    console.log(`\n🔍 Buscando memberships do usuário Ruan...`);
    const result = await findMembershipsUseCase.execute(ruan.id);

    if (result.isSuccess) {
        console.log(`✅ Memberships encontradas para Ruan:`);
        result.getValue().forEach(m => {
            console.log(`- Projeto: ${m.project.name} | Saiu? ${m.leftAt ? "Sim" : "Não"}`);
        });
    } else {
        console.error("❌ Erro:", result.getError());
    }

    // Simulando Ruan saindo do Projeto Alpha
    console.log(`\n🚪 Ruan saindo do Projeto Alpha...`);
    membership1.leaveProject();
    await membershipRepo.update(membership1);

    // Reexecutando a consulta
    console.log(`\n🔁 Buscando novamente memberships do usuário Ruan...`);
    const resultAfterLeave = await findMembershipsUseCase.execute(ruan.id);

    if (resultAfterLeave.isSuccess) {
        console.log(`📊 Resultado atualizado:`);
        resultAfterLeave.getValue().forEach(m => {
            console.log(`- Projeto: ${m.project.name} | Saiu? ${m.leftAt ? "Sim" : "Não"}`);
        });
    }
    
    console.log("\n🎉 Teste finalizado!");
}

runTest();
