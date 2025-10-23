// src/controllers/MembershipController.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { CreateMembershipRequest, CreateMembershipUseCase } from "../../useCases/membership/CreateMembershipUseCase";
import { LeaveProjectRequest, LeaveProjectUseCase } from "../../useCases/membership/LeaveProjectUseCase";
import { Result } from "../../env/Result";
import { ListMembershipsByProjectRequest, ListMembershipsByProjectUseCase } from "../../useCases/membership/ListMembershipByProjectUseCase";
export class MembershipController {
    constructor(
        private createMembershipUseCase: CreateMembershipUseCase,
        private leaveProjectUseCase: LeaveProjectUseCase,
        private listMembershipsUseCase: ListMembershipsByProjectUseCase
    ) {}

    async joinProject(request: FastifyRequest<{ Body: CreateMembershipRequest }>, reply: FastifyReply) {
        const result = await this.createMembershipUseCase.execute(request.body);
        if(result.isFailure){
            return reply.status(400).send({ message: result.getError() });
        }
        return reply.status(201).send(result.getValue());
    }

    async leaveProject(request: FastifyRequest<{ Params: LeaveProjectRequest }>, reply: FastifyReply) {
        const result = await this.leaveProjectUseCase.execute(request.params);
        if(result.isFailure){
            return reply.status(400).send({ message: result.getError() });
        }
        return reply.status(200).send({ message: "Saída do projeto realizada com sucesso" });
    }

    async listProjectMembers(request: FastifyRequest<{ Params: ListMembershipsByProjectRequest }>, reply: FastifyReply){
        const members = await this.listMembershipsUseCase.execute(request.params);
        return reply.status(200).send(members);
    }
}
