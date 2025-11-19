// src/controllers/MembershipController.ts
import { FastifyReply, FastifyRequest } from "fastify";
import {  CreateMembershipUseCase } from "../../useCases/membership/CreateMembershipUseCase";
// import { LeaveProjectRequest, LeaveProjectUseCase } from "../../useCases/membership/LeaveProjectUseCase";
import { Result } from "../../env/Result";
// import { ListMembershipsByProjectRequest, ListMembershipsByProjectUseCase } from "../../useCases/membership/ListMembershipByProjectUseCase";
import { ApiResponseValidationFilter } from "../Filters/ApiResponseValidationFilter";
import { MembershipRepository } from "../../repositories/prisma/MembershipRepository";
import { ProjectRepository } from "../../repositories/prisma/ProjectRepository";
import { UserRepository } from "../../repositories/prisma/UserRepository";
import { ApiResponse } from "../Wrappers/ApiResponse";
import { FindMembersByProjectUseCase } from "../../useCases/membership/FindMembersByProjectUseCase";
import { FindAllMembershipUseCase } from "../../useCases/membership/FindAllMembershipsUseCase";
import { LeaveProjectUseCase } from "../../useCases/membership/LeaveProjectUseCase";
import { RejoinProjectUseCase } from "../../useCases/membership/RejoinProjectUseCase";
import { FindByIdMembershipUseCase } from "../../useCases/membership/FindByIdMembershipUseCase";
import { ListMembershipPaginationUseCase } from "../../useCases/membership/ListMembershipPaginationUseCase";

export class MembershipController {

        private membershipRepository: MembershipRepository;
        private projectRepository: ProjectRepository;
        private userRepository: UserRepository;
        // private createMembershipUseCase: CreateMembershipUseCase;
        // private leaveProjectUseCase: LeaveProjectUseCase;
        // private listMembershipsUseCase: ListMembershipsByProjectUseCase;
        private responseFilter: ApiResponseValidationFilter;

    constructor() {
        this.membershipRepository = new MembershipRepository();
        this.projectRepository = new ProjectRepository();
        this.userRepository = new UserRepository();
        this.responseFilter = new ApiResponseValidationFilter();

    }

    async joinProject(request: FastifyRequest, reply: FastifyReply) {

        try {
            const {userId, projectId} = request.body as
            {
                userId: string,
                projectId: string
            }
            const useCase = new CreateMembershipUseCase(this.membershipRepository, this.projectRepository, this.userRepository);

            const result = await useCase.execute({userId, projectId});

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 200:400).send(response);

        } catch (error: any) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao sair do projeto"])
            )
            return reply.status(500).send(response)
        }
            
    }

    async findByIdMembership(request:FastifyRequest, reply: FastifyReply){
        try {
           const {id} = request.params as{
            id: string
           }

            const useCase = new FindByIdMembershipUseCase(this.membershipRepository)
           
            const result = await useCase.execute({id});
           
            const response = this.responseFilter.handleResponse(result);
           
            return reply.status(response.success ? 200:400).send(response);
        } catch (error: any) {
              console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar relacionamento"])
            )
            return reply.status(500).send(response)
        }
    }

    async listByProject(request: FastifyRequest, reply: FastifyReply){
        try {
            const {projectId} = request.body as
            {
                projectId: string
            }
            const useCase = new FindMembersByProjectUseCase(this.membershipRepository);
            
            const result = await useCase.execute({projectId});

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 200:400).send(response);
            
        } catch (error: any) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro retornar projeto"])
            )
            return reply.status(500).send(response)
        }
    }

    async findAllMembership(request: FastifyRequest, reply: FastifyReply){
        try {
            const useCase = new FindAllMembershipUseCase(this.membershipRepository);

            const result = await useCase.execute();
            
            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 200:400).send(response);
        } catch (error: any) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao retornar todos os Projetos"])
            )
                return reply.status(500).send(response);
        }
    }
    async listPagineted(request: FastifyRequest, reply: FastifyReply){
        try {
            const {page = 1, pageSize = 10} = request.query as any;
    
            const useCase = new ListMembershipPaginationUseCase(this.membershipRepository);
    
            const result = await useCase.execute({
                page: Number(page),
                pageSize: Number(pageSize)
            });
    
            const response = this.responseFilter.handleResponse(result);
    
            return reply.status(response.success? 200:400).send(response);
        } catch (error: any) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao buscar os User(pagination)"])
            )
            return reply.status(500).send(response)
        }
    }

    async leaveProject(request: FastifyRequest, reply: FastifyReply){
        try {
        const {userId, projectId} = request.body as
        {
            userId: string,
            projectId: string
        }
        const useCase = new LeaveProjectUseCase(this.membershipRepository, this.projectRepository, this.userRepository)
        
        const result = await useCase.execute({userId, projectId});

        const response = this.responseFilter.handleResponse(result);

        return reply.status(response.success ? 200:400).send(response)
        } catch (error: any) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao criar projeto"])
            )
            return reply.status(500).send(response)
        }
    }


    async rejoinProject(request: FastifyRequest, reply: FastifyReply){
        try {
        const {userId, projectId} = request.body as
        {
            userId: string,
            projectId: string
        }
        const useCase = new RejoinProjectUseCase(this.membershipRepository, this.projectRepository, this.userRepository)
        
        const result = await useCase.execute({userId, projectId});

        const response = this.responseFilter.handleResponse(result);

        return reply.status(response.success ? 200:400).send(response)
        } catch (error: any) {
            console.error(error);
            const response = this.responseFilter.handleResponse(
                ApiResponse.fail(["Erro ao entrar novamente no projeto"])
            )
            return reply.status(500).send(response)
        }
    }
}

