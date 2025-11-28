import { ProjectStatusType, RoleType } from "@prisma/client";
import { Membership } from "../../domain/entities/Membership";
import { Project } from "../../domain/entities/Projects";
import { Result } from "../../env/Result";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { Sectors } from "../../domain/entities/Sectors";

interface CoordenadorEditProjectRequest{
    coordenadorId: string;
    projectIdToEdit: string;
    projectId: string;
    
    name?: string;
    status?: ProjectStatusType;
    description?: string;
    goals?: string;
}

export class CoordenadorEditProjectUseCase{
    constructor(
        private membershipRepository: IMembershipRepository,
        private projectRepsitory: IProjectRepository,
        private userRepository: IUserRepository,
    ){}

    async execute(request: CoordenadorEditProjectRequest): Promise<Result<Project>>{
        try {
            if(!request.coordenadorId || !request.projectId || !request.projectIdToEdit){
                return Result.fail<Project>("Dados obrigatorios")
            }
            const coordenadorIdResult = await this.membershipRepository.findByUserAndProject(request.coordenadorId, request.projectId);
            if(coordenadorIdResult.isFailure || !coordenadorIdResult.getValue()){
                return Result.fail("Id buscado não pertence ao projeto")
            }
            if(coordenadorIdResult.getValue()?.user.role !== RoleType.COORDENADOR){
                return Result.fail("Usuario não é coordenador do projeto")
            }
       
            const coordenadorExisting = coordenadorIdResult.getValue();

            const projectIdToEditResult = await this.projectRepsitory.findById(request.projectIdToEdit);
            if(projectIdToEditResult.isFailure || !projectIdToEditResult.getValue()){
                return Result.fail("Erro ao verifica projeto")
            }
            const project = projectIdToEditResult.getValue();

            if(request.name){
                const nameResult = project.changeName(request.name)
                if(nameResult.isFailure){
                    return Result.fail(nameResult.getError())
                }
            }

          
            if(request.status){
                project.changeStatus(request.status)
            }

            if(request.description){
                project.changeDescription(request.description)
            }
            
            if(request.goals){
                project.changeGoals(request.goals)
            }

            const updateResult = await this.projectRepsitory.update(project)

            if(updateResult.isFailure || !updateResult.getValue()){
                return Result.fail(updateResult.getError());
            }

            return Result.ok(updateResult.getValue());
            
        } catch (error: any) {
            if(error instanceof Error){
                return Result.fail(error.message)
            }
            return Result.fail("Erro desconhecido ao atualizar projeto")
        }
    }
}