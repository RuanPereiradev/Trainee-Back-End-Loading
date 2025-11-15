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
            ApiResponse.fail(["Erro ao criar projeto"])
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

// async leaveProject(request: FastifyRequest<{ Params: LeaveProjectRequest }>, reply: FastifyReply) {
//         const result = await this.leaveProjectUseCase.execute(request.params);
        
//             const response = this.responseFilter.handleResponse(result);

//             return reply.status(response.success ? 201:400).send(response);    }

//     async listProjectMembers(request: FastifyRequest, reply: FastifyReply){
//         const members = await this.listMembershipsUseCase.execute(request.params);
//         const response = this.responseFilter.handleResponse(members);

//             return reply.status(response.success ? 201:400).send(response);    
//         }
}

