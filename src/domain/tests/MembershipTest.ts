import { CreateMembershipUseCase } from "../../useCases/membership/CreateMembershipUseCase";
import { DeleteMembershipUseCase } from "../../useCases/membership/DeleteMembershipUseCase";
import { UpdateMembershipUseCase } from "../../useCases/membership/UpdateMembershipUseCase";
import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { User } from "../../domain/entities/User";
import { Project } from "../../domain/entities/Projects";
import { Sectors } from "../../domain/entities/Sectors";
import { UserRole } from "../../domain/enums/UserRole";
import { RoleType } from "../../domain/enums/RoleType";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";

async function runMembershipTest() {
  const membershipRepo = new MembershipRepository();
  const createMembership = new CreateMembershipUseCase(membershipRepo);
  const deleteMembership = new DeleteMembershipUseCase(membershipRepo);
  const updateMembership = new UpdateMembershipUseCase(membershipRepo);

  // Criando usuário e projeto
  const user = new User("Ruan", new Email("ruan@example.com"), new Password("Hello123456"), new UserRole(RoleType.DIRETOR));
  const setor = new Sectors("TI", "Setor de tecnologia");
  const projectResult = Project.create("Projeto Alpha", setor, "Projeto teste");
  if (projectResult.isFailure) return console.log(projectResult.getError());
  const project = projectResult.getValue();

  // 1️⃣ Criar membership
  const membershipResult = await createMembership.execute({ user, project });
  if (membershipResult.isSuccess) {
    const membership = membershipResult.getValue();
    console.log(`✅ Membership criada: User=${membership.user.name} | Project=${membership.project.name}`);

    // 2️⃣ Atualizar membership: sair do projeto
    const leaveResult = await updateMembership.execute({ id: membership.id, leave: true });
    if (leaveResult.isSuccess) {
      console.log(`🔹 Usuário saiu do projeto: ${leaveResult.getValue().user.name} | ${leaveResult.getValue().project.name}`);
    } else {
      console.log("❌ Erro ao sair do projeto:", leaveResult.getError());
    }

    // 3️⃣ Atualizar membership: reentrar no projeto
    const rejoinResult = await updateMembership.execute({ id: membership.id, rejoin: true });
    if (rejoinResult.isSuccess) {
      console.log(`🔹 Usuário voltou ao projeto: ${rejoinResult.getValue().user.name} | ${rejoinResult.getValue().project.name}`);
    } else {
      console.log("❌ Erro ao reentrar no projeto:", rejoinResult.getError());
    }

    // 4️⃣ Teste de delete
    const deleteResult = await deleteMembership.execute(membership.id);
    if (deleteResult.isSuccess) {
      console.log("🗑️ Membership deletada com sucesso!");
    } else {
      console.log("❌ Erro ao deletar membership:", deleteResult.getError());
    }

    // 5️⃣ Teste delete duplicado
    const deleteAgainResult = await deleteMembership.execute(membership.id);
    if (deleteAgainResult.isFailure) {
      console.log("🔹 Teste duplicado: Deveria falhar!", deleteAgainResult.getError());
    }

  } else {
    console.log("❌ Erro ao criar membership:", membershipResult.getError());
  }
}

runMembershipTest();
