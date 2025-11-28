import { RoleType } from "@prisma/client";
import { Membership } from "../../domain/entities/Membership";
import { Result } from "../../env/Result";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { IProjectRepository } from "../../repositories/interfaces/IProjectRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { profileEnd } from "console";

interface CoordenadorJoinProjectRequest{
    coordenadorId: string;
    userIdToAdd: string;
    projectId: string;
}   

export class CoordenadorJoinProjectUseCase{
    constructor(
        private membershipRepository: IMembershipRepository,
        private projectRepository: IProjectRepository,
        private userRespository: IUserRepository

    ){}

    async execute(request: CoordenadorJoinProjectRequest): Promise<Result<Membership>>{
        try {
            if(!request.userIdToAdd || !request.projectId || !request.coordenadorId){
                return Result.fail<Membership>("UserId, ProjectId e coordenadorId são obrigatorios")
            }

            //verificação do coordenador
            const coordenadorResult = await this.membershipRepository.findByUserAndProject(request.coordenadorId, request.projectId);
            if(coordenadorResult.isFailure || !coordenadorResult.getValue()){
                return Result.fail<Membership>("Coordenador não pertence ao projeto")
            }
            const coordenadorExisting = coordenadorResult.getValue()

            if(coordenadorExisting?.user.role !== RoleType.COORDENADOR){
                return Result.fail("Coordenador não pertence ao projeto")
            }


            //verificação pro user
            const userIdToAddResult = await this.userRespository.findById(request.userIdToAdd)
            if(userIdToAddResult.isFailure || !userIdToAddResult.getValue()){
                return Result.fail<Membership>("Erro ao verificar usuário")
            }
            const user = userIdToAddResult.getValue();

            //verificação do projeto
            const projectResult = await this.projectRepository.findById(request.projectId);
            if(projectResult.isFailure){
                return Result.fail("Erro ao verificar projeto");
            }
            const project = projectResult.getValue();

            const existingMembershipResult = await this.membershipRepository.findByUserAndProject(request.userIdToAdd, request.projectId)
            if(existingMembershipResult.getValue()){
                return Result.fail("Usuário ja faz parte do projeto")
            }

            if(user.role === RoleType.DIRETOR){
                return Result.fail("Não é permitido adicionar diretor em projeto")
            }

            if(user.role === RoleType.COORDENADOR){
            return Result.fail("Já existe um coordenador no projeto")
            }            

            const membership = new Membership(user, project);

            const saveresult = await this.membershipRepository.create(membership);

            if(saveresult.isFailure){
                return Result.fail("Erro ao salvar membership")
            }

            return Result.ok<Membership>(saveresult.getValue());

        } catch (error:any) {
            return Result.fail<Membership>(error.message)
        }
    }
}