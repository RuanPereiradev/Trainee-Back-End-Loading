import { RoleType } from "@prisma/client";
import { Membership } from "../../domain/entities/Membership";
import { Result } from "../../env/Result";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";

interface CoordenadorRemoveMembroRequest{
    coordenadorId: string;
    userIdToRemove: string;
    projectId: string;
}


export class CoordenadorRemoveMembroUseCase{
    constructor(
        private membershipRepository: IMembershipRepository,
        private projectRepository: IProjectRepository,
        private userRepository: IUserRepository
    ){}

    async execute(request: CoordenadorRemoveMembroRequest): Promise<Result<Membership>>{
        try {
            if(!request.userIdToRemove || !request.projectId || !request.coordenadorId){
                return Result.fail("Faltam dados")
            }

            const userResult = await this.userRepository.findById(request.coordenadorId);
            if(userResult.isFailure){
               return Result.fail(userResult.getError())
            }
            
            const coordenadorResult = await this.membershipRepository.findByUserAndProject(request.coordenadorId, request.projectId)
            if(coordenadorResult.isFailure || !coordenadorResult.getValue()){
                return Result.fail("Coordenador não pertence ao projeto")
            }

            const userIdToRemove = await this.userRepository.findById(request.userIdToRemove)
            if(userIdToRemove.isFailure || !userIdToRemove.getValue()){
                return Result.fail("Erro ao verificar usuário")
            }
            const user = userIdToRemove.getValue();

            const projectResult = await this.projectRepository.findById(request.projectId);
            if(projectResult.isFailure || !projectResult.getValue()){
                return Result.fail("Erro ao verificar projeto")
            }

            
            const existingMembershipResult = await this.membershipRepository.findByUserAndProject(request.userIdToRemove, request.projectId)
            if(existingMembershipResult.isFailure){
                return Result.fail("Esse usuário não faz parte do projeto")
            }
            const membership = existingMembershipResult.getValue()

            if(user.role === RoleType.DIRETOR){
                return Result.fail("Você não pode remover diretores de canto nenhum")
            }

            if (user.role === RoleType.COORDENADOR) {
                return Result.fail("Você não pode remover coordenadores do projeto");
            }


            if(!membership){
                return Result.fail("Usuário não está vinculado a este projeto");
            }

            try {
                membership.leaveProject();
            } catch (error:any) {
                return Result.fail(error.message)
            }

            const updateResult = await this.membershipRepository.update(membership);
            if(updateResult.isFailure){
                return Result.fail(updateResult.getError())
            }

            return Result.ok<Membership>(updateResult.getValue())
        } catch (error:any) {
            return Result.fail<Membership>(error.message)

        }
    }
}