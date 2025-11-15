import { Result } from "../../env/Result";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { LeaveProjectUseCase } from "./LeaveProjectUseCase";

interface RejoinProjectRequest{
    userId: string;
    projectId: string;
}

export class RejoinProjectUseCase{
    constructor(private membershipRepository: IMembershipRepository,
        private projectRepository: IProjectRepository,
        private userRepository: IUserRepository){}

    async execute(request: RejoinProjectRequest): Promise<Result<void>>{
        try {
            const {userId, projectId} = request;

            if(!userId || !projectId){
                return Result.fail<void>("Todos os campos obrigatorios")
            }

            const userResult = await this.userRepository.findById(userId)
            if(userResult.isFailure){
                return Result.fail<void>("Usuário não encontrado")
            }

            const projectResult = await this.projectRepository.findById(projectId)
             if(projectResult.isFailure){
                return Result.fail<void>("Projeto não encontrado")
            }

            const membershipResult = await this.membershipRepository.findByUserAndProject(userId, projectId)
            if(membershipResult.isFailure){
                return Result.fail<void>(membershipResult.getError())
            }

            const membership = membershipResult.getValue();

            if(!membership){
                return Result.fail<void>("Usuário não está vinculado a este projeto");
            }

            try {
                membership.rejoinProject();
            } catch (error: any) {
               return Result.fail<void>(error.message)
            }

            const updateResult = await this.membershipRepository.update(membership)
            if(updateResult.isFailure){
                return Result.fail<void>(updateResult.getError())
            }
                return Result.ok<void>()

             } catch (error:any) {
            return Result.fail<void>(error.message)
        }

    }
}