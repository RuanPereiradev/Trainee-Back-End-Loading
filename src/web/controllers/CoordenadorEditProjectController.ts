import { FastifyReply, FastifyRequest } from "fastify";
import { IMembershipRepository } from "../../repositories/interfaces/IMembershipRepository";
import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { UserRepository } from "../../repositories/prisma/UserRepository";
import { ApiResponseValidationFilter } from "../Filters/ApiResponseValidationFilter";
import { CoordenadorJoinProjectUseCase } from "../../useCases/coordenadorUseCases/CoordenadorJoinProjectUseCase";
import { ApiResponse } from "../Wrappers/ApiResponse";
import { CoordenadorEditProjectUseCase } from "../../useCases/coordenadorUseCases/CoordenadorEditProjectUseCase";

export class CoordenadorEditProject{

        private membershipRepository: MembershipRepository;
        private projectRepository: ProjectRepository;
        private userRepository: UserRepository;
        private responseFilter: ApiResponseValidationFilter;

    constructor() {
        this.membershipRepository = new MembershipRepository();
        this.projectRepository = new ProjectRepository();
        this.userRepository = new UserRepository();
        this.responseFilter = new ApiResponseValidationFilter();

    }

    async addMember(request: FastifyRequest, reply: FastifyReply){
        try {
            const {userIdToAdd, projectId, coordenadorId} = request.params as 
            {
                userIdToAdd: string,
                projectId: string,
                coordenadorId: string
            }

            const useCase = new CoordenadorJoinProjectUseCase(this.membershipRepository, this.projectRepository, this.userRepository);

            const result = await useCase.execute({userIdToAdd, projectId, coordenadorId});

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 200:400).send(response)
        } catch (error:any) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao sair do projeto"])
            )
           return reply.status(500).send(response)
        }
    }

    async EditProject(request: FastifyRequest, reply: FastifyReply){
        try {
            const {projectIdToEdit, projectId, coordenadorId} = request.params as 
            {
                projectIdToEdit: string,
                projectId: string,
                coordenadorId: string
            }
            const {name, status, description, goals} = request.body as any

            const useCase = new CoordenadorEditProjectUseCase(this.membershipRepository,this.projectRepository, this.userRepository)
            const result = await useCase.execute({projectIdToEdit, projectId, coordenadorId, name, status, description, goals})

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success? 200 : 400).send(response)
        } catch (error: any) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao atualizar projeto"])
            )
            return reply.status(500).send(response);
        }
    }
}