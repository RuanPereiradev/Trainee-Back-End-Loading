// src/userCases/membership/LeaveProjectUseCase.ts
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { Result } from "../../env/Result";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { Membership } from "@prisma/client";

 interface LeaveProjectRequest {
    userId: string;
    projectId: string;
}

export class LeaveProjectUseCase {
    constructor(private membershipRepository: IMembershipRepository,
        private projectRepository: IProjectRepository,
        private userRepository: IUserRepository) {}

    async execute(request: LeaveProjectRequest): Promise<Result<void>>{
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
                membership.leaveProject();
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

