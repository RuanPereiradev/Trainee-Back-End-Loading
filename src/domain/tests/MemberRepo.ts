import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { RoleType } from "../enums/RoleType";
import { UserRole } from "../enums/UserRole";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";
import { User } from "../entities/User";
import { Sectors } from "../entities/Sectors";
import { Project } from "../entities/Projects";

async function runMembershipTests() {
    const membershipRepo = new MembershipRepository();

    //cria um usuário e projeto
    const user = new User("Ruan", new Email("ruantest@gmail.com"), new Password("senha1234"), new UserRole(RoleType.DIRETOR));
    const setor = new Sectors("Desenvolvimento", "Setor principal");
    const projectResult = Project.create("Projeto Alpha", setor);
    if(projectResult.isFailure) return;
    const project = projectResult.getValue();

    // Criar membership
    const membership = new (require("../entities/Membership").Membership)(user, project);


    //salvar membership
    const saveResult = await membershipRepo.save(membership);
    console.log("Salvar membership:", saveResult.isSuccess ? "OK" : saveResult.getError());

    //buscar por id
    const foundById = await membershipRepo.findById(membership.id);
    console.log("busca por id:", foundById.isSuccess ? foundById.getValue().id : "Não encontrado");
    //Atualizar membership
    membership.leaveProject();
    const updateResult = await membershipRepo.update(membership);
    console.log("Atualizar membership:", updateResult.isSuccess ? "OK" : updateResult.getError());

    // Listar todos
    const allMemberships = await membershipRepo.findAll();
    console.log("Todos memberships:", allMemberships.isSuccess ? allMemberships.getValue().map(m => m.id) : "Erro");

    // Deletar
    const deleteResult = await membershipRepo.delete(membership.id);
    console.log("Deletar membership:", deleteResult.isSuccess ? "OK" : deleteResult.getError());
}
runMembershipTests();