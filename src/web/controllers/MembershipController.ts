// src/controllers/MembershipController.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { CreateMembershipRequest, CreateMembershipUseCase } from "../../useCases/membership/CreateMembershipUseCase";
import { LeaveProjectRequest, LeaveProjectUseCase } from "../../useCases/membership/LeaveProjectUseCase";
import { Result } from "../../env/Result";
import { ListMembershipsByProjectRequest, ListMembershipsByProjectUseCase } from "../../useCases/membership/ListMembershipByProjectUseCase";
import { ApiResponseValidationFilter } from "../Filters/ApiResponseValidationFilter";

export class MembershipController {
    constructor(
        private createMembershipUseCase: CreateMembershipUseCase,
        private leaveProjectUseCase: LeaveProjectUseCase,
        private listMembershipsUseCase: ListMembershipsByProjectUseCase,
        private responseFilter: ApiResponseValidationFilter
    ) {}

    async joinProject(request: FastifyRequest<{ Body: CreateMembershipRequest }>, reply: FastifyReply) {
        const result = await this.createMembershipUseCase.execute(request.body);

            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 201:400).send(response);   
        }

    async leaveProject(request: FastifyRequest<{ Params: LeaveProjectRequest }>, reply: FastifyReply) {
        const result = await this.leaveProjectUseCase.execute(request.params);
        
            const response = this.responseFilter.handleResponse(result);

            return reply.status(response.success ? 201:400).send(response);    }

    async listProjectMembers(request: FastifyRequest<{ Params: ListMembershipsByProjectRequest }>, reply: FastifyReply){
        const members = await this.listMembershipsUseCase.execute(request.params);
        const response = this.responseFilter.handleResponse(members);

            return reply.status(response.success ? 201:400).send(response);    
        }
    }

