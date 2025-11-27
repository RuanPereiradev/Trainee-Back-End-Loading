// import { ProjectStatusType, RoleType } from "@prisma/client";
// import { Membership } from "../../domain/entities/Membership";
// import { Project } from "../../domain/entities/Projects";
// import { Result } from "../../env/Result";
// import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
// import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
// import { IUserRepository } from "../../repositories/interfaces/IUserRepository";

// interface CoordenadorEditProjectRequest{
//     userId: string;
//     projectId: string;
//     action: "EDIT" | "ADD_MEMBER" | "REMOVE_MEMBER";

//   // Só serão usados quando action === "EDIT"
//     name?: string;
//     description?: string;
//     goals?: string;
//     status?: ProjectStatusType;

//   // Só usado quando action === "ADD_MEMBER" ou "REMOVE_MEMBER"
//   targetUserId?: string;
// }

// export class CoordenadorEditProjectUseCase{
//     constructor(private membershipRepository: IMembershipRepository,
//                 private projectRepository: IProjectRepository,
//                 private userRespository: IUserRepository
//     ){}

//     async execute(request: CoordenadorEditProjectRequest): Promise<Result<any>>{

//         try {

//             const existingMembership = await this.membershipRepository.findByUserAndProject(request.userId, request.projectId);
//              if(existingMembership.isFailure || !existingMembership.getValue()){
//                 return Result.fail<Membership>("Não pertence a esse projeto")
//             }

//             const membership = existingMembership.getValue();
//             if(membership?.user.role !== RoleType.COORDENADOR ){
//                 return Result.fail("Apenas coordenadores podem editar informações ")
//             }

//             switch(request.action){
//                 case "EDIT": return this.handleEdit(request)
//                 case "ADD_MEMBER": return this.handleAddMember(request)
//                 case "REMOVE_MEMBER": return this.handleRemoveMember(request)
//                 default:
//                     return Result.fail("Ação inválida")
//             }
//         } catch (error: any) {
//             if(error instanceof Error){
//                 return Result.fail<Membership>(error.message);
//             }
//             return Result.fail<Membership>("Erro desconhecido ao atualizar")
//         }
//     }
//     async handleRemoveMember(request: CoordenadorEditProjectRequest): Promise<Result<void>> {
//         if(!request.targetUserId || !request.projectId){
//              return Result.fail<void>("targetUser e projectId obrigatorios")
//         }

//         const userResult = await this.userRespository.findById(request.targetUserId)
//         if(userResult.isFailure){
//             return Result.fail<void>("Usuário não encontrado");
//         }

//         const projectResult = await this.projectRepository.findById(request.projectId)
//         if(projectResult.isFailure){
//             return Result.fail<void>("Projeto não encontrado")
//         }

//         const membershipResult = await this.membershipRepository.findByUserAndProject(request.targetUserId, request.projectId)
//         if(membershipResult.isFailure){
//             return Result.fail<void>(membershipResult.getError())
//         }

//         const membership =  membershipResult.getValue();

//         if(!membership){
//             return Result.fail<void>("Usuário nao esta vinculado a esse projeto")
//         }

//         try {
//             membership.leaveProject()
//         } catch (error:any) {
//             return Result.fail<void>(error.message)
//         }

//         const updateResult = await this.membershipRepository.update(membership)
//         if(updateResult.isFailure){
//             return Result.fail<void>(updateResult.getError())
//         }
//         return Result.ok<void>()
//     }

//     async handleAddMember(request: CoordenadorEditProjectRequest): Promise<Result<Membership>> {

//         //validação
//         if(!request.targetUserId || !request.projectId){
//             return Result.fail<Membership>("targetId e ProjectId são obrigatórios")
//         }

//         //verificação de usuário
//         const targetUserResult = await this.userRespository.findById(request.targetUserId);
//         if(targetUserResult.isFailure || !targetUserResult.getValue()){
//             return Result.fail<Membership>("Usuário a ser adicionado não encontrado");
//         }

//         //pega o value do usuario
//         const targetUser = targetUserResult.getValue();

//         //busca o projeto
//         const projectResult = await this.projectRepository.findById(request.projectId);
//         if (projectResult.isFailure || !projectResult.getValue()) {
//             return Result.fail<Membership>("Projeto não encontrado");
//         }

//         //pega o valor do projeto  
//         const project = projectResult.getValue();

//         //verifica se já existe relacionamento
//         const existingMembershipResult = await this.membershipRepository.findByUserAndProject(request.userId, request.projectId)
//         if(existingMembershipResult){
//             return Result.fail<Membership>("Esse usuário já participa do projeto");
//         }

//         //se a role diretor for escolhida
//         if(targetUser.role === RoleType.DIRETOR){
//             return Result.fail<Membership>("Você não pode adicionar diretores no projeto, apenas membros");
//         }

//         //se a role coordenador for escolhida
//         if(targetUser.role === RoleType.COORDENADOR){
//             const coordenadorResult = await this.membershipRepository.findByCoordenadorProject(request.projectId)
//             if(coordenadorResult.isFailure && coordenadorResult.getValue()){
//                 return Result.fail("Esse projeto já possui um coordenador")
//             }
//         }
        

//         //relaciona a nova membership
//         const membership = new Membership(targetUser, project);

//         const saveResult = await this.membershipRepository.create(membership)

//         if(saveResult.isFailure){
//             return Result.fail<Membership>("Erro ao salvar membership");
//         }

//         return Result.ok<Membership>(saveResult.getValue())

//     }

//     private async handleEdit(request: CoordenadorEditProjectRequest): Promise<Result<Project>>{

//         const projectResult = await this.projectRepository.findById(request.projectId);
//         if(projectResult.isFailure){
//             return Result.fail("Projeto não encontrado")
//         }
//         const project = projectResult.getValue();

//         if(request.name){
//             const nameResult = project.changeName(request.name)
//             if(nameResult.isFailure){
//                 return Result.fail<Project>(nameResult.getError());
//             }
//         }
//         if(request.status){
//             const statusResult = project.changeStatus(request.status)
//             if(statusResult.isFailure){
//                 return Result.fail<Project>(statusResult.getError());
//             }
//         }
//         if(request.description){
//            const descriptionResult = project.changeDescription(request.description)
//            if(descriptionResult.isFailure){
//             return Result.fail<Project>(descriptionResult.getError())
//            }
//         }
//         if(request.goals){
//             const goalsResult = project.changeGoals(request.goals)
//             if(goalsResult.isFailure){
//                 return Result.fail<Project>(goalsResult.getError())
//             }
//         }

//         const updateResult = await this.projectRepository.update(project)

//         if(updateResult.isFailure){
//             return Result.fail<Project>(updateResult.getError())
//         }

//         return Result.ok<Project>(updateResult.getValue())
 
//     }
// }